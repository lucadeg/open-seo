/**
 * @file_id FILE-MVX-AUTO-USEBACKLINKSPAGEDATA-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-USEBACKLINKSPAGEDATA
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
 * @generated_at 2026-05-13T13:53:34.336Z
 * @updated_at 2026-05-13T13:53:34.338Z
 * @hash sha256:1afc808acf2ebd19f0239b60bd2899daa45f67446346cfcb738dcf7963a382f9
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.336Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type {
  BacklinksPageProps,
  BacklinksSearchState,
} from "./backlinksPageTypes";
import { useAccessGate } from "@/client/features/access-gate/useAccessGate";
import {
  getErrorCode,
  getStandardErrorMessage,
} from "@/client/lib/error-messages";
import {
  getBacklinksOverview,
  getBacklinksReferringDomains,
  getBacklinksTopPages,
} from "@/serverFunctions/backlinks";
import { getBacklinksAccessSetupStatus } from "@/serverFunctions/backlinksAccess";
import { getPersistedBacklinksSearchScope } from "./backlinksSearchScope";

type UseBacklinksPageDataArgs = {
  projectId: string;
  searchState: BacklinksSearchState;
};

function getBacklinksErrorMessage(
  error: unknown,
  fallback: string,
): string | null {
  if (!error) return null;
  if (getErrorCode(error) === "VALIDATION_ERROR") {
    return "Enter a valid domain or page URL.";
  }

  return getStandardErrorMessage(error, fallback);
}

export function useBacklinksPageData({
  projectId,
  searchState,
}: UseBacklinksPageDataArgs) {
  const accessGate = useAccessGate({
    queryKey: ["backlinksAccessStatus", projectId],
    queryFn: () => getBacklinksAccessSetupStatus({ data: { projectId } }),
    statusErrorFallback: "Could not load Backlinks setup status.",
  });
  const backlinksEnabled = accessGate.enabled;
  const retryAccessGate = accessGate.onRetry;
  const requestInput = buildBacklinksRequestInput(projectId, searchState);
  const searchCardInitialValues = useMemo(
    () => ({
      target: searchState.target,
      scope: searchState.scope,
    }),
    [searchState.scope, searchState.target],
  );

  const baseQueryKeyParts = [
    projectId,
    searchState.scope,
    searchState.target,
  ] as const;
  const overviewQuery = useQuery({
    queryKey: ["backlinksOverview", ...baseQueryKeyParts],
    enabled: backlinksEnabled && Boolean(searchState.target),
    queryFn: () => getBacklinksOverview({ data: requestInput }),
  });

  const referringDomainsQuery = useQuery({
    queryKey: ["backlinksReferringDomains", ...baseQueryKeyParts],
    enabled:
      backlinksEnabled &&
      Boolean(searchState.target) &&
      searchState.tab === "domains",
    queryFn: () => getBacklinksReferringDomains({ data: requestInput }),
  });

  const topPagesQuery = useQuery({
    queryKey: ["backlinksTopPages", ...baseQueryKeyParts],
    enabled:
      backlinksEnabled &&
      Boolean(searchState.target) &&
      searchState.tab === "pages",
    queryFn: () => getBacklinksTopPages({ data: requestInput }),
  });

  const overviewErrorMessage = getBacklinksErrorMessage(
    overviewQuery.error,
    "Could not load backlinks data.",
  );
  const backlinksDisabledByError =
    getErrorCode(overviewQuery.error) === "BACKLINKS_NOT_ENABLED";
  const activeTabError = getActiveTabError(
    searchState,
    referringDomainsQuery.error,
    topPagesQuery.error,
  );
  const activeTabErrorMessage = getBacklinksErrorMessage(
    activeTabError,
    "Could not load this tab.",
  );
  const backlinksDisabledByTabError =
    getErrorCode(activeTabError) === "BACKLINKS_NOT_ENABLED";

  useEffect(() => {
    if (
      (backlinksDisabledByError || backlinksDisabledByTabError) &&
      backlinksEnabled
    ) {
      retryAccessGate();
    }
  }, [
    backlinksDisabledByError,
    backlinksDisabledByTabError,
    backlinksEnabled,
    retryAccessGate,
  ]);

  return {
    accessGate,
    activeTabErrorMessage,
    backlinksDisabledByError,
    overviewErrorMessage,
    overviewQuery,
    referringDomainsQuery,
    searchCardInitialValues,
    topPagesQuery,
  };
}

export function navigateToBacklinksSearch(
  navigate: BacklinksPageProps["navigate"],
  values: Pick<BacklinksSearchState, "target" | "scope">,
) {
  navigate({
    search: (prev) => ({
      ...prev,
      target: values.target,
      scope: getPersistedBacklinksSearchScope(values.target, values.scope),
      tab: undefined,
    }),
    replace: true,
  });
}

function buildBacklinksRequestInput(
  projectId: string,
  searchState: BacklinksSearchState,
) {
  return {
    projectId,
    target: searchState.target,
    scope: searchState.scope,
    // Server-side spam filtering (hideSpam/spamThreshold) is available but
    // intentionally disabled. All filtering — including spam score — is applied
    // client-side so users get immediate feedback without re-fetching. This
    // trades slightly larger API responses for simpler code and flexibility.
    hideSpam: false,
  };
}

function getActiveTabError(
  searchState: BacklinksSearchState,
  referringDomainsError: unknown,
  topPagesError: unknown,
) {
  if (searchState.tab === "domains") {
    return referringDomainsError;
  }

  if (searchState.tab === "pages") {
    return topPagesError;
  }

  return null;
}
