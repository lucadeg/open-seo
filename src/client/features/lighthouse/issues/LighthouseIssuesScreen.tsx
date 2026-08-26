/**
 * @file_id FILE-MVX-AUTO-LIGHTHOUSEISSUESSCREEN-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-LIGHTHOUSEISSUESSCREEN
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
 * @generated_at 2026-05-13T13:53:35.342Z
 * @updated_at 2026-05-13T13:53:35.343Z
 * @hash sha256:9c256ef0c7783923f6f28751002ae1e92926fb97961d7ef6dc86e0344c235cde
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.342Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertCircle, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import {
  exportAuditLighthouseIssues,
  getAuditLighthouseIssues,
} from "@/serverFunctions/lighthouse";
import { exportTableToSheets } from "@/client/lib/exportToSheets";
import type { CategoryTab, ExportPayload, LighthouseIssue } from "./types";
import {
  categoryLabel,
  categorySlug,
  downloadTextFile,
  issuesToCsv,
  issuesToTable,
} from "./utils";
import {
  LighthouseIssueList,
  LighthouseIssuesHeader,
  LighthouseIssuesToolbar,
} from "./LighthouseIssuesParts";
import { categoryTabs } from "./types";

type LighthouseIssuesScreenProps = {
  projectId: string;
  resultId: string;
  category: CategoryTab;
  backLabel: string;
  onBack: () => void;
  onCategoryChange: (next: CategoryTab) => void;
};

export function LighthouseIssuesScreen(props: LighthouseIssuesScreenProps) {
  const { projectId, resultId, category, backLabel, onBack, onCategoryChange } =
    props;

  const issuesQuery = useQuery({
    queryKey: ["auditLighthouseIssues", projectId, resultId],
    queryFn: () =>
      getAuditLighthouseIssues({
        data: {
          projectId,
          resultId,
        },
      }),
  });

  const exportMutation = useMutation({
    mutationFn: (
      data: ExportPayload,
    ): Promise<{ filename: string; content: string }> =>
      exportAuditLighthouseIssues({
        data: {
          projectId,
          resultId,
          ...data,
        },
      }),
  });

  const {
    allIssues,
    categoryCounts,
    runCopy,
    runExport,
    runExportCsv,
    runExportSheets,
    selectedCategoryLabel,
    severityCounts,
    visibleIssues,
  } = useLighthouseIssuesActions({
    category,
    exportMutation,
    allIssues: issuesQuery.data?.issues ?? [],
  });

  const issuesErrorMessage =
    issuesQuery.error instanceof Error
      ? issuesQuery.error.message
      : "Failed to load Lighthouse issues.";
  const showsLegacyPayloadNotice =
    issuesQuery.data != null && !issuesQuery.data.hasIssueDetails;
  const emptyMessage = showsLegacyPayloadNotice
    ? "This audit was saved without issue-level Lighthouse details. Re-run the audit to populate this screen."
    : undefined;

  return (
    <div className="px-4 py-3 md:px-6 md:py-4 pb-24 md:pb-8 overflow-auto">
      <div className="mx-auto max-w-5xl space-y-4">
        <LighthouseIssuesHeader
          backLabel={backLabel}
          onBack={onBack}
          scannedAt={issuesQuery.data?.createdAt}
          finalUrl={issuesQuery.data?.finalUrl}
          scores={issuesQuery.data?.scores}
          metrics={issuesQuery.data?.metrics}
          severityCounts={severityCounts}
        />

        <div className="card bg-base-100 border border-base-300">
          <div className="card-body gap-4">
            {issuesQuery.isError ? (
              <div className="alert alert-error">
                <AlertCircle className="size-4" />
                <span>{issuesErrorMessage}</span>
              </div>
            ) : null}

            {showsLegacyPayloadNotice ? (
              <div className="alert alert-warning">
                <TriangleAlert className="size-4" />
                <span>
                  This Lighthouse run was stored before issue details were
                  preserved. Re-run the audit to see category counts and issue
                  cards.
                </span>
              </div>
            ) : null}

            <LighthouseIssuesToolbar
              category={category}
              categoryCounts={categoryCounts}
              selectedCategoryLabel={selectedCategoryLabel}
              isBusy={exportMutation.isPending}
              visibleIssues={visibleIssues}
              allIssues={allIssues}
              onCategoryChange={onCategoryChange}
              onCopy={(data, message) => {
                void runCopy(data, message);
              }}
              onExport={(data) => {
                void runExport(data);
              }}
              onExportCsv={runExportCsv}
              onExportSheets={runExportSheets}
            />
            <LighthouseIssueList
              issues={visibleIssues}
              isLoading={issuesQuery.isLoading}
              emptyMessage={emptyMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function useLighthouseIssuesActions({
  allIssues,
  category,
  exportMutation,
}: {
  allIssues: LighthouseIssue[];
  category: CategoryTab;
  exportMutation: {
    mutateAsync: (
      data: ExportPayload,
    ) => Promise<{ filename: string; content: string }>;
  };
}) {
  const visibleIssues =
    category === "all"
      ? allIssues
      : allIssues.filter((issue) => issue.category === category);
  const selectedCategoryLabel = categoryLabel(category);
  const categoryCounts = getCategoryCounts(allIssues);
  const severityCounts = getSeverityCounts(visibleIssues);

  const runExport = async (data: ExportPayload) => {
    try {
      const exported = await exportMutation.mutateAsync(data);
      downloadTextFile(exported.filename, exported.content, "application/json");
      toast.success("Download started");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to export payload";
      toast.error(message);
    }
  };

  const runExportCsv = (
    rows: LighthouseIssue[],
    variant: "all" | "current",
  ) => {
    const filename = `lighthouse-${variant}-${categorySlug(category)}-issues.csv`;
    downloadTextFile(filename, issuesToCsv(rows), "text/csv");
    toast.success("CSV download started");
  };

  const runExportSheets = (
    rows: LighthouseIssue[],
    variant: "all" | "current",
  ) => {
    const table = issuesToTable(rows);
    void exportTableToSheets({
      headers: table.headers,
      rows: table.rows,
      feature: `lighthouse_issues_${variant}`,
    });
  };

  const runCopy = async (data: ExportPayload, toastMessage: string) => {
    try {
      const exported = await exportMutation.mutateAsync(data);
      await navigator.clipboard.writeText(exported.content);
      toast.success(toastMessage);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to copy payload";
      toast.error(message);
    }
  };

  return {
    allIssues,
    categoryCounts,
    runCopy,
    runExport,
    runExportCsv,
    runExportSheets,
    selectedCategoryLabel,
    severityCounts,
    visibleIssues,
  };
}

function getCategoryCounts(
  allIssues: LighthouseIssue[],
): Record<CategoryTab, number> {
  return categoryTabs.reduce<Record<CategoryTab, number>>(
    (acc, tab) => {
      if (tab === "all") {
        acc[tab] = allIssues.length;
        return acc;
      }
      acc[tab] = allIssues.filter((issue) => issue.category === tab).length;
      return acc;
    },
    {
      all: allIssues.length,
      performance: 0,
      accessibility: 0,
      "best-practices": 0,
      seo: 0,
    },
  );
}

function getSeverityCounts(issues: LighthouseIssue[]) {
  return {
    critical: issues.filter((issue) => issue.severity === "critical").length,
    warning: issues.filter((issue) => issue.severity === "warning").length,
    info: issues.filter((issue) => issue.severity === "info").length,
  };
}
