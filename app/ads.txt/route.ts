export const dynamic = "force-static";

export function GET() {
  const content = "google.com, pub-3459385721774517, DIRECT, f08c47fec0942fa0\n";
  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
