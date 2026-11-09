"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPool } from "@/lib/db";
import { logger } from "@/lib/logger";
import {
  RENUNGAN_NOT_FOUND_MESSAGE,
  RENUNGAN_SAVE_ERROR_MESSAGE,
} from "./renungan.constants.ts";
import {
  RenunganDateTakenError,
  createRenungan,
  updateRenunganById,
} from "./renungan.service.ts";
import { parseRenunganInput } from "./renungan.validation.ts";

export type RenunganFormState = { error?: string };

export async function saveRenunganAction(
  _previousState: RenunganFormState,
  formData: FormData,
): Promise<RenunganFormState> {
  const parsed = parseRenunganInput({
    publishDate: String(formData.get("publishDate") ?? ""),
    title: String(formData.get("title") ?? ""),
    verse: String(formData.get("verse") ?? ""),
    scripture: String(formData.get("scripture") ?? ""),
    description: String(formData.get("description") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? ""),
    isPublished: formData.get("isPublished") === "on",
  });

  if (!parsed.ok) return { error: parsed.error };

  const id = String(formData.get("id") ?? "").trim();

  try {
    if (id) {
      const updated = await updateRenunganById(getPool(), id, parsed.value);
      if (!updated) return { error: RENUNGAN_NOT_FOUND_MESSAGE };
    } else {
      await createRenungan(getPool(), parsed.value);
    }
  } catch (error) {
    if (error instanceof RenunganDateTakenError) return { error: error.message };
    logger.error({ err: error }, "Saving renungan failed");
    return { error: RENUNGAN_SAVE_ERROR_MESSAGE };
  }

  revalidatePath("/admin/renungan");
  redirect(`/admin/renungan?month=${parsed.value.publishDate.slice(0, 7)}`);
}
