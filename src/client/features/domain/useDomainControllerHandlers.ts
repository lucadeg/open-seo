/**
 * @file_id FILE-MVX-AUTO-USEDOMAINCONTROLLERHANDLERS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-USEDOMAINCONTROLLERHANDLERS
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
 * @generated_at 2026-05-13T13:53:34.825Z
 * @updated_at 2026-05-13T13:53:34.826Z
 * @hash sha256:6d4eeb5b33eaf2f0483b796c2e495089848e7ceb08af31abea1b6152a0562e59
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.825Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { useCallback, type FormEvent } from "react";
import {
  getDefaultSortOrder,
  toSortOrderSearchParam,
  toSortSearchParam,
} from "@/client/features/domain/utils";
import type {
  DomainControlsValues,
  DomainSortMode,
  SortOrder,
} from "@/client/features/domain/types";
import { saveSelectedKeywords } from "@/client/features/domain/domainActions";
import type { useSaveKeywordsMutation } from "@/client/features/domain/mutations";
import type {
  SearchState,
  useOverviewDataState,
} from "@/client/features/domain/domainOverviewControllerInternals";
import type { DomainSearchHistoryItem } from "@/client/hooks/useDomainSearchHistory";
import {
  DEFAULT_LOCATION_CODE,
  getLanguageCode,
  isSupportedLocationCode,
} from "@/client/features/keywords/locations";

type DomainControlsFormApi = {
  state: { values: DomainControlsValues };
  handleSubmit: () => Promise<unknown>;
  reset: (values: DomainControlsValues) => void;
  setFieldValue: (
    field: keyof DomainControlsValues,
    value: string | boolean | number,
  ) => void;
};

export function useDomainControllerHandlers({
  controlsForm,
  currentSortOrder,
  currentState,
  dataState,
  projectId,
  saveMutation,
  selectedKeywords,
  setSearchParams,
}: {
  controlsForm: DomainControlsFormApi;
  currentSortOrder: SortOrder;
  currentState: SearchState;
  dataState: ReturnType<typeof useOverviewDataState>;
  projectId: string;
  saveMutation: ReturnType<typeof useSaveKeywordsMutation>;
  selectedKeywords: Set<string>;
  setSearchParams: (
    updates: Record<string, string | number | boolean | undefined>,
  ) => void;
}) {
  const applySort = useCallback(
    (nextSort: DomainSortMode, nextOrder: SortOrder) => {
      controlsForm.setFieldValue("sort", nextSort);
      setSearchParams({
        sort: toSortSearchParam(nextSort),
        order: toSortOrderSearchParam(nextSort, nextOrder),
        page: undefined,
      });
    },
    [controlsForm, setSearchParams],
  );

  const applyLocationChange = useCallback(
    (nextLocationCode: number) => {
      if (!isSupportedLocationCode(nextLocationCode)) return;
      controlsForm.setFieldValue("locationCode", nextLocationCode);
      setSearchParams({
        loc:
          nextLocationCode === DEFAULT_LOCATION_CODE
            ? undefined
            : nextLocationCode,
      });
    },
    [controlsForm, setSearchParams],
  );

  const handleSortColumnClick = useCallback(
    (nextSort: DomainSortMode) => {
      const nextOrder =
        nextSort === currentState.sort
          ? currentSortOrder === "asc"
            ? "desc"
            : "asc"
          : getDefaultSortOrder(nextSort);
      applySort(nextSort, nextOrder);
    },
    [applySort, currentSortOrder, currentState.sort],
  );

  const handleSaveKeywords = () => {
    saveSelectedKeywords({
      selectedKeywords,
      filteredKeywords: dataState.filteredKeywords,
      save: saveMutation.mutate,
      projectId,
      locationCode: currentState.locationCode,
      languageCode: getLanguageCode(currentState.locationCode),
    });
  };

  const handleHistorySelect = (item: DomainSearchHistoryItem) => {
    const historyLocation =
      item.locationCode != null && isSupportedLocationCode(item.locationCode)
        ? item.locationCode
        : DEFAULT_LOCATION_CODE;
    setSearchParams({
      domain: item.domain,
      subdomains: item.subdomains ? undefined : false,
      sort: toSortSearchParam(item.sort),
      order: undefined,
      tab: item.tab === "keywords" ? undefined : item.tab,
      search: item.search?.trim() || undefined,
      loc:
        historyLocation === DEFAULT_LOCATION_CODE ? undefined : historyLocation,
      page: undefined,
      size: undefined,
    });
  };

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    void controlsForm.handleSubmit();
  };

  return {
    applySort,
    applyLocationChange,
    handleSortColumnClick,
    handleSaveKeywords,
    handleSearchSubmit,
    handleHistorySelect,
  };
}
