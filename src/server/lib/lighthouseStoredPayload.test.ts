/**
 * @file_id FILE-MVX-AUTO-LIGHTHOUSESTOREDPAYLOAD-TEST-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-LIGHTHOUSESTOREDPAYLOAD-TEST
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
 * @generated_at 2026-05-13T13:53:38.373Z
 * @updated_at 2026-05-13T13:53:38.374Z
 * @hash sha256:d57eec8ac6afa2080d185bdf40888b300fe119a988b957d403e61b2a99b3e35a
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:38.373Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { describe, expect, it } from "vitest";
import {
  buildStoredLighthouseIssues,
  buildStoredLighthouseMetrics,
} from "@/server/lib/lighthouseStoredPayload";

describe("lighthouse stored payload classification", () => {
  it("keeps actionable audits but separates metrics and diagnostics", () => {
    const audits = {
      interactive: {
        title: "Time to Interactive",
        score: 0.13,
        scoreDisplayMode: "numeric",
        displayValue: "12.8 s",
        numericValue: 12800,
      },
      "largest-contentful-paint-element": {
        title: "Largest Contentful Paint element",
        score: 0,
        scoreDisplayMode: "metricSavings",
        displayValue: "3,630 ms",
      },
      "unused-javascript": {
        title: "Reduce unused JavaScript",
        description: "Trim dead code.",
        score: 0.5,
        scoreDisplayMode: "metricSavings",
        displayValue: "Potential savings of 227 KiB",
        details: {
          overallSavingsBytes: 232886,
        },
      },
      "color-contrast": {
        title:
          "Background and foreground colors do not have a sufficient contrast ratio.",
        description: "Improve contrast.",
        score: 0,
        scoreDisplayMode: "binary",
      },
    };

    const categories = {
      performance: {
        auditRefs: [
          { id: "interactive" },
          { id: "largest-contentful-paint-element" },
          { id: "unused-javascript" },
        ],
      },
      accessibility: {
        auditRefs: [{ id: "color-contrast" }],
      },
      "best-practices": { auditRefs: [] },
      seo: { auditRefs: [] },
    };

    const issues = buildStoredLighthouseIssues({ audits, categories });
    const metrics = buildStoredLighthouseMetrics({ audits });

    expect(issues.issues.map((issue) => issue.auditKey)).toEqual([
      "unused-javascript",
      "color-contrast",
    ]);
    expect(metrics.timeToInteractive.displayValue).toBe("12.8 s");
    expect(metrics.timeToInteractive.score).toBe(13);
  });

  it("skips passing and non-actionable audits even when they appear in audit refs", () => {
    const audits = {
      passBinary: {
        title: "Serve images in next-gen formats",
        score: 1,
        scoreDisplayMode: "binary",
      },
      informative: {
        title: "User Timing marks and measures",
        score: 0,
        scoreDisplayMode: "informative",
      },
      manual: {
        title: "Structured data is valid",
        score: 0,
        scoreDisplayMode: "manual",
      },
      notApplicable: {
        title: "Uses optimized images",
        score: 0,
        scoreDisplayMode: "notApplicable",
      },
      errorAudit: {
        title: "`[accesskey]` values are unique",
        score: null,
        scoreDisplayMode: "error",
      },
      goodScore: {
        title: "Reduce unused CSS",
        score: 0.96,
        scoreDisplayMode: "metricSavings",
      },
    };

    const categories = {
      performance: {
        auditRefs: [
          { id: "passBinary" },
          { id: "informative" },
          { id: "manual" },
          { id: "notApplicable" },
          { id: "goodScore" },
        ],
      },
      accessibility: {
        auditRefs: [{ id: "errorAudit" }],
      },
      "best-practices": { auditRefs: [] },
      seo: { auditRefs: [] },
    };

    const issues = buildStoredLighthouseIssues({ audits, categories });

    expect(issues.hasIssueDetails).toBe(true);
    expect(issues.issues).toEqual([]);
  });

  it("compacts affected items and caps them at ten entries", () => {
    const items = Array.from({ length: 12 }, (_, index) => ({
      url: `https://cdn.example.com/script-${index}.js`,
      wastedBytes: 1000 + index,
      extraField: "ignored",
    }));

    const issues = buildStoredLighthouseIssues({
      audits: {
        "unused-javascript": {
          title: "Reduce unused JavaScript",
          description: "Trim dead code.",
          score: 0,
          scoreDisplayMode: "metricSavings",
          details: {
            overallSavingsBytes: 50000,
            items,
          },
        },
      },
      categories: {
        performance: { auditRefs: [{ id: "unused-javascript" }] },
        accessibility: { auditRefs: [] },
        "best-practices": { auditRefs: [] },
        seo: { auditRefs: [] },
      },
    });

    expect(issues.issues).toHaveLength(1);
    expect(issues.issues[0]?.items).toHaveLength(10);
    expect(issues.issues[0]?.items[0]).toBe(
      '{"url":"https://cdn.example.com/script-0.js","wastedBytes":1000}',
    );
  });
});
