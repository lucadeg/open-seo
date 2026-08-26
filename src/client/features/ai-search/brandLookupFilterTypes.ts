/**
 * @file_id FILE-MVX-AUTO-BRANDLOOKUPFILTERTYPES-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-BRANDLOOKUPFILTERTYPES
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
 * @generated_at 2026-05-13T13:53:33.407Z
 * @updated_at 2026-05-13T13:53:33.409Z
 * @hash sha256:18ac9feb4e3585ab354a3d9d458051876b115d605c1500644ca2ce30b95c38bd
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:33.407Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

export type CitationTab = "pages" | "queries";

export type TopPagesFilterValues = {
  include: string;
  exclude: string;
  platform: string;
  minMentions: string;
  maxMentions: string;
};

export type QueriesFilterValues = {
  include: string;
  exclude: string;
  platform: string;
  minVolume: string;
  maxVolume: string;
};

export const EMPTY_TOP_PAGES_FILTERS: TopPagesFilterValues = {
  include: "",
  exclude: "",
  platform: "",
  minMentions: "",
  maxMentions: "",
};

export const EMPTY_QUERIES_FILTERS: QueriesFilterValues = {
  include: "",
  exclude: "",
  platform: "",
  minVolume: "",
  maxVolume: "",
};
