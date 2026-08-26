/**
 * @file_id FILE-MVX-AUTO-USEDOMAINKEYWORDSQUERY-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-USEDOMAINKEYWORDSQUERY
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
 * @generated_at 2026-05-13T13:53:34.722Z
 * @updated_at 2026-05-13T13:53:34.724Z
 * @hash sha256:978bd254adaa27c03e00a062356773174e13149f70ac6aee4620d5960224d326
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.722Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { useMemo } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getDomainKeywordsPage } from "@/serverFunctions/domain";
import type {
  DomainFilterValues,
  DomainSortMode,
  SortOrder,
} from "@/client/features/domain/types";

type DomainKeywordsQueryInput = {
  projectId: string;
  domain: string;
  includeSubdomains: boolean;
  locationCode: number;
  languageCode: string;
  page: number;
  pageSize: number;
  sortMode: DomainSortMode;
  sortOrder: SortOrder;
  appliedFilters: DomainFilterValues;
  searchTerm: string;
  enabled: boolean;
};

function toNumberOrUndefined(value: string): number | undefined {
  const trimmed = value.trim();
  if (trimmed === "") return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toFiltersPayload(
  filters: DomainFilterValues,
): Record<string, unknown> {
  return {
    include: filters.include || undefined,
    exclude: filters.exclude || undefined,
    minTraffic: toNumberOrUndefined(filters.minTraffic),
    maxTraffic: toNumberOrUndefined(filters.maxTraffic),
    minVol: toNumberOrUndefined(filters.minVol),
    maxVol: toNumberOrUndefined(filters.maxVol),
    minCpc: toNumberOrUndefined(filters.minCpc),
    maxCpc: toNumberOrUndefined(filters.maxCpc),
    minKd: toNumberOrUndefined(filters.minKd),
    maxKd: toNumberOrUndefined(filters.maxKd),
    minRank: toNumberOrUndefined(filters.minRank),
    maxRank: toNumberOrUndefined(filters.maxRank),
  };
}

export function useDomainKeywordsQuery(input: DomainKeywordsQueryInput) {
  const filtersPayload = useMemo(
    () => toFiltersPayload(input.appliedFilters),
    [input.appliedFilters],
  );
  const trimmedSearch = input.searchTerm.trim();

  return useQuery({
    enabled: input.enabled && Boolean(input.domain),
    queryKey: [
      "domain-keywords",
      input.projectId,
      input.domain,
      input.includeSubdomains,
      input.locationCode,
      input.languageCode,
      input.page,
      input.pageSize,
      input.sortMode,
      input.sortOrder,
      filtersPayload,
      trimmedSearch || undefined,
    ],
    queryFn: () =>
      getDomainKeywordsPage({
        data: {
          projectId: input.projectId,
          domain: input.domain,
          includeSubdomains: input.includeSubdomains,
          locationCode: input.locationCode,
          languageCode: input.languageCode,
          page: input.page,
          pageSize: input.pageSize,
          sortMode: input.sortMode,
          sortOrder: input.sortOrder,
          filters: filtersPayload,
          search: trimmedSearch || undefined,
        },
      }),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}
