/**
 * @file_id FILE-MVX-AUTO-REFERRINGDOMAINSTABLE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-REFERRINGDOMAINSTABLE
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
 * @generated_at 2026-05-13T13:53:34.259Z
 * @updated_at 2026-05-13T13:53:34.261Z
 * @hash sha256:358adb6f68c37e6dd2bf1b3eabd116416339e78e8ecd52e54d047f1c2a904ddd
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.259Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import {
  createColumnHelper,
  type SortingFn,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  AppDataTable,
  useAppTable,
} from "@/client/components/table/AppDataTable";
import { SortableHeader } from "@/client/components/table/SortableHeader";
import {
  compareNumericNullsLast,
  dateNullsLast,
  isDescending,
  numericNullsLast,
  stringNullsLast,
} from "@/client/components/table/nullSafeSort";
import { EmptyTableState } from "./BacklinksPageEmptyTableState";
import type { BacklinksOverviewData } from "./backlinksPageTypes";
import {
  formatCompactDate,
  formatDecimal,
  formatNumber,
} from "./backlinksPageUtils";

type ReferringDomainRow = BacklinksOverviewData["referringDomains"][number];

const columnHelper = createColumnHelper<ReferringDomainRow>();

// Nulls always to the bottom in both directions, same as the pre-TanStack
// implementation. Secondary compare on brokenPages must also keep nulls last —
// coercing to 0 would mix unknown values with real zeroes.
const sortByIssues: SortingFn<ReferringDomainRow> = (left, right, columnId) => {
  const descending = isDescending(left, columnId);
  const primary = compareNumericNullsLast(
    left.original.brokenBacklinks,
    right.original.brokenBacklinks,
    descending,
  );
  if (primary !== 0) return primary;
  return compareNumericNullsLast(
    left.original.brokenPages,
    right.original.brokenPages,
    descending,
  );
};

const columns = [
  columnHelper.accessor("domain", {
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label="Domain"
        helpText="The referring site linking to your target."
      />
    ),
    cell: ({ getValue }) => getValue() ?? "-",
    sortingFn: stringNullsLast,
  }),
  columnHelper.accessor("backlinks", {
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label="Backlinks"
        helpText="Total backlinks found from this domain."
      />
    ),
    cell: ({ getValue }) => formatNumber(getValue()),
    sortingFn: numericNullsLast,
    sortDescFirst: true,
  }),
  columnHelper.accessor("referringPages", {
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label="Referring Pages"
        helpText="Unique pages on this domain that link to your target."
      />
    ),
    cell: ({ getValue }) => formatNumber(getValue()),
    sortingFn: numericNullsLast,
    sortDescFirst: true,
  }),
  columnHelper.accessor("rank", {
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label="Rank"
        helpText="Authority score for the referring domain."
      />
    ),
    cell: ({ getValue }) => formatNumber(getValue()),
    sortingFn: numericNullsLast,
    sortDescFirst: true,
  }),
  columnHelper.accessor("spamScore", {
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label="Spam"
        helpText="Spam risk score for this referring domain."
      />
    ),
    cell: ({ getValue }) => formatDecimal(getValue()),
    sortingFn: numericNullsLast,
    sortDescFirst: true,
  }),
  columnHelper.accessor("firstSeen", {
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label="First Seen"
        helpText="When this domain was first discovered linking to your target."
      />
    ),
    cell: ({ getValue }) => formatCompactDate(getValue()),
    sortingFn: dateNullsLast,
    sortDescFirst: true,
  }),
  columnHelper.display({
    id: "issues",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label="Issues"
        helpText="Broken link and broken page counts tied to this domain."
      />
    ),
    cell: ({ row }) => (
      <div className="text-sm">
        <div>Broken links: {formatNumber(row.original.brokenBacklinks)}</div>
        <div className="text-base-content/55">
          Broken pages: {formatNumber(row.original.brokenPages)}
        </div>
      </div>
    ),
    enableSorting: true,
    sortingFn: sortByIssues,
    sortDescFirst: true,
  }),
];

const DEFAULT_SORTING: SortingState = [{ id: "backlinks", desc: true }];

export function ReferringDomainsTable({
  rows,
}: {
  rows: BacklinksOverviewData["referringDomains"];
}) {
  const [sorting, setSorting] = useState<SortingState>(DEFAULT_SORTING);

  const table = useAppTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    withSorting: true,
  });

  if (rows.length === 0) {
    return <EmptyTableState label="No referring domains match this filter." />;
  }

  return (
    <AppDataTable
      table={table}
      getCellClassName={(_, columnId) =>
        columnId === "domain" ? "font-medium break-all" : undefined
      }
    />
  );
}
