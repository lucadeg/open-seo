/**
 * @file_id FILE-MVX-AUTO-ERRORHANDLING-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-ERRORHANDLING
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
 * @generated_at 2026-05-13T13:53:36.270Z
 * @updated_at 2026-05-13T13:53:36.272Z
 * @hash sha256:e142451db066ee8ae4f5e51607395fb5f8c28d59c0c50453b12ae6f2b5586d83
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:36.270Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { waitUntil } from "cloudflare:workers";
import { shouldCaptureAppErrorCode } from "@/shared/error-codes";
import { asAppError, toClientError } from "@/server/lib/errors";
import { captureServerError } from "@/server/lib/posthog";

export const errorHandlingMiddleware = createMiddleware({
  type: "function",
}).server(async (c) => {
  const { next } = c;

  try {
    return await next();
  } catch (error) {
    if (!(error instanceof Error)) {
      throw new Error("INTERNAL_ERROR", { cause: error });
    }

    const appError = asAppError(error);

    if (shouldCaptureAppErrorCode(appError?.code)) {
      const request = getRequest();
      const url = new URL(request.url);

      console.error("server.function error:", error);
      waitUntil(
        captureServerError(error, {
          errorCode: appError?.code ?? "INTERNAL_ERROR",
          method: request.method,
          path: url.pathname,
          ...appError?.details,
        }),
      );
    }

    throw toClientError(error);
  }
});
