import { env } from "cloudflare:workers";
import type { BillingCustomerContext } from "@/server/billing/subscription";
import { RankTrackingRepository } from "@/server/features/rank-tracking/repositories/RankTrackingRepository";
import type {
  RankCheckTriggerResult,
  RankTrackingConfig,
} from "@/types/schemas/rank-tracking";

type RunRow = Awaited<ReturnType<typeof RankTrackingRepository.getRunById>>;

// Coordination model:
// - workflow id === run id (workflow instance is the authoritative runtime).
// - A partial unique index on rank_check_runs(config_id) WHERE status IN
//   ('pending','running') enforces at most one active run per config at the
//   DB level. A failed INSERT *is* the "already running" signal — no
//   separate lock table is needed.
// - Flipping status to 'completed'/'failed' is what frees the slot.
// - Missing/unknown workflow state is tolerated briefly during startup
//   before we treat a run as stale and mark it failed.

type RankCheckWorkflowStatus = {
  status:
    | "queued"
    | "running"
    | "paused"
    | "errored"
    | "terminated"
    | "complete"
    | "waiting"
    | "waitingForPause"
    | "unknown";
  error?: {
    message: string;
  };
};

type RankCheckConfigForStart = Pick<
  RankTrackingConfig,
  "id" | "domain" | "locationCode" | "languageCode" | "devices" | "serpDepth"
>;

const ACTIVE_WORKFLOW_STATUSES = new Set<RankCheckWorkflowStatus["status"]>([
  "queued",
  "running",
  "waiting",
  "waitingForPause",
  "paused",
]);

const RANK_CHECK_STARTUP_GRACE_MS = 60 * 1000;

async function getRankCheckWorkflowStatus(
  runId: string,
): Promise<RankCheckWorkflowStatus | null> {
  try {
    const instance = await env.RANK_CHECK_WORKFLOW.get(runId);
    return (await instance.status()) as RankCheckWorkflowStatus;
  } catch {
    return null;
  }
}

function getStaleReason(
  workflowStatus: RankCheckWorkflowStatus | null,
  run: RunRow,
): string {
  if (run?.status === "completed" || run?.status === "failed") {
    return `Run already ${run.status}`;
  }
  if (!workflowStatus) {
    return "Workflow instance was not found";
  }
  if (
    workflowStatus.status === "errored" ||
    workflowStatus.status === "terminated"
  ) {
    return workflowStatus.error?.message ?? `Workflow ${workflowStatus.status}`;
  }
  if (workflowStatus.status === "complete") {
    return "Workflow completed without finalizing the run";
  }
  return `Workflow is no longer active (${workflowStatus.status})`;
}

async function getStaleRankCheckRunReason(input: {
  run: RunRow;
  runId: string;
  ageMs: number;
}) {
  const workflowStatus = await getRankCheckWorkflowStatus(input.runId);

  if (workflowStatus && ACTIVE_WORKFLOW_STATUSES.has(workflowStatus.status)) {
    return null;
  }

  const startupWindow =
    input.ageMs < RANK_CHECK_STARTUP_GRACE_MS &&
    (!input.run ||
      input.run.status === "pending" ||
      input.run.status === "running") &&
    (!workflowStatus || workflowStatus.status === "unknown");

  if (startupWindow) {
    return null;
  }

  return getStaleReason(workflowStatus, input.run);
}

/**
 * @file_id FILE-MVX-AUTO-RANKCHECKRUNGUARDS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-RANKCHECKRUNGUARDS
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
 * @generated_at 2026-05-13T13:53:37.808Z
 * @updated_at 2026-05-13T13:53:37.810Z
 * @hash sha256:dd160c851d01b0da6823f34d1717ab3bbe42fbdf644df283d2d000051250c173
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:37.808Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */
export async function failRunIfActive(
  runId: string,
  reason: string,
  run?: RunRow,
) {
  const current = run ?? (await RankTrackingRepository.getRunById(runId));
  if (
    !current ||
    current.status === "completed" ||
    current.status === "failed"
  ) {
    return;
  }
  await RankTrackingRepository.updateRun(runId, {
    status: "failed",
    errorMessage: reason,
    completedAt: new Date().toISOString(),
  });
}

export async function beginRankCheckRun(input: {
  workflow: Env["RANK_CHECK_WORKFLOW"];
  config: RankCheckConfigForStart;
  projectId: string;
  billingCustomer: BillingCustomerContext;
  keywordsTotal: number;
  keywordIds?: string[];
  trigger: "manual" | "scheduled";
  workflowStartErrorMessage: string;
}): Promise<RankCheckTriggerResult> {
  // At most two attempts: once normally, once after clearing a stale blocker.
  for (let attempt = 0; attempt < 2; attempt++) {
    const runId = crypto.randomUUID();
    const inserted = await RankTrackingRepository.tryCreateRun({
      id: runId,
      configId: input.config.id,
      projectId: input.projectId,
      keywordsTotal: input.keywordsTotal,
      isSubsetRun: (input.keywordIds?.length ?? 0) > 0,
    });

    if (inserted) {
      try {
        await input.workflow.create({
          id: runId,
          params: {
            runId,
            configId: input.config.id,
            billingCustomer: input.billingCustomer,
            projectId: input.projectId,
            domain: input.config.domain,
            locationCode: input.config.locationCode,
            languageCode: input.config.languageCode,
            devices: input.config.devices,
            serpDepth: input.config.serpDepth,
            trigger: input.trigger,
            keywordIds: input.keywordIds,
          },
        });
      } catch (error) {
        // Workflow couldn't start — flip the run to failed so the
        // partial-index slot is released. Best-effort cleanup of any
        // zombie instance.
        await failRunIfActive(runId, input.workflowStartErrorMessage);
        try {
          const instance = await input.workflow.get(runId);
          await instance.terminate();
        } catch {
          // Workflow may not have been created.
        }
        throw error;
      }
      return { ok: true, runId };
    }

    // INSERT was blocked by the partial unique index — another active run
    // exists. Inspect it to decide whether to retry or return already_running.
    const blocker = await RankTrackingRepository.getActiveRunForConfig(
      input.config.id,
    );
    if (!blocker) {
      // Raced: blocker's status flipped between insert and select. Loop.
      continue;
    }

    if (attempt === 0) {
      const staleReason = await getStaleRankCheckRunReason({
        run: blocker,
        runId: blocker.id,
        ageMs: Date.now() - new Date(blocker.startedAt).getTime(),
      });
      if (staleReason) {
        await failRunIfActive(blocker.id, staleReason, blocker);
        continue; // slot is free now — retry insert
      }
    }

    return { ok: false, reason: "already_running", blockingRunId: blocker.id };
  }

  // Exhausted attempts (rapid churn). Report whatever's blocking now.
  const final = await RankTrackingRepository.getActiveRunForConfig(
    input.config.id,
  );
  return {
    ok: false,
    reason: "already_running",
    blockingRunId: final?.id ?? null,
  };
}

export async function reconcileActiveRankCheckRun(run: NonNullable<RunRow>) {
  if (run.status !== "running" && run.status !== "pending") {
    return null;
  }

  const staleReason = await getStaleRankCheckRunReason({
    runId: run.id,
    run,
    ageMs: Date.now() - new Date(run.startedAt).getTime(),
  });
  if (!staleReason) return null;

  return {
    errorMessage: staleReason,
    completedAt: new Date().toISOString(),
  };
}
