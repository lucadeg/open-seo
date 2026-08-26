/**
 * @file_id FILE-MVX-AUTO-PROMPTEXPLORERPAGE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-PROMPTEXPLORERPAGE
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
 * @generated_at 2026-05-13T13:53:33.703Z
 * @updated_at 2026-05-13T13:53:33.704Z
 * @hash sha256:aab184f30ffbaaf95fe312df49e13a1276550063153e9285c4ed061e49fdff20
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:33.703Z
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
  Columns3,
  SearchCheck,
  Sparkles,
} from "lucide-react";
import { explorePrompt } from "@/serverFunctions/ai-search";
import {
  HostedPlanGate,
  type HostedPlanGateState,
} from "@/client/features/billing/HostedPlanGate";
import { getStandardErrorMessage } from "@/client/lib/error-messages";
import { PromptExplorerForm } from "@/client/features/ai-search/components/PromptExplorerForm";
import { PromptExplorerResults } from "@/client/features/ai-search/components/PromptExplorerResults";
import { PromptExplorerLoadingState } from "@/client/features/ai-search/components/PromptExplorerLoadingState";
import { PromptExplorerHistorySection } from "@/client/features/ai-search/components/PromptExplorerHistorySection";
import { AiSearchPaidPlanGate } from "@/client/features/ai-search/components/AiSearchPaidPlanGate";
import {
  AiSearchAccessLoadingState,
  AiSearchSetupGate,
} from "@/client/features/ai-search/components/AiSearchSetupGate";
import { useAiSearchAccess } from "@/client/features/ai-search/useAiSearchAccess";
import { usePromptExplorerSearchHistory } from "@/client/hooks/usePromptExplorerSearchHistory";
import {
  PROMPT_EXPLORER_MAX_PROMPT_LENGTH,
  type PromptExplorerModel,
  type WebSearchCountryCode,
} from "@/types/schemas/ai-search";

type PromptExplorerFormValues = {
  prompt: string;
  highlightBrand: string;
  models: PromptExplorerModel[];
  webSearch: boolean;
  webSearchCountryCode: WebSearchCountryCode;
};

type Props = {
  projectId: string;
  urlState: PromptExplorerFormValues;
  onSubmit: (values: PromptExplorerFormValues) => void;
};

const PROMPT_EXPLORER_BULLETS = [
  {
    icon: Columns3,
    title: "Four models side-by-side",
    body: "Run one prompt across ChatGPT, Claude, Gemini, and Perplexity and compare answers in a single view.",
  },
  {
    icon: SearchCheck,
    title: "See what the models cite",
    body: "Every answer lists the sources it drew from, so you can audit where each model gets its information.",
  },
  {
    icon: Sparkles,
    title: "Check brand mentions",
    body: "Highlight a brand to instantly see whether it shows up in the answer text or the cited sources.",
  },
];

export function PromptExplorerPage(props: Props) {
  return (
    <HostedPlanGate>
      {(planGate) => <PromptExplorerPageInner {...props} planGate={planGate} />}
    </HostedPlanGate>
  );
}

function PromptExplorerPageInner({
  projectId,
  urlState,
  onSubmit,
  planGate,
}: Props & { planGate: HostedPlanGateState }) {
  const [form, setForm] = useState<PromptExplorerFormValues>(urlState);
  const [validationError, setValidationError] = useState<string | null>(null);
  const access = useAiSearchAccess(projectId);

  const {
    history,
    isLoaded: historyLoaded,
    addSearch,
    removeHistoryItem,
  } = usePromptExplorerSearchHistory(projectId);

  const trimmedPrompt = urlState.prompt.trim();
  const hasActivePrompt = trimmedPrompt.length > 0;

  const exploreQuery = useQuery({
    queryKey: [
      "prompt-explorer",
      projectId,
      trimmedPrompt,
      urlState.models.toSorted().join(","),
      urlState.webSearch,
      urlState.webSearchCountryCode,
      urlState.highlightBrand.trim(),
    ],
    queryFn: () =>
      explorePrompt({
        data: {
          projectId,
          prompt: trimmedPrompt,
          models: urlState.models,
          highlightBrand: urlState.highlightBrand.trim() || undefined,
          webSearch: urlState.webSearch,
          webSearchCountryCode: urlState.webSearchCountryCode,
        },
      }),
    enabled:
      hasActivePrompt &&
      urlState.models.length > 0 &&
      !planGate.isFreePlan &&
      access.enabled,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // Sync form to URL state — covers initial mount, browser back/forward, and
  // cmd+click history navigation (in the originating tab nothing changes; in
  // a new tab the form mounts populated from the URL).
  useEffect(() => {
    setForm(urlState);
    setValidationError(null);
  }, [urlState]);

  // Persist successful searches to history. Run on isSuccess so failed
  // requests don't pollute recent searches. The dedup ref prevents repeat
  // adds when downstream renders create new urlState references.
  const lastAddedKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (!hasActivePrompt || !exploreQuery.isSuccess) return;
    const key = [
      trimmedPrompt,
      urlState.highlightBrand.trim(),
      urlState.models.toSorted().join(","),
      urlState.webSearch,
      urlState.webSearchCountryCode,
    ].join("|");
    if (lastAddedKeyRef.current === key) return;
    lastAddedKeyRef.current = key;
    addSearch({
      prompt: trimmedPrompt,
      highlightBrand: urlState.highlightBrand.trim(),
      models: urlState.models,
      webSearch: urlState.webSearch,
      webSearchCountryCode: urlState.webSearchCountryCode,
    });
  }, [
    hasActivePrompt,
    exploreQuery.isSuccess,
    trimmedPrompt,
    urlState.highlightBrand,
    urlState.models,
    urlState.webSearch,
    urlState.webSearchCountryCode,
    addSearch,
  ]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = form.prompt.trim();
    if (trimmed.length === 0) {
      setValidationError("Enter a prompt");
      return;
    }
    if (trimmed.length > PROMPT_EXPLORER_MAX_PROMPT_LENGTH) {
      setValidationError(
        `Keep prompts under ${PROMPT_EXPLORER_MAX_PROMPT_LENGTH} characters`,
      );
      return;
    }
    if (form.models.length === 0) {
      setValidationError("Select at least one model");
      return;
    }
    setValidationError(null);
    onSubmit({
      ...form,
      prompt: trimmed,
      highlightBrand: form.highlightBrand.trim(),
    });
  };

  const errorMessage = exploreQuery.isError
    ? getStandardErrorMessage(exploreQuery.error)
    : null;
  const isLoading = hasActivePrompt && exploreQuery.isPending;
  const resultData = hasActivePrompt ? exploreQuery.data : undefined;

  const updateForm = <K extends keyof PromptExplorerFormValues>(
    key: K,
    value: PromptExplorerFormValues[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (validationError) setValidationError(null);
  };

  if (planGate.isLoading) return null;

  return (
    <div className="px-4 py-4 pb-24 overflow-auto md:px-6 md:py-6 md:pb-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Prompt Explorer</h1>
          <p className="text-sm text-base-content/70">
            Ask any prompt across ChatGPT, Claude, Gemini, and Perplexity
            side-by-side.
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
            feature="Prompt Explorer"
            description="Ask one prompt across ChatGPT, Claude, Gemini, and Perplexity at the same time and compare their answers — including which sources each model cites."
            bullets={PROMPT_EXPLORER_BULLETS}
          />
        ) : (
          <>
            <PromptExplorerForm
              form={form}
              onPromptChange={(value) => updateForm("prompt", value)}
              onHighlightBrandChange={(value) =>
                updateForm("highlightBrand", value)
              }
              onModelsChange={(value) => updateForm("models", value)}
              onWebSearchChange={(value) => updateForm("webSearch", value)}
              onCountryChange={(value) =>
                updateForm("webSearchCountryCode", value)
              }
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
              <PromptExplorerLoadingState modelCount={form.models.length} />
            ) : resultData ? (
              <>
                <div>
                  <Link
                    from="/p/$projectId/prompt-explorer"
                    to="/p/$projectId/prompt-explorer"
                    params={{ projectId }}
                    search={{}}
                    replace
                    className="btn btn-ghost btn-sm gap-2 px-0 text-base-content/70 hover:bg-transparent"
                  >
                    <ArrowLeft className="size-4" />
                    Recent searches
                  </Link>
                </div>
                <PromptExplorerResults result={resultData} />
              </>
            ) : !errorMessage ? (
              <PromptExplorerHistorySection
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
