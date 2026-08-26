/**
 * @file_id FILE-MVX-AUTO-KEYWORDRESEARCHSEARCHBAR-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-KEYWORDRESEARCHSEARCHBAR
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
 * @generated_at 2026-05-13T13:53:35.190Z
 * @updated_at 2026-05-13T13:53:35.192Z
 * @hash sha256:f297c934fbe42fb2c70066214f4bc54aabe0ed0c7b90d2bb9cff4a7af663619e
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.190Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { Search } from "lucide-react";
import { getFieldError } from "@/client/lib/forms";
import {
  isResultLimit,
  normalizeKeywordMode,
} from "@/client/features/keywords/keywordSearchParams";
import { RESULT_LIMITS } from "@/client/features/keywords/keywordResearchTypes";
import { LOCATION_OPTIONS } from "@/client/features/keywords/locations";
import type { KeywordResearchControllerState } from "./types";

type Props = {
  controller: KeywordResearchControllerState;
};

export function KeywordResearchSearchBar({ controller }: Props) {
  const { controlsForm, handleSearchSubmit, isLoading } = controller;

  return (
    <div className="card border border-base-300 bg-base-100">
      <div className="card-body gap-2">
        <form
          className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:gap-2"
          onSubmit={handleSearchSubmit}
        >
          <controlsForm.Field name="keyword">
            {(field) => {
              const keywordError = getFieldError(field.state.meta.errors);

              return (
                <label
                  className={`input input-bordered flex items-center gap-2 w-full lg:flex-1 lg:min-w-0 lg:max-w-md ${keywordError ? "input-error" : ""}`}
                >
                  <Search className="size-4 shrink-0 text-base-content/60" />
                  <input
                    className="grow min-w-0"
                    placeholder="Enter keyword"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </label>
              );
            }}
          </controlsForm.Field>

          <div className="grid grid-cols-2 gap-2 lg:contents">
            <controlsForm.Field name="locationCode">
              {(field) => (
                <select
                  className="select select-bordered w-full lg:w-auto lg:shrink-0"
                  value={field.state.value}
                  onChange={(event) =>
                    field.handleChange(Number(event.target.value))
                  }
                >
                  {LOCATION_OPTIONS.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </controlsForm.Field>

            <controlsForm.Field name="resultLimit">
              {(field) => (
                <select
                  className="select select-bordered w-full lg:w-auto lg:shrink-0"
                  value={field.state.value}
                  onChange={(event) => {
                    const next = Number(event.target.value);
                    field.handleChange(isResultLimit(next) ? next : 150);
                  }}
                >
                  {RESULT_LIMITS.map((limit) => (
                    <option key={limit} value={limit}>
                      {limit} results
                    </option>
                  ))}
                </select>
              )}
            </controlsForm.Field>

            <controlsForm.Field name="mode">
              {(field) => (
                <select
                  className="select select-bordered w-full lg:w-auto lg:shrink-0"
                  value={field.state.value}
                  onChange={(event) =>
                    field.handleChange(normalizeKeywordMode(event.target.value))
                  }
                >
                  <option value="auto">Auto</option>
                  <option value="related">Related keywords</option>
                  <option value="suggestions">Suggestions</option>
                  <option value="ideas">Ideas</option>
                </select>
              )}
            </controlsForm.Field>

            <button
              type="submit"
              className="btn btn-primary w-full px-6 font-semibold lg:w-auto lg:shrink-0"
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>
        <controlsForm.Field name="keyword">
          {(field) => {
            const keywordError = getFieldError(field.state.meta.errors);

            return keywordError ? (
              <p className="text-sm text-error">{keywordError}</p>
            ) : null;
          }}
        </controlsForm.Field>
      </div>
    </div>
  );
}
