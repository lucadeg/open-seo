/**
 * @file_id FILE-MVX-AUTO-SOURCE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-SOURCE
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
 * @generated_at 2026-05-13T13:53:39.593Z
 * @updated_at 2026-05-13T13:53:39.595Z
 * @hash sha256:f61fd046954201cf366921a867e4c82b359bc74f4f3fff331361797d009ef221
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:39.593Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { loader } from "fumadocs-core/source";
// Keep this server runtime import explicit. In this app's SSR build, the
// public Vite runtime entry resolves to the browser variant for sourceAsync.
import { fromConfig } from "../../node_modules/fumadocs-mdx/dist/runtime/vite/server.js";
import { guide } from "../../source.generated";
import type * as Config from "../../source.config";

const serverCreate = fromConfig<typeof Config>();

export const guideSource = loader({
  source: await serverCreate.sourceAsync(guide, {} as Record<string, never>),
  baseUrl: "/guides",
});
