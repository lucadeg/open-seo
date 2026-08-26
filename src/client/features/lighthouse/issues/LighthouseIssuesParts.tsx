/**
 * @file_id FILE-MVX-AUTO-LIGHTHOUSEISSUESPARTS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-LIGHTHOUSEISSUESPARTS
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
 * @generated_at 2026-05-13T13:53:35.326Z
 * @updated_at 2026-05-13T13:53:35.328Z
 * @hash sha256:caeec21cc6b51d512176449153cea8489252b91fb7299a5cfa5361f76dd5a20d
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.326Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import {
  ChevronDown,
  Copy,
  Download,
  FileWarning,
  Info,
  Sheet,
  TriangleAlert,
} from "lucide-react";
import type {
  CategoryTab,
  ExportPayload,
  LighthouseIssue,
  LighthouseMetrics,
  LighthouseScores,
} from "./types";
import { LighthouseIssueRow } from "./LighthouseIssueRow";
import { LighthouseIssuesSummary } from "./LighthouseIssuesSummary";
import { categoryLabel } from "./utils";
import { categoryTabs } from "./types";

export function LighthouseIssuesHeader({
  backLabel,
  onBack,
  scannedAt,
  finalUrl,
  scores,
  metrics,
  severityCounts,
}: {
  backLabel: string;
  onBack: () => void;
  scannedAt?: string;
  finalUrl?: string;
  scores?: LighthouseScores | null;
  metrics?: LighthouseMetrics | null;
  severityCounts: { critical: number; warning: number; info: number };
}) {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <button className="btn btn-ghost btn-sm px-2" onClick={onBack}>
          &larr; Back to {backLabel}
        </button>
        <span className="text-xs text-base-content/60">
          {scannedAt
            ? `Scanned ${new Date(scannedAt).toLocaleString()}`
            : "Reading latest issues..."}
        </span>
      </div>

      <div className="card bg-base-100 border border-base-300">
        <div className="card-body py-5 gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Lighthouse Issues</h1>
            <p className="text-sm text-base-content/70 break-all">
              {finalUrl ?? "Loading URL..."}
            </p>
          </div>
          <LighthouseIssuesSummary scores={scores} metrics={metrics} />
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="badge border border-error/30 bg-error/10 text-error/80 gap-1">
              <FileWarning className="size-3" />
              Critical {severityCounts.critical}
            </span>
            <span className="badge border border-warning/30 bg-warning/10 text-warning/80 gap-1">
              <TriangleAlert className="size-3" />
              Warning {severityCounts.warning}
            </span>
            <span className="badge border border-info/30 bg-info/10 text-info/80 gap-1">
              <Info className="size-3" />
              Info {severityCounts.info}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export function LighthouseIssuesToolbar({
  category,
  categoryCounts,
  selectedCategoryLabel,
  isBusy,
  visibleIssues,
  allIssues,
  onCategoryChange,
  onCopy,
  onExport,
  onExportCsv,
  onExportSheets,
}: {
  category: CategoryTab;
  categoryCounts: Record<CategoryTab, number>;
  selectedCategoryLabel: string;
  isBusy: boolean;
  visibleIssues: LighthouseIssue[];
  allIssues: LighthouseIssue[];
  onCategoryChange: (next: CategoryTab) => void;
  onCopy: (data: ExportPayload, toastMessage: string) => void;
  onExport: (data: ExportPayload) => void;
  onExportCsv: (issues: LighthouseIssue[], variant: "all" | "current") => void;
  onExportSheets: (
    issues: LighthouseIssue[],
    variant: "all" | "current",
  ) => void;
}) {
  const exportCurrentCategory: ExportPayload =
    category === "all" ? { mode: "issues" } : { mode: "category", category };

  const categoryLabelLower = selectedCategoryLabel.toLowerCase();

  return (
    <div className="sticky top-0 z-[2] -mx-2 px-2 py-2 bg-base-100/95 backdrop-blur-sm border-b border-base-300/60">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CategoryTabs
          category={category}
          categoryCounts={categoryCounts}
          onCategoryChange={onCategoryChange}
        />
        <ExportMenu
          allIssues={allIssues}
          categoryLabelLower={categoryLabelLower}
          exportCurrentCategory={exportCurrentCategory}
          isBusy={isBusy}
          onCopy={onCopy}
          onExport={onExport}
          onExportCsv={onExportCsv}
          onExportSheets={onExportSheets}
          visibleIssues={visibleIssues}
        />
      </div>
    </div>
  );
}

function CategoryTabs({
  category,
  categoryCounts,
  onCategoryChange,
}: {
  category: CategoryTab;
  categoryCounts: Record<CategoryTab, number>;
  onCategoryChange: (next: CategoryTab) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {categoryTabs.map((tab) => (
        <button
          key={tab}
          className={`pb-2 border-b-2 text-sm font-medium transition-colors ${
            category === tab
              ? "border-primary text-base-content"
              : "border-transparent text-base-content/60 hover:text-base-content"
          }`}
          onClick={() => onCategoryChange(tab)}
        >
          <span>{categoryLabel(tab)}</span>
          <span className="ml-1 text-xs opacity-70">
            ({categoryCounts[tab]})
          </span>
        </button>
      ))}
    </div>
  );
}

function ExportMenu({
  allIssues,
  categoryLabelLower,
  exportCurrentCategory,
  isBusy,
  onCopy,
  onExport,
  onExportCsv,
  onExportSheets,
  visibleIssues,
}: {
  allIssues: LighthouseIssue[];
  categoryLabelLower: string;
  exportCurrentCategory: ExportPayload;
  isBusy: boolean;
  onCopy: (data: ExportPayload, toastMessage: string) => void;
  onExport: (data: ExportPayload) => void;
  onExportCsv: (issues: LighthouseIssue[], variant: "all" | "current") => void;
  onExportSheets: (
    issues: LighthouseIssue[],
    variant: "all" | "current",
  ) => void;
  visibleIssues: LighthouseIssue[];
}) {
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-sm gap-1">
        <Download className="size-4" />
        Export
        <ChevronDown className="size-3 opacity-60" />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-10 menu p-2 shadow-lg bg-base-100 border border-base-300 rounded-box w-72"
      >
        <li className="menu-title">
          <span>Export to Sheets</span>
        </li>
        <li>
          <button
            disabled={!visibleIssues.length}
            onClick={() => onExportSheets(visibleIssues, "current")}
          >
            <Sheet className="size-4" />
            Open in Sheets — {categoryLabelLower}
          </button>
        </li>
        <li>
          <button
            disabled={!allIssues.length}
            onClick={() => onExportSheets(allIssues, "all")}
          >
            <Sheet className="size-4" />
            Open in Sheets — all actionable
          </button>
        </li>
        <li className="menu-title">
          <span>Copy</span>
        </li>
        <li>
          <button
            disabled={isBusy}
            onClick={() =>
              onCopy(
                exportCurrentCategory,
                `Copied ${categoryLabelLower} issues`,
              )
            }
          >
            <Copy className="size-4" />
            Copy {categoryLabelLower} issues
          </button>
        </li>
        <li>
          <button
            disabled={isBusy}
            onClick={() =>
              onCopy({ mode: "issues" }, "Copied all actionable issues")
            }
          >
            <Copy className="size-4" />
            Copy all actionable issues
          </button>
        </li>
        <li>
          <button
            disabled={isBusy}
            onClick={() =>
              onCopy({ mode: "full" }, "Copied saved Lighthouse payload")
            }
          >
            <Copy className="size-4" />
            Copy saved Lighthouse payload
          </button>
        </li>
        <li className="menu-title">
          <span>Download JSON</span>
        </li>
        <li>
          <button
            disabled={isBusy}
            onClick={() => onExport(exportCurrentCategory)}
          >
            Download {categoryLabelLower} issues
          </button>
        </li>
        <li>
          <button
            disabled={isBusy}
            onClick={() => onExport({ mode: "issues" })}
          >
            Download all actionable issues
          </button>
        </li>
        <li>
          <button disabled={isBusy} onClick={() => onExport({ mode: "full" })}>
            Download saved Lighthouse payload
          </button>
        </li>
        <li className="menu-title">
          <span>Download CSV</span>
        </li>
        <li>
          <button
            disabled={!visibleIssues.length}
            onClick={() => onExportCsv(visibleIssues, "current")}
          >
            Download {categoryLabelLower} issues
          </button>
        </li>
        <li>
          <button
            disabled={!allIssues.length}
            onClick={() => onExportCsv(allIssues, "all")}
          >
            Download all actionable issues
          </button>
        </li>
      </ul>
    </div>
  );
}

export function LighthouseIssueList({
  issues,
  isLoading,
  emptyMessage,
}: {
  issues: LighthouseIssue[];
  isLoading: boolean;
  emptyMessage?: string;
}) {
  if (isLoading) {
    return <p className="text-sm text-base-content/60">Loading issues...</p>;
  }
  if (!issues.length) {
    return (
      <p className="text-sm text-base-content/60">
        {emptyMessage ?? "No actionable issues for this category."}
      </p>
    );
  }
  return (
    <table className="table table-sm w-full table-fixed">
      <colgroup>
        <col className="w-8" />
        <col className="w-24" />
        <col />
        <col className="w-28 hidden sm:table-column" />
        <col className="w-28 hidden md:table-column" />
        <col className="w-14" />
      </colgroup>
      <thead>
        <tr className="text-xs text-base-content/50 uppercase tracking-wide border-b border-base-300">
          <th />
          <th className="font-medium">Severity</th>
          <th className="font-medium">Issue</th>
          <th className="font-medium hidden sm:table-cell">Category</th>
          <th className="font-medium hidden md:table-cell text-right">
            Impact
          </th>
          <th className="font-medium text-right">Score</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-base-300/60">
        {issues.map((issue, issueIndex) => (
          <LighthouseIssueRow
            key={`${issue.category}-${issue.auditKey}-${issueIndex}`}
            issue={issue}
          />
        ))}
      </tbody>
    </table>
  );
}
