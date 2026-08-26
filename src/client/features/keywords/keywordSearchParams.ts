/**
 * @file_id FILE-MVX-AUTO-KEYWORDSEARCHPARAMS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-KEYWORDSEARCHPARAMS
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
 * @generated_at 2026-05-13T13:53:35.053Z
 * @updated_at 2026-05-13T13:53:35.054Z
 * @hash sha256:99ece113922c1e919e31c316af085860627f5685db175edff6ad7d205ec49d38
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.053Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import type { SortDir, SortField } from "@/client/features/keywords/components";
import type {
  KeywordMode,
  ResultLimit,
} from "@/client/features/keywords/keywordResearchTypes";

type KeywordSearchParams = {
  q?: string;
  loc?: number;
  kLimit?: ResultLimit;
  mode?: KeywordMode;
  sort?: SortField;
  order?: SortDir;
  minVol?: string;
  maxVol?: string;
  minCpc?: string;
  maxCpc?: string;
  minKd?: string;
  maxKd?: string;
  include?: string;
  exclude?: string;
};

export function normalizeLegacyKeywordSearch(search: KeywordSearchParams): {
  normalized: KeywordSearchParams;
  changed: boolean;
} {
  const normalized: KeywordSearchParams = {
    ...search,
    q: search.q === "" ? undefined : search.q,
    loc: search.loc,
    kLimit: search.kLimit === 150 ? undefined : search.kLimit,
    mode: search.mode === "auto" ? undefined : search.mode,
    sort: search.sort === "searchVolume" ? undefined : search.sort,
    order: search.order === "desc" ? undefined : search.order,
    minVol: undefined,
    maxVol: undefined,
    minCpc: undefined,
    maxCpc: undefined,
    minKd: undefined,
    maxKd: undefined,
    include: undefined,
    exclude: undefined,
  };

  const keys: Array<keyof KeywordSearchParams> = [
    "q",
    "loc",
    "kLimit",
    "mode",
    "sort",
    "order",
    "minVol",
    "maxVol",
    "minCpc",
    "maxCpc",
    "minKd",
    "maxKd",
    "include",
    "exclude",
  ];

  return {
    normalized,
    changed: keys.some((key) => search[key] !== normalized[key]),
  };
}

export function isResultLimit(value: number): value is ResultLimit {
  return value === 150 || value === 300 || value === 500;
}

export function normalizeKeywordMode(value: string): KeywordMode {
  if (value === "auto") return "auto";
  if (value === "related") return "related";
  if (value === "suggestions") return "suggestions";
  if (value === "ideas") return "ideas";
  return "auto";
}

export function normalizeSortField(value: string): SortField {
  if (value === "keyword") return "keyword";
  if (value === "searchVolume") return "searchVolume";
  if (value === "cpc") return "cpc";
  if (value === "competition") return "competition";
  if (value === "keywordDifficulty") return "keywordDifficulty";
  return "searchVolume";
}

export function normalizeSortDir(value: string): SortDir {
  return value === "asc" ? "asc" : "desc";
}
