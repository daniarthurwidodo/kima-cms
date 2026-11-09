import {
  INVALID_RENUNGAN_MESSAGE,
  MAX_DESCRIPTION_LENGTH,
  MAX_IMAGE_URL_LENGTH,
  MAX_SCRIPTURE_LENGTH,
  MAX_TITLE_LENGTH,
  MAX_VERSE_LENGTH,
} from "./renungan.constants.ts";
import type { RenunganInput } from "./renungan.types.ts";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export type RenunganFormValues = {
  publishDate: string;
  title: string;
  verse: string;
  scripture: string;
  description: string;
  imageUrl?: string;
  isPublished?: boolean;
};

export function parsePublishDate(value: string): string | null {
  const date = value.trim();
  if (!DATE_PATTERN.test(date)) return null;

  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toISOString().slice(0, 10) === date ? date : null;
}

export function isHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function parseRequiredText(value: string, maxLength: number): string | null {
  const text = value.trim();
  if (!text || text.length > maxLength) return null;
  return text;
}

function parseImageUrl(value: string): ValidationResult<string | null> {
  const imageUrl = value.trim();
  if (!imageUrl) return { ok: true, value: null };

  if (imageUrl.length > MAX_IMAGE_URL_LENGTH || !isHttpUrl(imageUrl)) {
    return { ok: false, error: INVALID_RENUNGAN_MESSAGE };
  }

  return { ok: true, value: imageUrl };
}

export function parseRenunganInput(
  values: RenunganFormValues,
): ValidationResult<RenunganInput> {
  const publishDate = parsePublishDate(values.publishDate);
  const title = parseRequiredText(values.title, MAX_TITLE_LENGTH);
  const verse = parseRequiredText(values.verse, MAX_VERSE_LENGTH);
  const scripture = parseRequiredText(values.scripture, MAX_SCRIPTURE_LENGTH);
  const description = parseRequiredText(
    values.description,
    MAX_DESCRIPTION_LENGTH,
  );
  const image = parseImageUrl(values.imageUrl ?? "");

  if (!publishDate || !title || !verse || !scripture || !description) {
    return { ok: false, error: INVALID_RENUNGAN_MESSAGE };
  }

  if (!image.ok) return image;

  return {
    ok: true,
    value: {
      publishDate,
      title,
      verse,
      scripture,
      description,
      imageUrl: image.value,
      isPublished: values.isPublished ?? true,
    },
  };
}
