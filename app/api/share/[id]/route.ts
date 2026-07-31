import { NextRequest, NextResponse } from "next/server";
import { getDevSharedNote } from "../route";

async function getKVBinding() {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext();
    return (ctx.env as Record<string, unknown>)?.JUSTWRITE_SYNC_KV as
      | { get: (key: string) => Promise<string | null> }
      | undefined;
  } catch {
    return undefined;
  }
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: shareId } = await context.params;

  if (!shareId) {
    return NextResponse.json({ error: "Invalid share ID" }, { status: 400 });
  }

  const kv = await getKVBinding();
  if (kv) {
    const raw = await kv.get(`share:${shareId}`);
    if (!raw) {
      return NextResponse.json({ error: "Note not found or expired" }, { status: 404 });
    }
    return NextResponse.json({ payload: JSON.parse(raw) });
  }

  // Dev fallback
  const devPayload = await getDevSharedNote(shareId);
  if (!devPayload) {
    return NextResponse.json({ error: "Note not found or expired" }, { status: 404 });
  }

  return NextResponse.json({ payload: devPayload });
}
