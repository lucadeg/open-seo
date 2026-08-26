/**
 * @file_id FILE-MVX-AUTO-DOMAIN-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-DOMAIN
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
 * @generated_at 2026-05-13T13:53:36.730Z
 * @updated_at 2026-05-13T13:53:36.732Z
 * @hash sha256:cd3f880f490417f937f8a1a1b14f2880b4e5306a674fa4870ccf50f0e3f33b4d
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:36.730Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DomainOverviewPage } from "@/client/features/domain/DomainOverviewPage";
import {
  resolveSortOrder,
  toSortMode,
  toSortOrder,
} from "@/client/features/domain/utils";
import {
  DEFAULT_LOCATION_CODE,
  isSupportedLocationCode,
} from "@/client/features/keywords/locations";
import {
  DEFAULT_DOMAIN_KEYWORDS_PAGE_SIZE,
  domainSearchSchema,
} from "@/types/schemas/domain";
import {
  EMPTY_DOMAIN_FILTERS,
  type DomainFilterValues,
} from "@/client/features/domain/types";

export const Route = createFileRoute("/_project/p/$projectId/domain")({
  validateSearch: domainSearchSchema,
  component: DomainOverviewRoute,
});

function numberToFilterString(value: number | undefined): string {
  if (value == null || !Number.isFinite(value)) return "";
  return String(value);
}

function DomainOverviewRoute() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const {
    domain = "",
    subdomains = true,
    sort = "rank",
    order,
    tab = "keywords",
    search: searchTerm = "",
    loc,
    page,
    size,
  } = search;

  const normalizedSort = toSortMode(sort) ?? "rank";
  const normalizedOrder = resolveSortOrder(
    normalizedSort,
    toSortOrder(order ?? null),
  );
  const normalizedLocationCode =
    loc != null && isSupportedLocationCode(loc) ? loc : DEFAULT_LOCATION_CODE;
  const normalizedPage = page != null && page > 0 ? page : 1;
  const normalizedPageSize = size ?? DEFAULT_DOMAIN_KEYWORDS_PAGE_SIZE;

  const appliedFilters: DomainFilterValues = {
    include: search.include ?? EMPTY_DOMAIN_FILTERS.include,
    exclude: search.exclude ?? EMPTY_DOMAIN_FILTERS.exclude,
    minTraffic: numberToFilterString(search.minTraffic),
    maxTraffic: numberToFilterString(search.maxTraffic),
    minVol: numberToFilterString(search.minVol),
    maxVol: numberToFilterString(search.maxVol),
    minCpc: numberToFilterString(search.minCpc),
    maxCpc: numberToFilterString(search.maxCpc),
    minKd: numberToFilterString(search.minKd),
    maxKd: numberToFilterString(search.maxKd),
    minRank: numberToFilterString(search.minRank),
    maxRank: numberToFilterString(search.maxRank),
  };

  return (
    <DomainOverviewPage
      projectId={projectId}
      onShowRecentSearches={() => {
        void navigate({
          search: () => ({}),
          replace: true,
        });
      }}
      navigate={navigate}
      searchState={{
        domain,
        subdomains,
        sort: normalizedSort,
        order: normalizedOrder,
        tab,
        search: searchTerm,
        locationCode: normalizedLocationCode,
        page: normalizedPage,
        pageSize: normalizedPageSize,
        appliedFilters,
      }}
    />
  );
}
