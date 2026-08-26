/**
 * @file_id FILE-MVX-AUTO-DATAFORSEOACCESSCLASSIFICATION-TEST-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-DATAFORSEOACCESSCLASSIFICATION-TEST
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
 * @generated_at 2026-05-13T13:53:38.022Z
 * @updated_at 2026-05-13T13:53:38.023Z
 * @hash sha256:720622f8411b51109cf9c6325f07c7dbae5fcc3357f85afd85b4bd876e36a0a4
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:38.022Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { describe, expect, it } from "vitest";
import { createDataforseoAccessClassifier } from "@/server/lib/dataforseoAccessClassification";

const classify = createDataforseoAccessClassifier({
  pathPrefix: "/backlinks/",
  notEnabledCode: "BACKLINKS_NOT_ENABLED",
  notEnabledMessage: "not enabled",
  billingIssueCode: "BACKLINKS_BILLING_ISSUE",
  billingIssueMessage: "billing issue",
});

describe("createDataforseoAccessClassifier", () => {
  it("returns null when the path is outside the configured prefix", () => {
    expect(classify(402, "payment required", "/v3/serp/google/live")).toBe(
      null,
    );
  });

  it.each([40204, 403])(
    "translates status %s into the configured error code when inside the path prefix",
    (status) => {
      const err = classify(status, "", "/v3/backlinks/summary/live");
      expect(err?.code).toBe("BACKLINKS_NOT_ENABLED");
    },
  );

  it.each([40200, 40210, 402])(
    "translates billing status %s into the configured billing error code",
    (status) => {
      const err = classify(status, "", "/v3/backlinks/summary/live");
      expect(err?.code).toBe("BACKLINKS_BILLING_ISSUE");
    },
  );

  it.each([
    "subscription required",
    "plans and subscriptions",
    "access denied",
    "forbidden",
  ])("translates signal %s into the configured error code", (message) => {
    const err = classify(undefined, message, "/v3/backlinks/summary/live");
    expect(err?.code).toBe("BACKLINKS_NOT_ENABLED");
  });

  it.each([
    "insufficient funds",
    "payment required",
    "balance is too low",
    "problem billing",
    "account was not recharged",
  ])(
    "translates billing signal %s into the configured billing code",
    (message) => {
      const err = classify(undefined, message, "/v3/backlinks/summary/live");
      expect(err?.code).toBe("BACKLINKS_BILLING_ISSUE");
    },
  );

  it("returns null when neither status nor text matches", () => {
    expect(classify(500, "boom", "/v3/backlinks/summary/live")).toBe(null);
  });

  it("matches signals case-insensitively", () => {
    const err = classify(
      undefined,
      "SUBSCRIPTION required",
      "/v3/backlinks/summary/live",
    );
    expect(err?.code).toBe("BACKLINKS_NOT_ENABLED");
  });
});
