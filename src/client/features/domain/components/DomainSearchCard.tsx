/**
 * @file_id FILE-MVX-AUTO-DOMAINSEARCHCARD-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-DOMAINSEARCHCARD
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
 * @generated_at 2026-05-13T13:53:34.672Z
 * @updated_at 2026-05-13T13:53:34.674Z
 * @hash sha256:b1e9afac895107fcb11ff24926fdae7a55c3dafaac122537661ffe1a6e9f9a95
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.672Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import type { FormEvent } from "react";
import { AlertCircle, Search } from "lucide-react";
import { getFieldError, getFormError } from "@/client/lib/forms";
import type { useDomainOverviewController } from "@/client/features/domain/useDomainOverviewController";
import { toSortMode } from "@/client/features/domain/utils";
import type { DomainSortMode } from "@/client/features/domain/types";
import { LOCATION_OPTIONS } from "@/client/features/keywords/locations";

type Props = {
  controlsForm: ReturnType<typeof useDomainOverviewController>["controlsForm"];
  isLoading: boolean;
  onSubmit: (event: FormEvent) => void;
  onSortChange: (sort: DomainSortMode) => void;
  onLocationChange: (locationCode: number) => void;
};

export function DomainSearchCard({
  controlsForm,
  isLoading,
  onSubmit,
  onSortChange,
  onLocationChange,
}: Props) {
  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body gap-4">
        <form
          className="flex flex-col gap-3 lg:flex-row lg:items-center"
          onSubmit={onSubmit}
        >
          <controlsForm.Field name="domain">
            {(field) => {
              const domainError = getFieldError(field.state.meta.errors);

              return (
                <label
                  className={`input input-bordered flex items-center gap-2 w-full lg:flex-1 lg:min-w-0 lg:max-w-md ${domainError ? "input-error" : ""}`}
                >
                  <Search className="size-4 text-base-content/60" />
                  <input
                    className="grow min-w-0"
                    placeholder="Enter a domain"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={domainError ? true : undefined}
                    aria-describedby={
                      domainError ? "domain-input-error" : undefined
                    }
                  />
                </label>
              );
            }}
          </controlsForm.Field>

          <controlsForm.Field name="locationCode">
            {(field) => (
              <select
                className="select select-bordered shrink-0"
                value={field.state.value}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  field.handleChange(next);
                  onLocationChange(next);
                }}
              >
                {LOCATION_OPTIONS.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </controlsForm.Field>

          <controlsForm.Field name="sort">
            {(field) => (
              <select
                className="select select-bordered shrink-0"
                value={field.state.value}
                onChange={(event) => {
                  const next = toSortMode(event.target.value) ?? "rank";
                  field.handleChange(next);
                  onSortChange(next);
                }}
              >
                <option value="rank">By Rank</option>
                <option value="traffic">By Traffic</option>
                <option value="volume">By Volume</option>
                <option value="score">By Score</option>
                <option value="cpc">By CPC</option>
              </select>
            )}
          </controlsForm.Field>

          <controlsForm.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <button
                type="submit"
                className="btn btn-primary shrink-0 px-6"
                disabled={isLoading || isSubmitting}
              >
                {isLoading || isSubmitting ? "Loading..." : "Search"}
              </button>
            )}
          </controlsForm.Subscribe>
        </form>

        <controlsForm.Field name="domain">
          {(field) => {
            const domainError = getFieldError(field.state.meta.errors);

            return domainError ? (
              <p id="domain-input-error" className="text-sm text-error">
                {domainError}
              </p>
            ) : null;
          }}
        </controlsForm.Field>

        <controlsForm.Subscribe selector={(state) => state.errorMap.onSubmit}>
          {(submitError) => {
            const errorMessage = getFormError(submitError);

            return errorMessage ? (
              <div className="rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error flex items-start gap-2">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            ) : null;
          }}
        </controlsForm.Subscribe>

        <div className="flex flex-wrap items-center gap-3">
          <label className="label cursor-pointer gap-2 py-0">
            <controlsForm.Field name="subdomains">
              {(field) => (
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={field.state.value}
                  onChange={(event) => field.handleChange(event.target.checked)}
                />
              )}
            </controlsForm.Field>
            <span className="label-text">Include subdomains</span>
          </label>
        </div>
      </div>
    </div>
  );
}
