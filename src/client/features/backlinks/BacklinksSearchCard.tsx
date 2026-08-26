/**
 * @file_id FILE-MVX-AUTO-BACKLINKSSEARCHCARD-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-BACKLINKSSEARCHCARD
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
 * @generated_at 2026-05-13T13:53:34.164Z
 * @updated_at 2026-05-13T13:53:34.166Z
 * @hash sha256:6becd769ed7979770510a008534b5e6c6ab996414652af0418c4356a710c13be
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.164Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Search } from "lucide-react";
import {
  createFormValidationErrors,
  getFieldError,
  shouldValidateFieldOnChange,
} from "@/client/lib/forms";
import type { BacklinksSearchState } from "./backlinksPageTypes";
import { resolveBacklinksSearchScope } from "./backlinksSearchScope";

type SearchDraft = Pick<BacklinksSearchState, "target" | "scope">;

function getBacklinksValidationErrors(
  value: SearchDraft,
  shouldValidateUntouchedField: boolean,
) {
  if (value.target.trim()) {
    return null;
  }

  if (!shouldValidateUntouchedField) {
    return null;
  }

  return createFormValidationErrors({
    fields: {
      target: "Enter a domain or URL to analyze.",
    },
  });
}

export function BacklinksSearchCard({
  errorMessage,
  initialValues,
  isFetching,
  onSubmit,
}: {
  errorMessage: string | null;
  initialValues: SearchDraft;
  isFetching: boolean;
  onSubmit: (values: SearchDraft) => void;
}) {
  const [userSelectedScope, setUserSelectedScope] = useState(false);
  const form = useForm({
    defaultValues: initialValues,
    validators: {
      onChange: ({ formApi, value }) =>
        getBacklinksValidationErrors(
          value,
          shouldValidateFieldOnChange(formApi, "target"),
        ),
      onSubmit: ({ value }) => getBacklinksValidationErrors(value, true),
    },
    onSubmit: ({ value }) => {
      const target = value.target.trim();
      const scope = resolveBacklinksSearchScope({
        target,
        selectedScope: value.scope,
        userSelectedScope,
      });

      onSubmit({
        ...value,
        target,
        scope,
      });
    },
  });

  useEffect(() => {
    form.reset(initialValues);
    setUserSelectedScope(false);
  }, [form, initialValues]);

  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body gap-4">
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit();
          }}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
              <form.Field name="target">
                {(field) => {
                  const targetError = getFieldError(field.state.meta.errors);

                  return (
                    <label
                      className={`input input-bordered lg:col-span-10 flex items-center gap-2 ${targetError ? "input-error" : ""}`}
                    >
                      <Search className="size-4 text-base-content/60" />
                      <input
                        placeholder="Enter a domain or URL"
                        value={field.state.value}
                        onChange={(event) => {
                          const nextTarget = event.target.value;
                          field.handleChange(nextTarget);
                          if (!userSelectedScope) {
                            form.setFieldValue(
                              "scope",
                              resolveBacklinksSearchScope({
                                target: nextTarget,
                                selectedScope: form.state.values.scope,
                                userSelectedScope: false,
                              }),
                            );
                          }
                        }}
                      />
                    </label>
                  );
                }}
              </form.Field>

              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <button
                    type="submit"
                    className="btn btn-primary lg:col-span-2"
                    disabled={isFetching || isSubmitting}
                  >
                    {isFetching || isSubmitting ? "Loading..." : "Search"}
                  </button>
                )}
              </form.Subscribe>
            </div>

            <form.Field name="target">
              {(field) => {
                const targetError = getFieldError(field.state.meta.errors);

                return targetError ? (
                  <p className="text-sm text-error">{targetError}</p>
                ) : null;
              }}
            </form.Field>

            <div className="flex items-center gap-1">
              <form.Field name="scope">
                {(field) => (
                  <>
                    <button
                      type="button"
                      className={`btn btn-xs ${field.state.value === "domain" ? "btn-soft" : "btn-ghost"}`}
                      onClick={() => {
                        setUserSelectedScope(true);
                        field.handleChange("domain");
                      }}
                    >
                      Site-wide
                    </button>
                    <button
                      type="button"
                      className={`btn btn-xs ${field.state.value === "page" ? "btn-soft" : "btn-ghost"}`}
                      onClick={() => {
                        setUserSelectedScope(true);
                        field.handleChange("page");
                      }}
                    >
                      Exact page
                    </button>
                  </>
                )}
              </form.Field>
            </div>
          </div>
        </form>

        {errorMessage ? (
          <div className="rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">
            {errorMessage}
          </div>
        ) : null}
      </div>
    </div>
  );
}
