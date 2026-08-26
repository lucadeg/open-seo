/**
 * @file_id FILE-MVX-AUTO-DOMAINOVERVIEWPAGE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-DOMAINOVERVIEWPAGE
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
 * @generated_at 2026-05-13T13:53:34.706Z
 * @updated_at 2026-05-13T13:53:34.707Z
 * @hash sha256:4ec8b29d01de581058e894a7a3dc62bc1c4ac02a8bbf75e31f16ebf49df0eb3e
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.706Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { DomainOverviewLoadingState } from "@/client/features/domain/components/DomainOverviewLoadingState";
import { DomainHistorySection } from "@/client/features/domain/components/DomainHistorySection";
import { DomainResultsCard } from "@/client/features/domain/components/DomainResultsCard";
import { DomainSearchCard } from "@/client/features/domain/components/DomainSearchCard";
import { StatCard } from "@/client/features/domain/components/StatCard";
import { useDomainOverviewController } from "@/client/features/domain/useDomainOverviewController";
import {
  formatMetric,
  getDefaultSortOrder,
} from "@/client/features/domain/utils";
import type {
  DomainActiveTab,
  DomainFilterValues,
  DomainSortMode,
  SortOrder,
} from "@/client/features/domain/types";

type Props = {
  projectId: string;
  searchState: {
    domain: string;
    subdomains: boolean;
    sort: DomainSortMode;
    order?: SortOrder;
    tab: DomainActiveTab;
    search: string;
    locationCode: number;
    page: number;
    pageSize: number;
    appliedFilters: DomainFilterValues;
  };
  navigate: (args: {
    search: (prev: Record<string, unknown>) => Record<string, unknown>;
    replace: boolean;
  }) => void;
  onShowRecentSearches: () => void;
};

export function DomainOverviewPage({
  projectId,
  searchState,
  navigate,
  onShowRecentSearches,
}: Props) {
  const queryClient = useQueryClient();
  const state = useDomainOverviewController({
    projectId,
    queryClient,
    navigate,
    searchState,
  });

  return (
    <div className="px-4 py-4 md:px-6 md:py-6 pb-24 md:pb-8 overflow-auto">
      <div className="mx-auto max-w-7xl space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Domain Overview</h1>
          <p className="text-sm text-base-content/70">
            Analyze any domain&apos;s SEO profile: traffic, keywords, and
            backlinks.
          </p>
        </div>

        <DomainSearchCard
          controlsForm={state.controlsForm}
          isLoading={state.isLoading}
          onSubmit={state.handleSearchSubmit}
          onSortChange={(sort) =>
            state.applySort(sort, getDefaultSortOrder(sort))
          }
          onLocationChange={(locationCode) =>
            state.applyLocationChange(locationCode)
          }
        />

        {state.isLoading ? (
          <DomainOverviewLoadingState />
        ) : state.overview === null ? (
          <div className="space-y-4 pt-1">
            <DomainHistorySection
              history={state.history}
              historyLoaded={state.historyLoaded}
              onRemoveHistoryItem={state.removeHistoryItem}
              onSelectHistoryItem={state.handleHistorySelect}
            />
          </div>
        ) : (
          <>
            <div>
              <button
                type="button"
                className="btn btn-ghost btn-sm gap-2 px-0 text-base-content/70 hover:bg-transparent"
                onClick={onShowRecentSearches}
              >
                <ArrowLeft className="size-4" />
                Recent searches
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <StatCard
                label="Estimated Organic Traffic"
                value={formatMetric(
                  state.overview.organicTraffic,
                  state.overview.hasData,
                )}
              />
              <StatCard
                label="Organic Keywords"
                value={formatMetric(
                  state.overview.organicKeywords,
                  state.overview.hasData,
                )}
              />
            </div>

            {!state.overview.hasData ? (
              <div className="alert alert-info">
                <span>
                  Not enough data for this domain yet. Try another domain or
                  include subdomains.
                </span>
              </div>
            ) : null}

            <DomainResultsCard
              projectId={projectId}
              overview={state.overview}
              activeTab={searchState.tab}
              sortMode={searchState.sort}
              currentSortOrder={state.currentSortOrder}
              searchDraft={state.searchDraft}
              selectedKeywords={state.selectedKeywords}
              visibleKeywords={state.visibleKeywords}
              filteredKeywords={state.filteredKeywords}
              pagedPages={state.pagedPages}
              showFilters={state.showFilters}
              setShowFilters={state.setShowFilters}
              filtersForm={state.filtersForm}
              activeFilterCount={state.activeFilterCount}
              dirtyFilterCount={state.dirtyFilterCount}
              conditionCount={state.conditionCount}
              overLimit={state.overLimit}
              resetFilters={state.resetFilters}
              applyFilters={state.applyFilters}
              cancelFilterEdits={state.cancelFilterEdits}
              onSearchChange={state.setSearchDraft}
              onSaveKeywords={state.handleSaveKeywords}
              canSaveKeywords={state.canSaveKeywords}
              onSortClick={state.handleSortColumnClick}
              onToggleKeyword={state.toggleKeywordSelection}
              page={state.page}
              pageSize={state.pageSize}
              totalKeywordCount={state.totalKeywordCount}
              totalPagesCount={state.totalPagesCount}
              hasNextKeywordsPage={state.hasNextKeywordsPage}
              hasNextPagesPage={state.hasNextPagesPage}
              isKeywordsLoading={state.keywordsLoading}
              isPagesLoading={state.pagesLoading}
              onPageChange={state.goToPage}
              onPageSizeChange={state.setPageSize}
            />
          </>
        )}
      </div>
    </div>
  );
}
