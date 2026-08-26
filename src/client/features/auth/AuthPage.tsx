/**
 * @file_id FILE-MVX-AUTO-AUTHPAGE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-AUTHPAGE
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
 * @generated_at 2026-05-13T13:53:33.905Z
 * @updated_at 2026-05-13T13:53:33.906Z
 * @hash sha256:ca476e423d9694153510c08b4d30c508b500d4cfa3ee0ddc09cf6243c0016243
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:33.905Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { z } from "zod";
import { normalizeAuthRedirect } from "@/lib/auth-redirect";
import { isHostedClientAuthMode } from "@/lib/auth-mode";
import {
  getFieldError as getSharedFieldError,
  getFormError as getSharedFormError,
} from "@/client/lib/forms";

export const authRedirectSearchSchema = z.object({
  redirect: z.string().optional(),
});

export function useAuthPageState(redirect: string | undefined) {
  const redirectTo = normalizeAuthRedirect(redirect);
  const isHostedMode = isHostedClientAuthMode();

  return {
    redirectTo,
    isHostedMode,
  };
}

export function getFieldError(errors: readonly unknown[]) {
  return getSharedFieldError(errors);
}

export function getFormError(error: unknown) {
  return getSharedFormError(error);
}

export function AuthPageCard({
  title,
  helperText,
  children,
  footer,
}: {
  title: string;
  helperText?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-xs space-y-6">
      <div className="text-center space-y-3">
        <img
          src="/transparent-logo.png"
          alt="OpenSEO"
          className="mx-auto size-10 rounded-lg"
        />
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          {helperText ? (
            <p className="text-sm text-base-content/60 mt-1">{helperText}</p>
          ) : null}
        </div>
      </div>

      {children}

      {footer ? <div className="text-center">{footer}</div> : null}
    </div>
  );
}

export function AuthPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4 bg-base-200">
      {children}
    </div>
  );
}
