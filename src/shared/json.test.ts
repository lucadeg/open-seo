/**
 * @file_id FILE-MVX-AUTO-JSON-TEST-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-JSON-TEST
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
 * @generated_at 2026-05-13T13:53:38.919Z
 * @updated_at 2026-05-13T13:53:38.920Z
 * @hash sha256:7ec15d30d5c9cf2ba998034c3ef6d38ed60297ad15272032a09ba391271fc7ba
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:38.919Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { describe, expect, it } from "vitest";
import { z } from "zod";
import { jsonCodec } from "@/shared/json";

describe("jsonCodec", () => {
  const schema = z.object({
    name: z.string(),
    count: z.number().int().nonnegative(),
  });

  const codec = jsonCodec(schema);

  it("parses valid JSON that matches schema", () => {
    const parsed = codec.parse('{"name":"open-seo","count":2}');
    expect(parsed).toEqual({ name: "open-seo", count: 2 });
  });

  it("throws on invalid JSON", () => {
    expect(() => codec.parse('{"name":"open-seo"')).toThrowError();
  });

  it("throws when JSON does not match schema", () => {
    expect(() => codec.parse('{"name":"open-seo","count":"2"}')).toThrowError();
  });

  it("encodes typed values to JSON", () => {
    const encoded = codec.encode({ name: "open-seo", count: 5 });
    expect(encoded).toBe('{"name":"open-seo","count":5}');
  });
});
