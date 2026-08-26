import { useMemo } from "react";
import { toast } from "sonner";
import { buildCsv, type CsvValue, downloadCsv } from "@/client/lib/csv";
import { getStandardErrorMessage } from "@/client/lib/error-messages";
import { captureClientEvent } from "@/client/lib/posthog";
import { getLanguageCode } from "@/client/features/keywords/utils";
import type { KeywordResearchRow } from "@/types/keywords";
import type { SaveKeywordsInput } from "@/types/schemas/keywords";
import type { SortDir, SortField } from "@/client/features/keywords/components";
import type {
  KeywordMode,
  ResultLimit,
} from "@/client/features/keywords/keywordResearchTypes";
import type { KeywordResearchControllerInput } from "./useKeywordResearchController";

export const KEYWORD_RESEARCH_HEADERS = [
  "Keyword",
  "Volume",
  "CPC",
  "Competition",
  "Score",
  "Intent",
];

function keywordResearchRow(row: KeywordResearchRow): CsvValue[] {
  return [
    row.keyword,
    row.searchVolume ?? "",
    row.cpc ?? "",
    row.competition ?? "",
    row.keywordDifficulty ?? "",
    row.intent,
  ];
}

type SaveExportActionParams = {
  selectedRows: Set<string>;
  rows: KeywordResearchRow[];
  filteredRows: KeywordResearchRow[];
  input: KeywordResearchControllerInput;
  saveKeywordsMutate: (
    variables: SaveKeywordsInput,
    options: {
      onSuccess: () => void;
      onError: (error: unknown) => void;
    },
  ) => void;
  setShowSaveDialog: (show: boolean) => void;
};

export function parseKeywordInput(value: string) {
  return value
    .split(/[\n,]/)
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

/**
 * @file_id FILE-MVX-AUTO-KEYWORDCONTROLLERACTIONS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-KEYWORDCONTROLLERACTIONS
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
 * @generated_at 2026-05-13T13:53:35.215Z
 * @updated_at 2026-05-13T13:53:35.218Z
 * @hash sha256:28eacf655a2d96e635fd93ed00ab7415e9ffc0c07af0c635a395e6dcd07f0970
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.215Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */
export function buildKeywordSearchKey(params: {
  keyword: string;
  locationCode: number;
  resultLimit: ResultLimit;
  mode: KeywordMode;
}) {
  return [
    parseKeywordInput(params.keyword).join(""),
    params.locationCode,
    params.resultLimit,
    params.mode,
  ].join("|");
}

export function getNextSortParams(
  currentField: SortField,
  currentDirection: SortDir,
  targetField: SortField,
): { sort: SortField; order: SortDir } {
  if (currentField !== targetField) {
    return { sort: targetField, order: "desc" };
  }

  return {
    sort: currentField,
    order: currentDirection === "asc" ? "desc" : "asc",
  };
}

export function useSaveAndExportActions(params: SaveExportActionParams) {
  const {
    selectedRows,
    rows,
    filteredRows,
    input,
    saveKeywordsMutate,
    setShowSaveDialog,
  } = params;

  const handleSaveKeywords = () => {
    if (selectedRows.size === 0) {
      toast.error("Select at least one keyword first");
      return;
    }
    setShowSaveDialog(true);
  };

  const confirmSave = () => {
    const metrics = rows
      .filter((row) => selectedRows.has(row.keyword))
      .map((row) => ({
        keyword: row.keyword,
        searchVolume: row.searchVolume,
        cpc: row.cpc,
        competition: row.competition,
        keywordDifficulty: row.keywordDifficulty,
        intent: row.intent,
        monthlySearches: row.trend,
      }));

    saveKeywordsMutate(
      {
        projectId: input.projectId,
        keywords: [...selectedRows],
        locationCode: input.locationCode,
        languageCode: getLanguageCode(input.locationCode),
        metrics,
      },
      {
        onSuccess: () => {
          captureClientEvent("keyword:save", {
            source_feature: "keyword_research",
            keyword_count: selectedRows.size,
          });
          toast.success(`Saved ${selectedRows.size} keywords`);
          setShowSaveDialog(false);
        },
        onError: (error: unknown) => {
          toast.error(getStandardErrorMessage(error, "Save failed."));
        },
      },
    );
  };

  const sheetsExportRows: CsvValue[][] = useMemo(
    () =>
      (selectedRows.size > 0
        ? filteredRows.filter((row) => selectedRows.has(row.keyword))
        : filteredRows
      ).map(keywordResearchRow),
    [filteredRows, selectedRows],
  );

  const exportCsv = () => {
    if (sheetsExportRows.length === 0) {
      toast.error("No data to export");
      return;
    }
    // CSV file keeps cents-formatted CPC/competition for human readability.
    const csvRows = sheetsExportRows.map((row) =>
      row.map((cell, idx) =>
        (idx === 2 || idx === 3) && typeof cell === "number"
          ? cell.toFixed(2)
          : cell,
      ),
    );
    downloadCsv(
      "keyword-research.csv",
      buildCsv(KEYWORD_RESEARCH_HEADERS, csvRows),
    );
    captureClientEvent("data:export", {
      source_feature: "keyword_research",
      result_count: sheetsExportRows.length,
    });
  };

  return { handleSaveKeywords, confirmSave, exportCsv, sheetsExportRows };
}
