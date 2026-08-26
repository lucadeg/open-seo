/**
 * @file_id FILE-MVX-AUTO-USEKEYWORDRESEARCHDATA-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-USEKEYWORDRESEARCHDATA
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
 * @generated_at 2026-05-13T13:53:34.977Z
 * @updated_at 2026-05-13T13:53:34.979Z
 * @hash sha256:c1269a451a5ae2b1530e0b5919b4d81335ab5f5bbb7153f09fd2522c8f891d7b
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.977Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { useEffect, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStandardErrorMessage } from "@/client/lib/error-messages";
import { captureClientEvent } from "@/client/lib/posthog";
import { LOCATIONS, getLanguageCode } from "@/client/features/keywords/utils";
import { DEFAULT_LOCATION_CODE } from "@/client/features/keywords/locations";
import { researchKeywords } from "@/serverFunctions/keywords";
import type {
  KeywordMode,
  KeywordSource,
  ResultLimit,
} from "@/client/features/keywords/keywordResearchTypes";

type AddSearchFn = (
  keyword: string,
  locationCode: number,
  locationName: string,
) => void;

type KeywordResearchQueryInput = {
  projectId: string;
  keywordInput: string;
  locationCode: number;
  resultLimit: ResultLimit;
  mode: KeywordMode;
};

type KeywordResearchRequest = {
  projectId: string;
  keywords: string[];
  seedKeyword: string;
  locationCode: number;
  languageCode: string;
  resultLimit: ResultLimit;
  mode: KeywordMode;
};

const KEYWORD_RESEARCH_STALE_TIME_MS = 24 * 60 * 60 * 1000;

function parseSearchKeywords(value: string) {
  return value
    .split(/[\n,]/)
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

function buildKeywordResearchQueryKey(request: KeywordResearchRequest | null) {
  return request
    ? [
        "keywordResearch",
        request.projectId,
        request.keywords,
        request.locationCode,
        request.languageCode,
        request.resultLimit,
        request.mode,
      ]
    : ["keywordResearch", "idle"];
}

export function useKeywordResearchData(
  input: KeywordResearchQueryInput,
  addSearch: AddSearchFn,
) {
  const keywords = useMemo(
    () => parseSearchKeywords(input.keywordInput),
    [input.keywordInput],
  );
  const request = useMemo<KeywordResearchRequest | null>(() => {
    const seedKeyword = keywords[0] ?? "";
    if (!seedKeyword) return null;

    return {
      projectId: input.projectId,
      keywords,
      seedKeyword,
      locationCode: input.locationCode,
      languageCode: getLanguageCode(input.locationCode),
      resultLimit: input.resultLimit,
      mode: input.mode,
    };
  }, [
    input.locationCode,
    input.mode,
    input.projectId,
    input.resultLimit,
    keywords,
  ]);
  const queryKey = useMemo(
    () => buildKeywordResearchQueryKey(request),
    [request],
  );
  const queryKeyString = JSON.stringify(queryKey);

  const researchQuery = useQuery({
    queryKey,
    queryFn: () => {
      if (!request) {
        throw new Error("Keyword research query ran without request params");
      }

      return researchKeywords({
        data: {
          projectId: request.projectId,
          keywords: request.keywords,
          locationCode: request.locationCode,
          languageCode: request.languageCode,
          resultLimit: request.resultLimit,
          mode: request.mode,
        },
      });
    },
    enabled: request !== null,
    staleTime: KEYWORD_RESEARCH_STALE_TIME_MS,
    gcTime: KEYWORD_RESEARCH_STALE_TIME_MS,
    retry: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const handledSuccessKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (!request || !researchQuery.isSuccess || !researchQuery.data) return;
    if (handledSuccessKeyRef.current === queryKeyString) return;
    handledSuccessKeyRef.current = queryKeyString;

    captureClientEvent("keyword_research:search_complete", {
      location_code: request.locationCode,
      search_mode: request.mode,
      result_count: researchQuery.data.rows.length,
    });

    addSearch(
      request.seedKeyword,
      request.locationCode,
      LOCATIONS[request.locationCode] || "Unknown",
    );
  }, [
    addSearch,
    queryKeyString,
    request,
    researchQuery.data,
    researchQuery.isSuccess,
  ]);

  const hasSearched = request !== null;
  const rows = hasSearched ? (researchQuery.data?.rows ?? []) : [];
  const researchError =
    hasSearched && researchQuery.isError
      ? getStandardErrorMessage(researchQuery.error, "Research failed.")
      : null;

  return {
    rows,
    hasSearched,
    lastSearchError: hasSearched && researchQuery.isError,
    lastResultSource:
      researchQuery.data?.source ?? ("related" as KeywordSource),
    lastUsedFallback: researchQuery.data?.usedFallback ?? false,
    lastSearchKeyword: request?.seedKeyword ?? "",
    lastSearchLocationCode: request?.locationCode ?? DEFAULT_LOCATION_CODE,
    researchError,
    researchMutationError: researchQuery.error,
    searchedKeyword: request?.seedKeyword ?? "",
    isLoading: hasSearched && researchQuery.isPending,
    researchQuery,
    retryResearch: researchQuery.refetch,
  };
}
