import Link from "next/link";
import { getMonthGrid, shiftMonth } from "../renungan.calendar";
import type { Renungan } from "../renungan.types";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type RenunganCalendarProps = {
  yearMonth: string;
  today: string;
  entries: Renungan[];
};

function monthLabel(yearMonth: string): string {
  const [year, month] = yearMonth.split("-").map(Number);
  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export function RenunganCalendar({
  yearMonth,
  today,
  entries,
}: RenunganCalendarProps) {
  const grid = getMonthGrid(yearMonth);
  const entryByDate = new Map(entries.map((entry) => [entry.publishDate, entry]));

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/renungan?month=${shiftMonth(yearMonth, -1)}`}
            aria-label="Previous month"
            className="grid size-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-violet-600"
          >
            ‹
          </Link>
          <h2 className="min-w-40 text-center text-base font-semibold text-slate-900">
            {monthLabel(yearMonth)}
          </h2>
          <Link
            href={`/admin/renungan?month=${shiftMonth(yearMonth, 1)}`}
            aria-label="Next month"
            className="grid size-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-violet-600"
          >
            ›
          </Link>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" />
            Published
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-400" />
            Draft
          </span>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/70">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-slate-100">
        {grid.map((day, index) => {
          if (!day) {
            return (
              <div
                key={`empty-${index}`}
                className="min-h-24 bg-slate-50/60"
              />
            );
          }

          const entry = entryByDate.get(day.date);
          const isToday = day.date === today;

          return (
            <Link
              key={day.date}
              href={`/admin/renungan/${day.date}`}
              aria-label={`Edit renungan for ${day.date}`}
              className={`group flex min-h-24 flex-col gap-1 bg-white p-2 transition hover:bg-violet-50/60 focus-visible:outline-2 focus-visible:outline-violet-600 ${
                isToday ? "ring-2 ring-inset ring-violet-400" : ""
              }`}
            >
              <span className="flex items-center justify-between">
                <span
                  className={`text-xs font-semibold ${
                    isToday ? "text-violet-700" : "text-slate-500"
                  }`}
                >
                  {day.dayNumber}
                </span>
                {entry && (
                  <span
                    aria-hidden="true"
                    className={`size-2 rounded-full ${
                      entry.isPublished ? "bg-emerald-500" : "bg-amber-400"
                    }`}
                  />
                )}
              </span>
              {entry && (
                <span className="line-clamp-2 text-[11px] font-medium leading-4 text-slate-700">
                  {entry.title}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
