/**
 * @file_id FILE-MVX-AUTO-BACKLINKSSEARCHSCOPE-TEST-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-BACKLINKSSEARCHSCOPE-TEST
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
 * @generated_at 2026-05-13T13:53:34.176Z
 * @updated_at 2026-05-13T13:53:34.178Z
 * @hash sha256:c1fb6ebffa360de95e6cb8699c9c73a3aeab674b08e34e08b213335021935459
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.176Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { describe, expect, it } from "vitest";
import {
  getPersistedBacklinksSearchScope,
  inferBacklinksSearchScopeFromTarget,
  resolveBacklinksSearchScope,
} from "./backlinksSearchScope";

describe("inferBacklinksSearchScopeFromTarget", () => {
  it("treats bare hostnames as domain lookups", () => {
    expect(inferBacklinksSearchScopeFromTarget("example.com")).toBe("domain");
  });

  it("treats path-based targets without a protocol as page lookups", () => {
    expect(inferBacklinksSearchScopeFromTarget("example.com/pricing")).toBe(
      "page",
    );
  });

  it("treats root urls with explicit protocol as domain lookups", () => {
    expect(inferBacklinksSearchScopeFromTarget("https://example.com/")).toBe(
      "domain",
    );
  });

  it("treats explicit urls with a path as page lookups", () => {
    expect(
      inferBacklinksSearchScopeFromTarget("https://example.com/pricing"),
    ).toBe("page");
  });

  it("uses inferred scope until the user overrides it", () => {
    expect(
      resolveBacklinksSearchScope({
        target: "example.com/pricing",
        selectedScope: "domain",
        userSelectedScope: false,
      }),
    ).toBe("page");
  });

  it("preserves a manual scope override", () => {
    expect(
      resolveBacklinksSearchScope({
        target: "https://example.com/pricing?utm_source=newsletter",
        selectedScope: "domain",
        userSelectedScope: true,
      }),
    ).toBe("domain");
  });

  it("omits persisted scope when it matches the inferred target scope", () => {
    expect(
      getPersistedBacklinksSearchScope("example.com/pricing", "page"),
    ).toBe(undefined);
  });

  it("persists explicit scope overrides", () => {
    expect(
      getPersistedBacklinksSearchScope(
        "https://example.com/pricing?utm_source=newsletter",
        "domain",
      ),
    ).toBe("domain");
  });
});
