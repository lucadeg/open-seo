/**
 * @file_id FILE-MVX-AUTO-DOMAINOVERVIEWLOADINGSTATE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-DOMAINOVERVIEWLOADINGSTATE
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
 * @generated_at 2026-05-13T13:53:34.582Z
 * @updated_at 2026-05-13T13:53:34.584Z
 * @hash sha256:776e31eb3f123cae2d8198a420aae5e55d6bf5b3b27588b15b7743c36574ccef
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.582Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

export function DomainOverviewLoadingState() {
  return (
    <div className="space-y-4" aria-busy>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body p-4 space-y-2">
            <div className="skeleton h-3 w-36" />
            <div className="skeleton h-8 w-44" />
          </div>
        </div>
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body p-4 space-y-2">
            <div className="skeleton h-3 w-32" />
            <div className="skeleton h-8 w-40" />
          </div>
        </div>
      </div>

      <div className="card bg-base-100 border border-base-300">
        <div className="card-body gap-3">
          <div className="flex items-center justify-between">
            <div className="skeleton h-8 w-48" />
            <div className="skeleton h-8 w-60" />
          </div>
          <div className="skeleton h-9 w-64" />
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="grid grid-cols-7 gap-3">
                <div className="skeleton h-4 col-span-2" />
                <div className="skeleton h-4" />
                <div className="skeleton h-4" />
                <div className="skeleton h-4" />
                <div className="skeleton h-4 col-span-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
