/**
 * @file_id FILE-MVX-AUTO-CLI-AUTH-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-CLI-AUTH
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
 * @generated_at 2026-05-13T13:53:32.602Z
 * @updated_at 2026-05-13T13:53:32.603Z
 * @hash sha256:84a9d23067505936d08c21824b27dc1ba40be025f84e6c2cb0d2fa3776e7f38d
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:32.602Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { randomUUID } from "node:crypto";
import { betterAuth } from "better-auth";
import { baseAuthConfig } from "./src/lib/auth-config";

const CLI_DEV_BASE_URL = "http://localhost:3000";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? CLI_DEV_BASE_URL,
  secret: process.env.BETTER_AUTH_SECRET ?? randomUUID(),
  ...baseAuthConfig,
});
