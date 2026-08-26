import type { FormEvent } from "react";
import { Search } from "lucide-react";
import { isHostedClientAuthMode } from "@/lib/auth-mode";
import { applyBillingMarkupUsd } from "@/shared/billing";
import { BRAND_LOOKUP_MAX_INPUT_LENGTH } from "@/types/schemas/ai-search";

type Props = {
  query: string;
  onQueryChange: (next: string) => void;
  onSubmit: (event: FormEvent) => void;
  isLoading: boolean;
  validationError: string | null;
};

/**
 * @file_id FILE-MVX-AUTO-BRANDLOOKUPSEARCHCARD-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-BRANDLOOKUPSEARCHCARD
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
 * @generated_at 2026-05-13T13:53:33.553Z
 * @updated_at 2026-05-13T13:53:33.554Z
 * @hash sha256:8261377ea5f92151339bb3632a7fcfcfa488226ee41674d1974cbf6ffc6ef4ac
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:33.553Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */
const BRAND_LOOKUP_RAW_COST_USD = 0.65;

// Hosted customers are billed the marked-up USD; self-hosted users pay
// DataForSEO directly at the raw rate.
const BRAND_LOOKUP_DISPLAYED_COST_USD = isHostedClientAuthMode()
  ? applyBillingMarkupUsd(BRAND_LOOKUP_RAW_COST_USD)
  : BRAND_LOOKUP_RAW_COST_USD;

export function BrandLookupSearchCard({
  query,
  onQueryChange,
  onSubmit,
  isLoading,
  validationError,
}: Props) {
  return (
    <div className="card border border-base-300 bg-base-100">
      <div className="card-body gap-4">
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-3 lg:flex-row lg:items-center"
        >
          <label
            className={`input input-bordered flex flex-1 items-center gap-2 ${
              validationError ? "input-error" : ""
            }`}
          >
            <Search className="size-4 text-base-content/60" />
            <input
              type="text"
              placeholder="Enter a brand name or domain"
              value={query}
              maxLength={BRAND_LOOKUP_MAX_INPUT_LENGTH}
              onChange={(event) => onQueryChange(event.target.value)}
              aria-invalid={validationError ? true : undefined}
              aria-describedby={
                validationError ? "brand-lookup-input-error" : undefined
              }
              autoComplete="off"
              spellCheck={false}
              className="grow"
            />
          </label>

          <button
            type="submit"
            className="btn btn-primary px-6"
            disabled={isLoading}
          >
            {isLoading ? "Looking up..." : "Look up"}
          </button>
        </form>

        {validationError ? (
          <p id="brand-lookup-input-error" className="text-sm text-error">
            {validationError}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 text-xs text-base-content/60">
          <p className="tabular-nums">
            Est.{" "}
            <span className="font-medium text-base-content/80">
              ${BRAND_LOOKUP_DISPLAYED_COST_USD.toFixed(2)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
