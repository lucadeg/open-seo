/**
 * @file_id FILE-MVX-AUTO-RANKTRACKINGFILTERS-TEST-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-RANKTRACKINGFILTERS-TEST
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
 * @generated_at 2026-05-13T13:53:35.533Z
 * @updated_at 2026-05-13T13:53:35.535Z
 * @hash sha256:e11006596f96a80da702e9ea9f5b74ea30bc9813926a800d1b8b95636133199f
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.533Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { describe, expect, it } from "vitest";
import type { RankTrackingRow } from "@/types/schemas/rank-tracking";
import {
  applyFilters,
  EMPTY_FILTERS,
  matchesPositionFilter,
  type Filters,
} from "./RankTrackingFilters";

function makeRow(
  keyword: string,
  desktopPosition: number | null,
  mobilePosition: number | null,
): RankTrackingRow {
  return {
    trackingKeywordId: keyword,
    keyword,
    searchVolume: null,
    keywordDifficulty: null,
    cpc: null,
    desktop: {
      position: desktopPosition,
      previousPosition: null,
      rankingUrl: null,
      serpFeatures: [],
    },
    mobile: {
      position: mobilePosition,
      previousPosition: null,
      rankingUrl: null,
      serpFeatures: [],
    },
  };
}

function withFilters(overrides: Partial<Filters>): Filters {
  return { ...EMPTY_FILTERS, ...overrides };
}

describe("matchesPositionFilter", () => {
  it("matches only unranked positions when max is zero", () => {
    expect(matchesPositionFilter(null, "", "0")).toBe(true);
    expect(matchesPositionFilter(1, "", "0")).toBe(false);
    expect(matchesPositionFilter(20, "10", "0")).toBe(false);
  });

  it("keeps regular rank ranges unchanged", () => {
    expect(matchesPositionFilter(4, "1", "10")).toBe(true);
    expect(matchesPositionFilter(11, "1", "10")).toBe(false);
    expect(matchesPositionFilter(null, "1", "10")).toBe(false);
  });
});

describe("applyFilters", () => {
  const rows = [
    makeRow("ranked both", 3, 6),
    makeRow("desktop unranked", null, 5),
    makeRow("mobile unranked", 7, null),
    makeRow("unranked both", null, null),
  ];

  it("filters desktop unranked rows with desktop max zero", () => {
    expect(
      applyFilters(rows, withFilters({ maxDesktopPos: "0" })).map(
        (row) => row.keyword,
      ),
    ).toEqual(["desktop unranked", "unranked both"]);
  });

  it("filters mobile unranked rows with mobile max zero", () => {
    expect(
      applyFilters(rows, withFilters({ maxMobilePos: "0" })).map(
        (row) => row.keyword,
      ),
    ).toEqual(["mobile unranked", "unranked both"]);
  });

  it("requires both devices to be unranked when both max values are zero", () => {
    expect(
      applyFilters(
        rows,
        withFilters({ maxDesktopPos: "0", maxMobilePos: "0" }),
      ).map((row) => row.keyword),
    ).toEqual(["unranked both"]);
  });
});
