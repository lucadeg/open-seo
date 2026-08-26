/**
 * @file_id FILE-MVX-AUTO-RANK-TRACKING-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-RANK-TRACKING
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
 * @generated_at 2026-05-13T13:53:39.241Z
 * @updated_at 2026-05-13T13:53:39.243Z
 * @hash sha256:d4849ef2358219353a6a76ef93a3d16b62254655081ab31fd8c6a15bc5c8bc0d
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:39.241Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import type { InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import { rankTrackingConfigs } from "@/db/app.schema";
import { domainField } from "@/types/schemas/domain";

// ---------------------------------------------------------------------------
// DB-derived types
// ---------------------------------------------------------------------------

export type RankTrackingConfig = InferSelectModel<typeof rankTrackingConfigs>;

// ---------------------------------------------------------------------------
// API / UI types
// ---------------------------------------------------------------------------

export type RankCheckTriggerResult =
  | {
      ok: true;
      runId: string;
    }
  | {
      ok: false;
      reason: "already_running";
      blockingRunId: string | null;
    };

export interface RankTrackingDeviceResult {
  position: number | null;
  previousPosition: number | null;
  rankingUrl: string | null;
  serpFeatures: string[];
}

export interface RankTrackingRow {
  trackingKeywordId: string;
  keyword: string;
  searchVolume: number | null;
  keywordDifficulty: number | null;
  cpc: number | null;
  desktop: RankTrackingDeviceResult;
  mobile: RankTrackingDeviceResult;
}

// ---------------------------------------------------------------------------
// Validation schemas
// ---------------------------------------------------------------------------

const devicesEnum = z.enum(rankTrackingConfigs.devices.enumValues);
const scheduleEnum = z.enum(rankTrackingConfigs.scheduleInterval.enumValues);
export const getConfigsSchema = z.object({
  projectId: z.string().uuid(),
});

export const createConfigSchema = z.object({
  projectId: z.string().uuid(),
  domain: domainField,
  locationCode: z.number().int().positive().optional(),
  languageCode: z.string().max(10).optional(),
  devices: devicesEnum.optional(),
  serpDepth: z.number().int().min(10).max(100).multipleOf(10),
  scheduleInterval: scheduleEnum.optional(),
});

export const updateConfigSchema = z.object({
  projectId: z.string().uuid(),
  configId: z.string().uuid(),
  domain: domainField.optional(),
  locationCode: z.number().int().positive().optional(),
  languageCode: z.string().max(10).optional(),
  devices: devicesEnum.optional(),
  serpDepth: z.number().int().min(10).max(100).multipleOf(10).optional(),
  scheduleInterval: scheduleEnum.optional(),
  isActive: z.boolean().optional(),
});

export const triggerCheckSchema = z.object({
  projectId: z.string().uuid(),
  configId: z.string().uuid(),
  keywordIds: z.array(z.string().uuid()).max(2000).optional(),
});

export const comparePeriodSchema = z.enum(["1d", "7d", "30d", "90d"]);
export type ComparePeriod = z.infer<typeof comparePeriodSchema>;

export const getLatestResultsSchema = z.object({
  projectId: z.string().uuid(),
  configId: z.string().uuid(),
  comparePeriod: comparePeriodSchema.optional(),
});

export const getLatestRunSchema = z.object({
  projectId: z.string().uuid(),
  configId: z.string().uuid(),
});

export const estimateCostSchema = z.object({
  projectId: z.string().uuid(),
  configId: z.string().uuid(),
});

export const addKeywordsSchema = z.object({
  projectId: z.string().uuid(),
  configId: z.string().uuid(),
  keywords: z.array(z.string().min(1).max(200)).min(1).max(2000),
});

export const removeKeywordsSchema = z.object({
  projectId: z.string().uuid(),
  configId: z.string().uuid(),
  keywordIds: z.array(z.string().uuid()).min(1).max(2000),
});

export const refreshMetricsSchema = z.object({
  projectId: z.string().uuid(),
  configId: z.string().uuid(),
});
