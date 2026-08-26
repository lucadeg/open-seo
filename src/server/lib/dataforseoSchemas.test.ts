/**
 * @file_id FILE-MVX-AUTO-DATAFORSEOSCHEMAS-TEST-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-DATAFORSEOSCHEMAS-TEST
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
 * @generated_at 2026-05-13T13:53:38.287Z
 * @updated_at 2026-05-13T13:53:38.289Z
 * @hash sha256:7dd7ccec04067b4c26b9da4fe232e8b5abd4b70d3775d068ebb42693b6924a91
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:38.287Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { describe, expect, it } from "vitest";
import {
  domainRankedKeywordItemSchema,
  parseTaskItems,
  relatedKeywordItemSchema,
  successfulDataforseoTaskSchema,
} from "@/server/lib/dataforseoSchemas";

describe("dataforseoSchemas", () => {
  it("accepts null items for empty successful tasks", () => {
    const task = {
      id: "04042314-1577-0387-0000-33dc4b485cfd",
      status_code: 20000,
      status_message: "Ok.",
      path: ["v3", "dataforseo_labs", "google", "related_keywords", "live"],
      cost: 0.02,
      result_count: 1,
      result: [
        {
          se_type: "google",
          seed_keyword: "canva ai video alternative",
          location_code: 2840,
          language_code: "en",
          total_count: null,
          items_count: 0,
          items: null,
        },
      ],
    };

    const parsedTask = successfulDataforseoTaskSchema.parse(task);

    expect(
      parseTaskItems(
        "google-related-keywords-live",
        parsedTask,
        relatedKeywordItemSchema,
      ),
    ).toEqual([]);
  });

  it("accepts empty ranked keyword tasks with null items", () => {
    const task = {
      id: "04070246-1577-0381-0000-2c56c059f67e",
      status_code: 20000,
      status_message: "Ok.",
      path: ["v3", "dataforseo_labs", "google", "ranked_keywords", "live"],
      cost: 0.01,
      result_count: 1,
      result: [
        {
          se_type: "google",
          target: "openseo.so",
          location_code: 2840,
          language_code: "en",
          total_count: null,
          items_count: 0,
          metrics: null,
          metrics_absolute: null,
          items: null,
        },
      ],
    };

    const parsedTask = successfulDataforseoTaskSchema.parse(task);

    expect(
      parseTaskItems(
        "google-ranked-keywords-live",
        parsedTask,
        domainRankedKeywordItemSchema,
      ),
    ).toEqual([]);
  });
});
