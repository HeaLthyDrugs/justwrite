export interface NoteAttachment {
  id: string;
  noteId: string;
  mimeType: string;
  fileName: string;
  blob: Blob;
}

export interface PortableNoteAttachment {
  id: string;
  noteId: string;
  mimeType: string;
  fileName: string;
  data: string;
}

export interface NoteAttachmentCacheUsage {
  count: number;
  bytes: number;
}

const DATABASE_NAME = "justwrite-attachments";
const DATABASE_VERSION = 1;
const STORE_NAME = "attachments";
export const NOTE_ATTACHMENT_CACHE_CHANGED_EVENT = "justwrite:attachment-cache-changed";

function notifyAttachmentCacheChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(NOTE_ATTACHMENT_CACHE_CHANGED_EVENT));
  }
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("Image storage is unavailable in this browser."));
      return;
    }

    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("noteId", "noteId", { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open image storage."));
  });
}

async function withStore<T>(mode: IDBTransactionMode, work: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const request = work(transaction.objectStore(STORE_NAME));
    let result: T;
    request.onsuccess = () => { result = request.result; };
    request.onerror = () => reject(request.error ?? new Error("Image storage request failed."));
    transaction.oncomplete = () => {
      database.close();
      resolve(result);
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error ?? new Error("Image storage transaction failed."));
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error ?? new Error("Image storage transaction was aborted."));
    };
  });
}

export function saveNoteAttachment(attachment: NoteAttachment) {
  return withStore("readwrite", (store) => store.put(attachment)).then(() => {
    notifyAttachmentCacheChanged();
  });
}

export function deleteNoteAttachment(id: string) {
  return withStore("readwrite", (store) => store.delete(id)).then(() => {
    notifyAttachmentCacheChanged();
  });
}

export function getNoteAttachment(id: string) {
  return withStore<NoteAttachment | undefined>("readonly", (store) => store.get(id));
}

export async function getNoteAttachments(noteId: string): Promise<NoteAttachment[]> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME)
      .index("noteId").getAll(noteId);
    request.onsuccess = () => {
      database.close();
      resolve(request.result as NoteAttachment[]);
    };
    request.onerror = () => {
      database.close();
      reject(request.error ?? new Error("Could not load note images."));
    };
  });
}

export function getAllNoteAttachments(): Promise<NoteAttachment[]> {
  return withStore<NoteAttachment[]>("readonly", (store) => store.getAll());
}

export async function getNoteAttachmentCacheUsage(): Promise<NoteAttachmentCacheUsage> {
  const attachments = await getAllNoteAttachments();
  return {
    count: attachments.length,
    bytes: attachments.reduce((total, attachment) => total + attachment.blob.size, 0),
  };
}

export async function deleteAllNoteAttachments() {
  const usage = await getNoteAttachmentCacheUsage();
  await withStore<undefined>("readwrite", (store) => store.clear());
  notifyAttachmentCacheChanged();
  return usage;
}

export async function deleteNoteAttachments(noteId: string): Promise<void> {
  const attachments = await getNoteAttachments(noteId);
  if (attachments.length === 0) return;
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    for (const attachment of attachments) store.delete(attachment.id);
    transaction.oncomplete = () => { database.close(); resolve(); };
    transaction.onerror = () => { database.close(); reject(transaction.error); };
    transaction.onabort = () => { database.close(); reject(transaction.error); };
  });
  notifyAttachmentCacheChanged();
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

export async function serializeAttachment(attachment: NoteAttachment): Promise<PortableNoteAttachment> {
  return {
    id: attachment.id,
    noteId: attachment.noteId,
    mimeType: attachment.mimeType,
    fileName: attachment.fileName,
    data: bytesToBase64(new Uint8Array(await attachment.blob.arrayBuffer())),
  };
}

export function deserializeAttachment(attachment: PortableNoteAttachment): NoteAttachment {
  const safeMime = /^image\/(png|jpeg|webp|gif|avif)$/i.test(attachment.mimeType)
    ? attachment.mimeType
    : "image/png";
  const bytes = base64ToBytes(attachment.data);
  const copy = new Uint8Array(bytes.length);
  copy.set(bytes);
  return {
    id: attachment.id,
    noteId: attachment.noteId,
    mimeType: safeMime,
    fileName: attachment.fileName,
    blob: new Blob([copy.buffer], { type: safeMime }),
  };
}

export function attachmentPath(id: string, mimeType: string) {
  const extension: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
  };
  return `attachments/${id}.${extension[mimeType] ?? "png"}`;
}

export function attachmentIdFromPath(src: string): string | null {
  const match = src.match(/(?:^|\/)attachments\/([a-zA-Z0-9_-]+)\.[a-zA-Z0-9]+(?:$|[?#])/);
  return match?.[1] ?? null;
}

export async function attachmentUrlMap(noteId: string): Promise<Record<string, string>> {
  const attachments = await getNoteAttachments(noteId);
  return Object.fromEntries(attachments.map((attachment) => [
    attachment.id,
    URL.createObjectURL(attachment.blob),
  ]));
}

export function revokeAttachmentUrls(urls: Record<string, string>) {
  Object.values(urls).forEach((url) => URL.revokeObjectURL(url));
}
