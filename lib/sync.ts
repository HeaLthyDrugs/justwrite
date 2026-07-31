import { Note, NotesSnapshot } from "./notes-storage";
import { encryptData, decryptData, hashSyncCode, EncryptedPayload } from "./crypto";

export const SYNC_CODE_STORAGE_KEY = "justwrite.sync.code.v1";
export const LAST_SYNC_TIME_KEY = "justwrite.sync.last_time.v1";
export const AUTO_SYNC_ENABLED_KEY = "justwrite.sync.auto_enabled.v1";
export const DEVICE_ID_KEY = "justwrite.device.id.v1";

export interface DeviceInfo {
  id: string;
  name: string;
  lastSeen: string;
}

export function getStoredSyncCode(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SYNC_CODE_STORAGE_KEY);
}

export function setStoredSyncCode(code: string | null): void {
  if (typeof window === "undefined") return;
  if (!code) {
    window.localStorage.removeItem(SYNC_CODE_STORAGE_KEY);
    window.localStorage.removeItem(LAST_SYNC_TIME_KEY);
  } else {
    window.localStorage.setItem(SYNC_CODE_STORAGE_KEY, code.trim().toLowerCase());
  }
}

export function getStoredLastSyncTime(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(LAST_SYNC_TIME_KEY);
}

export function setStoredLastSyncTime(timeIso: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LAST_SYNC_TIME_KEY, timeIso);
}

export function getAutoSyncEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const stored = window.localStorage.getItem(AUTO_SYNC_ENABLED_KEY);
  return stored === null ? true : stored === "true";
}

export function setAutoSyncEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTO_SYNC_ENABLED_KEY, String(enabled));
}

export function getDeviceId(): string {
  if (typeof window === "undefined") return "browser-device";
  let id = window.localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    window.localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export function getDeviceName(): string {
  if (typeof window === "undefined") return "Web Browser";
  const ua = navigator.userAgent;
  let os = "Desktop";
  if (ua.includes("Mac")) os = "Mac";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Linux")) os = "Linux";

  let browser = "Browser";
  if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg")) browser = "Edge";

  return `${os} • ${browser}`;
}

/**
 * Merge two sets of notes using last-write-wins (LWW) by `updatedAt` timestamp
 */
export function mergeNotesSnapshots(local: Note[], remote: Note[]): Note[] {
  const noteMap = new Map<string, Note>();

  // Add all local notes
  for (const note of local) {
    noteMap.set(note.id, note);
  }

  // Merge remote notes (latest updatedAt wins)
  for (const remoteNote of remote) {
    const existing = noteMap.get(remoteNote.id);
    if (!existing) {
      noteMap.set(remoteNote.id, remoteNote);
    } else {
      const localTime = new Date(existing.updatedAt).getTime();
      const remoteTime = new Date(remoteNote.updatedAt).getTime();
      if (remoteTime > localTime) {
        noteMap.set(remoteNote.id, remoteNote);
      }
    }
  }

  // Sort notes: pinned first, then by updatedAt descending
  return Array.from(noteMap.values()).sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

export interface SyncResult {
  success: boolean;
  mergedSnapshot?: NotesSnapshot;
  devices?: DeviceInfo[];
  error?: string;
}

/**
 * Execute zero-knowledge sync with server
 */
export async function performNotesSync(
  localSnapshot: NotesSnapshot,
  syncCode: string
): Promise<SyncResult> {
  try {
    const vaultId = await hashSyncCode(syncCode);
    const currentDeviceId = getDeviceId();
    const currentDeviceName = getDeviceName();

    // 1. Fetch remote encrypted snapshot
    const res = await fetch(`/api/sync?vaultId=${encodeURIComponent(vaultId)}`);
    let remoteNotes: Note[] = [];
    let remoteDevices: DeviceInfo[] = [];

    if (res.ok) {
      const data = (await res.json()) as { payload?: EncryptedPayload };
      if (data.payload) {
        try {
          const decryptedJson = await decryptData(data.payload, syncCode);
          const parsed = JSON.parse(decryptedJson) as { notes?: Note[]; devices?: DeviceInfo[] };
          if (Array.isArray(parsed.notes)) {
            remoteNotes = parsed.notes;
          }
          if (Array.isArray(parsed.devices)) {
            remoteDevices = parsed.devices;
          }
        } catch {
          return {
            success: false,
            error: "Failed to decrypt vault. Please check your Sync Code.",
          };
        }
      }
    }

    // 2. Update device list
    const updatedDevicesMap = new Map<string, DeviceInfo>();
    for (const dev of remoteDevices) {
      updatedDevicesMap.set(dev.id, dev);
    }
    updatedDevicesMap.set(currentDeviceId, {
      id: currentDeviceId,
      name: currentDeviceName,
      lastSeen: new Date().toISOString(),
    });

    const updatedDevicesList = Array.from(updatedDevicesMap.values());

    // 3. Merge local and remote notes
    const mergedNotes = mergeNotesSnapshots(localSnapshot.notes, remoteNotes);
    const activeNoteExists = mergedNotes.some((n) => n.id === localSnapshot.activeNoteId);
    const mergedSnapshot: NotesSnapshot = {
      version: localSnapshot.version,
      notes: mergedNotes,
      activeNoteId: activeNoteExists ? localSnapshot.activeNoteId : (mergedNotes[0]?.id ?? null),
    };

    // 4. Encrypt merged snapshot
    const encryptedPayload = await encryptData(
      JSON.stringify({
        notes: mergedNotes,
        devices: updatedDevicesList,
        updatedAt: new Date().toISOString(),
      }),
      syncCode
    );

    // 5. Push encrypted snapshot to server
    const pushRes = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vaultId,
        payload: encryptedPayload,
      }),
    });

    if (!pushRes.ok) {
      return {
        success: false,
        error: "Failed to save encrypted notes to server.",
      };
    }

    const nowIso = new Date().toISOString();
    setStoredLastSyncTime(nowIso);

    return {
      success: true,
      mergedSnapshot,
      devices: updatedDevicesList,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Network error during sync.",
    };
  }
}

/**
 * Remove a specific device from the encrypted sync vault
 */
export async function removeDeviceFromSync(
  deviceIdToRemove: string,
  localSnapshot: NotesSnapshot,
  syncCode: string
): Promise<SyncResult> {
  try {
    const vaultId = await hashSyncCode(syncCode);

    const res = await fetch(`/api/sync?vaultId=${encodeURIComponent(vaultId)}`);
    let remoteNotes: Note[] = localSnapshot.notes;
    let remoteDevices: DeviceInfo[] = [];

    if (res.ok) {
      const data = (await res.json()) as { payload?: EncryptedPayload };
      if (data.payload) {
        const decryptedJson = await decryptData(data.payload, syncCode);
        const parsed = JSON.parse(decryptedJson) as { notes?: Note[]; devices?: DeviceInfo[] };
        if (Array.isArray(parsed.notes)) remoteNotes = parsed.notes;
        if (Array.isArray(parsed.devices)) remoteDevices = parsed.devices;
      }
    }

    const updatedDevices = remoteDevices.filter((d) => d.id !== deviceIdToRemove);

    const encryptedPayload = await encryptData(
      JSON.stringify({
        notes: remoteNotes,
        devices: updatedDevices,
        updatedAt: new Date().toISOString(),
      }),
      syncCode
    );

    const pushRes = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vaultId, payload: encryptedPayload }),
    });

    if (!pushRes.ok) {
      return { success: false, error: "Failed to update devices list on server." };
    }

    return {
      success: true,
      devices: updatedDevices,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error removing device.",
    };
  }
}
