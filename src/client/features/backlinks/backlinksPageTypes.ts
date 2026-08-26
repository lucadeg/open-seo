import type {
  BacklinksTab,
  BacklinksTargetScope,
} from "@/types/schemas/backlinks";
import type {
  getBacklinksOverview,
  getBacklinksReferringDomains,
  getBacklinksTopPages,
} from "@/serverFunctions/backlinks";

export type BacklinksOverviewData = Awaited<
  ReturnType<typeof getBacklinksOverview>
>;
export type BacklinksReferringDomainsData = Awaited<
  ReturnType<typeof getBacklinksReferringDomains>
>;
export type BacklinksTopPagesData = Awaited<
  ReturnType<typeof getBacklinksTopPages>
>;

export type BacklinksSearchState = {
  target: string;
  scope: BacklinksTargetScope;
  tab: BacklinksTab;
};

export type BacklinksNavigate = (args: {
  search: (prev: Record<string, unknown>) => Record<string, unknown>;
  replace: boolean;
}) => void;

export type BacklinksPageProps = {
  projectId: string;
  searchState: BacklinksSearchState;
  navigate: BacklinksNavigate;
};

export type BacklinksRow = BacklinksOverviewData["backlinks"][number];

export type GroupedBacklinkDomain = {
  domain: string;
  domainAuthority: number | null;
  spamScore: number | null;
  firstSeen: string | null;
  backlinkCount: number;
  targetCount: number;
  lostCount: number;
  brokenCount: number;
  nofollowCount: number;
  /**
 * @file_id FILE-MVX-AUTO-BACKLINKSPAGETYPES-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-BACKLINKSPAGETYPES
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
 * @generated_at 2026-05-13T13:53:34.102Z
 * @updated_at 2026-05-13T13:53:34.105Z
 * @hash sha256:a1b2ae688a89317ffc6f480a4f1faac790b6aeed92264f76f33fcd327c1796a4
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.102Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */
  subRows: GroupedBacklinkDomain[];
  /** Set on child rows only — the original backlink data */
  _backlink?: BacklinksRow;
};
