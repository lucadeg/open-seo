/**
 * @file_id FILE-MVX-AUTO-EXPORT-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-EXPORT
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
 * @generated_at 2026-05-13T13:53:34.247Z
 * @updated_at 2026-05-13T13:53:34.248Z
 * @hash sha256:9d71fc1daf29ea2ed80b378de95ba51551f9cb63d481569b1ea43673f817de95
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.247Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { buildCsv, type CsvValue, downloadCsv } from "@/client/lib/csv";
import type {
  BacklinksOverviewData,
  BacklinksSearchState,
} from "./backlinksPageTypes";

type BacklinksFilteredData = {
  backlinks: BacklinksOverviewData["backlinks"];
  referringDomains: BacklinksOverviewData["referringDomains"];
  topPages: BacklinksOverviewData["topPages"];
};

export function buildBacklinksTabExport(args: {
  tab: BacklinksSearchState["tab"];
  rows: BacklinksFilteredData;
}): { headers: string[]; rows: CsvValue[][] } {
  const { tab, rows } = args;

  if (tab === "backlinks") {
    return {
      headers: [
        "Domain",
        "Source URL",
        "Target URL",
        "Anchor",
        "Type",
        "Dofollow",
        "Rel Attributes",
        "Domain Rank",
        "Source Page Rank",
        "Target Rank",
        "Spam Score",
        "First Seen",
        "Last Seen",
        "Lost",
        "Broken",
        "Links Count",
      ],
      rows: rows.backlinks.map((row) => [
        row.domainFrom,
        row.urlFrom,
        row.urlTo,
        row.anchor,
        row.itemType,
        row.isDofollow,
        row.relAttributes.join(", "),
        row.domainFromRank,
        row.pageFromRank,
        row.rank,
        row.spamScore,
        row.firstSeen,
        row.lastSeen,
        row.isLost,
        row.isBroken,
        row.linksCount,
      ]),
    };
  }

  if (tab === "domains") {
    return {
      headers: [
        "Domain",
        "Backlinks",
        "Referring Pages",
        "Rank",
        "Spam Score",
        "First Seen",
        "Broken Backlinks",
        "Broken Pages",
      ],
      rows: rows.referringDomains.map((row) => [
        row.domain,
        row.backlinks,
        row.referringPages,
        row.rank,
        row.spamScore,
        row.firstSeen,
        row.brokenBacklinks,
        row.brokenPages,
      ]),
    };
  }

  return {
    headers: [
      "Page",
      "Backlinks",
      "Referring Domains",
      "Rank",
      "Broken Backlinks",
    ],
    rows: rows.topPages.map((row) => [
      row.page,
      row.backlinks,
      row.referringDomains,
      row.rank,
      row.brokenBacklinks,
    ]),
  };
}

export function buildBacklinksTabCsvFile(args: {
  tab: BacklinksSearchState["tab"];
  target: string;
  rows: BacklinksFilteredData;
}) {
  const { headers, rows } = buildBacklinksTabExport({
    tab: args.tab,
    rows: args.rows,
  });
  const filenamePrefix =
    args.tab === "backlinks"
      ? "backlinks"
      : args.tab === "domains"
        ? "referring-domains"
        : "top-pages";

  return {
    filename: buildFilename(filenamePrefix, args.target),
    content: buildCsv(headers, rows),
  };
}

export function exportBacklinksTabCsv(args: {
  tab: BacklinksSearchState["tab"];
  target: string;
  rows: BacklinksFilteredData;
}) {
  const file = buildBacklinksTabCsvFile(args);
  downloadCsv(file.filename, file.content);
}

function buildFilename(tabPrefix: string, target: string) {
  const normalizedTarget = target
    .toLowerCase()
    .trim()
    .replace(/https?:\/\//g, "")
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `backlinks-${tabPrefix}${normalizedTarget ? `-${normalizedTarget}` : ""}.csv`;
}
