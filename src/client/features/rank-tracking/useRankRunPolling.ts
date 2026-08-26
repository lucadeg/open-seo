import { useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getLatestRankRun } from "@/serverFunctions/rank-tracking";

/**
 * @file_id FILE-MVX-AUTO-USERANKRUNPOLLING-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-USERANKRUNPOLLING
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
 * @generated_at 2026-05-13T13:53:35.625Z
 * @updated_at 2026-05-13T13:53:35.627Z
 * @hash sha256:c591d694337c42859c549caea751a7457185a773f65db0b92306a60804ba5143
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.625Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */
export function useRankRunPolling(projectId: string, configId: string) {
  const queryClient = useQueryClient();
  const prevStatusRef = useRef<string | undefined>(undefined);

  const { data: latestRun } = useQuery({
    queryKey: ["rankTrackingLatestRun", projectId, configId],
    queryFn: () => getLatestRankRun({ data: { projectId, configId } }),
    refetchInterval: (query) => {
      const run = query.state.data;
      const prev = prevStatusRef.current;
      prevStatusRef.current = run?.status;

      // When a run transitions to a terminal state, invalidate results
      const isTerminal =
        run?.status === "completed" || run?.status === "failed";
      const wasActive = prev === "running" || prev === "pending";
      if (wasActive && isTerminal) {
        void queryClient.invalidateQueries({
          queryKey: ["rankTrackingResults", projectId, configId],
        });
      }

      // Keep polling active runs, including stale ones (they'll be cleaned up
      // by the cron handler and we want to show the transition).
      if (run?.status === "pending" || run?.status === "running") return 3000;
      return false;
    },
  });

  return latestRun;
}
