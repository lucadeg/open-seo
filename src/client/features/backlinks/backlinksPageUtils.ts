/**
 * @file_id FILE-MVX-AUTO-BACKLINKSPAGEUTILS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-BACKLINKSPAGEUTILS
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
 * @generated_at 2026-05-13T13:53:34.139Z
 * @updated_at 2026-05-13T13:53:34.141Z
 * @hash sha256:089c066e2445c4609c084c34c53f6703501d5d4ae71bffe907fe320d8aed5a72
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.139Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import type { BacklinksTab } from "@/types/schemas/backlinks";
import type {
  BacklinksOverviewData,
  BacklinksRow,
  GroupedBacklinkDomain,
} from "./backlinksPageTypes";

export const TAB_DESCRIPTIONS: Record<BacklinksTab, string> = {
  backlinks:
    "See the individual links pointing to your target, including source page, anchor text, and link quality signals.",
  domains:
    "View the unique domains linking to your target, grouped at the site level instead of by individual link.",
  pages:
    "See which pages on the target site attract the most backlinks and referring domains.",
};

export function buildSummaryStats(data: BacklinksOverviewData | undefined) {
  if (!data) return [];

  return [
    {
      label: "Backlinks",
      value: formatNumber(data.summary.backlinks),
      description: "Total links pointing to this site or page.",
    },
    {
      label: "Referring Domains",
      value: formatNumber(data.summary.referringDomains),
      description: "Unique domains linking to this site or page.",
    },
    {
      label: "Referring Pages",
      value: formatNumber(data.summary.referringPages),
      description: "Unique pages linking to this site or page.",
    },
    {
      label: "Rank",
      value: formatNumber(data.summary.rank),
      description: "DataForSEO's 0-100 authority score.",
    },
    {
      label: "Backlink Spam Score",
      value: formatDecimal(data.summary.backlinksSpamScore),
      description: "Estimated spam risk of links pointing here.",
    },
    {
      label: "Broken Backlinks",
      value: formatNumber(data.summary.brokenBacklinks),
      description: "Links pointing to broken pages here.",
    },
    {
      label: "Broken Pages",
      value: formatNumber(data.summary.brokenPages),
      description: "Broken pages here that still have backlinks.",
    },
    {
      label: "Target Spam Score",
      value: formatDecimal(data.summary.targetSpamScore),
      description: "Estimated spam risk of this site or page.",
    },
  ];
}

export function formatNumber(value: number | null | undefined) {
  if (value == null) return "-";
  return new Intl.NumberFormat().format(Math.round(value));
}

export function formatDecimal(value: number | null | undefined) {
  if (value == null) return "-";
  return value.toFixed(value >= 100 ? 0 : 1);
}

export function formatTooltipValue(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "number") return formatNumber(value);
  if (typeof value === "string") return value;
  return "-";
}

export function formatCompactDate(value: string | null | undefined) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatFullDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatMonthLabel(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    month: "short",
    year: "2-digit",
  });
}

export function formatRelativeTimestamp(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "recently";
  return parsed.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function groupBacklinksByDomain(
  rows: BacklinksRow[],
): GroupedBacklinkDomain[] {
  const groups = new Map<string, BacklinksRow[]>();

  for (const row of rows) {
    const key = row.domainFrom?.replace(/^www\./, "") ?? "unknown";
    const existing = groups.get(key);
    if (existing) {
      existing.push(row);
    } else {
      groups.set(key, [row]);
    }
  }

  return Array.from(groups.entries()).map(([domain, children]) => ({
    domain,
    domainAuthority: maxNullable(children.map((r) => r.domainFromRank)),
    spamScore: maxNullable(children.map((r) => r.spamScore)),
    firstSeen: minDateString(children.map((r) => r.firstSeen)),
    backlinkCount: children.reduce(
      (total, child) => total + getBacklinkCount(child),
      0,
    ),
    targetCount: new Set(children.map((r) => r.urlTo).filter(Boolean)).size,
    lostCount: children.filter((r) => r.isLost).length,
    brokenCount: children.filter((r) => r.isBroken).length,
    nofollowCount: children.filter((r) => r.isDofollow === false).length,
    subRows: children.map((child) => ({
      domain: child.domainFrom?.replace(/^www\./, "") ?? "unknown",
      domainAuthority: child.domainFromRank,
      spamScore: child.spamScore,
      firstSeen: child.firstSeen,
      backlinkCount: 1,
      targetCount: 1,
      lostCount: child.isLost ? 1 : 0,
      brokenCount: child.isBroken ? 1 : 0,
      nofollowCount: child.isDofollow === false ? 1 : 0,
      subRows: [],
      _backlink: child,
    })),
  }));
}

function getBacklinkCount(row: BacklinksRow) {
  return row.linksCount != null && row.linksCount > 0 ? row.linksCount : 1;
}

function maxNullable(values: (number | null)[]): number | null {
  let result: number | null = null;
  for (const v of values) {
    if (v != null && (result == null || v > result)) result = v;
  }
  return result;
}

function minDateString(values: (string | null)[]): string | null {
  let result: string | null = null;
  for (const v of values) {
    if (v && (result == null || v < result)) result = v;
  }
  return result;
}

export function extractUrlPath(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return url;
  }
}

export function truncateMiddle(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  const sideLength = Math.floor((maxLength - 1) / 2);
  return `${value.slice(0, sideLength)}...${value.slice(-sideLength)}`;
}
