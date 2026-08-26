/**
 * @file_id FILE-MVX-AUTO-HOSTEDPLANGATE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-HOSTEDPLANGATE
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
 * @generated_at 2026-05-13T13:53:34.401Z
 * @updated_at 2026-05-13T13:53:34.403Z
 * @hash sha256:0fae2164e595967e50a296a70e9ec808e2d84a6b0bb5ad0205080913e66a4751
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.401Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import type { ReactNode } from "react";
import { AutumnProvider, useCustomer } from "autumn-js/react";
import { useSession } from "@/lib/auth-client";
import { isHostedClientAuthMode } from "@/lib/auth-mode";
import { getCustomerPlanStatus } from "@/client/features/billing/plan-detection";

export type HostedPlanGateState = {
  isLoading: boolean;
  isFreePlan: boolean;
};

const SELF_HOSTED_PLAN_GATE: HostedPlanGateState = {
  isLoading: false,
  isFreePlan: false,
};

export function HostedPlanGate({
  children,
}: {
  children: (state: HostedPlanGateState) => ReactNode;
}) {
  if (!isHostedClientAuthMode()) {
    return children(SELF_HOSTED_PLAN_GATE);
  }

  return (
    <AutumnProvider>
      <HostedPlanGateContent>{children}</HostedPlanGateContent>
    </AutumnProvider>
  );
}

function HostedPlanGateContent({
  children,
}: {
  children: (state: HostedPlanGateState) => ReactNode;
}) {
  const { data: session, isPending: isSessionPending } = useSession();
  const hasSession = Boolean(session?.user?.id);
  const customerQuery = useCustomer({
    queryOptions: { enabled: hasSession },
  });

  return children({
    isLoading: isSessionPending || !hasSession || customerQuery.isLoading,
    isFreePlan:
      !!customerQuery.data &&
      getCustomerPlanStatus(customerQuery.data) === "free",
  });
}
