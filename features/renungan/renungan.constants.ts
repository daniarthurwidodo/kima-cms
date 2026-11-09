export const RENUNGAN_TIME_ZONE = process.env.RENUNGAN_TIMEZONE ?? "Asia/Jakarta";

export const MAX_TITLE_LENGTH = 120;
export const MAX_VERSE_LENGTH = 120;
export const MAX_SCRIPTURE_LENGTH = 2000;
export const MAX_DESCRIPTION_LENGTH = 10000;
export const MAX_IMAGE_URL_LENGTH = 2048;

export const INVALID_RENUNGAN_MESSAGE =
  "Check the required fields and the image URL.";
export const RENUNGAN_DATE_TAKEN_MESSAGE =
  "A renungan already exists for this date.";

export const OPENVERSE_IMAGES_URL = "https://api.openverse.org/v1/images/";
export const OPENVERSE_TIMEOUT_MS = 5000;
export const OPENVERSE_RESULT_LIMIT = 1;
export const OPENVERSE_IMAGE_SIZE = "large";
export const OPENVERSE_IMAGE_CATEGORY = "photograph";

export const API_DATE_REQUIRED_MESSAGE = "A date query is required.";
export const API_DATE_INVALID_MESSAGE = "The date must use YYYY-MM-DD.";
export const API_NOT_FOUND_MESSAGE = "No renungan found for this date.";
export const API_ERROR_MESSAGE = "Unable to load the renungan right now.";
export const RENUNGAN_NOT_FOUND_MESSAGE = "Renungan not found.";
export const RENUNGAN_SAVE_ERROR_MESSAGE =
  "Unable to save the renungan right now.";
export const RENUNGAN_LOAD_ERROR_MESSAGE =
  "Unable to load the renungan calendar right now.";
export const API_CACHE_CONTROL =
  "public, max-age=60, stale-while-revalidate=300";
export const HTTP_BAD_REQUEST = 400;
export const HTTP_NOT_FOUND = 404;
export const HTTP_INTERNAL_ERROR = 500;
