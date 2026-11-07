// .env.development.local points this at a local Studio while developing.
const studioUrl = (): string => (import.meta.env.VITE_STUDIO_URL || "https://studio.rungs.dev").replace(/\/+$/, "");

// The same campaign as every other surface that points at Studio, so they roll up together.
const trackingParameters = (content: string) =>
  new URLSearchParams({
    utm_source: "plcsimulator.online",
    utm_medium: "referral",
    utm_campaign: "successor",
    utm_content: content,
  }).toString();

async function gzip(text: string): Promise<Uint8Array> {
  const compressed = new Blob([text]).stream().pipeThrough(new CompressionStream("gzip"));
  return new Uint8Array(await new Response(compressed).arrayBuffer());
}

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

/** Studio takes the project from after the `#`, so it never reaches a server. */
export async function studioProjectLink(rungsText: string, content: string): Promise<string> {
  // An older browser without CompressionStream still gets a link, just a longer one.
  const project =
    typeof CompressionStream === "undefined"
      ? `rungs=${encodeURIComponent(rungsText)}&end`
      : base64Url(await gzip(rungsText));
  return `${studioUrl()}/open?${trackingParameters(content)}#${project}`;
}

export const studioHomeLink = (content: string) => `${studioUrl()}/?${trackingParameters(content)}`;
