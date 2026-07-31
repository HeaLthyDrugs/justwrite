import { NextRequest, NextResponse } from "next/server";

// Fallback in-memory store for local development when KV binding is not available
const devVaultStore = new Map<string, { payload: unknown; updatedAt: string }>();

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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const vaultId = searchParams.get("vaultId");

  if (!vaultId) {
    return NextResponse.json({ error: "Missing vaultId parameter" }, { status: 400 });
  }

  const kv = await getKVBinding();
  if (kv) {
    const raw = await kv.get(`vault:${vaultId}`);
    if (!raw) {
      return NextResponse.json({ payload: null });
    }
    return NextResponse.json({ payload: JSON.parse(raw) });
  }

  // Fallback for dev mode
  const item = devVaultStore.get(vaultId);
  return NextResponse.json({ payload: item?.payload ?? null });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { vaultId?: string; payload?: unknown };
    const { vaultId, payload } = body;

    if (!vaultId || !payload) {
      return NextResponse.json({ error: "Missing vaultId or payload" }, { status: 400 });
    }

    const kv = await getKVBinding();
    if (kv) {
      // Store encrypted vault with 180 days expiration TTL
      await kv.put(`vault:${vaultId}`, JSON.stringify(payload), {
        expirationTtl: 60 * 60 * 24 * 180,
      });
      return NextResponse.json({ success: true });
    }

    // Fallback for dev mode
    devVaultStore.set(vaultId, { payload, updatedAt: new Date().toISOString() });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
