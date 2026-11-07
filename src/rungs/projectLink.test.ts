import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { studioHomeLink, studioProjectLink } from "./projectLink";

const TEXT = "version: 6\naoi:\n  name: Żółć\n";

async function gunzipBase64Url(project: string): Promise<string> {
  const binary = atob(project.replaceAll("-", "+").replaceAll("_", "/"));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"))).text();
}

describe("studioProjectLink", () => {
  beforeEach(() => vi.stubEnv("VITE_STUDIO_URL", ""));
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("carries the file gzipped after the #, where no server sees it", async () => {
    const link = await studioProjectLink(TEXT, "test");
    const [address, project] = link.split("#");

    expect(address).toBe(
      "https://studio.rungs.dev/open?utm_source=plcsimulator.online&utm_medium=referral&utm_campaign=successor&utm_content=test",
    );
    expect(project).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(await gunzipBase64Url(project)).toBe(TEXT);
  });

  it("falls back to plain text where the browser cannot gzip", async () => {
    vi.stubGlobal("CompressionStream", undefined);
    const link = await studioProjectLink(TEXT, "test");

    expect(link.split("#")[1]).toBe(`rungs=${encodeURIComponent(TEXT)}&end`);
  });

  it("sends an empty project to the Studio home page", () => {
    expect(studioHomeLink("test")).toContain("https://studio.rungs.dev/?utm_source");
  });
});
