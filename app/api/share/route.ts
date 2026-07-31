import { NextRequest, NextResponse } from "next/server";

// Dev mode in-memory store for shared notes
const devShareStore = new Map<string, { payload: unknown; createdAt: string }>();

async function getKVBinding() {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext();
    return (ctx.env as Record<string, unknown>)?.JUSTWRITE_SYNC_KV as
      | { get: (key: string) => Promise<string | null>; put: (key: string, val: string, opts?: { expirationTtl?: number }) => Promise<void> }
      | undefined;
  } catch {
    return undefined;
  }
}

function generateShareId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `s_${id}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { payload?: unknown };
    const { payload } = body;

    if (!payload) {
      return NextResponse.json({ error: "Missing payload" }, { status: 400 });
    }

    const shareId = generateShareId();
    const kv = await getKVBinding();

    if (kv) {
      // Store single note payload for 90 days
      await kv.put(`share:${shareId}`, JSON.stringify(payload), {
        expirationTtl: 60 * 60 * 24 * 90,
      });
    } else {
      devShareStore.set(shareId, { payload, createdAt: new Date().toISOString() });
    }

    return NextResponse.json({ shareId });
  } catch {
    return NextResponse.json({ error: "Failed to create share link" }, { status: 500 });
  }
}

export async function getDevSharedNote(shareId: string) {
  return devShareStore.get(shareId)?.payload ?? null;
}
