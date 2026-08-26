/**
 * @file_id FILE-MVX-AUTO-ACTIONSMENU-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-ACTIONSMENU
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
 * @generated_at 2026-05-13T13:53:35.392Z
 * @updated_at 2026-05-13T13:53:35.393Z
 * @hash sha256:267e11d3c152b5a425e83294d387402d56e5531afa6c29c7265e3fc209272d90
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.392Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { useState } from "react";
import {
  Copy,
  Download,
  MoreHorizontal,
  Play,
  RefreshCw,
  Sheet,
} from "lucide-react";

export function ActionsMenu({
  onCheckNow,
  onExport,
  onExportToSheets,
  onCopyKeywords,
  onRefreshMetrics,
  isRunning,
  metricsRefreshing,
  hasData,
  checkDisabled,
}: {
  onCheckNow: () => void;
  onExport: () => void;
  onExportToSheets: () => void;
  onCopyKeywords: () => void;
  onRefreshMetrics: () => void;
  isRunning: boolean;
  metricsRefreshing: boolean;
  hasData: boolean;
  checkDisabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        className="btn btn-ghost btn-sm gap-1"
        onClick={() => setOpen((c) => !c)}
      >
        <MoreHorizontal className="size-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 rounded-lg border border-base-300 bg-base-100 shadow-lg py-1 min-w-[160px]">
            {!checkDisabled && (
              <button
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-base-200"
                onClick={() => {
                  onCheckNow();
                  setOpen(false);
                }}
                disabled={isRunning}
              >
                <Play className="size-3.5" />
                {isRunning ? "Running..." : "Check Now"}
              </button>
            )}
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-base-200"
              onClick={() => {
                onRefreshMetrics();
                setOpen(false);
              }}
              disabled={metricsRefreshing || !hasData}
            >
              <RefreshCw
                className={`size-3.5 ${metricsRefreshing ? "animate-spin" : ""}`}
              />
              {metricsRefreshing ? "Refreshing..." : "Refresh Metrics"}
            </button>
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-base-200"
              onClick={() => {
                onExportToSheets();
                setOpen(false);
              }}
              disabled={!hasData}
            >
              <Sheet className="size-3.5" />
              Export to Sheets
            </button>
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-base-200"
              onClick={() => {
                onExport();
                setOpen(false);
              }}
              disabled={!hasData}
            >
              <Download className="size-3.5" />
              Export CSV
            </button>
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-base-200"
              onClick={() => {
                onCopyKeywords();
                setOpen(false);
              }}
              disabled={!hasData}
            >
              <Copy className="size-3.5" />
              Copy Keywords
            </button>
          </div>
        </>
      )}
    </div>
  );
}
