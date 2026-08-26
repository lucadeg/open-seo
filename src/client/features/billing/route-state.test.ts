/**
 * @file_id FILE-MVX-AUTO-ROUTE-STATE-TEST-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-ROUTE-STATE-TEST
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
 * @generated_at 2026-05-13T13:53:34.433Z
 * @updated_at 2026-05-13T13:53:34.435Z
 * @hash sha256:4fbe6a8ca80d66b070ed22060d2cff92a478e31d4bb65473d7bd6f091c8568cd
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.433Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { describe, expect, it } from "vitest";
import { getBillingRouteState, getSubscribeRouteState } from "./route-state";

describe("getBillingRouteState", () => {
  it("shows ready after successful customer lookup", () => {
    expect(
      getBillingRouteState({
        hasSession: true,
        isSessionPending: false,
        isCustomerLoading: false,
        isCustomerError: false,
      }),
    ).toBe("ready");
  });

  it("shows an error state on billing lookup failures", () => {
    expect(
      getBillingRouteState({
        hasSession: true,
        isSessionPending: false,
        isCustomerLoading: false,
        isCustomerError: true,
      }),
    ).toBe("error");
  });

  it("keeps the page blank while auth or billing data is still loading", () => {
    expect(
      getBillingRouteState({
        hasSession: true,
        isSessionPending: true,
        isCustomerLoading: false,
        isCustomerError: false,
      }),
    ).toBe("loading");

    expect(
      getBillingRouteState({
        hasSession: true,
        isSessionPending: false,
        isCustomerLoading: true,
        isCustomerError: false,
      }),
    ).toBe("loading");
  });
});

describe("getSubscribeRouteState", () => {
  it("shows an error state on billing lookup failures", () => {
    expect(
      getSubscribeRouteState({
        hasSession: true,
        isCustomerLoading: false,
        isCustomerError: true,
        planStatus: "free",
      }),
    ).toBe("error");
  });

  it("redirects paying customers away from onboarding", () => {
    expect(
      getSubscribeRouteState({
        hasSession: true,
        isCustomerLoading: false,
        isCustomerError: false,
        planStatus: "paid",
      }),
    ).toBe("redirectToApp");
  });

  it("shows welcome page for free plan users", () => {
    expect(
      getSubscribeRouteState({
        hasSession: true,
        isCustomerLoading: false,
        isCustomerError: false,
        planStatus: "free",
      }),
    ).toBe("showWelcome");
  });
});
