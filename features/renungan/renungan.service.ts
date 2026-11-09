import type { Pool } from "pg";
import {
  RENUNGAN_DATE_TAKEN_MESSAGE,
  RENUNGAN_TIME_ZONE,
} from "./renungan.constants.ts";
import { findOpenverseImage } from "./renungan.image.ts";
import {
  findPublishedRenunganByDate,
  findRenunganByDate,
  findRenunganById,
  insertRenungan,
  listRenunganByDateRange,
  updateRenungan,
} from "./renungan.repository.ts";
import type {
  Renungan,
  RenunganImage,
  RenunganInput,
  RenunganResponse,
} from "./renungan.types.ts";
import { parsePublishDate } from "./renungan.validation.ts";

const YEAR_MONTH_PATTERN = /^\d{4}-\d{2}$/;

export class RenunganDateTakenError extends Error {
  constructor() {
    super(RENUNGAN_DATE_TAKEN_MESSAGE);
    this.name = "RenunganDateTakenError";
  }
}

export function formatDateInTimeZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export async function resolveRenunganImage(
  input: RenunganInput,
): Promise<RenunganImage | null> {
  if (input.imageUrl) {
    return { imageUrl: input.imageUrl, imageAttribution: null };
  }

  // shortcut: a blank URL re-runs Openverse on every save; the form prefills
  // the stored URL, so editors rarely hit this.
  return findOpenverseImage(`${input.title} ${input.verse}`);
}

export async function createRenungan(
  pool: Pool,
  input: RenunganInput,
): Promise<Renungan> {
  const existing = await findRenunganByDate(pool, input.publishDate);
  if (existing) throw new RenunganDateTakenError();

  const image = await resolveRenunganImage(input);
  return insertRenungan(
    pool,
    { ...input, imageUrl: image?.imageUrl ?? null },
    image?.imageAttribution ?? null,
  );
}

export async function updateRenunganById(
  pool: Pool,
  id: string,
  input: RenunganInput,
): Promise<Renungan | null> {
  const current = await findRenunganById(pool, id);
  if (!current) return null;

  const sameDate = await findRenunganByDate(pool, input.publishDate);
  if (sameDate && sameDate.id !== id) throw new RenunganDateTakenError();

  const image = await resolveRenunganImage(input);
  return updateRenungan(
    pool,
    id,
    { ...input, imageUrl: image?.imageUrl ?? null },
    image?.imageAttribution ?? null,
  );
}

export async function getPublishedRenunganByDate(
  pool: Pool,
  publishDate: string,
): Promise<Renungan | null> {
  return findPublishedRenunganByDate(pool, publishDate);
}

export async function getRenunganByDate(
  pool: Pool,
  publishDate: string,
): Promise<Renungan | null> {
  return findRenunganByDate(pool, publishDate);
}

export async function getDailyRenungan(
  pool: Pool,
  now: Date = new Date(),
): Promise<Renungan | null> {
  const today = formatDateInTimeZone(now, RENUNGAN_TIME_ZONE);
  return findPublishedRenunganByDate(pool, today);
}

export async function listRenunganByMonth(
  pool: Pool,
  yearMonth: string,
): Promise<Renungan[]> {
  if (!YEAR_MONTH_PATTERN.test(yearMonth)) return [];

  const startDate = `${yearMonth}-01`;
  if (!parsePublishDate(startDate)) return [];

  const [year, month] = yearMonth.split("-").map(Number);
  const endDate = new Date(Date.UTC(year, month, 1))
    .toISOString()
    .slice(0, 10);

  return listRenunganByDateRange(pool, startDate, endDate);
}

export function toRenunganResponse(renungan: Renungan): RenunganResponse {
  return {
    date: renungan.publishDate,
    title: renungan.title,
    verse: renungan.verse,
    scripture: renungan.scripture,
    description: renungan.description,
    imageUrl: renungan.imageUrl,
    imageAttribution: renungan.imageAttribution,
  };
}
