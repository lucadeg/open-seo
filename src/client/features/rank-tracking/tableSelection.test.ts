/**
 * @file_id FILE-MVX-AUTO-TABLESELECTION-TEST-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-TABLESELECTION-TEST
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
 * @generated_at 2026-05-13T13:53:35.584Z
 * @updated_at 2026-05-13T13:53:35.586Z
 * @hash sha256:e84738388c77c459c61e1c69db01267599897869792a480bb898f8c098edf345
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.584Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { describe, expect, it } from "vitest";
import type { MutableRefObject } from "react";
import type { RowSelectionState, Updater } from "@tanstack/react-table";
import {
  applyShiftRangeSelection,
  type SelectionAnchor,
} from "@/client/components/table/tableSelection";

function makeRow(id: string, selectedIds: Set<string>) {
  return {
    id,
    getIsSelected: () => selectedIds.has(id),
  };
}

function makeEvent(shiftKey: boolean) {
  const event = {
    shiftKey,
    defaultPrevented: false,
    preventDefault() {
      event.defaultPrevented = true;
    },
  };

  return event;
}

function makeTable(ids: string[], selectedIds: Set<string>) {
  return {
    getRowModel: () => ({
      rows: ids.map((id) => makeRow(id, selectedIds)),
    }),
    setRowSelection: (updater: Updater<RowSelectionState>) => {
      const currentSelection = Object.fromEntries(
        Array.from(selectedIds).map((id) => [id, true]),
      );
      const nextSelection =
        typeof updater === "function" ? updater(currentSelection) : updater;

      selectedIds.clear();
      Object.entries(nextSelection).forEach(([id, selected]) => {
        if (selected) selectedIds.add(id);
      });
    },
  };
}

describe("applyShiftRangeSelection", () => {
  it("records the next selected state on a plain click", () => {
    const selectedIds = new Set<string>();
    const table = makeTable(["a", "b"], selectedIds);
    const anchorRef: MutableRefObject<SelectionAnchor | null> = {
      current: null,
    };
    const event = makeEvent(false);

    expect(
      applyShiftRangeSelection(
        event,
        makeRow("a", selectedIds),
        table,
        anchorRef,
      ),
    ).toBe(false);
    expect(anchorRef.current).toEqual({ id: "a", selected: true });
    expect(event.defaultPrevented).toBe(false);
  });

  it("selects the visible range from a selected anchor", () => {
    const selectedIds = new Set<string>(["a"]);
    const table = makeTable(["a", "b", "c", "d"], selectedIds);
    const anchorRef: MutableRefObject<SelectionAnchor | null> = {
      current: { id: "a", selected: true },
    };
    const event = makeEvent(true);

    expect(
      applyShiftRangeSelection(
        event,
        makeRow("c", selectedIds),
        table,
        anchorRef,
      ),
    ).toBe(true);
    expect(Array.from(selectedIds)).toEqual(["a", "b", "c"]);
    expect(anchorRef.current).toEqual({ id: "c", selected: true });
    expect(event.defaultPrevented).toBe(true);
  });

  it("clears the visible range from a deselected anchor", () => {
    const selectedIds = new Set<string>(["a", "b", "c", "d"]);
    const table = makeTable(["a", "b", "c", "d"], selectedIds);
    const anchorRef: MutableRefObject<SelectionAnchor | null> = {
      current: { id: "b", selected: false },
    };

    applyShiftRangeSelection(
      makeEvent(true),
      makeRow("d", selectedIds),
      table,
      anchorRef,
    );

    expect(Array.from(selectedIds)).toEqual(["a"]);
    expect(anchorRef.current).toEqual({ id: "d", selected: false });
  });
});
