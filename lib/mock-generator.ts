import { Prisma } from "@/generated/prisma/client";
import type { PrismaClient } from "@/generated/prisma/client";

type CreatorTier = "top" | "growth" | "emerging";

type CreatorProfile = {
  fullName: string;
  tier: CreatorTier;
  anchorRevenue: number;
  volatility: number;
  weeklyInfluence: number;
  monthlyInfluence: number;
};

type ExistingSourceRow = {
  id: string;
  fullName: string;
  revenueGenerated: Prisma.Decimal;
};

export type MockCreatorPerformanceRow = {
  fullName: string;
  revenueGenerated: Prisma.Decimal;
  sourceDate: Date;
};

export type SyncMockCreatorPerformanceResult = {
  createdCount: number;
  updatedCount: number;
  sourceDate: Date;
  rows: MockCreatorPerformanceRow[];
};

type PrismaWriteClient = PrismaClient | Prisma.TransactionClient;

type MockGeneratorOptions = {
  sourceDate?: Date;
};

const CREATOR_PROFILES: CreatorProfile[] = [
  {
    fullName: "Aarav Malhotra",
    tier: "top",
    anchorRevenue: 238000,
    volatility: 0.035,
    weeklyInfluence: 0.028,
    monthlyInfluence: 0.018,
  },
  {
    fullName: "Anaya Kapoor",
    tier: "top",
    anchorRevenue: 224000,
    volatility: 0.034,
    weeklyInfluence: 0.027,
    monthlyInfluence: 0.017,
  },
  {
    fullName: "Vihaan Mehta",
    tier: "top",
    anchorRevenue: 209000,
    volatility: 0.036,
    weeklyInfluence: 0.028,
    monthlyInfluence: 0.018,
  },
  {
    fullName: "Ira Bhandari",
    tier: "top",
    anchorRevenue: 196000,
    volatility: 0.038,
    weeklyInfluence: 0.029,
    monthlyInfluence: 0.019,
  },
  {
    fullName: "Reyansh Sethi",
    tier: "top",
    anchorRevenue: 184000,
    volatility: 0.039,
    weeklyInfluence: 0.03,
    monthlyInfluence: 0.019,
  },
  {
    fullName: "Myra Arora",
    tier: "top",
    anchorRevenue: 173000,
    volatility: 0.04,
    weeklyInfluence: 0.031,
    monthlyInfluence: 0.02,
  },
  {
    fullName: "Kabir Sharma",
    tier: "growth",
    anchorRevenue: 148000,
    volatility: 0.052,
    weeklyInfluence: 0.037,
    monthlyInfluence: 0.024,
  },
  {
    fullName: "Siya Khanna",
    tier: "growth",
    anchorRevenue: 139000,
    volatility: 0.054,
    weeklyInfluence: 0.038,
    monthlyInfluence: 0.025,
  },
  {
    fullName: "Advik Nanda",
    tier: "growth",
    anchorRevenue: 132000,
    volatility: 0.056,
    weeklyInfluence: 0.038,
    monthlyInfluence: 0.026,
  },
  {
    fullName: "Aisha Tandon",
    tier: "growth",
    anchorRevenue: 126000,
    volatility: 0.058,
    weeklyInfluence: 0.039,
    monthlyInfluence: 0.026,
  },
  {
    fullName: "Arjun Wadhwa",
    tier: "growth",
    anchorRevenue: 119000,
    volatility: 0.06,
    weeklyInfluence: 0.04,
    monthlyInfluence: 0.027,
  },
  {
    fullName: "Kiara Batra",
    tier: "growth",
    anchorRevenue: 113000,
    volatility: 0.061,
    weeklyInfluence: 0.041,
    monthlyInfluence: 0.027,
  },
  {
    fullName: "Vivaan Kohli",
    tier: "growth",
    anchorRevenue: 108000,
    volatility: 0.062,
    weeklyInfluence: 0.042,
    monthlyInfluence: 0.028,
  },
  {
    fullName: "Riya Makhija",
    tier: "growth",
    anchorRevenue: 102000,
    volatility: 0.063,
    weeklyInfluence: 0.042,
    monthlyInfluence: 0.028,
  },
  {
    fullName: "Ishaan Sachdeva",
    tier: "growth",
    anchorRevenue: 97000,
    volatility: 0.064,
    weeklyInfluence: 0.043,
    monthlyInfluence: 0.029,
  },
  {
    fullName: "Tara Gulati",
    tier: "growth",
    anchorRevenue: 92500,
    volatility: 0.066,
    weeklyInfluence: 0.044,
    monthlyInfluence: 0.03,
  },
  {
    fullName: "Yash Bedi",
    tier: "growth",
    anchorRevenue: 88100,
    volatility: 0.067,
    weeklyInfluence: 0.044,
    monthlyInfluence: 0.03,
  },
  {
    fullName: "Meher Suri",
    tier: "growth",
    anchorRevenue: 84600,
    volatility: 0.068,
    weeklyInfluence: 0.045,
    monthlyInfluence: 0.031,
  },
  {
    fullName: "Ahaan Chawla",
    tier: "emerging",
    anchorRevenue: 78600,
    volatility: 0.081,
    weeklyInfluence: 0.05,
    monthlyInfluence: 0.034,
  },
  {
    fullName: "Sana Chopra",
    tier: "emerging",
    anchorRevenue: 74200,
    volatility: 0.083,
    weeklyInfluence: 0.051,
    monthlyInfluence: 0.034,
  },
  {
    fullName: "Rudra Jain",
    tier: "emerging",
    anchorRevenue: 70900,
    volatility: 0.085,
    weeklyInfluence: 0.052,
    monthlyInfluence: 0.035,
  },
  {
    fullName: "Navya Puri",
    tier: "emerging",
    anchorRevenue: 67400,
    volatility: 0.087,
    weeklyInfluence: 0.052,
    monthlyInfluence: 0.035,
  },
  {
    fullName: "Dhruv Ahuja",
    tier: "emerging",
    anchorRevenue: 63800,
    volatility: 0.088,
    weeklyInfluence: 0.053,
    monthlyInfluence: 0.036,
  },
  {
    fullName: "Mahira Juneja",
    tier: "emerging",
    anchorRevenue: 60300,
    volatility: 0.09,
    weeklyInfluence: 0.054,
    monthlyInfluence: 0.036,
  },
  {
    fullName: "Dev Singhal",
    tier: "emerging",
    anchorRevenue: 57200,
    volatility: 0.092,
    weeklyInfluence: 0.055,
    monthlyInfluence: 0.037,
  },
  {
    fullName: "Aditi Luthra",
    tier: "emerging",
    anchorRevenue: 54400,
    volatility: 0.094,
    weeklyInfluence: 0.055,
    monthlyInfluence: 0.037,
  },
  {
    fullName: "Nivan Seth",
    tier: "emerging",
    anchorRevenue: 51800,
    volatility: 0.096,
    weeklyInfluence: 0.056,
    monthlyInfluence: 0.038,
  },
  {
    fullName: "Trisha Narang",
    tier: "emerging",
    anchorRevenue: 49200,
    volatility: 0.098,
    weeklyInfluence: 0.057,
    monthlyInfluence: 0.039,
  },
  {
    fullName: "Arav Oberoi",
    tier: "emerging",
    anchorRevenue: 46600,
    volatility: 0.099,
    weeklyInfluence: 0.058,
    monthlyInfluence: 0.039,
  },
  {
    fullName: "Misha Arneja",
    tier: "emerging",
    anchorRevenue: 43800,
    volatility: 0.1,
    weeklyInfluence: 0.058,
    monthlyInfluence: 0.04,
  },
  {
    fullName: "Rohan Talwar",
    tier: "emerging",
    anchorRevenue: 41500,
    volatility: 0.101,
    weeklyInfluence: 0.059,
    monthlyInfluence: 0.04,
  },
  {
    fullName: "Ishita Marwah",
    tier: "emerging",
    anchorRevenue: 39200,
    volatility: 0.103,
    weeklyInfluence: 0.059,
    monthlyInfluence: 0.041,
  },
  {
    fullName: "Vedant Dhingra",
    tier: "emerging",
    anchorRevenue: 37100,
    volatility: 0.104,
    weeklyInfluence: 0.06,
    monthlyInfluence: 0.041,
  },
  {
    fullName: "Nysa Bajaj",
    tier: "emerging",
    anchorRevenue: 34900,
    volatility: 0.105,
    weeklyInfluence: 0.061,
    monthlyInfluence: 0.042,
  },
  {
    fullName: "Laksh Anand",
    tier: "emerging",
    anchorRevenue: 32800,
    volatility: 0.106,
    weeklyInfluence: 0.061,
    monthlyInfluence: 0.042,
  },
  {
    fullName: "Jiya Trehan",
    tier: "emerging",
    anchorRevenue: 30700,
    volatility: 0.108,
    weeklyInfluence: 0.062,
    monthlyInfluence: 0.043,
  },
];

export function normalizeSourceDate(input?: Date): Date {
  const date = input ?? new Date();

  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function createHash(input: string): number {
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function normalizedNoise(seed: string): number {
  return createHash(seed) / 4294967295;
}

function signedNoise(seed: string): number {
  return normalizedNoise(seed) * 2 - 1;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function roundCurrency(value: number): Prisma.Decimal {
  return new Prisma.Decimal(value.toFixed(2));
}

function minimumRevenueForTier(tier: CreatorTier): number {
  if (tier === "top") {
    return 115000;
  }

  if (tier === "growth") {
    return 52000;
  }

  return 18000;
}

function maximumRevenueForTier(tier: CreatorTier): number {
  if (tier === "top") {
    return 310000;
  }

  if (tier === "growth") {
    return 175000;
  }

  return 98000;
}

function calculateRevenue(
  profile: CreatorProfile,
  sourceDate: Date,
  previousRevenue?: number,
): Prisma.Decimal {
  const dayIndex = Math.floor(sourceDate.getTime() / 86_400_000);
  const profileSeed = `${profile.fullName}:${sourceDate.toISOString()}`;
  const phase = normalizedNoise(`${profile.fullName}:phase`) * Math.PI * 2;
  const weeklyWave =
    Math.sin((dayIndex / 7) * Math.PI * 2 + phase) * profile.weeklyInfluence;
  const monthlyWave =
    Math.sin((dayIndex / 29.5) * Math.PI * 2 + phase / 2) *
    profile.monthlyInfluence;
  const dailyShock = signedNoise(`${profileSeed}:daily`) * profile.volatility;
  const driftBias =
    signedNoise(`${profile.fullName}:drift`) *
    (profile.tier === "top" ? 0.006 : 0.01);
  const anchorTarget =
    profile.anchorRevenue *
    (1 + weeklyWave + monthlyWave + dailyShock + driftBias);

  const prior = previousRevenue ?? profile.anchorRevenue;
  const momentumGap = clamp(
    (prior - profile.anchorRevenue) / profile.anchorRevenue,
    -0.22,
    0.22,
  );
  const smoothedRevenue = prior * 0.68 + anchorTarget * 0.32;
  const momentumAdjustedRevenue =
    smoothedRevenue * (1 + momentumGap * 0.18) +
    signedNoise(`${profileSeed}:micro`) * profile.anchorRevenue * 0.008;

  const boundedRevenue = clamp(
    momentumAdjustedRevenue,
    minimumRevenueForTier(profile.tier),
    maximumRevenueForTier(profile.tier),
  );

  return roundCurrency(boundedRevenue);
}

export function generateMockCreatorPerformanceDataset(
  options: MockGeneratorOptions = {},
  existingRows: ExistingSourceRow[] = [],
): MockCreatorPerformanceRow[] {
  const sourceDate = normalizeSourceDate(options.sourceDate);
  const existingRowsByName = new Map(
    existingRows.map((row) => [row.fullName, row]),
  );

  return CREATOR_PROFILES.map((profile) => {
    const existingRow = existingRowsByName.get(profile.fullName);
    const previousRevenue = existingRow
      ? Number(existingRow.revenueGenerated.toString())
      : undefined;

    return {
      fullName: profile.fullName,
      revenueGenerated: calculateRevenue(profile, sourceDate, previousRevenue),
      sourceDate,
    };
  });
}

export async function syncMockCreatorPerformanceSource(
  prisma: PrismaWriteClient,
  options: MockGeneratorOptions = {},
): Promise<SyncMockCreatorPerformanceResult> {
  const sourceDate = normalizeSourceDate(options.sourceDate);
  const existingRows = await prisma.creatorPerformanceSource.findMany({
    select: {
      id: true,
      fullName: true,
      revenueGenerated: true,
    },
  });
  const existingRowsByName = new Map(
    existingRows.map((row) => [row.fullName, row]),
  );
  const rows = generateMockCreatorPerformanceDataset(options, existingRows);

  let createdCount = 0;
  let updatedCount = 0;

  await Promise.all(
    rows.map((row) => {
      const existingRow = existingRowsByName.get(row.fullName);

      if (existingRow) {
        updatedCount += 1;

        return prisma.creatorPerformanceSource.update({
          where: { id: existingRow.id },
          data: {
            fullName: row.fullName,
            revenueGenerated: row.revenueGenerated,
            sourceDate: row.sourceDate,
          },
        });
      }

      createdCount += 1;

      return prisma.creatorPerformanceSource.create({
        data: {
          fullName: row.fullName,
          revenueGenerated: row.revenueGenerated,
          sourceDate: row.sourceDate,
        },
      });
    }),
  );

  return {
    createdCount,
    updatedCount,
    sourceDate,
    rows,
  };
}
