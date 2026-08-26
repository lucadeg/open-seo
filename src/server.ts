/**
 * @file_id FILE-MVX-AUTO-SERVER-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-SERVER
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
 * @generated_at 2026-05-13T13:53:38.730Z
 * @updated_at 2026-05-13T13:53:38.731Z
 * @hash sha256:db1ad0b2ce11d6bbaa40282df380835a6269d81f6952bbab6cf38ed881b9426e
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:38.730Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";
import { RankTrackingRepository } from "@/server/features/rank-tracking/repositories/RankTrackingRepository";
import { beginRankCheckRun } from "@/server/features/rank-tracking/services/rankCheckRunGuards";
import { customerHasPaidPlan } from "@/server/billing/subscription";
import { isHostedServerAuthMode } from "@/server/lib/runtime-env";
import { computeNextCheckAt } from "@/shared/rank-tracking";

const fetch = createStartHandler(defaultStreamHandler);

// Export Workflow classes as named exports
export { SiteAuditWorkflow } from "./server/workflows/SiteAuditWorkflow";
export { RankCheckWorkflow } from "./server/workflows/RankCheckWorkflow";

export default {
  fetch,
  async scheduled(
    _controller: ScheduledController,
    env: Env,
    _ctx: ExecutionContext,
  ) {
    const nowIso = new Date().toISOString();
    const dueConfigs =
      await RankTrackingRepository.getDueConfigsWithOrganization(nowIso);

    const isHosted = await isHostedServerAuthMode();

    for (const config of dueConfigs) {
      try {
        // Skip configs whose org doesn't have a paid plan
        if (isHosted && !(await customerHasPaidPlan(config.organizationId))) {
          console.log(
            `[cron] Skipping config ${config.id} (${config.domain}) — org ${config.organizationId} no longer has access`,
          );
          continue;
        }

        // Skip configs with no keywords before advancing the schedule
        const kwCount = await RankTrackingRepository.getKeywordCountForConfig(
          config.id,
        );
        if (kwCount === 0) {
          console.log(
            `[cron] Skipping config ${config.id} (${config.domain}) — no keywords`,
          );
          // Still advance schedule so this config doesn't stay due forever
          const skipInterval =
            config.scheduleInterval === "daily" ||
            config.scheduleInterval === "weekly"
              ? config.scheduleInterval
              : null;
          if (skipInterval) {
            await RankTrackingRepository.updateConfig(
              config.id,
              config.projectId,
              {
                nextCheckAt: computeNextCheckAt(
                  skipInterval,
                  config.nextCheckAt,
                ),
              },
            );
          }
          continue;
        }

        // Advance nextCheckAt immediately to prevent retry storms if the run fails
        const interval =
          config.scheduleInterval === "daily" ||
          config.scheduleInterval === "weekly"
            ? config.scheduleInterval
            : null;
        if (interval) {
          await RankTrackingRepository.updateConfig(
            config.id,
            config.projectId,
            {
              nextCheckAt: computeNextCheckAt(interval, config.nextCheckAt),
            },
          );
        }

        const result = await beginRankCheckRun({
          workflow: env.RANK_CHECK_WORKFLOW,
          config,
          projectId: config.projectId,
          billingCustomer: {
            userId: "system",
            userEmail: "system@openseo.so",
            organizationId: config.organizationId,
            projectId: config.projectId,
          },
          keywordsTotal: kwCount,
          trigger: "scheduled",
          workflowStartErrorMessage: "Failed to start scheduled workflow",
        });

        if (!result.ok) {
          console.log(
            `[cron] Skipping config ${config.id} (${config.domain}) — run already active`,
          );
        } else {
          console.log(
            `[cron] Started scheduled rank check ${result.runId} for config ${config.id} (${config.domain})`,
          );
        }
      } catch (err) {
        console.error(
          `[cron] Error processing config ${config.id} (${config.domain}):`,
          err,
        );
      }
    }
  },
};
