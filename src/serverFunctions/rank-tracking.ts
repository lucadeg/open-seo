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
 * @generated_at 2026-05-13T13:53:38.885Z
 * @updated_at 2026-05-13T13:53:38.887Z
 * @hash sha256:9dbcbee64011c913737532a7dfaff5dbc355d997c5b54dd35378f3cdbb702641
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:38.885Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { createServerFn } from "@tanstack/react-start";
import { waitUntil } from "cloudflare:workers";
import { RankTrackingRepository } from "@/server/features/rank-tracking/repositories/RankTrackingRepository";
import { RankTrackingService } from "@/server/features/rank-tracking/services/RankTrackingService";
import { getLatestResults } from "@/server/features/rank-tracking/services/rankTrackingResults";
import { AppError, asAppError } from "@/server/lib/errors";
import { isHostedServerAuthMode } from "@/server/lib/runtime-env";
import { customerHasPaidPlan } from "@/server/billing/subscription";
import { captureServerEvent } from "@/server/lib/posthog";
import { requireProjectContext } from "@/serverFunctions/middleware";
import {
  getConfigsSchema,
  createConfigSchema,
  updateConfigSchema,
  triggerCheckSchema,
  getLatestResultsSchema,
  getLatestRunSchema,
  estimateCostSchema,
  addKeywordsSchema,
  removeKeywordsSchema,
  refreshMetricsSchema,
} from "@/types/schemas/rank-tracking";

export const getRankTrackingConfigs = createServerFn({ method: "POST" })
  .middleware(requireProjectContext)
  .inputValidator((data: unknown) => getConfigsSchema.parse(data))
  .handler(async ({ context }) => {
    return RankTrackingRepository.getConfigsForProject(context.projectId);
  });

export const getRankTrackingConfigSummaries = createServerFn({ method: "POST" })
  .middleware(requireProjectContext)
  .inputValidator((data: unknown) => getConfigsSchema.parse(data))
  .handler(async ({ context }) => {
    return RankTrackingRepository.getConfigSummaries(context.projectId);
  });

export const createRankTrackingConfig = createServerFn({ method: "POST" })
  .middleware(requireProjectContext)
  .inputValidator((data: unknown) => createConfigSchema.parse(data))
  .handler(async ({ data, context }) => {
    const result = await RankTrackingService.createConfig({
      projectId: context.projectId,
      domain: data.domain,
      locationCode: data.locationCode,
      languageCode: data.languageCode,
      devices: data.devices,
      serpDepth: data.serpDepth,
      scheduleInterval: data.scheduleInterval,
    });

    waitUntil(
      captureServerEvent({
        distinctId: context.userId,
        event: "rank_tracking:config_create",
        organizationId: context.organizationId,
        properties: {
          project_id: context.projectId,
          domain: data.domain,
          devices: data.devices ?? "both",
          schedule: data.scheduleInterval ?? "weekly",
        },
      }),
    );

    return result;
  });

export const updateRankTrackingConfig = createServerFn({ method: "POST" })
  .middleware(requireProjectContext)
  .inputValidator((data: unknown) => updateConfigSchema.parse(data))
  .handler(async ({ data, context }) => {
    await RankTrackingService.updateConfig(data.configId, context.projectId, {
      domain: data.domain,
      locationCode: data.locationCode,
      languageCode: data.languageCode,
      devices: data.devices,
      serpDepth: data.serpDepth,
      scheduleInterval: data.scheduleInterval,
      isActive: data.isActive,
    });
    return { success: true };
  });

export const triggerRankCheck = createServerFn({ method: "POST" })
  .middleware(requireProjectContext)
  .inputValidator((data: unknown) => triggerCheckSchema.parse(data))
  .handler(async ({ data, context }) => {
    const isHosted = await isHostedServerAuthMode();
    if (isHosted && !(await customerHasPaidPlan(context.organizationId))) {
      throw new AppError(
        "PAYMENT_REQUIRED",
        "Upgrade to the paid plan to run rank checks",
      );
    }

    const result = await RankTrackingService.triggerCheck({
      configId: data.configId,
      projectId: context.projectId,
      billingCustomer: context,
      keywordIds: data.keywordIds,
    });

    if (result.ok) {
      waitUntil(
        captureServerEvent({
          distinctId: context.userId,
          event: "rank_tracking:check_trigger",
          organizationId: context.organizationId,
          properties: {
            project_id: context.projectId,
            config_id: data.configId,
            run_id: result.runId,
          },
        }),
      );
    }

    return result;
  });

export const getLatestRankResults = createServerFn({ method: "POST" })
  .middleware(requireProjectContext)
  .inputValidator((data: unknown) => getLatestResultsSchema.parse(data))
  .handler(async ({ data, context }) => {
    return getLatestResults(
      data.configId,
      context.projectId,
      data.comparePeriod,
    );
  });

export const getLatestRankRun = createServerFn({ method: "POST" })
  .middleware(requireProjectContext)
  .inputValidator((data: unknown) => getLatestRunSchema.parse(data))
  .handler(async ({ data, context }) => {
    return RankTrackingService.getLatestRun(data.configId, context.projectId);
  });

export const estimateRankCheckCost = createServerFn({ method: "POST" })
  .middleware(requireProjectContext)
  .inputValidator((data: unknown) => estimateCostSchema.parse(data))
  .handler(async ({ data, context }) => {
    return RankTrackingService.estimateCost(data.configId, context.projectId);
  });

export const addTrackingKeywords = createServerFn({ method: "POST" })
  .middleware(requireProjectContext)
  .inputValidator((data: unknown) => addKeywordsSchema.parse(data))
  .handler(async ({ data, context }) => {
    const result = await RankTrackingService.addKeywords(
      data.configId,
      context.projectId,
      data.keywords,
    );

    let checkTriggered = false;
    if (result.addedIds.length > 0) {
      const isHosted = await isHostedServerAuthMode();
      const hasPaidPlan =
        !isHosted || (await customerHasPaidPlan(context.organizationId));

      if (hasPaidPlan) {
        try {
          const triggerResult = await RankTrackingService.triggerCheck({
            configId: data.configId,
            projectId: context.projectId,
            billingCustomer: context,
            keywordIds: result.addedIds,
          });
          checkTriggered = triggerResult.ok;
          if (!triggerResult.ok) {
            console.info(
              "[rank-tracking] auto-check skipped: %s",
              triggerResult.reason,
            );
          }
        } catch (err) {
          const appErr = asAppError(err);
          if (appErr?.code === "INSUFFICIENT_CREDITS") {
            console.info(
              "[rank-tracking] auto-check skipped: insufficient credits",
            );
          } else {
            console.error(
              "[rank-tracking] auto-check after keyword add failed:",
              err,
            );
          }
        }
      }
    }

    // Fetch keyword metrics (awaited so they're in the DB before client re-fetches)
    if (result.added > 0) {
      try {
        await RankTrackingService.refreshKeywordMetrics(
          data.configId,
          context.projectId,
          context,
        );
      } catch (err) {
        const appErr = asAppError(err);
        if (appErr?.code === "INSUFFICIENT_CREDITS") {
          console.info(
            "[rank-tracking] auto-metrics-refresh skipped: insufficient credits",
          );
        } else {
          console.error("[rank-tracking] auto-metrics-refresh failed:", err);
        }
      }
    }

    return { ...result, checkTriggered };
  });

export const removeTrackingKeywords = createServerFn({ method: "POST" })
  .middleware(requireProjectContext)
  .inputValidator((data: unknown) => removeKeywordsSchema.parse(data))
  .handler(async ({ data, context }) => {
    await RankTrackingService.removeKeywords(
      data.configId,
      context.projectId,
      data.keywordIds,
    );
    return { removed: data.keywordIds.length };
  });

export const refreshTrackingKeywordMetrics = createServerFn({ method: "POST" })
  .middleware(requireProjectContext)
  .inputValidator((data: unknown) => refreshMetricsSchema.parse(data))
  .handler(async ({ data, context }) => {
    const result = await RankTrackingService.refreshKeywordMetrics(
      data.configId,
      context.projectId,
      context,
    );

    waitUntil(
      captureServerEvent({
        distinctId: context.userId,
        event: "rank_tracking:metrics_refresh",
        organizationId: context.organizationId,
        properties: {
          project_id: context.projectId,
          config_id: data.configId,
          updated: result.updated,
        },
      }),
    );

    return result;
  });
