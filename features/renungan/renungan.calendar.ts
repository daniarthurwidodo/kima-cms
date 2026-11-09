import { formatDateInTimeZone } from "./renungan.service.ts";

const YEAR_MONTH_PATTERN = /^\d{4}-\d{2}$/;
const DAYS_PER_WEEK = 7;

export type CalendarDay = {
  date: string;
  dayNumber: number;
};

export function parseYearMonth(value: string): string | null {
  if (!YEAR_MONTH_PATTERN.test(value)) return null;

  const month = Number(value.split("-")[1]);
  return month >= 1 && month <= 12 ? value : null;
}

export function getMonthGrid(
  yearMonth: string,
): Array<CalendarDay | null> {
  if (!parseYearMonth(yearMonth)) return [];

  const [year, month] = yearMonth.split("-").map(Number);
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  const cells: Array<CalendarDay | null> = Array(firstWeekday).fill(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      date: `${yearMonth}-${String(day).padStart(2, "0")}`,
      dayNumber: day,
    });
  }

  while (cells.length % DAYS_PER_WEEK !== 0) cells.push(null);
  return cells;
}

export function shiftMonth(yearMonth: string, offset: number): string {
  const [year, month] = yearMonth.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1 + offset, 1))
    .toISOString()
    .slice(0, 7);
}

export function getCurrentMonth(
  timeZone: string,
  now: Date = new Date(),
): string {
  return formatDateInTimeZone(now, timeZone).slice(0, 7);
}
