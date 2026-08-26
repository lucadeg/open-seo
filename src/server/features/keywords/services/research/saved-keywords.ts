/**
 * @file_id FILE-MVX-AUTO-SAVED-KEYWORDS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-SAVED-KEYWORDS
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
 * @generated_at 2026-05-13T13:53:37.669Z
 * @updated_at 2026-05-13T13:53:37.671Z
 * @hash sha256:752b3cf8646647f8787801cfc2fc9f649cd6d46d8140b25a696f69a8962a63cc
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:37.669Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { KeywordResearchRepository } from "@/server/features/keywords/repositories/KeywordResearchRepository";
import { jsonCodec } from "@/shared/json";
import type {
  GetSavedKeywordsInput,
  RemoveSavedKeywordsInput,
  SaveKeywordsInput,
} from "@/types/schemas/keywords";
import type { MonthlySearch, SavedKeywordRow } from "@/types/keywords";
import { normalizeKeyword } from "./helpers";
import { z } from "zod";

const monthlySearchSchema = z.object({
  year: z.number().int().positive(),
  month: z.number().int().min(1).max(12),
  searchVolume: z.number().int().nonnegative(),
});

const monthlySearchesCodec = jsonCodec(z.array(monthlySearchSchema));

function parseMonthlySearches(payload: string | null): MonthlySearch[] {
  if (!payload) return [];
  const result = monthlySearchesCodec.safeParse(payload);
  return result.success ? result.data : [];
}

export async function saveKeywords(input: SaveKeywordsInput) {
  const normalizedKeywords = [
    ...new Set(
      input.keywords.map(normalizeKeyword).filter((kw) => kw.length > 0),
    ),
  ];

  const metricByKeyword = new Map(
    (input.metrics ?? [])
      .map((metric) => {
        const keyword = normalizeKeyword(metric.keyword);
        if (!keyword || !normalizedKeywords.includes(keyword)) return null;
        return [keyword, metric] as const;
      })
      .filter(
        (
          entry,
        ): entry is readonly [
          string,
          NonNullable<typeof input.metrics>[number],
        ] => entry != null,
      ),
  );

  if (metricByKeyword.size > 0) {
    await Promise.all(
      normalizedKeywords.map(async (keyword) => {
        const metric = metricByKeyword.get(keyword);
        if (!metric) return;

        await KeywordResearchRepository.upsertKeywordMetric({
          projectId: input.projectId,
          keyword,
          locationCode: input.locationCode,
          languageCode: input.languageCode,
          searchVolume: metric.searchVolume ?? null,
          cpc: metric.cpc ?? null,
          competition: metric.competition ?? null,
          keywordDifficulty: metric.keywordDifficulty ?? null,
          intent: metric.intent ?? null,
          monthlySearchesJson: JSON.stringify(metric.monthlySearches ?? []),
        });
      }),
    );
  }

  await KeywordResearchRepository.saveKeywordsToProject({
    projectId: input.projectId,
    keywords: normalizedKeywords,
    locationCode: input.locationCode,
    languageCode: input.languageCode,
  });

  return { success: true };
}

export async function getSavedKeywords(
  input: GetSavedKeywordsInput,
): Promise<{ rows: SavedKeywordRow[] }> {
  const rows = await KeywordResearchRepository.listSavedKeywordsByProject(
    input.projectId,
  );

  return {
    rows: rows.map(({ row, metric }) => ({
      id: row.id,
      projectId: row.projectId,
      keyword: row.keyword,
      locationCode: row.locationCode,
      languageCode: row.languageCode,
      createdAt: row.createdAt,
      searchVolume: metric?.searchVolume ?? null,
      cpc: metric?.cpc ?? null,
      competition: metric?.competition ?? null,
      keywordDifficulty: metric?.keywordDifficulty ?? null,
      intent: metric?.intent ?? null,
      monthlySearches: parseMonthlySearches(metric?.monthlySearches ?? null),
      fetchedAt: metric?.fetchedAt ?? null,
    })),
  };
}

export async function removeSavedKeywords(
  projectId: string,
  input: RemoveSavedKeywordsInput,
) {
  const deletedCount = await KeywordResearchRepository.removeSavedKeywords(
    input.savedKeywordIds,
    projectId,
  );
  return { success: true, deletedCount };
}
