import {
  MAX_DATAFORSEO_FILTER_CONDITIONS,
  type DomainKeywordsFilters,
} from "@/types/schemas/domain";
import { AppError } from "@/server/lib/errors";

export type DomainKeywordsSortMode =
  | "rank"
  | "traffic"
  | "volume"
  | "score"
  | "cpc";
export type DomainKeywordsSortOrder = "asc" | "desc";

const SORT_FIELD_BY_MODE: Record<DomainKeywordsSortMode, string> = {
  rank: "ranked_serp_element.serp_item.rank_absolute",
  traffic: "ranked_serp_element.serp_item.etv",
  volume: "keyword_data.keyword_info.search_volume",
  score: "keyword_data.keyword_properties.keyword_difficulty",
  cpc: "keyword_data.keyword_info.cpc",
};

export function buildOrderBy(
  sortMode: DomainKeywordsSortMode,
  sortOrder: DomainKeywordsSortOrder,
): string[] {
  return [`${SORT_FIELD_BY_MODE[sortMode]},${sortOrder}`];
}

function escapeLikeTerm(term: string): string {
  return term.replace(/[\\%_]/g, (match) => `\\${match}`);
}

function pushAnd(filters: unknown[], expression: Clause) {
  if (filters.length > 0) filters.push("and");
  filters.push(expression);
}

function parseTerms(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .toLowerCase()
    .split(/[,+]/)
    .map((term) => term.trim())
    .filter(Boolean);
}

function collectNumericRange(
  out: Clause[],
  field: string,
  min: number | undefined,
  max: number | undefined,
) {
  if (typeof min === "number" && Number.isFinite(min)) {
    out.push([field, ">=", min]);
  }
  if (typeof max === "number" && Number.isFinite(max)) {
    out.push([field, "<=", max]);
  }
}

/**
 * @file_id FILE-MVX-AUTO-DOMAINKEYWORDFILTERS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-DOMAINKEYWORDFILTERS
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
 * @generated_at 2026-05-13T13:53:37.424Z
 * @updated_at 2026-05-13T13:53:37.426Z
 * @hash sha256:d32436a7110af8dbcd45eba901891aa6b07aee9b5e56f7f81708b63145f0b4a4
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:37.424Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */
type Clause = unknown[];

export function buildKeywordFilters(
  filters: DomainKeywordsFilters,
  searchTerm?: string,
): unknown[] {
  const conditions: Clause[] = [];

  for (const term of parseTerms(filters.include)) {
    conditions.push([
      "keyword_data.keyword",
      "ilike",
      `%${escapeLikeTerm(term)}%`,
    ]);
  }
  for (const term of parseTerms(filters.exclude)) {
    conditions.push([
      "keyword_data.keyword",
      "not_ilike",
      `%${escapeLikeTerm(term)}%`,
    ]);
  }

  collectNumericRange(
    conditions,
    "keyword_data.keyword_info.search_volume",
    filters.minVol,
    filters.maxVol,
  );
  collectNumericRange(
    conditions,
    "ranked_serp_element.serp_item.etv",
    filters.minTraffic,
    filters.maxTraffic,
  );
  collectNumericRange(
    conditions,
    "keyword_data.keyword_info.cpc",
    filters.minCpc,
    filters.maxCpc,
  );
  collectNumericRange(
    conditions,
    "keyword_data.keyword_properties.keyword_difficulty",
    filters.minKd,
    filters.maxKd,
  );
  collectNumericRange(
    conditions,
    "ranked_serp_element.serp_item.rank_absolute",
    filters.minRank,
    filters.maxRank,
  );

  const trimmedSearch = searchTerm?.trim();
  const searchGroup = trimmedSearch ? buildSearchGroup(trimmedSearch) : null;

  // The search OR-group costs 2 slots; everything else is 1.
  const totalConditions = conditions.length + (searchGroup ? 2 : 0);
  if (totalConditions > MAX_DATAFORSEO_FILTER_CONDITIONS) {
    throw new AppError(
      "VALIDATION_ERROR",
      `Too many filter conditions (${totalConditions} of ${MAX_DATAFORSEO_FILTER_CONDITIONS} max).`,
    );
  }

  const expressions: unknown[] = [];
  for (const clause of conditions) pushAnd(expressions, clause);
  if (searchGroup) pushAnd(expressions, searchGroup);
  return expressions;
}

function buildSearchGroup(term: string): Clause {
  const escaped = escapeLikeTerm(term);
  return [
    ["keyword_data.keyword", "ilike", `%${escaped}%`],
    "or",
    ["ranked_serp_element.serp_item.url", "ilike", `%${escaped}%`],
  ];
}
