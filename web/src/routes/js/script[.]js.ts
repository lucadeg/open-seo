/**
 * @file_id FILE-MVX-AUTO-SCRIPT-JS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-SCRIPT-JS
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
 * @generated_at 2026-05-13T13:53:39.741Z
 * @updated_at 2026-05-13T13:53:39.742Z
 * @hash sha256:8525730d96d29e5e935881da6661349caf4c65d827240690cd469d10697db6a8
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:39.741Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { createFileRoute } from "@tanstack/react-router";

const PLAUSIBLE_SCRIPT_URL =
  "https://plausible.io/js/pa-f6y3kIQsae-ldmIxlnaPu.js";

export const Route = createFileRoute("/js/script.js")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const upstreamResponse = await fetch(PLAUSIBLE_SCRIPT_URL);

          if (!upstreamResponse.ok) {
            return buildFallbackScriptResponse();
          }

          const headers = new Headers(upstreamResponse.headers);
          headers.set("cache-control", "public, max-age=86400, immutable");

          return new Response(upstreamResponse.body, {
            status: upstreamResponse.status,
            headers,
          });
        } catch {
          return buildFallbackScriptResponse();
        }
      },
    },
  },
});

function buildFallbackScriptResponse() {
  return new Response(
    "window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)};",
    {
      status: 200,
      headers: {
        "content-type": "application/javascript; charset=utf-8",
        "cache-control": "public, max-age=300",
      },
    },
  );
}
