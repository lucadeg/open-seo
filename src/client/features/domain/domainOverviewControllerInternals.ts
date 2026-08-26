/**
 * @file_id FILE-MVX-AUTO-DOMAINOVERVIEWCONTROLLERINTERNALS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-DOMAINOVERVIEWCONTROLLERINTERNALS
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
 * @generated_at 2026-05-13T13:53:34.701Z
 * @updated_at 2026-05-13T13:53:34.704Z
 * @hash sha256:b19f9c2d57d80709879deb907f3bbacc9c5c703e62d98aec154ac4f105f5329a
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.701Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { useEffect, useMemo, type Dispatch, type SetStateAction } from "react";
import type { UpdateMetaOptions } from "@tanstack/react-form";
import {
  getDefaultSortOrder,
  toSortMode,
  toSortOrder,
} from "@/client/features/domain/utils";
import type {
  DomainActiveTab,
  DomainFilterValues,
  DomainSortMode,
  KeywordRow,
  SortOrder,
} from "@/client/features/domain/types";
import { DEFAULT_LOCATION_CODE } from "@/client/features/keywords/locations";

export type SearchState = {
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

type DomainNavigate = (args: {
  search: (prev: Record<string, unknown>) => Record<string, unknown>;
  replace: boolean;
}) => void;

type DomainControlsFormAccess = {
  state: {
    values: {
      domain: string;
      subdomains: boolean;
      sort: DomainSortMode;
      locationCode: number;
    };
  };
  reset: (values: {
    domain: string;
    subdomains: boolean;
    sort: DomainSortMode;
    locationCode: number;
  }) => void;
  setFieldValue: (
    field: "domain" | "subdomains" | "sort" | "locationCode",
    updater: string | boolean | number,
    opts?: UpdateMetaOptions,
  ) => void;
};

type ControlsFormLike = DomainControlsFormAccess;

export function useOverviewDataState({
  pagedKeywords,
  setSelectedKeywords,
  activeFilterCount,
}: {
  pagedKeywords: KeywordRow[];
  setSelectedKeywords: Dispatch<SetStateAction<Set<string>>>;
  activeFilterCount: number;
}) {
  // Keywords are now fetched server-side with filters/sort/pagination applied,
  // so we render whatever the page query returned.
  const filteredKeywords = pagedKeywords;

  const visibleKeywords = useMemo(
    () => filteredKeywords.map((row) => row.keyword),
    [filteredKeywords],
  );

  useEffect(() => {
    const visibleSet = new Set(visibleKeywords);
    setSelectedKeywords((prev) => {
      const next = new Set(
        [...prev].filter((keyword) => visibleSet.has(keyword)),
      );
      if (next.size === prev.size) return prev;
      return next;
    });
  }, [setSelectedKeywords, visibleKeywords]);

  return {
    filteredKeywords,
    visibleKeywords,
    activeFilterCount,
    toggleKeywordSelection: (keyword: string) => {
      setSelectedKeywords((prev) => {
        const next = new Set(prev);
        if (next.has(keyword)) next.delete(keyword);
        else next.add(keyword);
        return next;
      });
    },
    toggleAllVisibleKeywords: () => {
      setSelectedKeywords((prev) => {
        if (
          visibleKeywords.length > 0 &&
          visibleKeywords.every((keyword) => prev.has(keyword))
        ) {
          return new Set();
        }

        return new Set(visibleKeywords);
      });
    },
  };
}

export function useSyncRouteState({
  controlsForm,
  searchState,
  navigate,
}: {
  controlsForm: ControlsFormLike;
  searchState: SearchState;
  navigate: DomainNavigate;
}) {
  useEffect(() => {
    controlsForm.reset({
      domain: searchState.domain,
      subdomains: searchState.subdomains,
      sort: searchState.sort,
      locationCode: searchState.locationCode,
    });
  }, [controlsForm, searchState]);

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search);
    const rawSort = toSortMode(raw.get("sort"));
    const rawOrder = toSortOrder(raw.get("order"));
    const rawLoc = raw.get("loc");
    const shouldNormalize =
      raw.get("domain") === "" ||
      raw.get("search") === "" ||
      raw.get("subdomains") === "true" ||
      raw.get("sort") === "rank" ||
      (rawOrder != null &&
        rawOrder === getDefaultSortOrder(rawSort ?? "rank")) ||
      raw.get("tab") === "keywords" ||
      rawLoc === String(DEFAULT_LOCATION_CODE);
    if (!shouldNormalize) return;

    navigate({
      search: (prev) => {
        const prevSort =
          typeof prev.sort === "string" ? toSortMode(prev.sort) : undefined;
        return {
          ...prev,
          domain: prev.domain === "" ? undefined : prev.domain,
          search: prev.search === "" ? undefined : prev.search,
          subdomains: prev.subdomains === true ? undefined : prev.subdomains,
          sort: prev.sort === "rank" ? undefined : prev.sort,
          order:
            prev.order != null &&
            prev.order === getDefaultSortOrder(prevSort ?? "rank")
              ? undefined
              : prev.order,
          tab: prev.tab === "keywords" ? undefined : prev.tab,
          loc:
            prev.loc != null && Number(prev.loc) === DEFAULT_LOCATION_CODE
              ? undefined
              : prev.loc,
        };
      },
      replace: true,
    });
  }, [navigate]);
}
