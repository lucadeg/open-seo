/**
 * @file_id FILE-MVX-AUTO-ROUTE-STATE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-ROUTE-STATE
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
 * @generated_at 2026-05-13T13:53:34.449Z
 * @updated_at 2026-05-13T13:53:34.450Z
 * @hash sha256:6abdb8011eb2b6359d22d4c6a2a4c4617a6b0f5da1028af1565f10d2cc21f2b7
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.449Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import type { PlanStatus } from "@/client/features/billing/plan-detection";

export function getBillingRouteState(args: {
  hasSession: boolean;
  isSessionPending: boolean;
  isCustomerLoading: boolean;
  isCustomerError: boolean;
}) {
  if (args.isSessionPending || !args.hasSession || args.isCustomerLoading) {
    return "loading" as const;
  }

  if (args.isCustomerError) {
    return "error" as const;
  }

  return "ready" as const;
}

export function getSubscribeRouteState(args: {
  hasSession: boolean;
  isCustomerLoading: boolean;
  isCustomerError: boolean;
  planStatus: PlanStatus;
}) {
  if (!args.hasSession || args.isCustomerLoading) {
    return "loading" as const;
  }

  if (args.isCustomerError) {
    return "error" as const;
  }

  if (args.planStatus === "paid") {
    return "redirectToApp" as const;
  }

  return "showWelcome" as const;
}
