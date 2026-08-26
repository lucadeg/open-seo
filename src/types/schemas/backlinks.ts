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
 * @generated_at 2026-05-13T13:53:39.131Z
 * @updated_at 2026-05-13T13:53:39.132Z
 * @hash sha256:248a99316fb2def7def194b8da61d87e641f65036af8b2e4818206381df41215
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:39.131Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { z } from "zod";

export const backlinksTabSchema = z.enum(["backlinks", "domains", "pages"]);
export const backlinksTargetScopeSchema = z.enum(["domain", "page"]);
const DEFAULT_BACKLINKS_SPAM_THRESHOLD = 40;

function normalizeBacklinksSpamThreshold(value: number) {
  if (!Number.isFinite(value)) {
    return DEFAULT_BACKLINKS_SPAM_THRESHOLD;
  }

  return Math.min(100, Math.max(0, Math.trunc(value)));
}

export type BacklinksSpamFilterOptions = {
  hideSpam?: boolean;
  spamThreshold?: number;
};

export function normalizeBacklinksSpamFilterOptions(
  options?: BacklinksSpamFilterOptions,
) {
  const hideSpam = options?.hideSpam ?? true;

  return {
    hideSpam,
    spamThreshold: hideSpam
      ? normalizeBacklinksSpamThreshold(
          options?.spamThreshold ?? DEFAULT_BACKLINKS_SPAM_THRESHOLD,
        )
      : undefined,
  };
}
export const backlinksLookupSchema = z.object({
  target: z.string().min(1, "Target is required").max(2048),
  scope: backlinksTargetScopeSchema.optional(),
});

export const backlinksProjectSchema = z.object({
  projectId: z.string().min(1),
});

const backlinksSpamFilterSchema = z.object({
  hideSpam: z.boolean().optional(),
  spamThreshold: z.number().int().min(0).max(100).optional(),
});

export const backlinksOverviewInputSchema = backlinksLookupSchema
  .extend({
    projectId: z.string().min(1),
  })
  .merge(backlinksSpamFilterSchema);

export const backlinksSearchSchema = z.object({
  target: z.string().optional(),
  scope: backlinksTargetScopeSchema.optional(),
  tab: backlinksTabSchema.optional(),
});

export type BacklinksLookupInput = z.infer<typeof backlinksLookupSchema>;
export type BacklinksTab = z.infer<typeof backlinksTabSchema>;
export type BacklinksTargetScope = z.infer<typeof backlinksTargetScopeSchema>;
