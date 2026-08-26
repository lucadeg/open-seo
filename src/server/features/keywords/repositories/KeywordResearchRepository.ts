/**
 * @file_id FILE-MVX-AUTO-KEYWORDRESEARCHREPOSITORY-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-KEYWORDRESEARCHREPOSITORY
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
 * @generated_at 2026-05-13T13:53:37.543Z
 * @updated_at 2026-05-13T13:53:37.545Z
 * @hash sha256:305a6422dd5bc3723430b504a32c7078649276bf3b59fa98b9d61497f08fbd6e
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:37.543Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { and, count, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { keywordMetrics, savedKeywords } from "@/db/schema";

async function upsertKeywordMetric(params: {
  projectId: string;
  keyword: string;
  locationCode: number;
  languageCode: string;
  searchVolume: number | null;
  cpc: number | null;
  competition: number | null;
  keywordDifficulty: number | null;
  intent: string | null;
  monthlySearchesJson: string;
}) {
  const fetchedAt = new Date().toISOString();

  await db
    .insert(keywordMetrics)
    .values({
      projectId: params.projectId,
      keyword: params.keyword,
      locationCode: params.locationCode,
      languageCode: params.languageCode,
      searchVolume: params.searchVolume,
      cpc: params.cpc,
      competition: params.competition,
      keywordDifficulty: params.keywordDifficulty,
      intent: params.intent,
      monthlySearches: params.monthlySearchesJson,
      fetchedAt,
    })
    .onConflictDoUpdate({
      target: [
        keywordMetrics.projectId,
        keywordMetrics.keyword,
        keywordMetrics.locationCode,
        keywordMetrics.languageCode,
      ],
      set: {
        searchVolume: params.searchVolume,
        cpc: params.cpc,
        competition: params.competition,
        keywordDifficulty: params.keywordDifficulty,
        intent: params.intent,
        monthlySearches: params.monthlySearchesJson,
        fetchedAt,
      },
    });
}

async function countSavedKeywords(projectId: string) {
  const [result] = await db
    .select({ value: count() })
    .from(savedKeywords)
    .where(eq(savedKeywords.projectId, projectId));
  return result?.value ?? 0;
}

async function saveKeywordsToProject(params: {
  projectId: string;
  keywords: string[];
  locationCode: number;
  languageCode: string;
}) {
  if (params.keywords.length === 0) return;

  const [first, ...rest] = params.keywords.map((keyword) =>
    db
      .insert(savedKeywords)
      .values({
        id: crypto.randomUUID(),
        projectId: params.projectId,
        keyword,
        locationCode: params.locationCode,
        languageCode: params.languageCode,
      })
      .onConflictDoNothing(),
  );

  await db.batch([first, ...rest]);
}

async function listSavedKeywordsByProject(projectId: string) {
  return db
    .select({ row: savedKeywords, metric: keywordMetrics })
    .from(savedKeywords)
    .leftJoin(
      keywordMetrics,
      and(
        eq(keywordMetrics.keyword, savedKeywords.keyword),
        eq(keywordMetrics.projectId, savedKeywords.projectId),
        eq(keywordMetrics.locationCode, savedKeywords.locationCode),
        eq(keywordMetrics.languageCode, savedKeywords.languageCode),
      ),
    )
    .where(eq(savedKeywords.projectId, projectId))
    .orderBy(desc(savedKeywords.createdAt));
}

// D1 caps bound parameters at 100 per statement; leave headroom for the
// projectId filter.
const DELETE_CHUNK_SIZE = 90;

async function removeSavedKeywords(
  savedKeywordIds: string[],
  projectId: string,
) {
  let deletedCount = 0;
  for (let i = 0; i < savedKeywordIds.length; i += DELETE_CHUNK_SIZE) {
    const chunk = savedKeywordIds.slice(i, i + DELETE_CHUNK_SIZE);
    const deleted = await db
      .delete(savedKeywords)
      .where(
        and(
          inArray(savedKeywords.id, chunk),
          eq(savedKeywords.projectId, projectId),
        ),
      )
      .returning({ id: savedKeywords.id });
    deletedCount += deleted.length;
  }
  return deletedCount;
}

export const KeywordResearchRepository = {
  upsertKeywordMetric,
  countSavedKeywords,
  saveKeywordsToProject,
  listSavedKeywordsByProject,
  removeSavedKeywords,
} as const;
