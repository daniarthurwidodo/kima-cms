import type { Pool } from "pg";
import type { Renungan, RenunganInput } from "./renungan.types.ts";

const RENUNGAN_COLUMNS = `
  id,
  publish_date::text AS publish_date,
  title,
  verse,
  scripture,
  description,
  image_url,
  image_attribution,
  is_published,
  created_at,
  updated_at
`;

const FIND_BY_DATE_QUERY = `
  SELECT ${RENUNGAN_COLUMNS}
  FROM renungan
  WHERE publish_date = $1
  LIMIT 1
`;

const FIND_PUBLISHED_BY_DATE_QUERY = `
  SELECT ${RENUNGAN_COLUMNS}
  FROM renungan
  WHERE publish_date = $1 AND is_published = TRUE
  LIMIT 1
`;

const FIND_BY_ID_QUERY = `
  SELECT ${RENUNGAN_COLUMNS}
  FROM renungan
  WHERE id = $1
  LIMIT 1
`;

const LIST_BY_DATE_RANGE_QUERY = `
  SELECT ${RENUNGAN_COLUMNS}
  FROM renungan
  WHERE publish_date >= $1 AND publish_date < $2
  ORDER BY publish_date
`;

const INSERT_QUERY = `
  INSERT INTO renungan (
    publish_date,
    title,
    verse,
    scripture,
    description,
    image_url,
    image_attribution,
    is_published
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  RETURNING ${RENUNGAN_COLUMNS}
`;

const UPDATE_QUERY = `
  UPDATE renungan
  SET publish_date = $2,
      title = $3,
      verse = $4,
      scripture = $5,
      description = $6,
      image_url = $7,
      image_attribution = $8,
      is_published = $9,
      updated_at = now()
  WHERE id = $1
  RETURNING ${RENUNGAN_COLUMNS}
`;

type RenunganRow = {
  id: string;
  publish_date: string;
  title: string;
  verse: string;
  scripture: string;
  description: string;
  image_url: string | null;
  image_attribution: string | null;
  is_published: boolean;
  created_at: Date | string;
  updated_at: Date | string;
};

function toIsoString(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapRenungan(row: RenunganRow): Renungan {
  return {
    id: row.id,
    publishDate: row.publish_date,
    title: row.title,
    verse: row.verse,
    scripture: row.scripture,
    description: row.description,
    imageUrl: row.image_url,
    imageAttribution: row.image_attribution,
    isPublished: row.is_published,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
  };
}

export async function findRenunganByDate(
  pool: Pool,
  publishDate: string,
): Promise<Renungan | null> {
  const result = await pool.query<RenunganRow>(FIND_BY_DATE_QUERY, [publishDate]);
  return result.rows[0] ? mapRenungan(result.rows[0]) : null;
}

export async function findPublishedRenunganByDate(
  pool: Pool,
  publishDate: string,
): Promise<Renungan | null> {
  const result = await pool.query<RenunganRow>(FIND_PUBLISHED_BY_DATE_QUERY, [
    publishDate,
  ]);
  return result.rows[0] ? mapRenungan(result.rows[0]) : null;
}

export async function findRenunganById(
  pool: Pool,
  id: string,
): Promise<Renungan | null> {
  const result = await pool.query<RenunganRow>(FIND_BY_ID_QUERY, [id]);
  return result.rows[0] ? mapRenungan(result.rows[0]) : null;
}

export async function listRenunganByDateRange(
  pool: Pool,
  startDate: string,
  endDate: string,
): Promise<Renungan[]> {
  const result = await pool.query<RenunganRow>(LIST_BY_DATE_RANGE_QUERY, [
    startDate,
    endDate,
  ]);
  return result.rows.map(mapRenungan);
}

export async function insertRenungan(
  pool: Pool,
  input: RenunganInput,
  imageAttribution: string | null,
): Promise<Renungan> {
  const result = await pool.query<RenunganRow>(INSERT_QUERY, [
    input.publishDate,
    input.title,
    input.verse,
    input.scripture,
    input.description,
    input.imageUrl,
    imageAttribution,
    input.isPublished,
  ]);
  return mapRenungan(result.rows[0]);
}

export async function updateRenungan(
  pool: Pool,
  id: string,
  input: RenunganInput,
  imageAttribution: string | null,
): Promise<Renungan | null> {
  const result = await pool.query<RenunganRow>(UPDATE_QUERY, [
    id,
    input.publishDate,
    input.title,
    input.verse,
    input.scripture,
    input.description,
    input.imageUrl,
    imageAttribution,
    input.isPublished,
  ]);
  return result.rows[0] ? mapRenungan(result.rows[0]) : null;
}
