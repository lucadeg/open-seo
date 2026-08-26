/**
 * @file_id FILE-MVX-AUTO-PROMPTEXPLORERRESULTS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-PROMPTEXPLORERRESULTS
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
 * @generated_at 2026-05-13T13:53:33.652Z
 * @updated_at 2026-05-13T13:53:33.654Z
 * @hash sha256:129e750456815e71a7bc864a2b74e8fbc97ebb2b3bcbeaaf803cb1387893e4c8
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:33.652Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Globe,
  XCircle,
} from "lucide-react";
import { MarkdownAnswer } from "@/client/features/ai-search/components/MarkdownAnswer";
import {
  formatModelLabel,
  getModelAccent,
} from "@/client/features/ai-search/platformLabels";
import { formatUrlForDisplay } from "@/client/components/table/url";
import type {
  PromptExplorerModelResult,
  PromptExplorerResult,
} from "@/types/schemas/ai-search";

type Props = {
  result: PromptExplorerResult;
};

export function PromptExplorerResults({ result }: Props) {
  return (
    <div className="space-y-5">
      {result.results.map((modelResult) => (
        <ModelResultCard
          key={modelResult.model}
          modelResult={modelResult}
          highlightBrand={result.highlightBrand}
        />
      ))}
    </div>
  );
}

function ModelResultCard({
  modelResult,
  highlightBrand,
}: {
  modelResult: PromptExplorerModelResult;
  highlightBrand: string | null;
}) {
  const accent = getModelAccent(modelResult.model);

  if (modelResult.status === "error") {
    return (
      <article
        className={`overflow-hidden rounded-r-lg border border-base-300 border-l-4 ${accent.border} bg-base-100`}
      >
        <ModelHeader
          model={modelResult.model}
          modelName={null}
          tokens={null}
          webSearch={false}
          brandMentioned={null}
          highlightBrand={null}
          status="error"
        />
        <div className="flex items-start gap-2 px-5 py-4 text-sm text-error">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{modelResult.message}</span>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`overflow-hidden rounded-r-lg border border-base-300 border-l-4 ${accent.border} bg-base-100`}
    >
      <ModelHeader
        model={modelResult.model}
        modelName={modelResult.modelName}
        tokens={modelResult.outputTokens}
        webSearch={modelResult.webSearch}
        brandMentioned={modelResult.brandMentioned}
        highlightBrand={highlightBrand}
        status="success"
      />

      <div className="px-5 py-5">
        <MarkdownAnswer text={modelResult.text} />
      </div>

      {modelResult.citations.length > 0 ? (
        <div className="border-t border-base-200 bg-base-200/30 px-5 py-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-base-content/50">
            Cited sources ({modelResult.citations.length})
          </p>
          <ul className="space-y-1.5">
            {modelResult.citations.map((citation, index) => (
              <li
                key={`${citation.url}-${index}`}
                className="flex items-start gap-2 text-sm"
              >
                <span className="mt-1 size-1 shrink-0 rounded-full bg-base-content/30" />
                <a
                  href={citation.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`link inline-flex items-start gap-1 ${
                    citation.matchedBrand ? "link-primary font-medium" : ""
                  }`}
                >
                  <span className="break-all">
                    {citation.title || formatUrlForDisplay(citation.url)}
                  </span>
                  <ExternalLink className="mt-1 size-3 shrink-0" />
                </a>
                {citation.matchedBrand && highlightBrand ? (
                  <span className="badge badge-primary badge-xs">
                    {highlightBrand}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {modelResult.fanOutQueries.length > 0 ? (
        <div className="border-t border-base-200 px-5 py-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-base-content/50">
            Related queries the model considered
          </p>
          <div className="flex flex-wrap gap-1.5">
            {modelResult.fanOutQueries.map((query, index) => (
              <span
                key={`${query}-${index}`}
                className="rounded-full border border-base-300 px-2.5 py-0.5 text-xs text-base-content/70"
              >
                {query}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}

function ModelHeader({
  model,
  modelName,
  tokens,
  webSearch,
  brandMentioned,
  highlightBrand,
  status,
}: {
  model: PromptExplorerModelResult["model"];
  modelName: string | null;
  tokens: number | null;
  webSearch: boolean;
  brandMentioned: boolean | null;
  highlightBrand: string | null;
  status: "success" | "error";
}) {
  const accent = getModelAccent(model);
  return (
    <header className="flex flex-wrap items-center justify-between gap-2 border-b border-base-200 bg-base-200/40 px-5 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`size-2 rounded-full ${accent.dot}`} />
        <h3 className="text-sm font-semibold">{formatModelLabel(model)}</h3>
        {modelName ? (
          <code className="text-xs text-base-content/50">{modelName}</code>
        ) : null}
        {status === "error" ? (
          <span className="badge badge-error badge-sm">Error</span>
        ) : null}
        <BrandMentionBadge
          mentioned={brandMentioned}
          highlightBrand={highlightBrand}
        />
        {webSearch ? (
          <span className="inline-flex items-center gap-1 text-xs text-base-content/60">
            <Globe className="size-3" />
            web search
          </span>
        ) : null}
      </div>
      {tokens != null ? (
        <span className="text-xs tabular-nums text-base-content/50">
          {tokens.toLocaleString()} tokens
        </span>
      ) : null}
    </header>
  );
}

function BrandMentionBadge({
  mentioned,
  highlightBrand,
}: {
  mentioned: boolean | null;
  highlightBrand: string | null;
}) {
  if (mentioned == null || !highlightBrand) return null;
  if (mentioned) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
        <CheckCircle2 className="size-3" />
        {highlightBrand}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-base-200 px-2 py-0.5 text-xs text-base-content/60">
      <XCircle className="size-3" />
      no {highlightBrand}
    </span>
  );
}
