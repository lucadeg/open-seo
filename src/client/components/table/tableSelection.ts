/**
 * @file_id FILE-MVX-AUTO-TABLESELECTION-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-TABLESELECTION
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
 * @generated_at 2026-05-13T13:53:33.359Z
 * @updated_at 2026-05-13T13:53:33.361Z
 * @hash sha256:c5a102b00060115e1b98ee7fe2c69df85d2792141d4f2cadd69f32a842b09a88
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:33.359Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import type { MouseEvent, MutableRefObject } from "react";
import type { Row, RowSelectionState, Table } from "@tanstack/react-table";

export type SelectionAnchor = {
  id: string;
  selected: boolean;
};

type SelectionRow<T> = Pick<Row<T>, "id" | "getIsSelected">;

type SelectionTable<T> = Pick<Table<T>, "setRowSelection"> & {
  getRowModel: () => {
    rows: SelectionRow<T>[];
  };
};

export function applyShiftRangeSelection<T>(
  event: Pick<MouseEvent<HTMLElement>, "shiftKey" | "preventDefault">,
  row: SelectionRow<T>,
  table: SelectionTable<T>,
  anchorRef: MutableRefObject<SelectionAnchor | null>,
): boolean {
  if (!event.shiftKey || !anchorRef.current) {
    anchorRef.current = {
      id: row.id,
      selected: !row.getIsSelected(),
    };
    return false;
  }

  const rows = table.getRowModel().rows;
  const anchorIndex = rows.findIndex((candidate) => {
    return candidate.id === anchorRef.current?.id;
  });
  const currentIndex = rows.findIndex((candidate) => candidate.id === row.id);

  if (anchorIndex === -1 || currentIndex === -1) {
    anchorRef.current = {
      id: row.id,
      selected: !row.getIsSelected(),
    };
    return false;
  }

  event.preventDefault();

  const [from, to] =
    anchorIndex < currentIndex
      ? [anchorIndex, currentIndex]
      : [currentIndex, anchorIndex];

  const selected = anchorRef.current.selected;
  table.setRowSelection((currentSelection: RowSelectionState) => {
    const nextSelection = { ...currentSelection };

    for (let index = from; index <= to; index++) {
      const rangeRow = rows[index];
      if (!rangeRow) continue;

      if (selected) {
        nextSelection[rangeRow.id] = true;
      } else {
        delete nextSelection[rangeRow.id];
      }
    }

    return nextSelection;
  });
  anchorRef.current = { id: row.id, selected };
  return true;
}
