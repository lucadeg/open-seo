/**
 * @file_id FILE-MVX-AUTO-BACKLINKS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-BACKLINKS
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
 * @generated_at 2026-05-13T13:53:38.776Z
 * @updated_at 2026-05-13T13:53:38.777Z
 * @hash sha256:d563f5ae68c6eb60283c97795eeadbe611c630253699ef0ac0c9e7085c3874d1
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:38.776Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { createServerFn } from "@tanstack/react-start";
import { BacklinksService } from "@/server/features/backlinks/services/BacklinksService";
import { requireProjectContext } from "@/serverFunctions/middleware";
import { backlinksOverviewInputSchema } from "@/types/schemas/backlinks";

export const getBacklinksOverview = createServerFn({
  method: "POST",
})
  .middleware(requireProjectContext)
  .inputValidator((data: unknown) => backlinksOverviewInputSchema.parse(data))
  .handler(async ({ data, context }) => {
    const input = {
      target: data.target,
      scope: data.scope,
    };
    const spamOptions = {
      hideSpam: data.hideSpam,
      spamThreshold: data.spamThreshold,
    };
    const profile = await BacklinksService.profileOverview(
      input,
      context,
      spamOptions,
    );
    return profile.overview;
  });

export const getBacklinksReferringDomains = createServerFn({
  method: "POST",
})
  .middleware(requireProjectContext)
  .inputValidator((data: unknown) => backlinksOverviewInputSchema.parse(data))
  .handler(async ({ data, context }) => {
    const input = {
      target: data.target,
      scope: data.scope,
    };
    const profile = await BacklinksService.profileReferringDomains(
      input,
      context,
    );
    return profile.rows;
  });

export const getBacklinksTopPages = createServerFn({
  method: "POST",
})
  .middleware(requireProjectContext)
  .inputValidator((data: unknown) => backlinksOverviewInputSchema.parse(data))
  .handler(async ({ data, context }) => {
    const input = {
      target: data.target,
      scope: data.scope,
    };
    const profile = await BacklinksService.profileTopPages(input, context);
    return profile.rows;
  });
