/**
 * @file_id FILE-MVX-AUTO-KEYWORDCONTROLLERINTERNALS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-KEYWORDCONTROLLERINTERNALS
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
 * @generated_at 2026-05-13T13:53:35.227Z
 * @updated_at 2026-05-13T13:53:35.229Z
 * @hash sha256:730c0b0c2625f7ff568f220d426964d59612cd066617f88c320a142116e01e50
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.227Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { usePreferredKeywordLocation } from "@/client/features/keywords/hooks/usePreferredKeywordLocation";
import { saveKeywords } from "@/serverFunctions/keywords";
import type { SaveKeywordsInput } from "@/types/schemas/keywords";
import type { KeywordResearchRow } from "@/types/keywords";
import type { KeywordResearchControllerInput } from "./useKeywordResearchController";

export function useResolvedKeywordLocation(
  input: KeywordResearchControllerInput,
) {
  const { preferredLocationCode, setPreferredLocationCode } =
    usePreferredKeywordLocation();
  const locationCode =
    !input.hasExplicitLocationCode && input.keywordInput === ""
      ? preferredLocationCode
      : input.locationCode;

  return { locationCode, setPreferredLocationCode };
}

export function useKeywordUiState(initialShowFilters: boolean) {
  const [showFilters, setShowFilters] = useState(initialShowFilters);
  const [selectedKeyword, setSelectedKeyword] =
    useState<KeywordResearchRow | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [mobileTab, setMobileTab] = useState<"keywords" | "serp">("keywords");

  return {
    mobileTab,
    selectedKeyword,
    setMobileTab,
    setSelectedKeyword,
    setShowFilters,
    setShowSaveDialog,
    showFilters,
    showSaveDialog,
  };
}

export function useKeywordSearchParams() {
  const navigate = useNavigate({ from: "/p/$projectId/keywords" });

  return (updates: Record<string, string | number | boolean | undefined>) => {
    void navigate({
      search: (prev) => ({ ...prev, ...updates }),
      replace: true,
    });
  };
}

export function useKeywordSaveMutation(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveKeywordsInput) => saveKeywords({ data }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["savedKeywords", projectId],
      });
    },
  });
}
