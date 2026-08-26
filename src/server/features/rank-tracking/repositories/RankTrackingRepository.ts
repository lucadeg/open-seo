import { and, count, desc, eq, inArray, lte, max } from "drizzle-orm";
import type { InferInsertModel } from "drizzle-orm";
import { db } from "@/db";
import {
  rankTrackingConfigs,
  rankCheckRuns,
  rankSnapshots,
  rankTrackingKeywords,
  projects,
} from "@/db/schema";
import {
  getLatestSnapshotsForKeywords,
  getSnapshotsBeforeDate,
  getEarliestSnapshotsForKeywords,
} from "./snapshotQueries";

const DB_BATCH_SIZE = 100;
type BatchStatement = Parameters<typeof db.batch>[0][number];

async function executeInBatches<T>(
  items: T[],
  buildStatement: (item: T) => BatchStatement,
) {
  for (let i = 0; i < items.length; i += DB_BATCH_SIZE) {
    const chunk = items.slice(i, i + DB_BATCH_SIZE).map(buildStatement);
    const [first, ...rest] = chunk;
    if (!first) continue;
    await db.batch([first, ...rest]);
  }
}

// ---------------------------------------------------------------------------
// Config CRUD
// ---------------------------------------------------------------------------

async function getConfigsForProject(projectId: string) {
  return db
    .select()
    .from(rankTrackingConfigs)
    .where(
      and(
        eq(rankTrackingConfigs.projectId, projectId),
        eq(rankTrackingConfigs.isActive, true),
      ),
    )
    .orderBy(rankTrackingConfigs.createdAt);
}

async function getConfigById({
  configId,
  projectId,
}: {
  configId: string;
  projectId: string;
}) {
  const rows = await db
    .select()
    .from(rankTrackingConfigs)
    .where(
      and(
        eq(rankTrackingConfigs.id, configId),
        eq(rankTrackingConfigs.projectId, projectId),
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}

async function getConfigByProjectDomainLocation(
  projectId: string,
  domain: string,
  locationCode: number,
) {
  const rows = await db
    .select()
    .from(rankTrackingConfigs)
    .where(
      and(
        eq(rankTrackingConfigs.projectId, projectId),
        eq(rankTrackingConfigs.domain, domain),
        eq(rankTrackingConfigs.locationCode, locationCode),
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}

async function createConfig(
  data: InferInsertModel<typeof rankTrackingConfigs>,
) {
  await db.insert(rankTrackingConfigs).values(data);
}

async function updateConfig(
  configId: string,
  projectId: string,
  data: Partial<InferInsertModel<typeof rankTrackingConfigs>>,
) {
  await db
    .update(rankTrackingConfigs)
    .set(data)
    .where(
      and(
        eq(rankTrackingConfigs.id, configId),
        eq(rankTrackingConfigs.projectId, projectId),
      ),
    );
}

async function getDueConfigsWithOrganization(nowIso: string) {
  return db
    .select({
      id: rankTrackingConfigs.id,
      projectId: rankTrackingConfigs.projectId,
      domain: rankTrackingConfigs.domain,
      locationCode: rankTrackingConfigs.locationCode,
      languageCode: rankTrackingConfigs.languageCode,
      devices: rankTrackingConfigs.devices,
      serpDepth: rankTrackingConfigs.serpDepth,
      scheduleInterval: rankTrackingConfigs.scheduleInterval,
      nextCheckAt: rankTrackingConfigs.nextCheckAt,
      organizationId: projects.organizationId,
    })
    .from(rankTrackingConfigs)
    .innerJoin(projects, eq(rankTrackingConfigs.projectId, projects.id))
    .where(
      and(
        eq(rankTrackingConfigs.isActive, true),
        lte(rankTrackingConfigs.nextCheckAt, nowIso),
      ),
    )
    .limit(50);
}

// ---------------------------------------------------------------------------
// Run CRUD
// ---------------------------------------------------------------------------

/**
 * @file_id FILE-MVX-AUTO-RANKTRACKINGREPOSITORY-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-RANKTRACKINGREPOSITORY
 * @bounded_context governance
 * @epic_id EPI-MVX-00
 * @capability_id CAP-UNSPECIFIED
 * @story_id STORY-UNSPECIFIED
 * @task_id TASK-UNSPECIFIED
 * @sprint_id SPR-00
 * @release_slice_id RS-UNSPECIFIED-00
 * @requirement_refs REQ-MVX-000
 * @acceptance_refs AC-UNSPECIFIED-000
 * @test_refs TEST-UNSPECIFIED-000
 * @contract_refs CNTR-UNSPECIFIED
 * @evidence_refs EVD-UNSPECIFIED-000
 * @depends_on_files NONE
 * @used_by_files NONE
 * @schema_refs SCH-UNSPECIFIED-000
 * @event_refs EVT-UNSPECIFIED-000
 * @api_refs API-UNSPECIFIED-000
 * @flow_links flow:unspecified,ui:unspecified,event:unspecified
 * @telemetry trace:unspecified;metric:unspecified;log:unspecified
 * @dashboard_refs DASH-UNSPECIFIED
 * @alert_policy_refs ALT-UNSPECIFIED
 * @runbook_refs RB-UNSPECIFIED
 * @rollout_refs RO-UNSPECIFIED
 * @rollback_refs ROLLBACK-UNSPECIFIED
 * @security_class internal
 * @data_class technical_metadata
 * @pii_flag no
 * @auth_scope management_plane
 * @compliance_scope internal-audit
 * @retention_policy rp-persistent
 * @owner_team hermes-platform-team
 * @approver_role architect
 * @human_author architect/lucadeg
 * @agent_author codex
 * @generated_by_model gpt-5.3-codex
 * @prompt_hash sha256:auto-generated
 * @compiler_version mvx-tvm-v5
 * @source_artifacts AUTO-GENERATED
 * @generated_at 2026-05-13T13:53:37.781Z
 * @updated_at 2026-05-13T13:53:37.782Z
 * @hash sha256:1dd282d51949765fb0d71aed6a9c171b0c6a53b1462335aa7ef31ffa805372e7
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:37.781Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */
async function tryCreateRun(data: {
  id: string;
  configId: string;
  projectId: string;
  keywordsTotal: number;
  isSubsetRun?: boolean;
}): Promise<boolean> {
  const inserted = await db
    .insert(rankCheckRuns)
    .values({ ...data, status: "pending" })
    .onConflictDoNothing()
    .returning({ id: rankCheckRuns.id });
  return inserted.length > 0;
}

async function updateRun(
  runId: string,
  data: Partial<InferInsertModel<typeof rankCheckRuns>>,
) {
  await db.update(rankCheckRuns).set(data).where(eq(rankCheckRuns.id, runId));
}

async function getRunById(runId: string) {
  const rows = await db
    .select()
    .from(rankCheckRuns)
    .where(eq(rankCheckRuns.id, runId))
    .limit(1);
  return rows[0] ?? null;
}

async function getLatestRunForConfig(configId: string) {
  const rows = await db
    .select()
    .from(rankCheckRuns)
    .where(eq(rankCheckRuns.configId, configId))
    .orderBy(desc(rankCheckRuns.startedAt))
    .limit(1);
  return rows[0] ?? null;
}

/**
 * Returns the currently active (pending or running) run for a config, if any.
 * At most one such row exists, enforced by the partial unique index.
 */
async function getActiveRunForConfig(configId: string) {
  const rows = await db
    .select()
    .from(rankCheckRuns)
    .where(
      and(
        eq(rankCheckRuns.configId, configId),
        inArray(rankCheckRuns.status, ["pending", "running"]),
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}

// ---------------------------------------------------------------------------
// Snapshots
// ---------------------------------------------------------------------------

async function insertSnapshots(
  snapshots: Array<
    Omit<InferInsertModel<typeof rankSnapshots>, "id" | "checkedAt">
  >,
) {
  await executeInBatches(snapshots, (snapshot) =>
    db.insert(rankSnapshots).values(snapshot).onConflictDoNothing(),
  );
}

async function getSnapshotsForRun(runId: string) {
  return db.select().from(rankSnapshots).where(eq(rankSnapshots.runId, runId));
}

// ---------------------------------------------------------------------------
// Tracking keywords per config
// ---------------------------------------------------------------------------

async function getKeywordsForConfig(configId: string) {
  return db
    .select()
    .from(rankTrackingKeywords)
    .where(eq(rankTrackingKeywords.configId, configId))
    .orderBy(rankTrackingKeywords.createdAt);
}

async function addKeywordsToConfig(
  keywords: Array<{ id: string; configId: string; keyword: string }>,
) {
  await executeInBatches(keywords, (kw) =>
    db.insert(rankTrackingKeywords).values(kw).onConflictDoNothing(),
  );
}

async function removeKeywordsFromConfig(
  keywordIds: string[],
  configId: string,
) {
  await db
    .delete(rankTrackingKeywords)
    .where(
      and(
        inArray(rankTrackingKeywords.id, keywordIds),
        eq(rankTrackingKeywords.configId, configId),
      ),
    );
}

async function getConfigSummaries(projectId: string) {
  const configs = await getConfigsForProject(projectId);
  if (configs.length === 0) return [];

  // Batch: keyword counts grouped by config
  const kwCounts = await db
    .select({
      configId: rankTrackingKeywords.configId,
      value: count(),
    })
    .from(rankTrackingKeywords)
    .where(
      inArray(
        rankTrackingKeywords.configId,
        configs.map((c) => c.id),
      ),
    )
    .groupBy(rankTrackingKeywords.configId);

  const kwCountMap = new Map(kwCounts.map((r) => [r.configId, r.value]));

  // Subquery: latest startedAt per config
  const latestStarted = db
    .select({
      configId: rankCheckRuns.configId,
      maxStartedAt: max(rankCheckRuns.startedAt).as("maxStartedAt"),
    })
    .from(rankCheckRuns)
    .where(
      inArray(
        rankCheckRuns.configId,
        configs.map((c) => c.id),
      ),
    )
    .groupBy(rankCheckRuns.configId)
    .as("latestStarted");

  // Join back to get status + completedAt for each config's latest run
  const latestRuns = await db
    .select({
      configId: rankCheckRuns.configId,
      status: rankCheckRuns.status,
      completedAt: rankCheckRuns.completedAt,
    })
    .from(rankCheckRuns)
    .innerJoin(
      latestStarted,
      and(
        eq(rankCheckRuns.configId, latestStarted.configId),
        eq(rankCheckRuns.startedAt, latestStarted.maxStartedAt),
      ),
    );

  const latestRunMap = new Map<
    string,
    { status: string; completedAt: string | null }
  >();
  for (const run of latestRuns) {
    latestRunMap.set(run.configId, {
      status: run.status,
      completedAt: run.completedAt,
    });
  }

  return configs.map((config) => ({
    ...config,
    keywordCount: kwCountMap.get(config.id) ?? 0,
    lastRunStatus: latestRunMap.get(config.id)?.status ?? null,
    lastRunCompletedAt: latestRunMap.get(config.id)?.completedAt ?? null,
  }));
}

async function updateKeywordMetrics(
  updates: Array<{
    id: string;
    searchVolume: number | null;
    keywordDifficulty: number | null;
    cpc: number | null;
    metricsFetchedAt: string;
  }>,
) {
  await executeInBatches(updates, (u) =>
    db
      .update(rankTrackingKeywords)
      .set({
        searchVolume: u.searchVolume,
        keywordDifficulty: u.keywordDifficulty,
        cpc: u.cpc,
        metricsFetchedAt: u.metricsFetchedAt,
      })
      .where(eq(rankTrackingKeywords.id, u.id)),
  );
}

async function getKeywordCountForConfig(configId: string) {
  const rows = await db
    .select({ value: count() })
    .from(rankTrackingKeywords)
    .where(eq(rankTrackingKeywords.configId, configId));
  return rows[0]?.value ?? 0;
}

export const RankTrackingRepository = {
  getConfigsForProject,
  getConfigById,
  getConfigByProjectDomainLocation,
  createConfig,
  updateConfig,
  getDueConfigsWithOrganization,
  tryCreateRun,
  updateRun,
  getRunById,
  getLatestRunForConfig,
  getActiveRunForConfig,
  insertSnapshots,
  getSnapshotsForRun,
  getKeywordsForConfig,
  addKeywordsToConfig,
  removeKeywordsFromConfig,
  updateKeywordMetrics,
  getKeywordCountForConfig,
  getConfigSummaries,
  getLatestSnapshotsForKeywords,
  getSnapshotsBeforeDate,
  getEarliestSnapshotsForKeywords,
};
