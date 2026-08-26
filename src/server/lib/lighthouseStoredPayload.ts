/**
 * @file_id FILE-MVX-AUTO-LIGHTHOUSESTOREDPAYLOAD-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-LIGHTHOUSESTOREDPAYLOAD
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
 * @generated_at 2026-05-13T13:53:38.402Z
 * @updated_at 2026-05-13T13:53:38.403Z
 * @hash sha256:03c92eec23e5a28936f1c0b15b7d298101c809565a56b3581e3bf061911bf270
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:38.402Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { z } from "zod";
import {
  LIGHTHOUSE_CATEGORIES,
  type LighthouseCategory,
} from "@/shared/lighthouse";

export type StoredLighthouseIssue = {
  category: LighthouseCategory;
  auditKey: string;
  title: string;
  description: string;
  score: number | null;
  scoreDisplayMode: string | null;
  displayValue: string | null;
  impactMs: number | null;
  impactBytes: number | null;
  severity: "critical" | "warning" | "info";
  items: string[];
};

type StoredLighthouseMetric = {
  score: number | null;
  displayValue: string | null;
  numericValue: number | null;
};

export type StoredLighthouseMetrics = {
  firstContentfulPaint: StoredLighthouseMetric;
  largestContentfulPaint: StoredLighthouseMetric;
  totalBlockingTime: StoredLighthouseMetric;
  cumulativeLayoutShift: StoredLighthouseMetric;
  speedIndex: StoredLighthouseMetric;
  timeToInteractive: StoredLighthouseMetric;
  interactionToNextPaint: StoredLighthouseMetric;
  serverResponseTime: StoredLighthouseMetric;
};

export type StoredLighthousePayload = {
  version: 2;
  source: "dataforseo-lighthouse";
  hasIssueDetails: boolean;
  metadata: {
    requestedUrl: string;
    finalUrl: string;
    strategy: "mobile" | "desktop";
    fetchedAt: string;
    lighthouseVersion: string | null;
    taskId: string | null;
    cost: number | null;
  };
  scores: {
    performance: number | null;
    accessibility: number | null;
    "best-practices": number | null;
    seo: number | null;
  };
  metrics: StoredLighthouseMetrics;
  issues: StoredLighthouseIssue[];
};

export type RawLighthouseAudit = {
  title?: string;
  description?: string;
  score?: number | null;
  scoreDisplayMode?: string;
  displayValue?: string;
  numericValue?: number;
  details?: {
    overallSavingsMs?: number;
    overallSavingsBytes?: number;
    items?: Array<Record<string, unknown>>;
  };
};

export type RawLighthouseCategory = {
  score?: number | null;
  auditRefs?: Array<{
    id?: string;
  }>;
};

const storedLighthouseMetricSchema = z.object({
  score: z.number().nullable(),
  displayValue: z.string().nullable(),
  numericValue: z.number().nullable(),
});

export const storedLighthousePayloadSchema = z.object({
  version: z.literal(2),
  source: z.literal("dataforseo-lighthouse"),
  hasIssueDetails: z.boolean(),
  metadata: z.object({
    requestedUrl: z.string(),
    finalUrl: z.string(),
    strategy: z.enum(["mobile", "desktop"]),
    fetchedAt: z.string(),
    lighthouseVersion: z.string().nullable(),
    taskId: z.string().nullable(),
    cost: z.number().nullable(),
  }),
  scores: z.object({
    performance: z.number().nullable(),
    accessibility: z.number().nullable(),
    "best-practices": z.number().nullable(),
    seo: z.number().nullable(),
  }),
  metrics: z.object({
    firstContentfulPaint: storedLighthouseMetricSchema,
    largestContentfulPaint: storedLighthouseMetricSchema,
    totalBlockingTime: storedLighthouseMetricSchema,
    cumulativeLayoutShift: storedLighthouseMetricSchema,
    speedIndex: storedLighthouseMetricSchema,
    timeToInteractive: storedLighthouseMetricSchema,
    interactionToNextPaint: storedLighthouseMetricSchema,
    serverResponseTime: storedLighthouseMetricSchema,
  }),
  issues: z.array(
    z.object({
      category: z.enum(LIGHTHOUSE_CATEGORIES),
      auditKey: z.string(),
      title: z.string(),
      description: z.string(),
      score: z.number().nullable(),
      scoreDisplayMode: z.string().nullable(),
      displayValue: z.string().nullable(),
      impactMs: z.number().nullable(),
      impactBytes: z.number().nullable(),
      severity: z.enum(["critical", "warning", "info"]),
      items: z.array(z.string()),
    }),
  ),
});

export function scoreToPercent(
  score: number | null | undefined,
): number | null {
  if (score == null || Number.isNaN(score)) return null;
  return Math.round(score * 100);
}

function buildStoredMetric(
  audit: RawLighthouseAudit | undefined,
): StoredLighthouseMetric {
  return {
    score: scoreToPercent(audit?.score),
    displayValue: audit?.displayValue ?? null,
    numericValue:
      typeof audit?.numericValue === "number" ? audit.numericValue : null,
  };
}

const DIAGNOSTIC_AUDIT_KEYS = new Set([
  "largest-contentful-paint-element",
  "layout-shifts",
  "diagnostics",
  "metrics",
  "network-requests",
  "network-rtt",
  "network-server-latency",
  "main-thread-tasks",
  "screenshot-thumbnails",
  "final-screenshot",
  "script-treemap-data",
  "resource-summary",
]);

function compactItem(item: Record<string, unknown>): string {
  const preferredKeys = [
    "url",
    "source",
    "nodeLabel",
    "snippet",
    "totalBytes",
    "wastedBytes",
    "wastedMs",
    "label",
    "value",
  ];

  const output: Record<string, unknown> = {};
  for (const key of preferredKeys) {
    if (item[key] != null) {
      output[key] = item[key];
    }
  }

  if (Object.keys(output).length === 0) {
    for (const [key, value] of Object.entries(item).slice(0, 6)) {
      output[key] = value;
    }
  }

  return JSON.stringify(output);
}

function getSeverity(input: {
  score: number | null;
  impactMs: number | null;
  impactBytes: number | null;
}): "critical" | "warning" | "info" {
  if ((input.impactMs ?? 0) >= 300 || (input.impactBytes ?? 0) >= 150_000) {
    return "critical";
  }

  if (input.score != null && input.score < 50) {
    return "critical";
  }

  if ((input.impactMs ?? 0) >= 100 || (input.impactBytes ?? 0) >= 50_000) {
    return "warning";
  }

  if (input.score != null && input.score < 90) {
    return "warning";
  }

  return "info";
}

export function buildStoredLighthouseIssues(input: {
  audits: Record<string, RawLighthouseAudit>;
  categories: Record<string, RawLighthouseCategory>;
}) {
  const hasIssueDetails = LIGHTHOUSE_CATEGORIES.some(
    (category) => (input.categories[category]?.auditRefs?.length ?? 0) > 0,
  );

  const issues: StoredLighthouseIssue[] = [];

  for (const category of LIGHTHOUSE_CATEGORIES) {
    const refs = input.categories[category]?.auditRefs ?? [];
    for (const ref of refs) {
      const auditKey = ref.id;
      if (!auditKey) continue;

      const audit = input.audits[auditKey];
      if (!audit) continue;

      const score = scoreToPercent(audit.score);
      const scoreDisplayMode = audit.scoreDisplayMode ?? null;

      if (scoreDisplayMode === "numeric") continue;
      if (DIAGNOSTIC_AUDIT_KEYS.has(auditKey)) continue;

      const isPass =
        score == null ||
        (score != null && score >= 90) ||
        scoreDisplayMode === "notApplicable" ||
        scoreDisplayMode === "informative" ||
        scoreDisplayMode === "manual" ||
        scoreDisplayMode === "error";

      if (isPass) continue;

      const impactMs =
        typeof audit.details?.overallSavingsMs === "number"
          ? audit.details.overallSavingsMs
          : null;
      const impactBytes =
        typeof audit.details?.overallSavingsBytes === "number"
          ? audit.details.overallSavingsBytes
          : null;
      const items = Array.isArray(audit.details?.items)
        ? audit.details.items.slice(0, 10).map(compactItem)
        : [];

      issues.push({
        category,
        auditKey,
        title: audit.title ?? auditKey,
        description: audit.description ?? "",
        score,
        scoreDisplayMode,
        displayValue: audit.displayValue ?? null,
        impactMs,
        impactBytes,
        severity: getSeverity({ score, impactMs, impactBytes }),
        items,
      });
    }
  }

  return {
    hasIssueDetails,
    issues,
  };
}

export function buildStoredLighthouseMetrics(input: {
  audits: Record<string, RawLighthouseAudit>;
}): StoredLighthouseMetrics {
  return {
    firstContentfulPaint: buildStoredMetric(
      input.audits["first-contentful-paint"],
    ),
    largestContentfulPaint: buildStoredMetric(
      input.audits["largest-contentful-paint"],
    ),
    totalBlockingTime: buildStoredMetric(input.audits["total-blocking-time"]),
    cumulativeLayoutShift: buildStoredMetric(
      input.audits["cumulative-layout-shift"],
    ),
    speedIndex: buildStoredMetric(input.audits["speed-index"]),
    timeToInteractive: buildStoredMetric(input.audits.interactive),
    interactionToNextPaint: buildStoredMetric(
      input.audits["interaction-to-next-paint"],
    ),
    serverResponseTime: buildStoredMetric(input.audits["server-response-time"]),
  };
}
