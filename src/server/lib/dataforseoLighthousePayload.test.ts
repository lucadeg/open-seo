/**
 * @file_id FILE-MVX-AUTO-DATAFORSEOLIGHTHOUSEPAYLOAD-TEST-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-DATAFORSEOLIGHTHOUSEPAYLOAD-TEST
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
 * @generated_at 2026-05-13T13:53:38.210Z
 * @updated_at 2026-05-13T13:53:38.211Z
 * @hash sha256:19588767c799a7bc5c92e58eda9e4eb296c234cb9f32c0ee6d9a6821df28cd3c
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:38.210Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { describe, expect, it } from "vitest";
import { parseDataforseoLighthousePayload } from "@/server/lib/dataforseoLighthousePayload";
import { readStoredLighthousePayload } from "@/server/lib/lighthousePayload";

describe("parseDataforseoLighthousePayload", () => {
  it("stores only issue-level lighthouse data and key metadata", () => {
    const parsed = parseDataforseoLighthousePayload(
      {
        status_code: 20000,
        status_message: "Ok.",
        tasks: [
          {
            id: "task-1",
            status_code: 20000,
            status_message: "Ok.",
            cost: 0.00425,
            result: [
              {
                requestedUrl: "https://everyapp.dev/",
                finalUrl: "https://everyapp.dev/",
                lighthouseVersion: "12.2.0",
                categories: {
                  performance: {
                    score: 0.54,
                    auditRefs: [{ id: "unused-javascript" }],
                  },
                  accessibility: {
                    score: 0.93,
                    auditRefs: [{ id: "accesskeys" }],
                  },
                  "best-practices": { score: 0.79, auditRefs: [] },
                  seo: { score: 0.92, auditRefs: [] },
                },
                audits: {
                  "unused-javascript": {
                    title: "Reduce unused JavaScript",
                    description: "Trim dead code.",
                    score: 0,
                    scoreDisplayMode: "metricSavings",
                    displayValue: "Potential savings of 188 KiB",
                    numericValue: 193002,
                    details: {
                      overallSavingsMs: 1270,
                      overallSavingsBytes: 193002,
                      items: [
                        {
                          url: "https://cdn.example.com/app.js",
                          wastedBytes: 193002,
                        },
                      ],
                    },
                  },
                  accesskeys: {
                    title: "`[accesskey]` values are unique",
                    description: "Access keys should not conflict.",
                    score: null,
                    scoreDisplayMode: "error",
                  },
                  interactive: {
                    title: "Time to Interactive",
                    description: "Time until the page becomes interactive.",
                    score: 0.13,
                    scoreDisplayMode: "numeric",
                    displayValue: "12.8 s",
                    numericValue: 12800,
                  },
                },
              },
            ],
          },
        ],
      },
      {
        url: "https://everyapp.dev/",
        strategy: "mobile",
      },
    );

    const { report } = readStoredLighthousePayload(JSON.stringify(parsed));

    expect(parsed.metrics.timeToInteractive.displayValue).toBe("12.8 s");
    expect(parsed).toMatchObject({
      version: 2,
      source: "dataforseo-lighthouse",
      hasIssueDetails: true,
      metadata: {
        requestedUrl: "https://everyapp.dev/",
        finalUrl: "https://everyapp.dev/",
        strategy: "mobile",
        lighthouseVersion: "12.2.0",
        taskId: "task-1",
        cost: 0.00425,
      },
      scores: {
        performance: 54,
        accessibility: 93,
        "best-practices": 79,
        seo: 92,
      },
      metrics: {
        timeToInteractive: {
          score: 13,
          displayValue: "12.8 s",
          numericValue: 12800,
        },
      },
    });
    expect(parsed.issues).toHaveLength(1);
    expect(parsed.issues).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ auditKey: "interactive" }),
      ]),
    );
    expect(parsed).not.toHaveProperty("lighthouseResult");

    expect(report.hasIssueDetails).toBe(true);
    expect(report.issues).toEqual([
      expect.objectContaining({
        auditKey: "unused-javascript",
        category: "performance",
        impactMs: 1270,
        impactBytes: 193002,
        title: "Reduce unused JavaScript",
      }),
    ]);
  });

  it("throws when the lighthouse response has no category scores", () => {
    expect(() =>
      parseDataforseoLighthousePayload(
        {
          status_code: 20000,
          status_message: "Ok.",
          tasks: [
            {
              id: "task-1",
              status_code: 20000,
              status_message: "Ok.",
              cost: 0.00425,
              result: [
                {
                  requestedUrl:
                    "https://everyapp.dev/blog/category/cyber-security",
                  finalUrl:
                    "https://everyapp.dev/blog/category/cyber-security/",
                  lighthouseVersion: "12.2.0",
                  categories: {
                    performance: { score: null, auditRefs: [] },
                    accessibility: { score: null, auditRefs: [] },
                    "best-practices": { score: null, auditRefs: [] },
                    seo: { score: null, auditRefs: [] },
                  },
                  audits: {},
                },
              ],
            },
          ],
        },
        {
          url: "https://everyapp.dev/blog/category/cyber-security",
          strategy: "desktop",
        },
      ),
    ).toThrow("DataForSEO Lighthouse returned no category scores");
  });

  it("throws when DataForSEO returns a non-success task status", () => {
    expect(() =>
      parseDataforseoLighthousePayload(
        {
          status_code: 20000,
          status_message: "Ok.",
          tasks: [
            {
              id: "task-1",
              status_code: 40501,
              status_message: "Insufficient credits",
              result: [],
            },
          ],
        },
        {
          url: "https://everyapp.dev/",
          strategy: "mobile",
        },
      ),
    ).toThrow("Insufficient credits");
  });

  it("includes schema details when the payload shape is invalid", () => {
    expect(() =>
      parseDataforseoLighthousePayload(null, {
        url: "https://everyapp.dev/",
        strategy: "mobile",
      }),
    ).toThrow("<root>");
  });

  it("accepts audits whose details.items is an object", () => {
    expect(() =>
      parseDataforseoLighthousePayload(
        {
          status_code: 20000,
          status_message: "Ok.",
          tasks: [
            {
              id: "task-1",
              status_code: 20000,
              status_message: "Ok.",
              cost: 0.00425,
              result: [
                {
                  requestedUrl: "https://everyapp.dev/",
                  finalUrl: "https://everyapp.dev/",
                  lighthouseVersion: "12.2.0",
                  categories: {
                    performance: {
                      score: 0.54,
                      auditRefs: [{ id: "document-latency-insight" }],
                    },
                    accessibility: { score: 0.93, auditRefs: [] },
                    "best-practices": { score: 0.79, auditRefs: [] },
                    seo: { score: 0.92, auditRefs: [] },
                  },
                  audits: {
                    "document-latency-insight": {
                      title: "Document request latency",
                      description: "Latency insight.",
                      score: 0,
                      scoreDisplayMode: "informative",
                      details: {
                        items: {
                          latencyMs: 120,
                        },
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          url: "https://everyapp.dev/",
          strategy: "mobile",
        },
      ),
    ).not.toThrow();
  });
});
