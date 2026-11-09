import {
  OPENVERSE_IMAGE_CATEGORY,
  OPENVERSE_IMAGE_SIZE,
  OPENVERSE_IMAGES_URL,
  OPENVERSE_RESULT_LIMIT,
  OPENVERSE_TIMEOUT_MS,
} from "./renungan.constants.ts";
import type { RenunganImage } from "./renungan.types.ts";
import { isHttpUrl } from "./renungan.validation.ts";

type OpenverseResponse = {
  results?: Array<{
    url?: unknown;
    attribution?: unknown;
  }>;
};

// The save path must succeed even when the image source is down, so failures
// degrade to "no image" instead of propagating.
export async function findOpenverseImage(
  query: string,
): Promise<RenunganImage | null> {
  const search = query.trim();
  if (!search) return null;

  const url = new URL(OPENVERSE_IMAGES_URL);
  url.searchParams.set("q", search);
  url.searchParams.set("page_size", String(OPENVERSE_RESULT_LIMIT));
  url.searchParams.set("size", OPENVERSE_IMAGE_SIZE);
  url.searchParams.set("category", OPENVERSE_IMAGE_CATEGORY);

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(OPENVERSE_TIMEOUT_MS),
    });
    if (!response.ok) return null;

    const body = (await response.json()) as OpenverseResponse;
    const result = body.results?.[0];
    const imageUrl = typeof result?.url === "string" ? result.url : null;
    if (!imageUrl || !isHttpUrl(imageUrl)) return null;

    const attribution =
      typeof result?.attribution === "string" && result.attribution.trim()
        ? result.attribution.trim()
        : null;

    return { imageUrl, imageAttribution: attribution };
  } catch {
    return null;
  }
}
