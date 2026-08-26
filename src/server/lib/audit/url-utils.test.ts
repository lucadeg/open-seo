/**
 * @file_id FILE-MVX-AUTO-URL-UTILS-TEST-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-URL-UTILS-TEST
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
 * @generated_at 2026-05-13T13:53:37.965Z
 * @updated_at 2026-05-13T13:53:37.966Z
 * @hash sha256:fc428b4c2a6f632ff01b20145e8f59faf4ed81ecbcd12f91d4d6702638cb28cd
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:37.965Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { describe, expect, it } from "vitest";
import {
  detectUrlTemplate,
  getOrigin,
  isSameOrigin,
  normalizeUrl,
} from "@/server/lib/audit/url-utils";

describe("normalizeUrl", () => {
  it("normalizes host/query/hash/trailing slash", () => {
    const value = normalizeUrl(
      "https://Example.COM/path/?b=2&a=1#section",
      "https://fallback.com",
    );

    expect(value).toBe("https://example.com/path/?a=1&b=2");
  });

  it("returns null for unsupported protocol", () => {
    expect(normalizeUrl("mailto:test@example.com")).toBeNull();
  });
});

describe("isSameOrigin", () => {
  it("accepts www host equivalence", () => {
    expect(
      isSameOrigin("https://www.example.com/products", "https://example.com"),
    ).toBe(true);
  });

  it("allows http to https upgrade on default ports", () => {
    expect(isSameOrigin("https://example.com/page", "http://example.com")).toBe(
      true,
    );
  });

  it("rejects mismatched hosts", () => {
    expect(isSameOrigin("https://example.org", "https://example.com")).toBe(
      false,
    );
  });
});

describe("detectUrlTemplate", () => {
  it("maps dynamic path segments", () => {
    expect(detectUrlTemplate("/blog/2026-03-01/my-great-post")).toBe(
      "/blog/:date/:slug",
    );
  });

  it("maps numeric id segments", () => {
    expect(detectUrlTemplate("/products/12345")).toBe("/products/:id");
  });
});

describe("getOrigin", () => {
  it("returns URL origin", () => {
    expect(getOrigin("https://example.com:8080/path?q=1")).toBe(
      "https://example.com:8080",
    );
  });
});
