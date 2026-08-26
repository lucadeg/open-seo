/**
 * @file_id FILE-MVX-AUTO-BRANDLOOKUPCITATIONTABLES-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-BRANDLOOKUPCITATIONTABLES
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
 * @generated_at 2026-05-13T13:53:33.464Z
 * @updated_at 2026-05-13T13:53:33.466Z
 * @hash sha256:53993c1e555afdbd45bb048ddae2aa4a9807d7f1167235e4fa96cd41ce64297c
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:33.464Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { createColumnHelper, type Table } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import { AppDataTable } from "@/client/components/table/AppDataTable";
import { SortableHeader } from "@/client/components/table/SortableHeader";
import { numericNullsLast } from "@/client/components/table/nullSafeSort";
import {
  formatCount,
  formatPlatformLabel,
} from "@/client/features/ai-search/platformLabels";
import { formatUrlForDisplay } from "@/client/components/table/url";
import type { BrandLookupResult } from "@/types/schemas/ai-search";

type TopPageRow = BrandLookupResult["topPages"][number];
type TopQueryRow = BrandLookupResult["topQueries"][number];
type PlatformKey = TopPageRow["platform"];

const PLATFORM_BADGE_CLASS: Record<PlatformKey, string> = {
  chat_gpt: "border-emerald-500/40 bg-emerald-500/10 text-emerald-500",
  google: "border-sky-500/40 bg-sky-500/10 text-sky-500",
};

function PlatformBadge({ platform }: { platform: PlatformKey }) {
  return (
    <span className={`badge badge-sm border ${PLATFORM_BADGE_CLASS[platform]}`}>
      {formatPlatformLabel(platform)}
    </span>
  );
}

const pagesHelper = createColumnHelper<TopPageRow>();
const queriesHelper = createColumnHelper<TopQueryRow>();

export const topPagesColumns = [
  pagesHelper.accessor("url", {
    id: "url",
    header: () => <span className="uppercase tracking-wider">URL</span>,
    enableSorting: false,
    cell: ({ row }) => (
      <>
        <a
          href={row.original.url}
          target="_blank"
          rel="noreferrer"
          className="link link-primary inline-flex items-start gap-1 break-all"
        >
          <span className="break-all">
            {formatUrlForDisplay(row.original.url)}
          </span>
          <ExternalLink className="mt-1 size-3 shrink-0" />
        </a>
        {row.original.domain ? (
          <p className="text-xs text-base-content/50">{row.original.domain}</p>
        ) : null}
      </>
    ),
  }),
  pagesHelper.accessor("platform", {
    id: "platform",
    header: () => <span className="uppercase tracking-wider">Platform</span>,
    enableSorting: false,
    cell: ({ getValue }) => <PlatformBadge platform={getValue()} />,
  }),
  pagesHelper.accessor("mentions", {
    id: "mentions",
    header: ({ column }) => (
      <SortableHeader column={column} label="Mentions" align="right" />
    ),
    cell: ({ getValue }) => (
      <span className="tabular-nums">{formatCount(getValue())}</span>
    ),
    sortingFn: numericNullsLast,
    sortDescFirst: true,
  }),
];

export const topQueriesColumns = [
  queriesHelper.accessor("question", {
    id: "question",
    header: () => <span className="uppercase tracking-wider">Query</span>,
    enableSorting: false,
    cell: ({ row }) => (
      <>
        <p className="break-words font-medium">{row.original.question}</p>
        {row.original.brandsMentioned.length > 0 ? (
          <p className="mt-0.5 text-xs text-base-content/50">
            Brands: {row.original.brandsMentioned.slice(0, 5).join(", ")}
          </p>
        ) : null}
      </>
    ),
  }),
  queriesHelper.accessor("platform", {
    id: "platform",
    header: () => <span className="uppercase tracking-wider">Platform</span>,
    enableSorting: false,
    cell: ({ getValue }) => <PlatformBadge platform={getValue()} />,
  }),
  queriesHelper.accessor("aiSearchVolume", {
    id: "aiSearchVolume",
    header: ({ column }) => (
      <SortableHeader column={column} label="AI search vol." align="right" />
    ),
    cell: ({ getValue }) => (
      <span className="tabular-nums">{formatCount(getValue())}</span>
    ),
    sortingFn: numericNullsLast,
    sortDescFirst: true,
  }),
];

export function TopPagesTable({ table }: { table: Table<TopPageRow> }) {
  if (table.getRowModel().rows.length === 0) {
    return (
      <p className="p-6 text-center text-sm text-base-content/60">
        No cited pages returned.
      </p>
    );
  }

  return <BrandLookupTable table={table} urlLikeColumnId="url" />;
}

export function TopQueriesTable({ table }: { table: Table<TopQueryRow> }) {
  if (table.getRowModel().rows.length === 0) {
    return (
      <p className="p-6 text-center text-sm text-base-content/60">
        No matching queries found.
      </p>
    );
  }

  return <BrandLookupTable table={table} urlLikeColumnId="question" />;
}

function BrandLookupTable<T>({
  table,
  urlLikeColumnId,
}: {
  table: Table<T>;
  urlLikeColumnId: string;
}) {
  return (
    <AppDataTable
      table={table}
      getCellClassName={(_, columnId) =>
        cellClassName(
          columnId,
          urlLikeColumnId,
          table.getColumn(columnId)?.getCanSort() ?? false,
        )
      }
      getRowClassName={() => ""}
    />
  );
}

function cellClassName(
  columnId: string,
  urlLikeColumnId: string,
  isNumeric: boolean,
): string {
  if (columnId === urlLikeColumnId) {
    return "min-w-80 max-w-2xl align-top";
  }
  if (isNumeric) {
    return "whitespace-nowrap text-right align-top";
  }
  return "whitespace-nowrap align-top";
}
