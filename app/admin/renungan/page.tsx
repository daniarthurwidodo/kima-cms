import type { Metadata } from "next";
import Link from "next/link";
import { getPool } from "@/lib/db";
import { logger } from "@/lib/logger";
import {
  RENUNGAN_LOAD_ERROR_MESSAGE,
  RENUNGAN_TIME_ZONE,
} from "@/features/renungan/renungan.constants";
import {
  getCurrentMonth,
  parseYearMonth,
} from "@/features/renungan/renungan.calendar";
import { RenunganCalendar } from "@/features/renungan/components/renungan-calendar";
import {
  formatDateInTimeZone,
  listRenunganByMonth,
} from "@/features/renungan/renungan.service";
import type { Renungan } from "@/features/renungan/renungan.types";

export const metadata: Metadata = {
  title: "Renungan | Kima CMS",
};

type RenunganPageProps = {
  searchParams: Promise<{ month?: string }>;
};

export default async function RenunganPage({
  searchParams,
}: RenunganPageProps) {
  const params = await searchParams;
  const requested = typeof params.month === "string" ? params.month : "";
  const yearMonth =
    parseYearMonth(requested) ?? getCurrentMonth(RENUNGAN_TIME_ZONE);
  const today = formatDateInTimeZone(new Date(), RENUNGAN_TIME_ZONE);

  let entries: Renungan[] = [];
  let loadFailed = false;

  try {
    entries = await listRenunganByMonth(getPool(), yearMonth);
  } catch (error) {
    logger.error({ err: error, yearMonth }, "Loading renungan calendar failed");
    loadFailed = true;
  }

  return (
    <main className="min-h-screen bg-[#f7f8fc] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="text-sm font-medium text-violet-600 hover:text-violet-800"
            >
              ← Dashboard
            </Link>
            <h1 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-slate-900">
              Renungan
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Pick a date to write or edit that day&apos;s devotional.
            </p>
          </div>
          <Link
            href={`/admin/renungan/${today}`}
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            Write today&apos;s renungan
          </Link>
        </div>

        {loadFailed && (
          <p
            role="alert"
            className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600"
          >
            {RENUNGAN_LOAD_ERROR_MESSAGE}
          </p>
        )}

        <RenunganCalendar
          yearMonth={yearMonth}
          today={today}
          entries={entries}
        />
      </div>
    </main>
  );
}
