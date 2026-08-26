/**
 * @file_id FILE-MVX-AUTO-BACKLINKSTABLECOLUMNS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-BACKLINKSTABLECOLUMNS
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
 * @generated_at 2026-05-13T13:53:34.222Z
 * @updated_at 2026-05-13T13:53:34.224Z
 * @hash sha256:5c87b8209b5ac9b90ce2c6c79991d6bef932f23f05b60a89df0f63e740e09cd6
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.222Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import type { ColumnDef } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import { SortableHeader } from "@/client/components/table/SortableHeader";
import {
  dateNullsLast,
  numericNullsLast,
  stringNullsLast,
} from "@/client/components/table/nullSafeSort";
import { HeaderHelpLabel } from "@/client/features/keywords/components";
import { BacklinksSourceLink } from "./BacklinksPageLinks";
import type { BacklinksRow, GroupedBacklinkDomain } from "./backlinksPageTypes";
import {
  formatCompactDate,
  formatDecimal,
  formatNumber,
} from "./backlinksPageUtils";

function BacklinkFlags({ row }: { row: BacklinksRow }) {
  return (
    <div className="flex flex-wrap gap-1">
      {row.isLost ? (
        <span className="badge badge-sm badge-error badge-outline">Lost</span>
      ) : null}
      {row.isBroken ? (
        <span className="badge badge-sm badge-warning badge-outline">
          Broken
        </span>
      ) : null}
      {row.isDofollow === false ? (
        <span className="badge badge-sm badge-outline">Nofollow</span>
      ) : null}
      {row.linksCount != null && row.linksCount > 1 ? (
        <span className="badge badge-sm badge-outline inline-flex min-w-fit items-center whitespace-nowrap">
          {row.linksCount} links
        </span>
      ) : null}
    </div>
  );
}

function DomainFlagBadges({ group }: { group: GroupedBacklinkDomain }) {
  const badges: Array<{ label: string; className: string }> = [];
  if (group.lostCount > 0) {
    badges.push({
      label: `${group.lostCount} Lost`,
      className: "badge badge-sm badge-error badge-outline",
    });
  }
  if (group.brokenCount > 0) {
    badges.push({
      label: `${group.brokenCount} Broken`,
      className: "badge badge-sm badge-warning badge-outline",
    });
  }
  if (group.nofollowCount > 0) {
    badges.push({
      label: `${group.nofollowCount} Nofollow`,
      className: "badge badge-sm badge-outline",
    });
  }
  if (badges.length === 0) return null;

  return (
    <div className="flex gap-1">
      {badges.map((badge) => (
        <span key={badge.label} className={badge.className}>
          {badge.label}
        </span>
      ))}
    </div>
  );
}

export const backlinksColumns: ColumnDef<GroupedBacklinkDomain>[] = [
  {
    id: "source",
    accessorKey: "domain",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label="Source"
        helpText="Page or domain linking to you"
      />
    ),
    size: 250,
    minSize: 180,
    cell: ({ row }) => {
      if (row.depth > 0) {
        const child = row.original._backlink;
        return (
          <div className="pl-6 break-all">
            {child?.urlFrom ? (
              <BacklinksSourceLink url={child.urlFrom} maxLength={48} muted />
            ) : (
              <span className="text-base-content/55">-</span>
            )}
          </div>
        );
      }

      const group = row.original;
      return (
        <div className="flex items-center gap-2">
          <ChevronRight
            className={`size-4 shrink-0 transition-transform ${row.getIsExpanded() ? "rotate-90" : ""}`}
          />
          <div>
            <div className="font-semibold">{group.domain}</div>
            <div className="text-xs text-base-content/55">
              {group.backlinkCount}{" "}
              {group.backlinkCount === 1 ? "backlink" : "backlinks"} &middot;{" "}
              {group.targetCount} {group.targetCount === 1 ? "page" : "pages"}
            </div>
          </div>
        </div>
      );
    },
    sortingFn: stringNullsLast,
  },
  {
    id: "target",
    header: () => (
      <HeaderHelpLabel label="Target" helpText="Destination on your site" />
    ),
    size: 220,
    minSize: 150,
    enableSorting: false,
    cell: ({ row }) => {
      if (row.depth > 0) {
        const child = row.original._backlink;
        return (
          <div className="break-all">
            {child?.urlTo ? (
              <BacklinksSourceLink url={child.urlTo} maxLength={40} />
            ) : (
              "-"
            )}
          </div>
        );
      }

      return null;
    },
  },
  {
    id: "anchor",
    header: () => (
      <HeaderHelpLabel label="Anchor" helpText="Text or format of the link" />
    ),
    size: 150,
    minSize: 100,
    enableSorting: false,
    cell: ({ row }) => {
      if (row.depth > 0) {
        const child = row.original._backlink;
        return (
          <div className="space-y-0.5 break-words">
            <span className="text-sm">{child?.anchor || "No anchor text"}</span>
            {child?.itemType ? (
              <div className="text-xs text-base-content/55">
                {child.itemType}
              </div>
            ) : null}
          </div>
        );
      }

      return null;
    },
  },
  {
    id: "flags",
    header: () => (
      <HeaderHelpLabel
        label="Flags"
        helpText="Special backlink attributes, such as lost, broken, nofollow, or multiple links from the same source."
      />
    ),
    size: 130,
    minSize: 80,
    enableSorting: false,
    cell: ({ row }) => {
      if (row.depth > 0) {
        const child = row.original._backlink;
        const hasFlags =
          child?.isLost ||
          child?.isBroken ||
          child?.isDofollow === false ||
          (child?.linksCount != null && child.linksCount > 1);
        return hasFlags && child ? <BacklinkFlags row={child} /> : null;
      }

      return <DomainFlagBadges group={row.original} />;
    },
  },
  {
    id: "linkAuthority",
    header: () => (
      <span className="flex w-full justify-end">
        <HeaderHelpLabel
          label="Link"
          helpText="Authority of the linking page"
        />
      </span>
    ),
    size: 70,
    minSize: 50,
    enableSorting: false,
    cell: ({ row }) => {
      if (row.depth > 0) {
        const child = row.original._backlink;
        return (
          <div className="text-right tabular-nums text-sm">
            <span
              title={
                child?.spamScore != null
                  ? `Spam score: ${formatDecimal(child.spamScore)}`
                  : undefined
              }
            >
              {formatNumber(child?.rank)}
            </span>
          </div>
        );
      }

      return null;
    },
  },
  {
    id: "domainAuthority",
    accessorKey: "domainAuthority",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label="DA"
        helpText="Authority of the linking domain"
        align="right"
      />
    ),
    size: 70,
    minSize: 50,
    cell: ({ row }) => {
      if (row.depth > 0) return null;

      return (
        <div className="text-right tabular-nums text-sm">
          {formatNumber(row.original.domainAuthority)}
        </div>
      );
    },
    sortingFn: numericNullsLast,
    sortDescFirst: true,
  },
  {
    id: "spamScore",
    accessorKey: "spamScore",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label="Spam"
        helpText="Estimated spam risk for the linking domain or backlink. Higher scores are more likely to be manipulative or low quality."
        align="right"
      />
    ),
    size: 70,
    minSize: 50,
    cell: ({ row }) => {
      const value =
        row.depth > 0
          ? row.original._backlink?.spamScore
          : row.original.spamScore;

      return (
        <div className="text-right tabular-nums text-sm">
          {value != null && value > 0 ? Math.round(value) : null}
        </div>
      );
    },
    sortingFn: numericNullsLast,
    sortDescFirst: true,
  },
  {
    id: "firstSeen",
    accessorKey: "firstSeen",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label="First Seen"
        helpText="When this link was first discovered by the crawler"
      />
    ),
    size: 110,
    minSize: 80,
    cell: ({ row }) => {
      if (row.depth > 0) {
        const child = row.original._backlink;
        return (
          <div className="whitespace-nowrap text-sm">
            <div>{formatCompactDate(child?.firstSeen)}</div>
            {child?.lastSeen ? (
              <div className="text-xs text-base-content/55">
                Last {formatCompactDate(child.lastSeen)}
              </div>
            ) : null}
          </div>
        );
      }

      return (
        <div className="whitespace-nowrap text-sm">
          {formatCompactDate(row.original.firstSeen)}
        </div>
      );
    },
    sortingFn: dateNullsLast,
    sortDescFirst: true,
  },
];
