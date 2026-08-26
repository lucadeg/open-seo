/**
 * @file_id FILE-MVX-AUTO-BRANDLOOKUPPAGE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-BRANDLOOKUPPAGE
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
 * @generated_at 2026-05-13T13:53:33.412Z
 * @updated_at 2026-05-13T13:53:33.414Z
 * @hash sha256:3cf74eb0b8cf7e7035810e849584bbda5182a416b2b3e7a7e86939012ecd0949
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:33.412Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Quote,
  TrendingUp,
} from "lucide-react";
import { lookupBrand } from "@/serverFunctions/ai-search";
import {
  HostedPlanGate,
  type HostedPlanGateState,
} from "@/client/features/billing/HostedPlanGate";
import { getStandardErrorMessage } from "@/client/lib/error-messages";
import { BrandLookupResults } from "@/client/features/ai-search/components/BrandLookupResults";
import { BrandLookupSearchCard } from "@/client/features/ai-search/components/BrandLookupSearchCard";
import { BrandLookupHistorySection } from "@/client/features/ai-search/components/BrandLookupHistorySection";
import { AiSearchLoadingState } from "@/client/features/ai-search/components/AiSearchLoadingState";
import { AiSearchPaidPlanGate } from "@/client/features/ai-search/components/AiSearchPaidPlanGate";
import {
  AiSearchAccessLoadingState,
  AiSearchSetupGate,
} from "@/client/features/ai-search/components/AiSearchSetupGate";
import { useAiSearchAccess } from "@/client/features/ai-search/useAiSearchAccess";
import { useBrandLookupSearchHistory } from "@/client/hooks/useBrandLookupSearchHistory";
import { BRAND_LOOKUP_MAX_INPUT_LENGTH } from "@/types/schemas/ai-search";

type Props = {
  projectId: string;
  initialQuery: string;
  onQueryChange: (next: string) => void;
};

const BRAND_LOOKUP_BULLETS = [
  {
    icon: TrendingUp,
    title: "Track AI visibility",
    body: "Count how often ChatGPT and Google AI Overview cite your brand, and watch the trend month over month.",
  },
  {
    icon: Quote,
    title: "See the prompts",
    body: "View the actual user questions where LLMs reference your domain — the real demand driving AI traffic.",
  },
  {
    icon: BarChart3,
    title: "Map the competition",
    body: "Spot the pages LLMs cite alongside you so you know who's competing for attention in AI answers.",
  },
];

export function BrandLookupPage(props: Props) {
  return (
    <HostedPlanGate>
      {(planGate) => <BrandLookupPageInner {...props} planGate={planGate} />}
    </HostedPlanGate>
  );
}

function BrandLookupPageInner({
  projectId,
  initialQuery,
  onQueryChange,
  planGate,
}: Props & { planGate: HostedPlanGateState }) {
  const [query, setQuery] = useState(initialQuery);
  const [validationError, setValidationError] = useState<string | null>(null);

  const access = useAiSearchAccess(projectId);

  const trimmedInitialQuery = initialQuery.trim();
  const hasActiveQuery = trimmedInitialQuery.length > 0;

  const lookupQuery = useQuery({
    queryKey: ["brand-lookup", projectId, trimmedInitialQuery],
    queryFn: () =>
      lookupBrand({
        data: {
          projectId,
          query: trimmedInitialQuery,
          locationCode: 2840,
          languageCode: "en",
        },
      }),
    enabled: hasActiveQuery && !planGate.isFreePlan && access.enabled,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const {
    history,
    isLoaded: historyLoaded,
    addSearch,
    removeHistoryItem,
  } = useBrandLookupSearchHistory(projectId);

  // Dedup ref prevents repeat adds — `addSearch` identity is not stable
  // across renders, so we'd otherwise re-write the same item every render.
  const lastAddedQueryRef = useRef<string | null>(null);
  useEffect(() => {
    if (!hasActiveQuery || !lookupQuery.isSuccess) return;
    if (lastAddedQueryRef.current === trimmedInitialQuery) return;
    lastAddedQueryRef.current = trimmedInitialQuery;
    addSearch({ query: trimmedInitialQuery });
  }, [hasActiveQuery, lookupQuery.isSuccess, trimmedInitialQuery, addSearch]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length === 0) {
      setValidationError("Enter a brand name or domain");
      return;
    }
    if (trimmed.length > BRAND_LOOKUP_MAX_INPUT_LENGTH) {
      setValidationError(
        `Keep it under ${BRAND_LOOKUP_MAX_INPUT_LENGTH} characters`,
      );
      return;
    }
    setValidationError(null);
    onQueryChange(trimmed);
  };

  // The query input is reset whenever the URL `q` changes — including the
  // browser-back path and Cmd+click navigation. This keeps local form state
  // in sync with the URL source-of-truth.
  useEffect(() => {
    setQuery(initialQuery);
    setValidationError(null);
  }, [initialQuery]);

  const isLoading = hasActiveQuery && lookupQuery.isPending;
  const errorMessage =
    hasActiveQuery && lookupQuery.isError
      ? getStandardErrorMessage(lookupQuery.error)
      : null;
  const resultData = hasActiveQuery ? lookupQuery.data : undefined;

  if (planGate.isLoading) return null;

  return (
    <div className="px-4 py-4 pb-24 overflow-auto md:px-6 md:py-6 md:pb-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Brand Lookup</h1>
          <p className="text-sm text-base-content/70">
            See how AI search cites any brand name or domain.
          </p>
        </div>

        {access.isLoading ? (
          <AiSearchAccessLoadingState />
        ) : !access.enabled ? (
          <AiSearchSetupGate
            errorMessage={access.errorMessage ?? access.statusErrorMessage}
            isRefetching={access.isRefetching}
            onRetry={access.onRetry}
          />
        ) : planGate.isFreePlan ? (
          <AiSearchPaidPlanGate
            feature="Brand Lookup"
            description="See how ChatGPT and Google AI Overview cite any brand or domain — total mentions, the prompts driving them, and the pages cited alongside yours."
            bullets={BRAND_LOOKUP_BULLETS}
          />
        ) : (
          <>
            <BrandLookupSearchCard
              query={query}
              onQueryChange={(next) => {
                setQuery(next);
                if (validationError) setValidationError(null);
              }}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              validationError={validationError}
            />

            {errorMessage ? (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            ) : null}

            {isLoading ? (
              <AiSearchLoadingState />
            ) : resultData ? (
              <>
                <div>
                  <Link
                    from="/p/$projectId/brand-lookup"
                    to="/p/$projectId/brand-lookup"
                    params={{ projectId }}
                    search={{ q: undefined }}
                    replace
                    className="btn btn-ghost btn-sm gap-2 px-0 text-base-content/70 hover:bg-transparent"
                  >
                    <ArrowLeft className="size-4" />
                    Recent searches
                  </Link>
                </div>
                <BrandLookupResults result={resultData} />
              </>
            ) : !errorMessage ? (
              <BrandLookupHistorySection
                projectId={projectId}
                history={history}
                historyLoaded={historyLoaded}
                onRemoveHistoryItem={removeHistoryItem}
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
