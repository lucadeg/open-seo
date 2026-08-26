/**
 * @file_id FILE-MVX-AUTO-PROMPTEXPLORERLOADINGSTATE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-PROMPTEXPLORERLOADINGSTATE
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
 * @generated_at 2026-05-13T13:53:33.606Z
 * @updated_at 2026-05-13T13:53:33.608Z
 * @hash sha256:0bc61b4ade51bb773873307b26a61aefd0da6b86789d1f8992240ab5c9ad71a4
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:33.606Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

type Props = {
  modelCount: number;
};

export function PromptExplorerLoadingState({ modelCount }: Props) {
  const count = Math.max(1, modelCount);
  return (
    <div className="space-y-5" aria-busy>
      {Array.from({ length: count }).map((_, index) => (
        <article
          key={index}
          className="overflow-hidden rounded-r-lg border border-base-300 border-l-4 border-l-base-300 bg-base-100"
        >
          <header className="flex items-center justify-between border-b border-base-200 bg-base-200/40 px-5 py-3">
            <div className="flex items-center gap-2">
              <div className="skeleton size-2 rounded-full" />
              <div className="skeleton h-4 w-20" />
              <div className="skeleton h-3 w-32" />
            </div>
            <div className="skeleton h-3 w-16" />
          </header>
          <div className="space-y-2 px-5 py-5">
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-11/12" />
            <div className="skeleton h-3 w-10/12" />
            <div className="skeleton h-3 w-9/12" />
          </div>
        </article>
      ))}
    </div>
  );
}
