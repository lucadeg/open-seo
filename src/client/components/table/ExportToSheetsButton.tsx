import { Sheet } from "lucide-react";
import { useState } from "react";
import type { CsvValue } from "@/client/lib/csv";
import { exportTableToSheets } from "@/client/lib/exportToSheets";

type Props = {
  headers: string[];
  /**
 * @file_id FILE-MVX-AUTO-EXPORTTOSHEETSBUTTON-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-EXPORTTOSHEETSBUTTON
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
 * @generated_at 2026-05-13T13:53:33.303Z
 * @updated_at 2026-05-13T13:53:33.305Z
 * @hash sha256:d981a0f4d414ee471400a975688384a7937f029aaa09b23a00e1cac0f130c6a9
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:33.303Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */
  rows: CsvValue[][];
  /** PostHog `source_feature` for the `data:export_sheets` event. */
  feature: string;
  disabled?: boolean;
  label?: string;
  /** Render the icon without a text label (icon-only mode for tight rows). */
  iconOnly?: boolean;
  /** Extra classes appended to the default button classes. */
  className?: string;
};

export function ExportToSheetsButton({
  headers,
  rows,
  feature,
  disabled,
  label = "Export to Sheets",
  iconOnly,
  className,
}: Props) {
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await exportTableToSheets({ headers, rows, feature });
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      className={`btn btn-ghost btn-xs gap-1 ${className ?? ""}`}
      onClick={handleClick}
      disabled={disabled || rows.length === 0 || busy}
      title="Copy table and open a new Google Sheet"
      aria-label={iconOnly ? "Export to Sheets" : undefined}
    >
      <Sheet className="size-3.5" />
      {iconOnly ? null : label}
    </button>
  );
}
