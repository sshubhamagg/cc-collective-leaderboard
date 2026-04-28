import { Prisma } from "@/generated/prisma/client";

type DecimalLike = Prisma.Decimal | number | string;

export type CreatorRevenueRow = {
  id: string;
  fullName: string;
  revenueGenerated: DecimalLike;
};

export type RankedLeaderboardRow = {
  id: string;
  fullName: string;
  revenueGenerated: Prisma.Decimal;
  rankPosition: number;
};

function toDecimal(value: DecimalLike): Prisma.Decimal {
  return value instanceof Prisma.Decimal ? value : new Prisma.Decimal(value);
}

function compareRevenueDescending(
  left: CreatorRevenueRow,
  right: CreatorRevenueRow,
): number {
  const leftRevenue = toDecimal(left.revenueGenerated);
  const rightRevenue = toDecimal(right.revenueGenerated);

  return rightRevenue.comparedTo(leftRevenue);
}

function compareCreatorIdAscending(
  left: CreatorRevenueRow,
  right: CreatorRevenueRow,
): number {
  return left.id.localeCompare(right.id);
}

export function rankCreatorRevenueRows(
  rows: readonly CreatorRevenueRow[],
): RankedLeaderboardRow[] {
  const sortedRows = [...rows].sort((left, right) => {
    const revenueComparison = compareRevenueDescending(left, right);

    if (revenueComparison !== 0) {
      return revenueComparison;
    }

    return compareCreatorIdAscending(left, right);
  });

  return sortedRows.map((row, index) => ({
    id: row.id,
    fullName: row.fullName,
    revenueGenerated: toDecimal(row.revenueGenerated),
    rankPosition: index + 1,
  }));
}
