/**
 * @file_id FILE-MVX-AUTO-KEYWORDRESEARCHLOADINGSTATE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-KEYWORDRESEARCHLOADINGSTATE
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
 * @generated_at 2026-05-13T13:53:35.137Z
 * @updated_at 2026-05-13T13:53:35.141Z
 * @hash sha256:e624912f05a008201d2bcd73d20f9a559730b436de1827dc02d3ac46043a4036
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.137Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

export function KeywordResearchLoadingState() {
  return (
    <div className="flex-1 w-full pt-1">
      <div className="hidden md:flex h-full gap-4 mt-2">
        <div className="flex-1 flex flex-col min-w-0 gap-2">
          <div className="rounded-xl border border-base-300 bg-base-100 p-4">
            <div className="skeleton h-5 w-56" />
          </div>
          <div className="flex-1 rounded-xl border border-base-300 bg-base-100 overflow-hidden">
            <div className="border-b border-base-300 px-4 py-3 flex items-center gap-3">
              <div className="skeleton h-8 w-24" />
              <div className="skeleton h-4 w-40" />
            </div>
            <div className="p-4 space-y-3">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[24px_minmax(0,1fr)_64px_56px_48px_40px] items-center gap-3"
                >
                  <div className="skeleton h-3 w-3" />
                  <div className="skeleton h-4 w-10/12" />
                  <div className="skeleton h-3 w-12 justify-self-end" />
                  <div className="skeleton h-3 w-10 justify-self-end" />
                  <div className="skeleton h-3 w-10 justify-self-end" />
                  <div className="skeleton h-6 w-6 rounded-full justify-self-end" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col min-w-0 gap-2">
          <div className="rounded-xl border border-base-300 bg-base-100 p-4 space-y-3">
            <div className="skeleton h-4 w-36" />
            <div className="skeleton h-56 w-full" />
          </div>
          <div className="flex-1 rounded-xl border border-base-300 bg-base-100 p-4 space-y-3">
            <div className="skeleton h-4 w-44" />
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="grid grid-cols-[24px_1fr_72px] gap-2">
                <div className="skeleton h-3 w-4" />
                <div className="skeleton h-3 w-10/12" />
                <div className="skeleton h-3 w-12 justify-self-end" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="md:hidden mt-2 space-y-3">
        <div className="rounded-xl border border-base-300 bg-base-100 p-4 space-y-3">
          <div className="skeleton h-8 w-full" />
          <div className="skeleton h-8 w-2/3" />
        </div>
        <div className="rounded-xl border border-base-300 bg-base-100 p-4 space-y-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="space-y-2 rounded-lg border border-base-300 p-3"
            >
              <div className="skeleton h-4 w-9/12" />
              <div className="grid grid-cols-3 gap-2">
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
