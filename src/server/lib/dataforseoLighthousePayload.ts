/**
 * @file_id FILE-MVX-AUTO-DATAFORSEOLIGHTHOUSEPAYLOAD-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-DATAFORSEOLIGHTHOUSEPAYLOAD
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
 * @generated_at 2026-05-13T13:53:38.221Z
 * @updated_at 2026-05-13T13:53:38.223Z
 * @hash sha256:92e104e5fffa27d3470956ca8aa894fa4982ea5cc8444db3015b9fc395ce18de
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:38.221Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { z } from "zod";
import {
  buildStoredLighthouseIssues,
  buildStoredLighthouseMetrics,
  type RawLighthouseAudit,
  type RawLighthouseCategory,
  scoreToPercent,
  type StoredLighthousePayload,
} from "@/server/lib/lighthouseStoredPayload";

export const requestCategories = [
  "performance",
  "accessibility",
  "best_practices",
  "seo",
] as const;

export type LighthouseStrategy = "mobile" | "desktop";

const lighthouseAuditItemsSchema = z
  .union([
    z.array(z.record(z.string(), z.unknown())),
    z.record(z.string(), z.unknown()),
  ])
  .transform((items) => (Array.isArray(items) ? items : [items]));

const lighthouseAuditSchema = z
  .object({
    score: z.number().nullable().optional(),
    displayValue: z.string().optional(),
    numericValue: z.number().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    scoreDisplayMode: z.string().optional(),
    details: z
      .object({
        overallSavingsMs: z.number().optional(),
        overallSavingsBytes: z.number().optional(),
        items: lighthouseAuditItemsSchema.optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

const lighthouseCategorySchema = z
  .object({
    score: z.number().nullable().optional(),
    auditRefs: z
      .array(
        z
          .object({
            id: z.string().optional(),
          })
          .passthrough(),
      )
      .optional(),
  })
  .passthrough();

const lighthouseResponseSchema = z
  .object({
    requestedUrl: z.string().optional(),
    finalUrl: z.string().optional(),
    lighthouseVersion: z.string().optional(),
    categories: z
      .record(z.string(), lighthouseCategorySchema)
      .optional()
      .default({}),
    audits: z.record(z.string(), lighthouseAuditSchema).optional().default({}),
  })
  .passthrough();

const dataforseoTaskSchema = z
  .object({
    id: z.string().optional(),
    cost: z.number().optional(),
    status_code: z.number().optional(),
    status_message: z.string().optional(),
    result: z.array(lighthouseResponseSchema).optional(),
  })
  .passthrough();

const dataforseoLighthouseResponseSchema = z
  .object({
    status_code: z.number().optional(),
    status_message: z.string().optional(),
    tasks: z.array(dataforseoTaskSchema).optional(),
  })
  .passthrough();

function summarizeZodIssues(error: z.ZodError, maxIssues = 3): string {
  return error.issues
    .slice(0, maxIssues)
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "<root>";
      return `${path}: ${issue.message}`;
    })
    .join("; ");
}

export function parseDataforseoLighthousePayload(
  payload: unknown,
  input: { url: string; strategy: LighthouseStrategy },
): StoredLighthousePayload {
  const parsed = dataforseoLighthouseResponseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error(
      `DataForSEO Lighthouse returned an invalid response: ${summarizeZodIssues(parsed.error)}`,
    );
  }

  if (parsed.data.status_code !== 20000) {
    throw new Error(
      parsed.data.status_message ?? "DataForSEO Lighthouse request failed",
    );
  }

  const task = parsed.data.tasks?.[0];
  if (!task) {
    throw new Error("DataForSEO Lighthouse response missing task");
  }

  if (task.status_code !== 20000) {
    throw new Error(task.status_message ?? "DataForSEO Lighthouse task failed");
  }

  const result = task.result?.[0];
  if (!result) {
    throw new Error("DataForSEO Lighthouse response missing result");
  }

  const fetchedAt = new Date().toISOString();
  const categories: Record<string, RawLighthouseCategory> =
    result.categories ?? {};
  const audits: Record<string, RawLighthouseAudit> = result.audits ?? {};
  const issueReport = buildStoredLighthouseIssues({ audits, categories });
  const metrics = buildStoredLighthouseMetrics({ audits });
  const storedPayload: StoredLighthousePayload = {
    version: 2,
    source: "dataforseo-lighthouse",
    hasIssueDetails: issueReport.hasIssueDetails,
    metadata: {
      requestedUrl: result.requestedUrl ?? input.url,
      finalUrl: result.finalUrl ?? input.url,
      strategy: input.strategy,
      fetchedAt,
      lighthouseVersion: result.lighthouseVersion ?? null,
      taskId: task.id ?? null,
      cost: task.cost ?? null,
    },
    scores: {
      performance: scoreToPercent(categories.performance?.score),
      accessibility: scoreToPercent(categories.accessibility?.score),
      "best-practices": scoreToPercent(categories["best-practices"]?.score),
      seo: scoreToPercent(categories.seo?.score),
    },
    metrics,
    issues: issueReport.issues,
  };

  const allScoresMissing = Object.values(storedPayload.scores).every(
    (score) => score == null,
  );
  if (allScoresMissing) {
    throw new Error(
      `DataForSEO Lighthouse returned no category scores for ${storedPayload.metadata.finalUrl}`,
    );
  }

  return storedPayload;
}
