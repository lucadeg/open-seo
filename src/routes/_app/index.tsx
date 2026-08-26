/**
 * @file_id FILE-MVX-AUTO-INDEX-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-INDEX
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
 * @generated_at 2026-05-13T13:53:36.435Z
 * @updated_at 2026-05-13T13:53:36.437Z
 * @hash sha256:07b76dd87391b2a79a31ff3a3547f080b774e9d3a211e8e2f435c577356c4a40
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:36.435Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { getOrCreateDefaultProject } from "@/serverFunctions/projects";
import {
  getErrorCode,
  getStandardErrorMessage,
} from "@/client/lib/error-messages";
import { AuthConfigErrorCard } from "@/client/components/AuthConfigErrorCard";
import { UnauthenticatedErrorCard } from "@/client/components/UnauthenticatedErrorCard";
import { SUBSCRIBE_ROUTE } from "@/shared/billing";

export const Route = createFileRoute("/_app/")({
  component: IndexRedirect,
});

function IndexRedirect() {
  const navigate = useNavigate();

  const { mutate, error, isError } = useMutation({
    mutationFn: () => getOrCreateDefaultProject(),
    onSuccess: (project) => {
      void navigate({
        to: "/p/$projectId/keywords",
        params: { projectId: project.id },
      });
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  useEffect(() => {
    if (getErrorCode(error) !== "PAYMENT_REQUIRED") {
      return;
    }

    void navigate({ href: SUBSCRIBE_ROUTE });
  }, [error, navigate]);

  if (isError) {
    const errorCode = getErrorCode(error);

    if (errorCode === "AUTH_CONFIG_MISSING") {
      return (
        <div className="flex items-center justify-center h-full p-4">
          <AuthConfigErrorCard
            message={getStandardErrorMessage(
              error,
              "An unexpected error occurred. Please check server logs.",
            )}
            onRetry={() => {
              mutate();
            }}
          />
        </div>
      );
    }

    if (errorCode === "UNAUTHENTICATED") {
      return (
        <div className="flex items-center justify-center h-full p-4">
          <UnauthenticatedErrorCard
            message="Please sign in to access your OpenSEO workspace."
            onRetry={() => {
              mutate();
            }}
          />
        </div>
      );
    }

    if (errorCode === "PAYMENT_REQUIRED") {
      return (
        <div className="flex items-center justify-center h-full p-4">
          <div className="flex flex-col items-center gap-3 max-w-xl text-center">
            <p className="text-base-content/80">
              Redirecting you to billing so you can start a hosted subscription.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="flex flex-col items-center gap-3 max-w-xl">
          <p className="text-error text-center">
            {getStandardErrorMessage(
              error,
              "An unexpected error occurred. Please check server logs.",
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full">
      <span className="loading loading-spinner loading-md" />
    </div>
  );
}
