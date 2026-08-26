/**
 * @file_id FILE-MVX-AUTO-BACKLINKSFILTERPANEL-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-BACKLINKSFILTERPANEL
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
 * @generated_at 2026-05-13T13:53:33.932Z
 * @updated_at 2026-05-13T13:53:33.934Z
 * @hash sha256:37f0a838d92f7a7185448003311cbe53e276d09856ab6b7f5db539df574e0468
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:33.932Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { RotateCcw } from "lucide-react";
import type { BacklinksTab } from "@/types/schemas/backlinks";
import type { BacklinksFiltersState } from "./useBacklinksFilters";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyForm = { Field: React.ComponentType<any> };

function FilterTextInput({
  form,
  name,
  label,
  placeholder,
}: {
  form: AnyForm;
  name: string;
  label: string;
  placeholder: string;
}) {
  return (
    <label className="form-control gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-base-content/60">
        {label}
      </span>
      <form.Field name={name}>
        {(field: {
          state: { value: string };
          handleChange: (v: string) => void;
        }) => (
          <input
            className="input input-bordered input-sm w-full bg-base-100"
            placeholder={placeholder}
            value={field.state.value}
            onChange={(event) => field.handleChange(event.target.value)}
          />
        )}
      </form.Field>
    </label>
  );
}

function FilterRangeInputs({
  form,
  title,
  minName,
  maxName,
  step,
}: {
  form: AnyForm;
  title: string;
  minName: string;
  maxName: string;
  step?: string;
}) {
  return (
    <div className="rounded-lg border border-base-300 bg-base-100 p-2.5 space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-base-content/60">
        {title}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <CompactRangeInput
          form={form}
          name={minName}
          placeholder="Min"
          step={step}
        />
        <CompactRangeInput
          form={form}
          name={maxName}
          placeholder="Max"
          step={step}
        />
      </div>
    </div>
  );
}

function CompactRangeInput({
  form,
  name,
  placeholder,
  step,
}: {
  form: AnyForm;
  name: string;
  placeholder: string;
  step?: string;
}) {
  return (
    <form.Field name={name}>
      {(field: {
        state: { value: string };
        handleChange: (v: string) => void;
      }) => (
        <input
          className="input input-bordered input-xs bg-base-100"
          placeholder={placeholder}
          type="number"
          step={step}
          value={field.state.value}
          onChange={(event) => field.handleChange(event.target.value)}
        />
      )}
    </form.Field>
  );
}

function BacklinksTabFilters({
  form,
}: {
  form: BacklinksFiltersState["backlinks"]["form"];
}) {
  return (
    <>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <FilterTextInput
          form={form}
          name="include"
          label="Include Terms"
          placeholder="example.com, blog"
        />
        <FilterTextInput
          form={form}
          name="exclude"
          label="Exclude Terms"
          placeholder="spam, forum"
        />
      </div>

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
        <FilterRangeInputs
          form={form}
          title="Domain Authority"
          minName="minDomainRank"
          maxName="maxDomainRank"
        />
        <FilterRangeInputs
          form={form}
          title="Link Authority"
          minName="minLinkAuthority"
          maxName="maxLinkAuthority"
        />
        <FilterRangeInputs
          form={form}
          title="Spam Score"
          minName="minSpamScore"
          maxName="maxSpamScore"
          step="0.1"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-base-content/60">
            Link Type
          </p>
          <form.Field name="linkType">
            {(field) => (
              <div className="flex items-center gap-1">
                {(["", "dofollow", "nofollow"] as const).map((value) => (
                  <button
                    key={value || "all"}
                    type="button"
                    className={`btn btn-xs ${field.state.value === value ? "btn-soft" : "btn-ghost"}`}
                    onClick={() => field.handleChange(value)}
                  >
                    {value === ""
                      ? "All"
                      : value === "dofollow"
                        ? "Dofollow"
                        : "Nofollow"}
                  </button>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-base-content/60">
            Visibility
          </p>
          <div className="flex items-center gap-3">
            <form.Field name="hideLost">
              {(field) => (
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-xs"
                    checked={field.state.value === "true"}
                    onChange={(event) =>
                      field.handleChange(event.target.checked ? "true" : "")
                    }
                  />
                  <span className="text-xs">Hide lost</span>
                </label>
              )}
            </form.Field>
            <form.Field name="hideBroken">
              {(field) => (
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-xs"
                    checked={field.state.value === "true"}
                    onChange={(event) =>
                      field.handleChange(event.target.checked ? "true" : "")
                    }
                  />
                  <span className="text-xs">Hide broken</span>
                </label>
              )}
            </form.Field>
          </div>
        </div>
      </div>
    </>
  );
}

function ReferringDomainsFilters({
  form,
}: {
  form: BacklinksFiltersState["domains"]["form"];
}) {
  return (
    <>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <FilterTextInput
          form={form}
          name="include"
          label="Include Terms"
          placeholder="example.com, blog"
        />
        <FilterTextInput
          form={form}
          name="exclude"
          label="Exclude Terms"
          placeholder="spam, forum"
        />
      </div>

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <FilterRangeInputs
          form={form}
          title="Backlinks"
          minName="minBacklinks"
          maxName="maxBacklinks"
        />
        <FilterRangeInputs
          form={form}
          title="Rank"
          minName="minRank"
          maxName="maxRank"
        />
      </div>
    </>
  );
}

function TopPagesFilters({
  form,
}: {
  form: BacklinksFiltersState["pages"]["form"];
}) {
  return (
    <>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <FilterTextInput
          form={form}
          name="include"
          label="Include Terms"
          placeholder="/blog, /products"
        />
        <FilterTextInput
          form={form}
          name="exclude"
          label="Exclude Terms"
          placeholder="/tag, /author"
        />
      </div>

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
        <FilterRangeInputs
          form={form}
          title="Backlinks"
          minName="minBacklinks"
          maxName="maxBacklinks"
        />
        <FilterRangeInputs
          form={form}
          title="Referring Domains"
          minName="minReferringDomains"
          maxName="maxReferringDomains"
        />
        <FilterRangeInputs
          form={form}
          title="Rank"
          minName="minRank"
          maxName="maxRank"
        />
      </div>
    </>
  );
}

export function BacklinksFilterPanel({
  activeTab,
  filters,
}: {
  activeTab: BacklinksTab;
  filters: BacklinksFiltersState;
}) {
  const current = filters[activeTab];

  return (
    <div className="shrink-0 border-b border-base-300 bg-gradient-to-b from-base-100 to-base-200/30 px-4 py-3 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">Refine results</p>
          {current.activeFilterCount > 0 ? (
            <span className="badge badge-xs badge-primary border-0 text-primary-content">
              {current.activeFilterCount} active
            </span>
          ) : null}
        </div>
        <button
          type="button"
          className="btn btn-xs btn-ghost gap-1"
          onClick={current.reset}
          disabled={current.activeFilterCount === 0}
        >
          <RotateCcw className="size-3" />
          Clear all
        </button>
      </div>

      {activeTab === "backlinks" ? (
        <BacklinksTabFilters form={filters.backlinks.form} />
      ) : null}
      {activeTab === "domains" ? (
        <ReferringDomainsFilters form={filters.domains.form} />
      ) : null}
      {activeTab === "pages" ? (
        <TopPagesFilters form={filters.pages.form} />
      ) : null}
    </div>
  );
}
