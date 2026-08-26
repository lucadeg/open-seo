/**
 * @file_id FILE-MVX-AUTO-PLAN-DETECTION-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-PLAN-DETECTION
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
 * @generated_at 2026-05-13T13:53:34.421Z
 * @updated_at 2026-05-13T13:53:34.422Z
 * @hash sha256:234b82883beee427557204c09acb158754442164cde0478ef963d9df8a9a1f13
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.421Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { AUTUMN_PAID_PLAN_ID } from "@/shared/billing";

export type PlanStatus = "free" | "paid";

export function getCustomerPlanStatus(
  customer:
    | { subscriptions?: Array<{ planId: string; status: string }> }
    | undefined,
): PlanStatus {
  if (!customer?.subscriptions) return "free";

  const hasActivePaid = customer.subscriptions.some(
    (sub) => sub.planId === AUTUMN_PAID_PLAN_ID && sub.status === "active",
  );

  return hasActivePaid ? "paid" : "free";
}
