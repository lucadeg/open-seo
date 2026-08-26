/**
 * @file_id FILE-MVX-AUTO-AUTH-MODE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-AUTH-MODE
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
 * @generated_at 2026-05-13T13:53:36.033Z
 * @updated_at 2026-05-13T13:53:36.035Z
 * @hash sha256:2e03a3fa20c45c472bfd0e9c7d4a5f471efbfa2101c1d45d66ce659738b9e76f
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:36.033Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { z } from "zod";

type AuthMode = "cloudflare_access" | "local_noauth" | "hosted";

const authModeSchema = z
  .enum(["cloudflare_access", "local_noauth", "hosted"])
  .catch("cloudflare_access");

export function getAuthMode(value: string | null | undefined): AuthMode {
  return authModeSchema.parse(value);
}

export function isHostedAuthMode(value: string | null | undefined) {
  return getAuthMode(value) === "hosted";
}

export function isHostedClientAuthMode() {
  // This is an explicit deploy-time contract: the operator must keep the
  // client build-time AUTH_MODE aligned with the server runtime AUTH_MODE.
  // We accept that tradeoff to avoid a startup round-trip just to ask the
  // backend which auth UI to render. Hosted deployments must therefore set
  // AUTH_MODE=hosted in both the client build environment and the runtime.
  return isHostedAuthMode(import.meta.env.AUTH_MODE);
}
