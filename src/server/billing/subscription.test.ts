/**
 * @file_id FILE-MVX-AUTO-SUBSCRIPTION-TEST-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-SUBSCRIPTION-TEST
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
 * @generated_at 2026-05-13T13:53:36.984Z
 * @updated_at 2026-05-13T13:53:36.987Z
 * @hash sha256:1a738a205457972496a435b747133c291c6af1adffb0b821b991cdf1525b9d7a
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:36.984Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { AUTUMN_PAID_PLAN_FEATURE_ID } from "@/shared/billing";

const { checkMock, getOrCreateMock } = vi.hoisted(() => ({
  checkMock: vi.fn(),
  getOrCreateMock: vi.fn(),
}));

vi.mock("@/server/billing/autumn", () => ({
  autumn: {
    check: checkMock,
    customers: {
      getOrCreate: getOrCreateMock,
    },
  },
}));

vi.mock("@/server/lib/runtime-env", () => ({
  isHostedServerAuthMode: vi.fn(),
}));

import {
  customerHasPaidPlan,
  getOrCreateOrganizationCustomer,
} from "./subscription";

describe("subscription billing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("checks the paid plan entitlement", async () => {
    checkMock.mockResolvedValue({ allowed: true });

    await expect(customerHasPaidPlan("org_123")).resolves.toBe(true);

    expect(checkMock).toHaveBeenCalledWith({
      customerId: "org_123",
      featureId: AUTUMN_PAID_PLAN_FEATURE_ID,
    });
  });

  it("returns false when org lacks paid plan", async () => {
    checkMock.mockResolvedValue({ allowed: false });

    await expect(customerHasPaidPlan("org_123")).resolves.toBe(false);
  });

  it("looks up the billing customer by organization id", async () => {
    getOrCreateMock.mockResolvedValue({ id: "cust_123" });

    await getOrCreateOrganizationCustomer({
      organizationId: "org_123",
      userId: "user_123",
      userEmail: "alice@example.com",
    });

    expect(getOrCreateMock).toHaveBeenCalledWith({
      customerId: "org_123",
      email: "alice@example.com",
    });
  });
});
