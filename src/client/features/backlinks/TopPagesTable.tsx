/**
 * @file_id FILE-MVX-AUTO-TOPPAGESTABLE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-TOPPAGESTABLE
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
 * @generated_at 2026-05-13T13:53:34.289Z
 * @updated_at 2026-05-13T13:53:34.291Z
 * @hash sha256:5c28eadb5e5680bcd84325d82396e7bfd155d9973090d50d1cc27e39011a42b7
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.289Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { createColumnHelper, type SortingState } from "@tanstack/react-table";
import { useState } from "react";
import {
  AppDataTable,
  useAppTable,
} from "@/client/components/table/AppDataTable";
import { SortableHeader } from "@/client/components/table/SortableHeader";
import {
  numericNullsLast,
  stringNullsLast,
} from "@/client/components/table/nullSafeSort";
import { EmptyTableState } from "./BacklinksPageEmptyTableState";
import { BacklinksExternalLink } from "./BacklinksPageLinks";
import type { BacklinksOverviewData } from "./backlinksPageTypes";
import { formatNumber } from "./backlinksPageUtils";

type TopPageRow = BacklinksOverviewData["topPages"][number];

const columnHelper = createColumnHelper<TopPageRow>();

const columns = [
  columnHelper.accessor("page", {
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label="Page"
        helpText="Page on the target site receiving backlinks."
      />
    ),
    cell: ({ getValue }) => {
      const page = getValue();
      return page ? (
        <BacklinksExternalLink
          url={page}
          label={page}
          className="link link-hover break-all inline-flex items-center gap-1"
        />
      ) : (
        "-"
      );
    },
    sortingFn: stringNullsLast,
  }),
  columnHelper.accessor("backlinks", {
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label="Backlinks"
        helpText="Total backlinks pointing to this page."
      />
    ),
    cell: ({ getValue }) => formatNumber(getValue()),
    sortingFn: numericNullsLast,
    sortDescFirst: true,
  }),
  columnHelper.accessor("referringDomains", {
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label="Referring Domains"
        helpText="Unique domains linking to this page."
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
        helpText="Authority score for this target page."
      />
    ),
    cell: ({ getValue }) => formatNumber(getValue()),
    sortingFn: numericNullsLast,
    sortDescFirst: true,
  }),
  columnHelper.accessor("brokenBacklinks", {
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label="Broken Backlinks"
        helpText="Backlinks pointing here that are currently broken."
      />
    ),
    cell: ({ getValue }) => formatNumber(getValue()),
    sortingFn: numericNullsLast,
    sortDescFirst: true,
  }),
];

const DEFAULT_SORTING: SortingState = [{ id: "backlinks", desc: true }];

export function TopPagesTable({
  rows,
}: {
  rows: BacklinksOverviewData["topPages"];
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
    return <EmptyTableState label="No top pages match this filter." />;
  }

  return (
    <AppDataTable
      table={table}
      getCellClassName={(_, columnId) =>
        columnId === "page" ? "min-w-80" : undefined
      }
    />
  );
}
