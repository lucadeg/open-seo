/**
 * @file_id FILE-MVX-AUTO-RESEARCH-DATA-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-RESEARCH-DATA
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
 * @generated_at 2026-05-13T13:53:37.633Z
 * @updated_at 2026-05-13T13:53:37.636Z
 * @hash sha256:76ef389b6db79c29eeda080086b455c930db10ae9ee8ba82d2bbe0c85a774c5e
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:37.633Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { type LabsKeywordDataItem } from "@/server/lib/dataforseoClient";
import type { BillingCustomerContext } from "@/server/billing/subscription";
import { createDataforseoClient } from "@/server/lib/dataforseoClient";
import {
  normalizeIntent,
  normalizeKeyword,
  type EnrichedKeyword,
} from "./helpers";
import type { KeywordSource } from "./selection";

type FetchResearchRowsParams = {
  seedKeyword: string;
  locationCode: number;
  languageCode: string;
  resultLimit: number;
  source: KeywordSource;
};

function mapKeywordDataItems(items: LabsKeywordDataItem[]): EnrichedKeyword[] {
  const rows: EnrichedKeyword[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    const keyword = item.keyword;
    if (!keyword) continue;

    const normalized = normalizeKeyword(keyword);
    if (seen.has(normalized)) continue;
    seen.add(normalized);

    const keywordInfo = item.keyword_info_normalized_with_clickstream
      ?.search_volume
      ? item.keyword_info_normalized_with_clickstream
      : item.keyword_info;

    rows.push({
      keyword: normalized,
      searchVolume: keywordInfo?.search_volume ?? null,
      trend: (keywordInfo?.monthly_searches ?? []).map((entry) => ({
        year: entry.year,
        month: entry.month,
        searchVolume: entry.search_volume ?? 0,
      })),
      cpc: item.keyword_info?.cpc ?? null,
      competition: item.keyword_info?.competition ?? null,
      keywordDifficulty: item.keyword_properties?.keyword_difficulty ?? null,
      intent: normalizeIntent(item.search_intent_info?.main_intent),
    });
  }

  return rows;
}

async function fetchRelatedRows(
  params: Omit<FetchResearchRowsParams, "source">,
  dataforseo: ReturnType<typeof createDataforseoClient>,
) {
  const items = await dataforseo.keywords.related({
    keyword: params.seedKeyword,
    locationCode: params.locationCode,
    languageCode: params.languageCode,
    limit: params.resultLimit,
    depth: 3,
  });

  const rows: EnrichedKeyword[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    const keywordData = item.keyword_data;
    const keyword = keywordData.keyword;
    if (!keyword) continue;

    const normalized = normalizeKeyword(keyword);
    if (seen.has(normalized)) continue;
    seen.add(normalized);

    const keywordInfo = keywordData.keyword_info_normalized_with_clickstream
      ?.search_volume
      ? keywordData.keyword_info_normalized_with_clickstream
      : keywordData.keyword_info;

    rows.push({
      keyword: normalized,
      searchVolume: keywordInfo?.search_volume ?? null,
      trend: (keywordInfo?.monthly_searches ?? []).map((entry) => ({
        year: entry.year,
        month: entry.month,
        searchVolume: entry.search_volume ?? 0,
      })),
      cpc: keywordData.keyword_info?.cpc ?? null,
      competition: keywordData.keyword_info?.competition ?? null,
      keywordDifficulty:
        keywordData.keyword_properties?.keyword_difficulty ?? null,
      intent: normalizeIntent(keywordData.search_intent_info?.main_intent),
    });
  }

  return rows;
}

export async function fetchResearchRowsBySource(
  params: FetchResearchRowsParams,
  billingCustomer: BillingCustomerContext,
): Promise<EnrichedKeyword[]> {
  const dataforseo = createDataforseoClient(billingCustomer);

  if (params.source === "related") {
    return fetchRelatedRows(params, dataforseo);
  }

  if (params.source === "suggestions") {
    return mapKeywordDataItems(
      await dataforseo.keywords.suggestions({
        keyword: params.seedKeyword,
        locationCode: params.locationCode,
        languageCode: params.languageCode,
        limit: params.resultLimit,
      }),
    );
  }

  return mapKeywordDataItems(
    await dataforseo.keywords.ideas({
      keyword: params.seedKeyword,
      locationCode: params.locationCode,
      languageCode: params.languageCode,
      limit: params.resultLimit,
    }),
  );
}
