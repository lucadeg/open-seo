/**
 * @file_id FILE-MVX-AUTO-DATAFORSEOBACKLINKSSUPPORT-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-DATAFORSEOBACKLINKSSUPPORT
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
 * @generated_at 2026-05-13T13:53:38.117Z
 * @updated_at 2026-05-13T13:53:38.120Z
 * @hash sha256:e99d5816fcf776b251d9e480dac5435e774ea50e7fcd80192c041e69097024e3
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:38.117Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { z } from "zod";
import { createDataforseoAccessClassifier } from "@/server/lib/dataforseoAccessClassification";
import { AppError } from "@/server/lib/errors";

const taskResultSchema = z
  .object({
    items: z.array(z.unknown()).nullable().optional(),
  })
  .passthrough();

export type BacklinksTaskResult = z.infer<typeof taskResultSchema>;

const taskSchema = z
  .object({
    status_code: z.number().optional(),
    status_message: z.string().optional(),
    cost: z.number().nullable().optional(),
    result_count: z.number().nullable().optional(),
    path: z.array(z.string()).optional(),
    result: z.array(taskResultSchema.nullable()).nullable().optional(),
  })
  .passthrough();

export const responseSchema = z
  .object({
    status_code: z.number().optional(),
    status_message: z.string().optional(),
    cost: z.number().nullable().optional(),
    tasks: z.array(taskSchema).optional(),
  })
  .passthrough();

export const backlinksSummaryItemSchema = z
  .object({
    target: z.string().optional(),
    rank: z.number().nullable().optional(),
    backlinks: z.number().nullable().optional(),
    referring_pages: z.number().nullable().optional(),
    referring_domains: z.number().nullable().optional(),
    broken_backlinks: z.number().nullable().optional(),
    broken_pages: z.number().nullable().optional(),
    new_backlinks: z.number().nullable().optional(),
    lost_backlinks: z.number().nullable().optional(),
    new_reffering_domains: z.number().nullable().optional(),
    lost_reffering_domains: z.number().nullable().optional(),
    new_referring_domains: z.number().nullable().optional(),
    lost_referring_domains: z.number().nullable().optional(),
    backlinks_spam_score: z.number().nullable().optional(),
    info: z
      .object({
        target_spam_score: z.number().nullable().optional(),
      })
      .passthrough()
      .nullable()
      .optional(),
  })
  .passthrough();

export const backlinksItemSchema = z
  .object({
    domain_from: z.string().nullable().optional(),
    url_from: z.string().nullable().optional(),
    url_to: z.string().nullable().optional(),
    anchor: z.string().nullable().optional(),
    item_type: z.string().nullable().optional(),
    dofollow: z.boolean().nullable().optional(),
    rank: z.number().nullable().optional(),
    domain_from_rank: z.number().nullable().optional(),
    page_from_rank: z.number().nullable().optional(),
    backlinks_spam_score: z.number().nullable().optional(),
    backlink_spam_score: z.number().nullable().optional(),
    first_seen: z.string().nullable().optional(),
    last_visited: z.string().nullable().optional(),
    lost_date: z.string().nullable().optional(),
    is_new: z.boolean().nullable().optional(),
    is_lost: z.boolean().nullable().optional(),
    is_broken: z.boolean().nullable().optional(),
    links_count: z.number().nullable().optional(),
    rel_attributes: z.array(z.string()).nullable().optional(),
    attributes: z.array(z.string()).nullable().optional(),
  })
  .passthrough();

export const referringDomainItemSchema = z
  .object({
    domain: z.string().nullable().optional(),
    backlinks: z.number().nullable().optional(),
    referring_pages: z.number().nullable().optional(),
    rank: z.number().nullable().optional(),
    first_seen: z.string().nullable().optional(),
    broken_backlinks: z.number().nullable().optional(),
    broken_pages: z.number().nullable().optional(),
    backlinks_spam_score: z.number().nullable().optional(),
    target_spam_score: z.number().nullable().optional(),
  })
  .passthrough();

export const domainPageSummaryItemSchema = z
  .object({
    page: z.string().nullable().optional(),
    url: z.string().nullable().optional(),
    backlinks: z.number().nullable().optional(),
    referring_domains: z.number().nullable().optional(),
    rank: z.number().nullable().optional(),
    broken_backlinks: z.number().nullable().optional(),
  })
  .passthrough();

export const backlinksHistoryItemSchema = z
  .object({
    date: z.string().nullable().optional(),
    rank: z.number().nullable().optional(),
    backlinks: z.number().nullable().optional(),
    referring_domains: z.number().nullable().optional(),
    new_backlinks: z.number().nullable().optional(),
    lost_backlinks: z.number().nullable().optional(),
    new_reffering_domains: z.number().nullable().optional(),
    lost_reffering_domains: z.number().nullable().optional(),
    new_referring_domains: z.number().nullable().optional(),
    lost_referring_domains: z.number().nullable().optional(),
  })
  .passthrough();

export const classifyBacklinksError = createDataforseoAccessClassifier({
  pathPrefix: "/backlinks/",
  notEnabledCode: "BACKLINKS_NOT_ENABLED",
  notEnabledMessage:
    "Backlinks is not enabled for the connected DataForSEO account",
  billingIssueCode: "BACKLINKS_BILLING_ISSUE",
  billingIssueMessage:
    "The connected DataForSEO account has a billing or balance issue",
});

export function parseItems<T extends z.ZodTypeAny>(
  endpointName: string,
  results: BacklinksTaskResult[],
  itemSchema: T,
): Array<z.infer<T>> {
  const firstResult = results[0] ?? null;
  if (firstResult == null) {
    return [];
  }

  const parsed = z.array(itemSchema).safeParse(firstResult.items ?? []);
  if (!parsed.success) {
    console.error(
      `dataforseo.${endpointName}.invalid-items`,
      parsed.error.issues.slice(0, 5),
    );
    throw new AppError(
      "INTERNAL_ERROR",
      `DataForSEO ${endpointName} returned an invalid response shape`,
    );
  }

  return parsed.data;
}
