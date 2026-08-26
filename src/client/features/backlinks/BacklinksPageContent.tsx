/**
 * @file_id FILE-MVX-AUTO-BACKLINKSPAGECONTENT-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-BACKLINKSPAGECONTENT
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
 * @generated_at 2026-05-13T13:53:34.016Z
 * @updated_at 2026-05-13T13:53:34.017Z
 * @hash sha256:960aa661a3986e8da0b9745069352d1f85a413581e9da927273688608413ab72
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.016Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { useMemo } from "react";
import {
  BacklinksOverviewPanels,
  BacklinksResultsCard,
} from "./BacklinksPageSections";
import {
  BacklinksAccessLoadingState,
  BacklinksErrorState,
  BacklinksLoadingState,
  BacklinksSetupGate,
} from "./BacklinksPageStates";
import { BacklinksHistorySection } from "./BacklinksHistorySection";
import type { BacklinksSearchHistoryItem } from "@/client/hooks/useBacklinksSearchHistory";
import type {
  BacklinksOverviewData,
  BacklinksReferringDomainsData,
  BacklinksSearchState,
  BacklinksTopPagesData,
} from "./backlinksPageTypes";
import type { UseAccessGateResult } from "@/client/features/access-gate/useAccessGate";
import { buildSummaryStats } from "./backlinksPageUtils";
import {
  filterBacklinkRows,
  filterReferringDomainRows,
  filterTopPageRows,
} from "./backlinksFiltering";
import type { BacklinksFiltersState } from "./useBacklinksFilters";

type BacklinksBodyProps = {
  projectId: string;
  accessGate: UseAccessGateResult;
  backlinksDisabledByError: boolean;
  history: BacklinksSearchHistoryItem[];
  historyLoaded: boolean;
  overviewData: BacklinksOverviewData | undefined;
  overviewError: string | null;
  overviewLoading: boolean;
  referringDomains: BacklinksReferringDomainsData | undefined;
  searchState: BacklinksSearchState;
  filters: BacklinksFiltersState;
  tabErrorMessage: string | null;
  tabLoading: boolean;
  topPages: BacklinksTopPagesData | undefined;
  onRemoveHistoryItem: (timestamp: number) => void;
  onRetryOverview: () => void;
};

export function BacklinksBody({
  projectId,
  accessGate,
  backlinksDisabledByError,
  history,
  historyLoaded,
  overviewData,
  overviewError,
  overviewLoading,
  referringDomains,
  searchState,
  filters,
  tabErrorMessage,
  tabLoading,
  topPages,
  onRemoveHistoryItem,
  onRetryOverview,
}: BacklinksBodyProps) {
  const mergedData = useMemo(
    () => mergeTabData(overviewData, referringDomains, topPages),
    [overviewData, referringDomains, topPages],
  );
  const filteredData = useMemo(() => {
    if (!mergedData) {
      return { backlinks: [], referringDomains: [], topPages: [] };
    }
    return {
      backlinks: filterBacklinkRows(
        mergedData.backlinks,
        filters.backlinks.values,
      ),
      referringDomains: filterReferringDomainRows(
        mergedData.referringDomains,
        filters.domains.values,
      ),
      topPages: filterTopPageRows(mergedData.topPages, filters.pages.values),
    };
  }, [
    mergedData,
    filters.backlinks.values,
    filters.domains.values,
    filters.pages.values,
  ]);
  const summaryStats = useMemo(
    () => buildSummaryStats(mergedData),
    [mergedData],
  );

  if (accessGate.isLoading) {
    return <BacklinksAccessLoadingState />;
  }

  if (accessGate.statusErrorMessage) {
    return (
      <BacklinksErrorState
        errorMessage={accessGate.statusErrorMessage}
        onRetry={accessGate.onRetry}
      />
    );
  }

  if (!accessGate.enabled || backlinksDisabledByError) {
    return (
      <BacklinksSetupGate
        errorMessage={accessGate.errorMessage}
        isRefetching={accessGate.isRefetching}
        onRetry={accessGate.onRetry}
      />
    );
  }

  if (!searchState.target) {
    return (
      <BacklinksHistorySection
        projectId={projectId}
        history={history}
        historyLoaded={historyLoaded}
        onRemoveHistoryItem={onRemoveHistoryItem}
      />
    );
  }

  if (overviewLoading) {
    return <BacklinksLoadingState />;
  }

  if (!mergedData) {
    return (
      <BacklinksErrorState
        errorMessage={overviewError}
        onRetry={onRetryOverview}
      />
    );
  }

  return (
    <>
      <BacklinksOverviewPanels
        projectId={projectId}
        data={mergedData}
        summaryStats={summaryStats}
      />
      <BacklinksResultsCard
        projectId={projectId}
        activeTab={searchState.tab}
        filteredData={filteredData}
        filters={filters}
        isTabLoading={searchState.tab !== "backlinks" && tabLoading}
        tabErrorMessage={
          searchState.tab !== "backlinks" ? tabErrorMessage : null
        }
        exportTarget={mergedData.displayTarget || searchState.target}
      />
    </>
  );
}

function mergeTabData(
  data: BacklinksOverviewData | undefined,
  referringDomains: BacklinksReferringDomainsData | undefined,
  topPages: BacklinksTopPagesData | undefined,
) {
  if (!data) {
    return undefined;
  }

  return {
    ...data,
    referringDomains: referringDomains ?? data.referringDomains,
    topPages: topPages ?? data.topPages,
  };
}
