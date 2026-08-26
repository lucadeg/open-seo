/**
 * @file_id FILE-MVX-AUTO-HOSTEDBILLINGCONTENTUTILS-TEST-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-HOSTEDBILLINGCONTENTUTILS-TEST
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
 * @generated_at 2026-05-13T13:53:34.376Z
 * @updated_at 2026-05-13T13:53:34.377Z
 * @hash sha256:f688d33d9cdf5fee40b804eb0c3ddc7b6aa17e5a1f306370cc464c4488a9baff
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.376Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { describe, expect, it } from "vitest";
import { parseTopUpAmount } from "./HostedBillingContentUtils";

describe("parseTopUpAmount", () => {
  it("accepts valid whole-dollar amounts", () => {
    expect(parseTopUpAmount("20")).toEqual({ isValid: true, parsed: 20 });
    expect(parseTopUpAmount("10")).toEqual({ isValid: true, parsed: 10 });
    expect(parseTopUpAmount("99")).toEqual({ isValid: true, parsed: 99 });
  });

  it("rejects amounts below minimum", () => {
    expect(parseTopUpAmount("9")).toEqual({ isValid: false, parsed: 20 });
  });

  it("rejects amounts above maximum", () => {
    expect(parseTopUpAmount("100")).toEqual({ isValid: false, parsed: 20 });
  });

  it("rejects non-numeric input", () => {
    expect(parseTopUpAmount("abc")).toEqual({ isValid: false, parsed: 20 });
  });
});
