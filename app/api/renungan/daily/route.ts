import { getPool } from "@/lib/db";
import { jsonError, jsonResponse } from "@/lib/http";
import { logger } from "@/lib/logger";
import {
  API_CACHE_CONTROL,
  API_DATE_INVALID_MESSAGE,
  API_ERROR_MESSAGE,
  API_NOT_FOUND_MESSAGE,
  HTTP_BAD_REQUEST,
  HTTP_INTERNAL_ERROR,
  HTTP_NOT_FOUND,
} from "@/features/renungan/renungan.constants";
import {
  getDailyRenungan,
  getPublishedRenunganByDate,
  toRenunganResponse,
} from "@/features/renungan/renungan.service";
import { parsePublishDate } from "@/features/renungan/renungan.validation";

export async function GET(request: Request) {
  const dateParam = new URL(request.url).searchParams.get("date");
  let publishDate: string | undefined;

  if (dateParam) {
    const parsed = parsePublishDate(dateParam);
    if (!parsed) {
      return jsonError(API_DATE_INVALID_MESSAGE, HTTP_BAD_REQUEST);
    }
    publishDate = parsed;
  }

  try {
    const pool = getPool();
    const renungan = publishDate
      ? await getPublishedRenunganByDate(pool, publishDate)
      : await getDailyRenungan(pool);

    if (!renungan) {
      return jsonError(API_NOT_FOUND_MESSAGE, HTTP_NOT_FOUND);
    }

    return jsonResponse(toRenunganResponse(renungan), {
      headers: { "Cache-Control": API_CACHE_CONTROL },
    });
  } catch (error) {
    logger.error({ err: error, publishDate }, "Daily renungan lookup failed");
    return jsonError(API_ERROR_MESSAGE, HTTP_INTERNAL_ERROR);
  }
}
