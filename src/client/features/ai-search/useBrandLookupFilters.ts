/**
 * @file_id FILE-MVX-AUTO-USEBRANDLOOKUPFILTERS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-USEBRANDLOOKUPFILTERS
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
 * @generated_at 2026-05-13T13:53:33.726Z
 * @updated_at 2026-05-13T13:53:33.727Z
 * @hash sha256:976f22f27488e1fbefe287adf9552cc394c2ba4b998a12ceb273b2779a15da1d
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:33.726Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { useCallback, useEffect, useState } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import {
  EMPTY_QUERIES_FILTERS,
  EMPTY_TOP_PAGES_FILTERS,
  type QueriesFilterValues,
  type TopPagesFilterValues,
} from "./brandLookupFilterTypes";
import { countActiveFilters } from "./brandLookupFiltering";

const STORAGE_KEY_PREFIX = "brand-lookup-filters:";

type FilterValues = Record<string, string>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function loadFromStorage<T extends FilterValues>(tab: string, fallback: T): T {
  const fallbackClone = { ...fallback };

  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${tab}`);
    if (!raw) return fallbackClone;

    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return fallbackClone;

    const result = { ...fallbackClone };
    for (const key in fallback) {
      const value = parsed[key];
      if (typeof value === "string") {
        Object.assign(result, { [key]: value });
      }
    }

    return result;
  } catch {
    return fallbackClone;
  }
}

function saveToStorage(tab: string, values: FilterValues) {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${tab}`, JSON.stringify(values));
  } catch {
    // storage full - silently ignore
  }
}

function useTabFilters<T extends FilterValues>(tab: string, emptyValues: T) {
  const [defaultValues] = useState<T>(() =>
    loadFromStorage(tab, { ...emptyValues }),
  );
  const form = useForm({ defaultValues });
  const values = useStore(form.store, (state) => state.values);

  useEffect(() => {
    saveToStorage(tab, values);
  }, [tab, values]);

  const reset = useCallback(() => {
    form.reset({ ...emptyValues }, { keepDefaultValues: true });
  }, [emptyValues, form]);

  return {
    form,
    values,
    reset,
    activeFilterCount: countActiveFilters(values),
  };
}

export function useBrandLookupFilters() {
  const [showFilters, setShowFilters] = useState(false);

  const pages = useTabFilters<TopPagesFilterValues>(
    "pages",
    EMPTY_TOP_PAGES_FILTERS,
  );
  const queries = useTabFilters<QueriesFilterValues>(
    "queries",
    EMPTY_QUERIES_FILTERS,
  );

  return {
    pages,
    queries,
    showFilters,
    setShowFilters,
  };
}

export type BrandLookupFiltersState = ReturnType<typeof useBrandLookupFilters>;
