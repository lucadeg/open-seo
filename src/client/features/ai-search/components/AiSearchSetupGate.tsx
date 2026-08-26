/**
 * @file_id FILE-MVX-AUTO-AISEARCHSETUPGATE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-AISEARCHSETUPGATE
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
 * @generated_at 2026-05-13T13:53:33.449Z
 * @updated_at 2026-05-13T13:53:33.451Z
 * @hash sha256:e5d1d6b5eade634a8c205ec7fa28692f76de58cbef61fd9e23880ff15bad01cf
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:33.449Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import {
  AccessGate,
  AccessGateLoadingState,
} from "@/client/features/access-gate/AccessGate";

export function AiSearchAccessLoadingState() {
  return <AccessGateLoadingState />;
}

export function AiSearchSetupGate({
  errorMessage,
  isRefetching,
  onRetry,
}: {
  errorMessage: string | null;
  isRefetching: boolean;
  onRetry: () => void;
}) {
  return (
    <AccessGate
      title="Enable AI Optimization"
      bodyText="AI Optimization is not enabled for your DataForSEO account yet. You can enable it in DataForSEO, or use managed OpenSEO for long-term LLM Mentions access at $10/month."
      helperText={
        <>
          We are also planning an API so self-hosted apps can use OpenSEO's LLM
          Mentions data directly. Until then, <InlineManagedOpenSeoLink />.
        </>
      }
      buttonLabel="Confirm AI Optimization Access"
      externalUrl="https://app.dataforseo.com/api-access-subscriptions"
      externalLabel="Open DataForSEO API Access"
      errorMessage={errorMessage}
      isRefetching={isRefetching}
      onRetry={onRetry}
    />
  );
}

function InlineManagedOpenSeoLink() {
  return (
    <a
      className="underline underline-offset-2 hover:text-base-content/70"
      href="https://openseo.so/?utm_source=self_hosted_app&utm_medium=access_gate&utm_campaign=llm_mentions"
      target="_blank"
      rel="noreferrer"
    >
      use managed OpenSEO
    </a>
  );
}
