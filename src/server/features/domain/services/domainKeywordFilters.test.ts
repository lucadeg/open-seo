/**
 * @file_id FILE-MVX-AUTO-DOMAINKEYWORDFILTERS-TEST-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-DOMAINKEYWORDFILTERS-TEST
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
 * @generated_at 2026-05-13T13:53:37.412Z
 * @updated_at 2026-05-13T13:53:37.413Z
 * @hash sha256:366e2f17fc27f8800bef92df9b0715e33b5c20112711eea91afffce1a8c4cbf1
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:37.412Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { describe, expect, it } from "vitest";
import {
  buildKeywordFilters,
  buildOrderBy,
} from "@/server/features/domain/services/domainKeywordFilters";

describe("buildOrderBy", () => {
  it("maps sort modes to DataForSEO field paths", () => {
    expect(buildOrderBy("rank", "asc")).toEqual([
      "ranked_serp_element.serp_item.rank_absolute,asc",
    ]);
    expect(buildOrderBy("volume", "desc")).toEqual([
      "keyword_data.keyword_info.search_volume,desc",
    ]);
    expect(buildOrderBy("score", "asc")).toEqual([
      "keyword_data.keyword_properties.keyword_difficulty,asc",
    ]);
  });
});

describe("buildKeywordFilters", () => {
  it("returns an empty array when no filters are set", () => {
    expect(buildKeywordFilters({})).toEqual([]);
  });

  it("emits one ilike clause per include term and chains them with 'and'", () => {
    expect(buildKeywordFilters({ include: "audit, checker" })).toEqual([
      ["keyword_data.keyword", "ilike", "%audit%"],
      "and",
      ["keyword_data.keyword", "ilike", "%checker%"],
    ]);
  });

  it("emits not_ilike clauses for exclude terms", () => {
    expect(buildKeywordFilters({ exclude: "jobs+salary" })).toEqual([
      ["keyword_data.keyword", "not_ilike", "%jobs%"],
      "and",
      ["keyword_data.keyword", "not_ilike", "%salary%"],
    ]);
  });

  it("escapes SQL LIKE wildcards in user-supplied terms", () => {
    const result = buildKeywordFilters({ include: "100%" });
    expect(result[0]).toEqual(["keyword_data.keyword", "ilike", "%100\\%%"]);
  });

  it("includes numeric range conditions", () => {
    const result = buildKeywordFilters({
      minVol: 100,
      maxVol: 5000,
      minCpc: 0.5,
    });
    expect(result).toEqual([
      ["keyword_data.keyword_info.search_volume", ">=", 100],
      "and",
      ["keyword_data.keyword_info.search_volume", "<=", 5000],
      "and",
      ["keyword_data.keyword_info.cpc", ">=", 0.5],
    ]);
  });

  it("emits an OR group matching keyword or url for the search term", () => {
    const result = buildKeywordFilters({}, "audit");
    expect(result).toEqual([
      [
        ["keyword_data.keyword", "ilike", "%audit%"],
        "or",
        ["ranked_serp_element.serp_item.url", "ilike", "%audit%"],
      ],
    ]);
  });

  it("ANDs the search OR-group after structured filters", () => {
    const result = buildKeywordFilters({ minVol: 100 }, "audit");
    expect(result).toEqual([
      ["keyword_data.keyword_info.search_volume", ">=", 100],
      "and",
      [
        ["keyword_data.keyword", "ilike", "%audit%"],
        "or",
        ["ranked_serp_element.serp_item.url", "ilike", "%audit%"],
      ],
    ]);
  });

  it("packs exactly 8 conditions without throwing", () => {
    const result = buildKeywordFilters({
      include: "a,b,c,d",
      exclude: "e,f",
      minVol: 1,
      maxVol: 2,
    });
    const arrayClauses = result.filter((entry) => Array.isArray(entry));
    expect(arrayClauses).toHaveLength(8);
  });

  it("throws when conditions exceed the 8-condition cap", () => {
    expect(() =>
      buildKeywordFilters({
        include: "a,b,c,d",
        exclude: "e,f",
        minVol: 1,
        maxVol: 2,
        minTraffic: 3,
        maxTraffic: 4,
      }),
    ).toThrow(/Too many filter conditions/);
  });

  it("counts the search OR-group as 2 toward the cap", () => {
    expect(() =>
      buildKeywordFilters(
        {
          include: "a,b,c,d",
          exclude: "e,f",
          minVol: 1,
        },
        "audit",
      ),
    ).toThrow(/Too many filter conditions/);
  });
});
