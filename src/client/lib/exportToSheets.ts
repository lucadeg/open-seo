import { useSyncExternalStore } from "react";
import { toast } from "sonner";
import {
  copyTableToClipboard,
  GOOGLE_SHEETS_NEW_URL,
} from "@/client/lib/clipboard";
import type { CsvValue } from "@/client/lib/csv";
import { getStandardErrorMessage } from "@/client/lib/error-messages";
import { captureClientEvent } from "@/client/lib/posthog";

type ModalState = { isOpen: false } | { isOpen: true; rowCount: number };

const listeners = new Set<() => void>();
let state: ModalState = { isOpen: false };

function emit() {
  for (const listener of listeners) listener();
}

function setState(next: ModalState) {
  state = next;
  emit();
}

export function useExportToSheetsModalState(): ModalState {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
    () => state,
  );
}

export function closeExportToSheetsModal() {
  setState({ isOpen: false });
}

export function openGoogleSheetsTab() {
  window.open(GOOGLE_SHEETS_NEW_URL, "_blank", "noopener,noreferrer");
}

/**
 * @file_id FILE-MVX-AUTO-EXPORTTOSHEETS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-EXPORTTOSHEETS
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
 * @generated_at 2026-05-13T13:53:35.836Z
 * @updated_at 2026-05-13T13:53:35.838Z
 * @hash sha256:f37c547dbe998729959011235f4bfce870d8eda883cf86c345522313035768f8
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.836Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */
export async function exportTableToSheets(args: {
  headers: string[];
  rows: CsvValue[][];
  feature: string;
}) {
  const { headers, rows, feature } = args;
  if (rows.length === 0) {
    toast.error("No data to export");
    return;
  }
  try {
    await copyTableToClipboard(headers, rows);
    captureClientEvent("data:export_sheets", {
      source_feature: feature,
      result_count: rows.length,
    });
    setState({ isOpen: true, rowCount: rows.length });
  } catch (error) {
    toast.error(getStandardErrorMessage(error, "Could not copy to clipboard"));
  }
}
