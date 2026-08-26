/**
 * @file_id FILE-MVX-AUTO-USELOCALKEYWORDFILTERS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-USELOCALKEYWORDFILTERS
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
 * @generated_at 2026-05-13T13:53:35.015Z
 * @updated_at 2026-05-13T13:53:35.016Z
 * @hash sha256:d2ed8721137fa9d49c9481693fec2597a35e7560f10589aced7cef0cc286e7c6
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.015Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { useCallback, useEffect } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { z } from "zod";
import {
  EMPTY_FILTERS,
  type KeywordFilterValues,
} from "@/client/features/keywords/keywordResearchTypes";

const STORAGE_KEY = "keyword-default-filters";

const filterValuesSchema = z.object({
  include: z.string(),
  exclude: z.string(),
  minVol: z.string(),
  maxVol: z.string(),
  minCpc: z.string(),
  maxCpc: z.string(),
  minKd: z.string(),
  maxKd: z.string(),
});

function loadFiltersFromStorage(): KeywordFilterValues {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_FILTERS;
    return filterValuesSchema.parse(JSON.parse(raw));
  } catch {
    return EMPTY_FILTERS;
  }
}

function saveFiltersToStorage(filters: KeywordFilterValues) {
  try {
    const hasAnyFilter = Object.values(filters).some((v) => v.trim() !== "");
    if (hasAnyFilter) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // storage full or unavailable
  }
}

export function useLocalKeywordFilters() {
  const filtersForm = useForm({
    defaultValues: loadFiltersFromStorage(),
  });

  const values = useStore(filtersForm.store, (s) => s.values);

  useEffect(() => {
    saveFiltersToStorage(values);
  }, [values]);

  const resetFilters = useCallback(() => {
    const keys: Array<keyof KeywordFilterValues> = [
      "include",
      "exclude",
      "minVol",
      "maxVol",
      "minCpc",
      "maxCpc",
      "minKd",
      "maxKd",
    ];

    for (const key of keys) {
      filtersForm.setFieldValue(key, "");
    }
  }, [filtersForm]);

  return {
    filtersForm,
    values,
    resetFilters,
  };
}
