/**
 * @file_id FILE-MVX-AUTO-SAFEURL-TEST-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-SAFEURL-TEST
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
 * @generated_at 2026-05-13T13:53:37.058Z
 * @updated_at 2026-05-13T13:53:37.060Z
 * @hash sha256:544c4c071c4b548a1039efa4241982dcd7515c5ac1080c8ba93fbbef06b748a3
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:37.058Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { describe, expect, it } from "vitest";
import { safeHostname, safeHttpUrl } from "./safeUrl";

describe("safeHttpUrl", () => {
  it.each([
    "https://example.com",
    "http://example.com",
    "https://example.com/path?q=1#frag",
    "https://sub.example.com",
  ])("accepts %s", (input) => {
    expect(safeHttpUrl(input)).toBe(input);
  });

  it.each([
    "javascript:alert(1)",
    "JAVASCRIPT:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
    "file:///etc/passwd",
    "ftp://example.com",
    "not a url",
    "",
    "https://user:pass@evil.example.com",
    "https://user@evil.example.com",
  ])("rejects %s", (input) => {
    expect(safeHttpUrl(input)).toBeNull();
  });

  it("returns null for null/undefined", () => {
    expect(safeHttpUrl(null)).toBeNull();
    expect(safeHttpUrl(undefined)).toBeNull();
  });
});

describe("safeHostname", () => {
  it("strips protocol and www prefix", () => {
    expect(safeHostname("https://www.example.com/path")).toBe("example.com");
    expect(safeHostname("http://sub.example.com")).toBe("sub.example.com");
  });

  it("returns null for unsafe schemes", () => {
    expect(safeHostname("javascript:alert(1)")).toBeNull();
    expect(safeHostname("data:text/html,foo")).toBeNull();
  });

  it("returns null for invalid input", () => {
    expect(safeHostname("not a url")).toBeNull();
    expect(safeHostname(null)).toBeNull();
  });
});
