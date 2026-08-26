/**
 * @file_id FILE-MVX-AUTO-RANKTRACKINGCOLUMNS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-RANKTRACKINGCOLUMNS
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
 * @generated_at 2026-05-13T13:53:35.459Z
 * @updated_at 2026-05-13T13:53:35.460Z
 * @hash sha256:edbad4f11815b90c3c1b480dc8d6c4903dafef039ee85ae02c705919ab4ef1de
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.459Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { useMemo, type MutableRefObject } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import type { ColumnDef, SortingFn } from "@tanstack/react-table";
import { makeSelectionColumn } from "@/client/components/table/AppDataTable";
import type { RankTrackingRow } from "@/types/schemas/rank-tracking";
import {
  comparePositions,
  CpcCell,
  DeviceRankCell,
  DeviceUrlCell,
  DifficultyCell,
  SerpFeatureTags,
  VolumeCell,
} from "./RankTrackingTableParts";
import type { SelectionAnchor } from "@/client/components/table/tableSelection";

const HEADER_TOOLTIPS: Record<string, string> = {
  keyword: "The search term being tracked in Google",
  volume: "Estimated monthly search volume from Google",
  kd: "Keyword difficulty score (0-100) — higher means harder to rank",
  cpc: "Average cost per click in Google Ads (USD)",
  desktopPosition:
    "Current Google ranking position, showing change from the comparison period",
  mobilePosition:
    "Current Google ranking position, showing change from the comparison period",
  url: "The page on your site that ranks for this keyword",
  serp: "Special result features appearing on the search results page (e.g. AI Overview, People Also Ask)",
};

export function SortableHeader({
  column,
  label,
  id,
  tooltip,
}: {
  column: {
    getIsSorted: () => false | "asc" | "desc";
    getToggleSortingHandler: () => ((event: unknown) => void) | undefined;
  };
  label: string;
  id: string;
  tooltip?: string;
}) {
  const sorted = column.getIsSorted();
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 text-xs uppercase tracking-wide font-medium text-base-content/60 transition-colors hover:text-base-content"
      onClick={column.getToggleSortingHandler()}
      title={tooltip ?? HEADER_TOOLTIPS[id]}
      aria-label={`Sort by ${label}`}
      aria-pressed={!!sorted}
    >
      {label}
      {sorted === "asc" ? (
        <ArrowUp className="size-3 shrink-0" />
      ) : sorted === "desc" ? (
        <ArrowDown className="size-3 shrink-0" />
      ) : null}
    </button>
  );
}

const nullsLastNumeric: SortingFn<RankTrackingRow> = (rowA, rowB, columnId) => {
  const a = rowA.getValue<number | null>(columnId);
  const b = rowB.getValue<number | null>(columnId);
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return a - b;
};

const volumeColumn: ColumnDef<RankTrackingRow> = {
  id: "volume",
  accessorKey: "searchVolume",
  header: ({ column }) => (
    <SortableHeader column={column} label="Volume" id="volume" />
  ),
  size: 90,
  cell: ({ getValue }) => <VolumeCell value={getValue<number | null>()} />,
  sortingFn: nullsLastNumeric,
};

const kdColumn: ColumnDef<RankTrackingRow> = {
  id: "kd",
  accessorKey: "keywordDifficulty",
  header: ({ column }) => <SortableHeader column={column} label="KD" id="kd" />,
  size: 70,
  cell: ({ getValue }) => <DifficultyCell value={getValue<number | null>()} />,
  sortingFn: nullsLastNumeric,
};

const cpcColumn: ColumnDef<RankTrackingRow> = {
  id: "cpc",
  accessorKey: "cpc",
  header: ({ column }) => (
    <SortableHeader column={column} label="CPC" id="cpc" />
  ),
  size: 80,
  cell: ({ getValue }) => <CpcCell value={getValue<number | null>()} />,
  sortingFn: nullsLastNumeric,
};

const positionSort: SortingFn<RankTrackingRow> = (rowA, rowB, columnId) => {
  const device = columnId === "desktopPosition" ? "desktop" : "mobile";
  return comparePositions(
    rowA.original[device].position,
    rowB.original[device].position,
  );
};

function makeSelectColumn(
  anchorRef: MutableRefObject<SelectionAnchor | null>,
): ColumnDef<RankTrackingRow> {
  return makeSelectionColumn<RankTrackingRow>(anchorRef);
}

const keywordColumn: ColumnDef<RankTrackingRow> = {
  id: "keyword",
  accessorKey: "keyword",
  header: ({ column }) => (
    <SortableHeader column={column} label="Keyword" id="keyword" />
  ),
  cell: ({ getValue }) => (
    <span className="font-medium">{getValue<string>()}</span>
  ),
  sortingFn: "alphanumeric",
};

function makeDeviceColumn(
  device: "desktop" | "mobile",
): ColumnDef<RankTrackingRow> {
  const id = device === "desktop" ? "desktopPosition" : "mobilePosition";
  return {
    id,
    accessorFn: (row) => row[device].position,
    header: ({ column }) => (
      <SortableHeader column={column} label="Position" id={id} />
    ),
    size: 120,
    maxSize: 140,
    cell: ({ row }) => <DeviceRankCell result={row.original[device]} />,
    sortingFn: positionSort,
  };
}

function makeUrlColumn(
  device: "desktop" | "mobile",
  domain: string,
): ColumnDef<RankTrackingRow> {
  return {
    id: device === "desktop" ? "desktopUrl" : "mobileUrl",
    enableSorting: false,
    header: () => (
      <span
        className="text-xs uppercase tracking-wide font-medium text-base-content/60 cursor-help"
        title={HEADER_TOOLTIPS.url}
      >
        URL
      </span>
    ),
    size: 240,
    cell: ({ row }) => (
      <DeviceUrlCell result={row.original[device]} domain={domain} />
    ),
  };
}

function makeSerpColumn(
  device: "desktop" | "mobile",
): ColumnDef<RankTrackingRow> {
  return {
    id: device === "desktop" ? "desktopSerp" : "mobileSerp",
    enableSorting: false,
    header: () => (
      <span
        className="text-xs uppercase tracking-wide font-medium text-base-content/60 cursor-help"
        title={HEADER_TOOLTIPS.serp}
      >
        SERP Features
      </span>
    ),
    cell: ({ row }) => {
      const features = row.original[device].serpFeatures;
      if (features.length === 0) return null;
      return <SerpFeatureTags features={features} />;
    },
  };
}

export function useRankTrackingColumns(
  showDesktop: boolean,
  showMobile: boolean,
  domain: string,
  selectAnchorRef: MutableRefObject<SelectionAnchor | null>,
): ColumnDef<RankTrackingRow>[] {
  return useMemo(() => {
    const cols: ColumnDef<RankTrackingRow>[] = [
      makeSelectColumn(selectAnchorRef),
      keywordColumn,
    ];
    if (showDesktop) {
      cols.push(makeDeviceColumn("desktop"));
      cols.push(makeUrlColumn("desktop", domain));
    }
    if (showMobile) {
      cols.push(makeDeviceColumn("mobile"));
      cols.push(makeUrlColumn("mobile", domain));
    }
    cols.push(volumeColumn, kdColumn, cpcColumn);
    if (showDesktop) {
      cols.push(makeSerpColumn("desktop"));
    }
    if (showMobile) {
      cols.push(makeSerpColumn("mobile"));
    }
    return cols;
  }, [showDesktop, showMobile, domain, selectAnchorRef]);
}
