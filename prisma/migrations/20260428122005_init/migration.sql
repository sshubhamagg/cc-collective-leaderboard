-- CreateTable
CREATE TABLE "creator_performance_source" (
    "id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "revenue_generated" DECIMAL(12,2) NOT NULL,
    "source_date" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "creator_performance_source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leaderboard_daily_snapshot" (
    "id" UUID NOT NULL,
    "source_id" UUID NOT NULL,
    "snapshot_date" DATE NOT NULL,
    "revenue_generated" DECIMAL(12,2) NOT NULL,
    "rank_position" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leaderboard_daily_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "creator_performance_source_source_date_idx" ON "creator_performance_source"("source_date");

-- CreateIndex
CREATE INDEX "leaderboard_snapshot_date_rank_idx" ON "leaderboard_daily_snapshot"("snapshot_date", "rank_position");

-- CreateIndex
CREATE INDEX "leaderboard_snapshot_source_id_idx" ON "leaderboard_daily_snapshot"("source_id");

-- CreateIndex
CREATE UNIQUE INDEX "leaderboard_snapshot_date_source_id_key" ON "leaderboard_daily_snapshot"("snapshot_date", "source_id");

-- AddForeignKey
ALTER TABLE "leaderboard_daily_snapshot" ADD CONSTRAINT "leaderboard_daily_snapshot_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "creator_performance_source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
