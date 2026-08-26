import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import {
  EMPTY_DOMAIN_FILTERS,
  type DomainFilterValues,
} from "@/client/features/domain/types";
import { MAX_DATAFORSEO_FILTER_CONDITIONS } from "@/types/schemas/domain";

const FILTER_KEYS: Array<keyof DomainFilterValues> = [
  "include",
  "exclude",
  "minTraffic",
  "maxTraffic",
  "minVol",
  "maxVol",
  "minCpc",
  "maxCpc",
  "minKd",
  "maxKd",
  "minRank",
  "maxRank",
];

function filtersToSearchParams(
  values: DomainFilterValues,
): Record<string, string | number | undefined> {
  const out: Record<string, string | number | undefined> = {};
  for (const key of FILTER_KEYS) {
    const trimmed = values[key].trim();
    if (trimmed === "") {
      out[key] = undefined;
      continue;
    }
    if (key === "include" || key === "exclude") {
      out[key] = trimmed;
    } else {
      const parsed = Number(trimmed);
      out[key] = Number.isFinite(parsed) ? parsed : undefined;
    }
  }
  return out;
}

/**
 * @file_id FILE-MVX-AUTO-USEDOMAINFILTERS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-USEDOMAINFILTERS
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
 * @generated_at 2026-05-13T13:53:34.717Z
 * @updated_at 2026-05-13T13:53:34.719Z
 * @hash sha256:889794f7e0398f8a4ec0a1c242e922f9e984df098de33b72ed16fa5389fdf75d
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.717Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */
function countConditions(
  values: DomainFilterValues,
  hasSearch: boolean,
): number {
  let n = 0;
  for (const term of values.include.split(/[,+]/)) if (term.trim()) n += 1;
  for (const term of values.exclude.split(/[,+]/)) if (term.trim()) n += 1;
  for (const k of [
    "minTraffic",
    "maxTraffic",
    "minVol",
    "maxVol",
    "minCpc",
    "maxCpc",
    "minKd",
    "maxKd",
    "minRank",
    "maxRank",
  ] as const) {
    if (values[k].trim() !== "") n += 1;
  }
  if (hasSearch) n += 2;
  return n;
}

export function useDomainFilters({
  appliedValues,
  appliedSearch,
  setSearchParams,
}: {
  appliedValues: DomainFilterValues;
  appliedSearch: string;
  setSearchParams: (
    updates: Record<string, string | number | boolean | undefined>,
  ) => void;
}) {
  const filtersForm = useForm({
    defaultValues: appliedValues,
  });

  const draftValues = useStore(filtersForm.store, (s) => s.values);
  const [searchDraft, setSearchDraft] = useState(appliedSearch);

  // Keep the draft in sync when applied values change from outside the panel
  // (URL navigation, history-select, "back to recent searches"). Without this,
  // the form keeps the previous draft and diverges from the URL.
  const appliedKey = useMemo(
    () => FILTER_KEYS.map((key) => appliedValues[key]).join("|"),
    [appliedValues],
  );
  useEffect(() => {
    filtersForm.reset({ ...appliedValues });
    // appliedKey covers content changes; filtersForm is a stable ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedKey]);

  useEffect(() => {
    setSearchDraft(appliedSearch);
  }, [appliedSearch]);

  const applyFilters = useCallback(() => {
    const trimmedSearch = searchDraft.trim();
    setSearchParams({
      ...filtersToSearchParams(draftValues),
      search: trimmedSearch === "" ? undefined : trimmedSearch,
      page: undefined,
    });
  }, [draftValues, searchDraft, setSearchParams]);

  const cancelEdits = useCallback(() => {
    filtersForm.reset({ ...appliedValues }, { keepDefaultValues: true });
    setSearchDraft(appliedSearch);
  }, [appliedValues, appliedSearch, filtersForm]);

  const resetFilters = useCallback(() => {
    filtersForm.reset({ ...EMPTY_DOMAIN_FILTERS }, { keepDefaultValues: true });
    setSearchDraft("");
    setSearchParams({
      ...filtersToSearchParams(EMPTY_DOMAIN_FILTERS),
      search: undefined,
      page: undefined,
    });
  }, [filtersForm, setSearchParams]);

  const activeAppliedCount = useMemo(
    () =>
      FILTER_KEYS.filter((key) => appliedValues[key].trim() !== "").length +
      (appliedSearch.trim() !== "" ? 1 : 0),
    [appliedValues, appliedSearch],
  );
  const dirtyCount = useMemo(() => {
    const filterDirt = FILTER_KEYS.filter(
      (key) => draftValues[key].trim() !== appliedValues[key].trim(),
    ).length;
    const searchDirt = searchDraft.trim() !== appliedSearch.trim() ? 1 : 0;
    return filterDirt + searchDirt;
  }, [draftValues, appliedValues, searchDraft, appliedSearch]);

  const conditionCount = countConditions(
    draftValues,
    searchDraft.trim() !== "",
  );
  const overLimit = conditionCount > MAX_DATAFORSEO_FILTER_CONDITIONS;

  return {
    filtersForm,
    draftValues,
    appliedValues,
    searchDraft,
    setSearchDraft,
    activeAppliedCount,
    dirtyCount,
    conditionCount,
    overLimit,
    applyFilters,
    cancelEdits,
    resetFilters,
  };
}
