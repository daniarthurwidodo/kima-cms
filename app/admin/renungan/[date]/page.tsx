import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPool } from "@/lib/db";
import { logger } from "@/lib/logger";
import { RENUNGAN_LOAD_ERROR_MESSAGE } from "@/features/renungan/renungan.constants";
import { RenunganForm } from "@/features/renungan/components/renungan-form";
import { getRenunganByDate } from "@/features/renungan/renungan.service";
import { parsePublishDate } from "@/features/renungan/renungan.validation";
import type { Renungan } from "@/features/renungan/renungan.types";

export const metadata: Metadata = {
  title: "Edit renungan | Kima CMS",
};

type RenunganEditorPageProps = {
  params: Promise<{ date: string }>;
};

export default async function RenunganEditorPage({
  params,
}: RenunganEditorPageProps) {
  const { date } = await params;
  const publishDate = parsePublishDate(date);
  if (!publishDate) notFound();

  let renungan: Renungan | null = null;
  let loadFailed = false;

  try {
    renungan = await getRenunganByDate(getPool(), publishDate);
  } catch (error) {
    logger.error({ err: error, publishDate }, "Loading renungan failed");
    loadFailed = true;
  }

  return (
    <main className="min-h-screen bg-[#f7f8fc] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <Link
            href={`/admin/renungan?month=${publishDate.slice(0, 7)}`}
            className="text-sm font-medium text-violet-600 hover:text-violet-800"
          >
            ← Calendar
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-slate-900">
            {renungan ? "Edit renungan" : "New renungan"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{publishDate}</p>
        </div>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
          {loadFailed ? (
            <p
              role="alert"
              className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600"
            >
              {RENUNGAN_LOAD_ERROR_MESSAGE}
            </p>
          ) : (
            <RenunganForm date={publishDate} initial={renungan} />
          )}
        </section>
      </div>
    </main>
  );
}
