import type { Row } from "@tanstack/react-table";

/**
 * @file_id FILE-MVX-AUTO-NULLSAFESORT-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-NULLSAFESORT
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
 * @generated_at 2026-05-13T13:53:33.350Z
 * @updated_at 2026-05-13T13:53:33.351Z
 * @hash sha256:fbdce83f465f45e1660b87071773dc43a67cc558181c13dbd44ef84bace421ae
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:33.350Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

export function isDescending<TData>(
  row: Row<TData>,
  columnId: string,
): boolean {
  const cell = row.getAllCells().find((c) => c.column.id === columnId);
  return cell?.column.getIsSorted() === "desc";
}

/**
 * Compare two nullable numeric values with nulls always at the bottom,
 * regardless of the column's current sort direction. Use this directly for
 * tiebreakers or when the value isn't the column's accessor.
 */
export function compareNumericNullsLast(
  a: number | null | undefined,
  b: number | null | undefined,
  descending: boolean,
): number {
  if (a == null && b == null) return 0;
  if (a == null || b == null) {
    const sign = descending ? -1 : 1;
    return (a == null ? 1 : -1) * sign;
  }
  return a - b;
}

export function numericNullsLast<TData>(
  rowA: Row<TData>,
  rowB: Row<TData>,
  columnId: string,
): number {
  return compareNumericNullsLast(
    rowA.getValue<number | null | undefined>(columnId),
    rowB.getValue<number | null | undefined>(columnId),
    isDescending(rowA, columnId),
  );
}

export function stringNullsLast<TData>(
  rowA: Row<TData>,
  rowB: Row<TData>,
  columnId: string,
): number {
  const a = rowA.getValue<string | null | undefined>(columnId);
  const b = rowB.getValue<string | null | undefined>(columnId);
  if (!a && !b) return 0;
  if (!a || !b) {
    const sign = isDescending(rowA, columnId) ? -1 : 1;
    return (!a ? 1 : -1) * sign;
  }
  return a.toLowerCase().localeCompare(b.toLowerCase());
}

export function dateNullsLast<TData>(
  rowA: Row<TData>,
  rowB: Row<TData>,
  columnId: string,
): number {
  const a = rowA.getValue<string | null | undefined>(columnId);
  const b = rowB.getValue<string | null | undefined>(columnId);
  if (!a && !b) return 0;
  if (!a || !b) {
    const sign = isDescending(rowA, columnId) ? -1 : 1;
    return (!a ? 1 : -1) * sign;
  }
  return Date.parse(a) - Date.parse(b);
}
