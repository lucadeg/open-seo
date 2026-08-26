/**
 * @file_id FILE-MVX-AUTO-SEARCH-PARAMS-TEST-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-SEARCH-PARAMS-TEST
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
 * @generated_at 2026-05-13T13:53:39.269Z
 * @updated_at 2026-05-13T13:53:39.271Z
 * @hash sha256:3cf2a80dcea2d7f87c4604b22921f164e7d9d91bc645b1d518d555ef03375aae
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:39.269Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { describe, expect, it } from "vitest";
import { backlinksSearchSchema } from "@/types/schemas/backlinks";
import { domainSearchSchema } from "@/types/schemas/domain";

describe("search param boolean parsing", () => {
  it("parses backlinks search params with target and tab", () => {
    const parsed = backlinksSearchSchema.parse({
      target: "example.com",
      tab: "domains",
    });

    expect(parsed).toEqual({
      target: "example.com",
      tab: "domains",
    });
  });

  it("parses explicit false values for domain search params", () => {
    const parsed = domainSearchSchema.parse({
      subdomains: "false",
    });

    expect(parsed).toEqual({
      subdomains: false,
    });
  });
});
