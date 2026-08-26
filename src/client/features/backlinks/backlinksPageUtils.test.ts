/**
 * @file_id FILE-MVX-AUTO-BACKLINKSPAGEUTILS-TEST-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-BACKLINKSPAGEUTILS-TEST
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
 * @generated_at 2026-05-13T13:53:34.125Z
 * @updated_at 2026-05-13T13:53:34.128Z
 * @hash sha256:689b009122f7fa1d0cb360d5a3b9243cad9836e3b19f56c0191b3b3c5e921439
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.125Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { describe, expect, it } from "vitest";
import type { BacklinksRow } from "./backlinksPageTypes";
import { groupBacklinksByDomain } from "./backlinksPageUtils";

function makeBacklinkRow(overrides: Partial<BacklinksRow> = {}): BacklinksRow {
  return {
    domainFrom: "source.example",
    urlFrom: "https://source.example/post",
    urlTo: "https://target.example/",
    anchor: null,
    itemType: null,
    isDofollow: true,
    relAttributes: [],
    rank: null,
    domainFromRank: null,
    pageFromRank: null,
    spamScore: null,
    firstSeen: null,
    lastSeen: null,
    isLost: false,
    isBroken: false,
    linksCount: null,
    ...overrides,
  };
}

describe("groupBacklinksByDomain", () => {
  it("sums grouped backlink totals from linksCount", () => {
    const groups = groupBacklinksByDomain([
      makeBacklinkRow({ linksCount: 5 }),
      makeBacklinkRow({
        urlFrom: "https://source.example/second-post",
        urlTo: "https://target.example/pricing",
      }),
    ]);

    expect(groups).toHaveLength(1);
    expect(groups[0]?.backlinkCount).toBe(6);
  });

  it("falls back to one backlink when linksCount is missing", () => {
    const groups = groupBacklinksByDomain([
      makeBacklinkRow({ linksCount: null }),
      makeBacklinkRow({
        domainFrom: "other.example",
        urlFrom: "https://other.example/post",
        linksCount: 0,
      }),
    ]);

    expect(groups.map((group) => group.backlinkCount)).toEqual([1, 1]);
  });
});
