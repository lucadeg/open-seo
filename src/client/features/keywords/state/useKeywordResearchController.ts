/**
 * @file_id FILE-MVX-AUTO-USEKEYWORDRESEARCHCONTROLLER-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-USEKEYWORDRESEARCHCONTROLLER
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
 * @generated_at 2026-05-13T13:53:35.286Z
 * @updated_at 2026-05-13T13:53:35.288Z
 * @hash sha256:337afe4c81abfafe3984f4c9b3974c0c8510f8100b0f8db6a778ee1dcc73839b
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.286Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { useCallback, useEffect, useRef, type FormEvent } from "react";
import { useKeywordControlsForm } from "@/client/features/keywords/hooks/useKeywordControlsForm";
import { useKeywordFiltering } from "@/client/features/keywords/hooks/useKeywordFiltering";
import { useLocalKeywordFilters } from "@/client/features/keywords/hooks/useLocalKeywordFilters";
import { useKeywordResearchData } from "@/client/features/keywords/hooks/useKeywordResearchData";
import { useKeywordSelection } from "@/client/features/keywords/hooks/useKeywordSelection";
import { useKeywordSerpAnalysis } from "@/client/features/keywords/hooks/useKeywordSerpAnalysis";
import { captureClientEvent } from "@/client/lib/posthog";
import { useSearchHistory } from "@/client/hooks/useSearchHistory";
import {
  type KeywordMode,
  type ResultLimit,
} from "@/client/features/keywords/keywordResearchTypes";
import { DEFAULT_LOCATION_CODE } from "@/client/features/keywords/locations";
import type { KeywordResearchRow } from "@/types/keywords";
import type { SortDir, SortField } from "@/client/features/keywords/components";
import {
  buildKeywordSearchKey,
  getNextSortParams,
  useSaveAndExportActions,
} from "./keywordControllerActions";
import {
  useKeywordSaveMutation,
  useKeywordSearchParams,
  useKeywordUiState,
  useResolvedKeywordLocation,
} from "./keywordControllerInternals";
import { useKeywordOverviewState } from "./useKeywordOverviewState";

export type KeywordResearchControllerInput = {
  projectId: string;
  keywordInput: string;
  locationCode: number;
  hasExplicitLocationCode: boolean;
  resultLimit: ResultLimit;
  keywordMode: KeywordMode;
  sortField: SortField;
  sortDir: SortDir;
};

export function useKeywordResearchController(
  input: KeywordResearchControllerInput,
) {
  const state = useKeywordControllerState(input);
  const controlsForm = state.controlsForm;
  const setSearchParams = state.setSearchParams;
  const retryResearch = state.retryResearch;

  const onSearch = useCallback(
    (overrides?: Partial<{ keyword: string; locationCode: number }>) => {
      if (overrides?.keyword !== undefined) {
        controlsForm.setFieldValue("keyword", overrides.keyword);
      }

      if (overrides?.locationCode !== undefined) {
        controlsForm.setFieldValue("locationCode", overrides.locationCode);
      }

      void controlsForm.handleSubmit();
    },
    [controlsForm],
  );

  const retrySearch = useCallback(() => {
    void retryResearch();
  }, [retryResearch]);

  const handleSearchSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      void controlsForm.handleSubmit();
    },
    [controlsForm],
  );

  const toggleSort = useCallback(
    (field: SortField) => {
      setSearchParams(getNextSortParams(input.sortField, input.sortDir, field));
    },
    [input.sortDir, input.sortField, setSearchParams],
  );

  const { handleSaveKeywords, confirmSave, exportCsv, sheetsExportRows } =
    useSaveAndExportActions({
      selectedRows: state.selectedRows,
      rows: state.rows,
      filteredRows: state.filteredRows,
      input,
      saveKeywordsMutate: state.saveMutation.mutate,
      setShowSaveDialog: state.setShowSaveDialog,
    });

  const handleToggleAllRows = () => {
    state.toggleAllRows(state.filteredRows.map((row) => row.keyword));
  };

  const handleRowClick = (row: KeywordResearchRow) => {
    captureClientEvent("keyword_research:serp_open");
    state.setSelectedKeyword(row);
    state.setSerpKeyword(row.keyword);
    state.setSerpPage(0);
  };

  return {
    activeFilterCount: state.activeFilterCount,
    activeSerpKeyword: state.activeSerpKeyword,
    confirmSave,
    controlsForm: state.controlsForm,
    exportCsv,
    sheetsExportRows,
    filteredRows: state.filteredRows,
    filtersForm: state.filtersForm,
    handleRowClick,
    handleSaveKeywords,
    handleSearchSubmit,
    hasSearched: state.hasSearched,
    history: state.history,
    historyLoaded: state.historyLoaded,
    isLoading: state.isLoading,
    lastResultSource: state.lastResultSource,
    lastSearchError: state.lastSearchError,
    lastSearchKeyword: state.lastSearchKeyword,
    lastSearchLocationCode: state.lastSearchLocationCode,
    lastUsedFallback: state.lastUsedFallback,
    mobileTab: state.mobileTab,
    onSearch,
    overviewKeyword: state.overviewKeyword,
    removeHistoryItem: state.removeHistoryItem,
    researchError: state.researchError,
    researchMutationError: state.researchMutationError,
    retrySearch,
    resetFilters: state.resetFilters,
    rows: state.rows,
    searchedKeyword: state.searchedKeyword,
    selectedRows: state.selectedRows,
    serpError: state.serpError,
    serpLoading: state.serpLoading,
    serpPage: state.serpPage,
    serpQuery: state.serpQuery,
    serpResults: state.serpResults,
    setMobileTab: state.setMobileTab,
    setSelectedRows: state.setSelectedRows,
    setSerpPage: state.setSerpPage,
    setShowFilters: state.setShowFilters,
    setShowSaveDialog: state.setShowSaveDialog,
    showApproximateMatchNotice: state.showApproximateMatchNotice,
    showFilters: state.showFilters,
    showSaveDialog: state.showSaveDialog,
    sortDir: input.sortDir,
    sortField: input.sortField,
    toggleAllRows: handleToggleAllRows,
    toggleRowSelection: state.toggleRowSelection,
    toggleSort,
    SERP_PAGE_SIZE: state.SERP_PAGE_SIZE,
  };
}

function useKeywordControllerState(input: KeywordResearchControllerInput) {
  const { locationCode, setPreferredLocationCode } =
    useResolvedKeywordLocation(input);
  const {
    filtersForm,
    values: filterValues,
    resetFilters,
  } = useLocalKeywordFilters();
  const uiState = useKeywordUiState(
    Object.values(filterValues).some((v) => v.trim() !== ""),
  );
  const {
    selectedRows,
    setSelectedRows,
    clearSelection,
    toggleRowSelection,
    toggleAllRows,
  } = useKeywordSelection();
  const {
    setSerpKeyword,
    serpPage,
    setSerpPage,
    SERP_PAGE_SIZE,
    serpQuery,
    serpResults,
    activeSerpKeyword,
    serpLoading,
    serpError,
  } = useKeywordSerpAnalysis(input.projectId, locationCode);

  const {
    history,
    isLoaded: historyLoaded,
    addSearch,
    removeHistoryItem,
  } = useSearchHistory(input.projectId);

  const {
    rows,
    hasSearched,
    lastSearchError,
    lastResultSource,
    lastUsedFallback,
    lastSearchKeyword,
    lastSearchLocationCode,
    researchError,
    researchMutationError,
    researchQuery,
    searchedKeyword,
    isLoading,
    retryResearch,
  } = useKeywordResearchData(
    {
      projectId: input.projectId,
      keywordInput: input.keywordInput,
      locationCode,
      resultLimit: input.resultLimit,
      mode: input.keywordMode,
    },
    addSearch,
  );
  const setSearchParams = useKeywordSearchParams();
  const saveMutation = useKeywordSaveMutation(input.projectId);

  const activeSearchKey = input.keywordInput.trim()
    ? buildKeywordSearchKey({
        keyword: input.keywordInput,
        locationCode,
        resultLimit: input.resultLimit,
        mode: input.keywordMode,
      })
    : null;

  const previousSearchKeyRef = useRef<string | null>(null);
  const handledSerpSearchKeyRef = useRef<string | null>(null);

  const clearActiveKeywordResult = useCallback(() => {
    clearSelection();
    uiState.setSelectedKeyword(null);
    setSerpKeyword(null);
    setSerpPage(0);
  }, [clearSelection, setSerpKeyword, setSerpPage, uiState]);

  const controlsForm = useKeywordControlsForm(
    {
      ...input,
      locationCode,
    },
    (value) => {
      setPreferredLocationCode(value.locationCode);
      setSearchParams({
        q: value.keyword,
        loc:
          input.hasExplicitLocationCode ||
          value.locationCode !== DEFAULT_LOCATION_CODE
            ? value.locationCode
            : undefined,
        kLimit: value.resultLimit === 150 ? undefined : value.resultLimit,
        mode: value.mode === "auto" ? undefined : value.mode,
      });
    },
  );

  // The URL is the source of truth for paid keyword research queries. This
  // effect only resets UI state around a new query key; TanStack Query owns the
  // actual fetch, cache, dedupe, and error lifecycle.
  useEffect(() => {
    if (activeSearchKey === previousSearchKeyRef.current) return;
    previousSearchKeyRef.current = activeSearchKey;
    handledSerpSearchKeyRef.current = null;

    if (!activeSearchKey) {
      clearActiveKeywordResult();
      return;
    }

    clearActiveKeywordResult();
  }, [activeSearchKey, clearActiveKeywordResult]);

  useEffect(() => {
    if (!activeSearchKey || !researchQuery.isSuccess) return;
    if (handledSerpSearchKeyRef.current === activeSearchKey) return;

    handledSerpSearchKeyRef.current = activeSearchKey;
    setSerpKeyword(rows.length > 0 ? searchedKeyword : null);
    setSerpPage(0);
  }, [
    activeSearchKey,
    researchQuery.isSuccess,
    rows.length,
    searchedKeyword,
    setSerpKeyword,
    setSerpPage,
  ]);

  const { filteredRows, activeFilterCount } = useKeywordFiltering({
    rows,
    filters: filterValues,
    sortField: input.sortField,
    sortDir: input.sortDir,
  });

  const { showApproximateMatchNotice, overviewKeyword } =
    useKeywordOverviewState({
      rows,
      searchedKeyword,
      selectedKeyword: uiState.selectedKeyword,
      hasSearched,
      isLoading,
      lastSearchError,
      keywordMode: input.keywordMode,
    });

  return {
    activeFilterCount,
    activeSerpKeyword,
    clearSelection,
    controlsForm,
    filteredRows,
    filtersForm,
    hasSearched,
    history,
    historyLoaded,
    isLoading,
    lastResultSource,
    lastSearchError,
    lastSearchKeyword,
    lastSearchLocationCode,
    lastUsedFallback,
    mobileTab: uiState.mobileTab,
    overviewKeyword,
    removeHistoryItem,
    researchError,
    researchMutationError,
    retryResearch,
    resetFilters,
    rows,
    searchedKeyword,
    selectedKeyword: uiState.selectedKeyword,
    selectedRows,
    setSelectedRows,
    saveMutation,
    setPreferredLocationCode,
    setSelectedKeyword: uiState.setSelectedKeyword,
    setSearchParams,
    setSerpKeyword,
    serpError,
    serpLoading,
    serpPage,
    serpQuery,
    serpResults,
    setMobileTab: uiState.setMobileTab,
    setSerpPage,
    setShowFilters: uiState.setShowFilters,
    setShowSaveDialog: uiState.setShowSaveDialog,
    showApproximateMatchNotice,
    showFilters: uiState.showFilters,
    showSaveDialog: uiState.showSaveDialog,
    toggleAllRows,
    toggleRowSelection,
    SERP_PAGE_SIZE,
  };
}
