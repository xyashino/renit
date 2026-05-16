import { parseDate } from './duration';

export type BlockedRange = {
  dateFrom: string;
  dateTo: string;
};

export type RentalSlot = {
  dateFrom: string;
  dateTo: string;
};

function addUtcDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function toUtcYmd(date: Date): string {
  return date.toISOString().split('T')[0]!;
}

function blockedRangeBoundary(iso: string): Date {
  const ymd = iso.includes('T') ? iso.split('T')[0]! : iso;
  return parseDate(ymd)!;
}

function rangesOverlap(start: Date, end: Date, blockFrom: Date, blockTo: Date): boolean {
  return blockFrom < end && start < blockTo;
}

/** `dateTo` is the last inclusive rental day. */
export function isRentalRangeAvailable(
  dateFrom: string,
  dateTo: string,
  blockedRanges: BlockedRange[]
): boolean {
  const from = parseDate(dateFrom);
  const lastDay = parseDate(dateTo);
  if (!from || !lastDay || lastDay < from) return false;

  const endExclusive = addUtcDays(lastDay, 1);
  return !blockedRanges.some((range) =>
    rangesOverlap(
      from,
      endExclusive,
      blockedRangeBoundary(range.dateFrom),
      blockedRangeBoundary(range.dateTo)
    )
  );
}

export function computeAvailableSlots(
  blockedRanges: BlockedRange[],
  durationDays: number,
  options?: { horizonDays?: number; searchFrom?: Date }
): RentalSlot[] {
  if (durationDays < 1) return [];

  const horizonDays = options?.horizonDays ?? 30;
  const anchor = options?.searchFrom ?? new Date();
  const today = new Date(
    Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth(), anchor.getUTCDate())
  );

  const blocks = blockedRanges
    .map((range) => ({
      from: blockedRangeBoundary(range.dateFrom),
      to: blockedRangeBoundary(range.dateTo),
    }))
    .filter((range) => !isNaN(range.from.getTime()) && !isNaN(range.to.getTime()));

  const slots: RentalSlot[] = [];

  for (let offset = 0; offset <= horizonDays - durationDays; offset++) {
    const start = addUtcDays(today, offset);
    const end = addUtcDays(start, durationDays);

    const conflict = blocks.some((block) => rangesOverlap(start, end, block.from, block.to));
    if (!conflict) {
      slots.push({ dateFrom: toUtcYmd(start), dateTo: toUtcYmd(end) });
    }
  }

  return slots;
}
