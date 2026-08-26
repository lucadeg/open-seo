/**
 * @file_id FILE-MVX-AUTO-LIGHTHOUSE-EXPORT-TEST-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-LIGHTHOUSE-EXPORT-TEST
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
 * @generated_at 2026-05-13T13:53:37.713Z
 * @updated_at 2026-05-13T13:53:37.715Z
 * @hash sha256:e75764c7e072339bea344e5226124199c606ae9b60eba0354a5102e49e8bb3e6
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:37.713Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { z } from "zod";
import { describe, expect, it } from "vitest";
import { buildLighthouseExportFile } from "@/server/lib/lighthousePayload";

const storedPayloadJson = JSON.stringify({
  version: 2,
  source: "dataforseo-lighthouse",
  hasIssueDetails: true,
  metadata: {
    requestedUrl: "https://everyapp.dev/blog/enable-mfa-rdp-ssh",
    finalUrl: "https://everyapp.dev/blog/enable-mfa-rdp-ssh",
    strategy: "mobile",
    fetchedAt: "2026-03-23T19:27:33.000Z",
    lighthouseVersion: "12.2.0",
    taskId: "task-1",
    cost: 0.00425,
  },
  scores: {
    performance: 89,
    accessibility: 93,
    "best-practices": 92,
    seo: 91,
  },
  metrics: {
    firstContentfulPaint: {
      score: 47,
      displayValue: "3.1 s",
      numericValue: 3100,
    },
    largestContentfulPaint: {
      score: 12,
      displayValue: "6.4 s",
      numericValue: 6400,
    },
    totalBlockingTime: {
      score: 79,
      displayValue: "290 ms",
      numericValue: 290,
    },
    cumulativeLayoutShift: {
      score: 92,
      displayValue: "0.03",
      numericValue: 0.03,
    },
    speedIndex: {
      score: 86,
      displayValue: "3.7 s",
      numericValue: 3700,
    },
    timeToInteractive: {
      score: 13,
      displayValue: "12.8 s",
      numericValue: 12800,
    },
    interactionToNextPaint: {
      score: null,
      displayValue: null,
      numericValue: null,
    },
    serverResponseTime: {
      score: 90,
      displayValue: "52 ms",
      numericValue: 52,
    },
  },
  issues: [
    {
      category: "performance",
      auditKey: "unused-javascript",
      title: "Reduce unused JavaScript",
      description: "Trim dead code.",
      score: 50,
      scoreDisplayMode: "metricSavings",
      displayValue: "Potential savings of 227 KiB",
      impactMs: 0,
      impactBytes: 232886,
      severity: "critical",
      items: [],
    },
    {
      category: "accessibility",
      auditKey: "color-contrast",
      title:
        "Background and foreground colors do not have a sufficient contrast ratio.",
      description: "Improve contrast.",
      score: 0,
      scoreDisplayMode: "binary",
      displayValue: null,
      impactMs: null,
      impactBytes: null,
      severity: "critical",
      items: [],
    },
  ],
});

const issuesExportSchema = z.object({
  resultId: z.string(),
  category: z.string(),
  issues: z.array(
    z.object({
      auditKey: z.string(),
      category: z.string(),
    }),
  ),
});

describe("buildLighthouseExportFile", () => {
  it("exports the stored payload unchanged for full mode", () => {
    const exported = buildLighthouseExportFile({
      idField: "resultId",
      idValue: "result-1",
      finalUrl: "https://everyapp.dev/blog/enable-mfa-rdp-ssh",
      strategy: "mobile",
      createdAt: "2026-03-23T19:27:33.000Z",
      payloadJson: storedPayloadJson,
      mode: "full",
    });

    expect(exported.filename).toContain("-payload.json");
    expect(exported.content).toBe(storedPayloadJson);
  });

  it("exports only actionable issues for issues mode", () => {
    const exported = buildLighthouseExportFile({
      idField: "resultId",
      idValue: "result-1",
      finalUrl: "https://everyapp.dev/blog/enable-mfa-rdp-ssh",
      strategy: "mobile",
      createdAt: "2026-03-23T19:27:33.000Z",
      payloadJson: storedPayloadJson,
      mode: "issues",
    });

    const content = issuesExportSchema.parse(JSON.parse(exported.content));

    expect(exported.filename).toContain("-issues.json");
    expect(content.resultId).toBe("result-1");
    expect(content.category).toBe("all");
    expect(content.issues.map((issue) => issue.auditKey)).toEqual([
      "unused-javascript",
      "color-contrast",
    ]);
    expect(exported.content).not.toContain("timeToInteractive");
  });

  it("exports only the selected category for category mode", () => {
    const exported = buildLighthouseExportFile({
      idField: "resultId",
      idValue: "result-1",
      finalUrl: "https://everyapp.dev/blog/enable-mfa-rdp-ssh",
      strategy: "mobile",
      createdAt: "2026-03-23T19:27:33.000Z",
      payloadJson: storedPayloadJson,
      mode: "category",
      category: "accessibility",
    });

    const content = issuesExportSchema.parse(JSON.parse(exported.content));

    expect(exported.filename).toContain("-accessibility-issues.json");
    expect(content.category).toBe("accessibility");
    expect(content.issues).toEqual([
      expect.objectContaining({
        auditKey: "color-contrast",
        category: "accessibility",
      }),
    ]);
  });
});
