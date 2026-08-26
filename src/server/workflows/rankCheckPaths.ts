import type { WorkflowStep } from "cloudflare:workers";
import { RankTrackingRepository } from "@/server/features/rank-tracking/repositories/RankTrackingRepository";
import type { createDataforseoClient } from "@/server/lib/dataforseoClient";
import type { RankCheckResult } from "@/server/lib/dataforseo";
import type { RankTrackingConfig } from "@/types/schemas/rank-tracking";
import { KEYWORDS_PER_BATCH } from "@/shared/rank-tracking";

const SINGLE_ATTEMPT_STEP_CONFIG = {
  retries: { limit: 0, delay: "1 second" as const },
  timeout: "2 minutes" as const,
};

type KeywordEntry = { id: string; keyword: string };
type RankCheckResultWithDevice = RankCheckResult & {
  device: "desktop" | "mobile";
};

function mapResultsToSnapshotRows(
  runId: string,
  results: RankCheckResultWithDevice[],
) {
  return results.map((r) => ({
    runId,
    trackingKeywordId: r.keywordId,
    keyword: r.keyword,
    device: r.device,
    position: r.position,
    url: r.url,
    serpFeatures:
      r.serpFeatures.length > 0 ? JSON.stringify(r.serpFeatures) : null,
  }));
}

interface CheckContext {
  client: ReturnType<typeof createDataforseoClient>;
  keywords: KeywordEntry[];
  devices: RankTrackingConfig["devices"];
  serpDepth: number;
  domain: string;
  locationCode: number;
  languageCode: string;
  runId: string;
}

/**
 * @file_id FILE-MVX-AUTO-RANKCHECKPATHS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-RANKCHECKPATHS
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
 * @generated_at 2026-05-13T13:53:38.502Z
 * @updated_at 2026-05-13T13:53:38.504Z
 * @hash sha256:c99329221430accbac2cd3cc547e2bd9b814cab36da606b236e968eab6d84690
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:38.502Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */
export async function runLiveCheck(
  step: WorkflowStep,
  ctx: CheckContext,
): Promise<{ totalFailed: number }> {
  const deviceList: Array<"desktop" | "mobile"> =
    ctx.devices === "both" ? ["desktop", "mobile"] : [ctx.devices];
  let checked = 0;
  let totalFailed = 0;

  for (let i = 0; i < ctx.keywords.length; i += KEYWORDS_PER_BATCH) {
    const batch = ctx.keywords.slice(i, i + KEYWORDS_PER_BATCH);
    const batchIndex = Math.floor(i / KEYWORDS_PER_BATCH);

    const batchResults = await step.do(
      `live-batch-${batchIndex}`,
      SINGLE_ATTEMPT_STEP_CONFIG,
      async () => {
        const promises = batch.flatMap((kw) =>
          deviceList.map((device) =>
            ctx.client.serp
              .rankCheck({
                keyword: kw.keyword,
                keywordId: kw.id,
                locationCode: ctx.locationCode,
                languageCode: ctx.languageCode,
                device,
                targetDomain: ctx.domain,
                depth: ctx.serpDepth,
              })
              .then((r) => ({ ...r, device })),
          ),
        );
        const settled = await Promise.allSettled(promises);
        const results: RankCheckResultWithDevice[] = [];
        let batchFailed = 0;
        for (const outcome of settled) {
          if (outcome.status === "fulfilled") {
            results.push(outcome.value);
          } else {
            batchFailed++;
            console.error("Rank check call failed:", outcome.reason);
          }
        }
        checked += batch.length;
        await RankTrackingRepository.updateRun(ctx.runId, {
          keywordsChecked: checked,
        });

        if (results.length > 0) {
          await RankTrackingRepository.insertSnapshots(
            mapResultsToSnapshotRows(ctx.runId, results),
          );
        }
        return { batchFailed };
      },
    );

    totalFailed += batchResults.batchFailed;
  }

  if (totalFailed > 0) {
    console.warn(`Rank check completed with ${totalFailed} failed API call(s)`);
  }

  return { totalFailed };
}
