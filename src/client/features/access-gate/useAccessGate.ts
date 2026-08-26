/**
 * @file_id FILE-MVX-AUTO-USEACCESSGATE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-USEACCESSGATE
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
 * @generated_at 2026-05-13T13:53:33.382Z
 * @updated_at 2026-05-13T13:53:33.384Z
 * @hash sha256:85c8f08fad7155784d68493b23ed1c896990d18a8f083257e946c33347b94bbb
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:33.382Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStandardErrorMessage } from "@/client/lib/error-messages";

type AccessGateStatus = {
  enabled: boolean;
  errorMessage: string | null;
};

export type UseAccessGateResult = {
  enabled: boolean;
  isLoading: boolean;
  isRefetching: boolean;
  errorMessage: string | null;
  statusErrorMessage: string | null;
  onRetry: () => void;
};

export function useAccessGate(config: {
  queryKey: readonly unknown[];
  queryFn: () => Promise<AccessGateStatus>;
  statusErrorFallback: string;
}): UseAccessGateResult {
  const { data, error, isPending, isRefetching, refetch } = useQuery({
    queryKey: config.queryKey,
    queryFn: config.queryFn,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
  });

  const statusErrorMessage = error
    ? getStandardErrorMessage(error, config.statusErrorFallback)
    : null;
  const onRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  return {
    enabled: data?.enabled ?? false,
    isLoading: isPending,
    isRefetching,
    errorMessage: data?.errorMessage ?? null,
    statusErrorMessage,
    onRetry,
  };
}
