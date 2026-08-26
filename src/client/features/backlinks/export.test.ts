/**
 * @file_id FILE-MVX-AUTO-EXPORT-TEST-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-EXPORT-TEST
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
 * @generated_at 2026-05-13T13:53:34.235Z
 * @updated_at 2026-05-13T13:53:34.237Z
 * @hash sha256:c3b23d3484c43a0f4f6230ad90fc1e6f4f158e0073ade0243b4d0e17d872ce30
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.235Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { describe, expect, it } from "vitest";
import { buildBacklinksTabCsvFile } from "./export";

describe("buildBacklinksTabCsvFile", () => {
  it("builds backlinks csv with backlink-specific columns", () => {
    const file = buildBacklinksTabCsvFile({
      tab: "backlinks",
      target: "https://Example.com/path?q=1",
      rows: {
        backlinks: [
          {
            domainFrom: "example.org",
            urlFrom: "https://example.org/post",
            urlTo: "https://example.com/path",
            anchor: "Example",
            itemType: "organic",
            isDofollow: true,
            relAttributes: ["noopener", "noreferrer"],
            rank: 123,
            domainFromRank: 45,
            pageFromRank: 12,
            spamScore: 10,
            firstSeen: "2025-01-01",
            lastSeen: "2025-01-15",
            isLost: false,
            isBroken: false,
            linksCount: 2,
          },
        ],
        referringDomains: [],
        topPages: [],
      },
    });

    expect(file.filename).toBe("backlinks-backlinks-example.com-path-q-1.csv");
    expect(file.content).toContain('"Domain","Source URL","Target URL"');
    expect(file.content).toContain('"example.org"');
    expect(file.content).toContain('"noopener, noreferrer"');
  });

  it("builds referring domains csv", () => {
    const file = buildBacklinksTabCsvFile({
      tab: "domains",
      target: "Example.com",
      rows: {
        backlinks: [],
        referringDomains: [
          {
            domain: "source.com",
            backlinks: 12,
            referringPages: 7,
            rank: 101,
            spamScore: 4,
            firstSeen: "2024-05-10",
            brokenBacklinks: 1,
            brokenPages: 0,
          },
        ],
        topPages: [],
      },
    });

    expect(file.filename).toBe("backlinks-referring-domains-example.com.csv");
    expect(file.content).toContain('"Domain","Backlinks","Referring Pages"');
    expect(file.content).toContain('"source.com"');
  });

  it("builds top pages csv", () => {
    const file = buildBacklinksTabCsvFile({
      tab: "pages",
      target: "docs.example.com",
      rows: {
        backlinks: [],
        referringDomains: [],
        topPages: [
          {
            page: "https://docs.example.com/start",
            backlinks: 22,
            referringDomains: 9,
            rank: 88,
            brokenBacklinks: 0,
          },
        ],
      },
    });

    expect(file.filename).toBe("backlinks-top-pages-docs.example.com.csv");
    expect(file.content).toContain(
      '"Page","Backlinks","Referring Domains","Rank","Broken Backlinks"',
    );
    expect(file.content).toContain('"https://docs.example.com/start"');
  });
  it("sanitizes formula-like cell values to prevent CSV injection", () => {
    const file = buildBacklinksTabCsvFile({
      tab: "backlinks",
      target: "example.com",
      rows: {
        backlinks: [
          {
            domainFrom: "=cmd|' /C calc'!A0",
            urlFrom: "+https://evil.example/source",
            urlTo: "@https://evil.example/target",
            anchor: "\tformula",
            itemType: "organic",
            isDofollow: true,
            relAttributes: [],
            rank: 1,
            domainFromRank: 1,
            pageFromRank: 1,
            spamScore: 0,
            firstSeen: "2025-01-01",
            lastSeen: "2025-01-01",
            isLost: false,
            isBroken: false,
            linksCount: 1,
          },
        ],
        referringDomains: [],
        topPages: [],
      },
    });

    expect(file.content).toContain("\"'=cmd|' /C calc'!A0\"");
    expect(file.content).toContain('"\'+https://evil.example/source"');
    expect(file.content).toContain('"\'@https://evil.example/target"');
    expect(file.content).toContain('"\'\tformula"');
  });
});
