/**
 * @file_id FILE-MVX-AUTO-TYPES-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-TYPES
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
 * @generated_at 2026-05-13T13:53:34.812Z
 * @updated_at 2026-05-13T13:53:34.813Z
 * @hash sha256:3d4779a7aeb4344dd1ec82940c8cea7e985b7d5aee2415a70cad8fefeb4f8ed8
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.812Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

export type KeywordRow = {
  keyword: string;
  position: number | null;
  searchVolume: number | null;
  traffic: number | null;
  cpc: number | null;
  url: string | null;
  relativeUrl: string | null;
  keywordDifficulty: number | null;
};

export type PageRow = {
  page: string;
  relativePath: string | null;
  organicTraffic: number | null;
  keywords: number | null;
};

export type DomainFilterValues = {
  include: string;
  exclude: string;
  minTraffic: string;
  maxTraffic: string;
  minVol: string;
  maxVol: string;
  minCpc: string;
  maxCpc: string;
  minKd: string;
  maxKd: string;
  minRank: string;
  maxRank: string;
};

export const EMPTY_DOMAIN_FILTERS: DomainFilterValues = {
  include: "",
  exclude: "",
  minTraffic: "",
  maxTraffic: "",
  minVol: "",
  maxVol: "",
  minCpc: "",
  maxCpc: "",
  minKd: "",
  maxKd: "",
  minRank: "",
  maxRank: "",
};

export type DomainControlsValues = {
  domain: string;
  subdomains: boolean;
  sort: "rank" | "traffic" | "volume" | "score" | "cpc";
  locationCode: number;
};

export type DomainSortMode = DomainControlsValues["sort"];
export type SortOrder = "asc" | "desc";
export type DomainActiveTab = "keywords" | "pages";

export type DomainOverviewData = {
  domain: string;
  organicTraffic: number | null;
  organicKeywords: number | null;
  backlinks: number | null;
  referringDomains: number | null;
  hasData: boolean;
};

export type DomainHistoryItem = {
  timestamp: number;
  domain: string;
  subdomains: boolean;
  sort: DomainSortMode;
  tab: DomainActiveTab;
  search?: string;
  locationCode?: number;
};
