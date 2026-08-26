/**
 * @file_id FILE-MVX-AUTO-AUDIT-CAPACITY-TEST-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-AUDIT-CAPACITY-TEST
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
 * @generated_at 2026-05-13T13:53:37.293Z
 * @updated_at 2026-05-13T13:53:37.295Z
 * @hash sha256:bc2a298061d7726e64203f83887f9b5111888c686cfd7c4bff0823a13b31b730
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:37.293Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { describe, expect, it } from "vitest";
import {
  clampAuditMaxPages,
  getEstimatedAuditCapacity,
  MAX_USER_AUDIT_USAGE,
} from "@/server/features/audit/services/audit-capacity";

describe("audit capacity helpers", () => {
  it("clamps max pages into the supported range", () => {
    expect(clampAuditMaxPages()).toBe(50);
    expect(clampAuditMaxPages(1)).toBe(10);
    expect(clampAuditMaxPages(500)).toBe(500);
    expect(clampAuditMaxPages(20_000)).toBe(10_000);
  });

  it("estimates capacity for each lighthouse strategy", () => {
    expect(
      getEstimatedAuditCapacity({ maxPages: 100, lighthouseStrategy: "none" }),
    ).toEqual({
      pagesTotal: 100,
      lighthouseTotal: 0,
      total: 100,
    });
    expect(
      getEstimatedAuditCapacity({
        maxPages: 100,
        lighthouseStrategy: "manual",
      }),
    ).toEqual({
      pagesTotal: 100,
      lighthouseTotal: 0,
      total: 100,
    });
    expect(
      getEstimatedAuditCapacity({ maxPages: 100, lighthouseStrategy: "auto" }),
    ).toEqual({
      pagesTotal: 100,
      lighthouseTotal: 20,
      total: 120,
    });
    expect(
      getEstimatedAuditCapacity({ maxPages: 100, lighthouseStrategy: "all" }),
    ).toEqual({
      pagesTotal: 100,
      lighthouseTotal: 200,
      total: 300,
    });
  });

  it("stays within the global capacity limit for the maximum auto audit", () => {
    expect(
      getEstimatedAuditCapacity({
        maxPages: 10_000,
        lighthouseStrategy: "auto",
      }).total,
    ).toBeLessThan(MAX_USER_AUDIT_USAGE);
  });
});
