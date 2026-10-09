// Dev mode in-memory store for shared notes
const devShareStore = new Map<string, { payload: unknown; createdAt: string }>();

export function setDevSharedNote(shareId: string, payload: unknown) {
  devShareStore.set(shareId, { payload, createdAt: new Date().toISOString() });
}

export function getDevSharedNote(shareId: string) {
  return devShareStore.get(shareId)?.payload ?? null;
}
