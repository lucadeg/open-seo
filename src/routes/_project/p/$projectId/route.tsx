/**
 * @file_id FILE-MVX-AUTO-ROUTE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-ROUTE
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
 * @generated_at 2026-05-13T13:53:36.860Z
 * @updated_at 2026-05-13T13:53:36.862Z
 * @hash sha256:e18364724afed44b5c154961693aedcf282d7c38849eb778e212575731846d54
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:36.860Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { FreePlanBanner } from "@/client/features/billing/FreePlanBanner";
import { getErrorCode } from "@/client/lib/error-messages";
import { AuthenticatedAppLayout } from "@/client/layout/AppShell";
import { isHostedClientAuthMode } from "@/lib/auth-mode";
import {
  getCurrentAuthRedirectFromHref,
  getSignInSearch,
} from "@/lib/auth-redirect";
import { getProjectAccess } from "@/serverFunctions/projects";

export const Route = createFileRoute("/_project/p/$projectId")({
  beforeLoad: async ({ location, params }) => {
    try {
      await getProjectAccess({ data: { projectId: params.projectId } });
    } catch (error) {
      if (getErrorCode(error) === "UNAUTHENTICATED") {
        throw redirect({
          to: "/sign-in",
          search: getSignInSearch(
            getCurrentAuthRedirectFromHref(location.href),
          ),
          replace: true,
        });
      }

      throw redirect({ to: "/", replace: true });
    }
  },
  pendingComponent: ProjectRoutePending,
  component: ProjectLayout,
});

function ProjectLayout() {
  const { projectId } = Route.useParams();

  return (
    <AuthenticatedAppLayout
      projectId={projectId}
      banner={isHostedClientAuthMode() ? <FreePlanBanner /> : undefined}
    >
      <Outlet />
    </AuthenticatedAppLayout>
  );
}

function ProjectRoutePending() {
  return (
    <div className="flex h-full items-center justify-center">
      <span className="loading loading-spinner loading-md" />
    </div>
  );
}
