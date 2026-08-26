/**
 * @file_id FILE-MVX-AUTO-BACKLINKSPAGE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-BACKLINKSPAGE
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
 * @generated_at 2026-05-13T13:53:33.992Z
 * @updated_at 2026-05-13T13:53:33.993Z
 * @hash sha256:1d666cea8a176f06a24e2a9055cc18eda1e807675f1f07fce18cf8c7d0962c35
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:33.992Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { BacklinksSearchCard } from "./BacklinksSearchCard";
import { BacklinksBody } from "./BacklinksPageContent";
import type { BacklinksPageProps } from "./backlinksPageTypes";
import {
  navigateToBacklinksSearch,
  useBacklinksPageData,
} from "./useBacklinksPageData";
import { useBacklinksFilters } from "./useBacklinksFilters";
import { useBacklinksSearchHistory } from "@/client/hooks/useBacklinksSearchHistory";

export function BacklinksPage({
  projectId,
  searchState,
  navigate,
}: BacklinksPageProps) {
  const filters = useBacklinksFilters();
  const {
    accessGate,
    activeTabErrorMessage,
    backlinksDisabledByError,
    overviewErrorMessage,
    overviewQuery,
    referringDomainsQuery,
    searchCardInitialValues,
    topPagesQuery,
  } = useBacklinksPageData({
    projectId,
    searchState,
  });

  const {
    history,
    isLoaded: historyLoaded,
    addSearch,
    removeHistoryItem,
  } = useBacklinksSearchHistory(projectId);

  return (
    <div className="px-4 py-4 pb-24 overflow-auto md:px-6 md:py-6 md:pb-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Backlinks</h1>
          <p className="text-sm text-base-content/70">
            Understand who links to a site, what changed recently, and which
            pages attract links.
          </p>
        </div>

        {!accessGate.isLoading &&
        accessGate.enabled &&
        !backlinksDisabledByError ? (
          <BacklinksSearchCard
            errorMessage={overviewErrorMessage}
            initialValues={searchCardInitialValues}
            isFetching={
              overviewQuery.isFetching ||
              referringDomainsQuery.isFetching ||
              topPagesQuery.isFetching
            }
            onSubmit={(values) => {
              navigateToBacklinksSearch(navigate, values);
              addSearch({ target: values.target, scope: values.scope });
            }}
          />
        ) : null}

        <BacklinksBody
          projectId={projectId}
          accessGate={accessGate}
          backlinksDisabledByError={backlinksDisabledByError}
          history={history}
          historyLoaded={historyLoaded}
          overviewData={overviewQuery.data}
          overviewError={overviewErrorMessage}
          overviewLoading={overviewQuery.isLoading}
          referringDomains={referringDomainsQuery.data}
          searchState={searchState}
          filters={filters}
          tabErrorMessage={activeTabErrorMessage}
          tabLoading={
            (searchState.tab === "domains" &&
              referringDomainsQuery.isLoading) ||
            (searchState.tab === "pages" && topPagesQuery.isLoading)
          }
          topPages={topPagesQuery.data}
          onRemoveHistoryItem={removeHistoryItem}
          onRetryOverview={() => void overviewQuery.refetch()}
        />
      </div>
    </div>
  );
}
