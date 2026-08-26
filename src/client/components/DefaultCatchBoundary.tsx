/**
 * @file_id FILE-MVX-AUTO-DEFAULTCATCHBOUNDARY-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-DEFAULTCATCHBOUNDARY
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
 * @generated_at 2026-05-13T13:53:33.070Z
 * @updated_at 2026-05-13T13:53:33.072Z
 * @hash sha256:001bc015b4824f383dd4daa0484d93a32c7a4cd28c60edb2c6b0a20f810eb6c3
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:33.070Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { Link, rootRouteId, useMatch, useRouter } from "@tanstack/react-router";
import type { ErrorComponentProps } from "@tanstack/react-router";
import * as React from "react";
import { shouldCaptureAppErrorCode } from "@/shared/error-codes";
import {
  getErrorCode,
  getStandardErrorMessage,
} from "@/client/lib/error-messages";
import { AuthConfigErrorCard } from "@/client/components/AuthConfigErrorCard";
import { captureClientError } from "@/client/lib/posthog";
import { UnauthenticatedErrorCard } from "@/client/components/UnauthenticatedErrorCard";

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });
  const pathname = router.state.location.pathname;

  const message = getStandardErrorMessage(
    error,
    "Something went wrong. Please try again.",
  );
  const errorCode = getErrorCode(error);

  React.useEffect(() => {
    if (!shouldCaptureAppErrorCode(errorCode)) {
      return;
    }

    captureClientError(error, {
      errorCode,
      path: pathname,
    });
  }, [error, errorCode, pathname]);

  const showAuthConfigHelp = errorCode === "AUTH_CONFIG_MISSING";
  const showSignInHelp = errorCode === "UNAUTHENTICATED";

  if (showAuthConfigHelp) {
    return (
      <div className="min-w-0 flex-1 p-4 flex items-center justify-center">
        <AuthConfigErrorCard
          message={message}
          onRetry={() => {
            void router.invalidate();
          }}
        />
      </div>
    );
  }

  if (showSignInHelp) {
    return (
      <div className="min-w-0 flex-1 p-4 flex items-center justify-center">
        <UnauthenticatedErrorCard
          message={message}
          onRetry={() => {
            void router.invalidate();
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6">
      <p className="text-center text-error">{message}</p>
      <div className="flex gap-2 items-center flex-wrap">
        <button
          onClick={() => {
            void router.invalidate();
          }}
          className="btn btn-neutral btn-sm uppercase"
        >
          Try Again
        </button>
        {isRoot ? (
          <Link to="/" className="btn btn-neutral btn-sm uppercase">
            Home
          </Link>
        ) : (
          <Link
            to="/"
            className="btn btn-neutral btn-sm uppercase"
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
          >
            Go Back
          </Link>
        )}
      </div>
    </div>
  );
}
