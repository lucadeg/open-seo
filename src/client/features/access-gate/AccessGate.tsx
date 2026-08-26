/**
 * @file_id FILE-MVX-AUTO-ACCESSGATE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-ACCESSGATE
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
 * @generated_at 2026-05-13T13:53:33.379Z
 * @updated_at 2026-05-13T13:53:33.380Z
 * @hash sha256:b580bcaede94666a4c269148648ad35edad62a1ac4c091c35c42fe99a003b480
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:33.379Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import type { ReactNode } from "react";
import { ShieldAlert, Wrench } from "lucide-react";

export function AccessGateLoadingState() {
  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body gap-4">
        <div className="skeleton h-6 w-48" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-4/5" />
        <div className="skeleton h-10 w-48" />
      </div>
    </div>
  );
}

export function AccessGate({
  title,
  bodyText,
  helperText,
  buttonLabel,
  refetchingLabel = "Confirming...",
  externalUrl,
  externalLabel,
  errorMessage,
  isRefetching,
  onRetry,
}: {
  title: string;
  bodyText: ReactNode;
  helperText?: ReactNode;
  buttonLabel: string;
  refetchingLabel?: string;
  externalUrl: string;
  externalLabel: string;
  errorMessage: string | null;
  isRefetching: boolean;
  onRetry: () => void;
}) {
  return (
    <section>
      <div className="rounded-2xl border border-base-300 bg-base-100 p-6 md:p-7 space-y-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-warning/15 p-2.5 text-warning shrink-0">
            <Wrench className="size-5" />
          </div>
          <div className="max-w-3xl space-y-1.5">
            <h2 className="text-xl font-semibold">{title}</h2>
            <div className="text-sm text-base-content/68">{bodyText}</div>
            {helperText ? (
              <div className="text-xs text-base-content/50">{helperText}</div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            className="btn btn-primary"
            onClick={onRetry}
            disabled={isRefetching}
          >
            {isRefetching ? refetchingLabel : buttonLabel}
          </button>
          <a
            className="btn btn-outline"
            href={externalUrl}
            target="_blank"
            rel="noreferrer"
          >
            {externalLabel}
          </a>
        </div>

        {errorMessage ? (
          <div className="alert alert-warning">
            <ShieldAlert className="size-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
