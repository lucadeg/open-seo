/**
 * @file_id FILE-MVX-AUTO-USEKEYWORDCONTROLSFORM-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-USEKEYWORDCONTROLSFORM
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
 * @generated_at 2026-05-13T13:53:34.953Z
 * @updated_at 2026-05-13T13:53:34.955Z
 * @hash sha256:38f565d78882d40a9e954039f2b989935d70ece839ccae01d5444b19ffb36ebc
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.953Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import {
  createFormValidationErrors,
  shouldValidateFieldOnChange,
} from "@/client/lib/forms";
import {
  type KeywordMode,
  type ResultLimit,
} from "@/client/features/keywords/keywordResearchTypes";
import { parseKeywordInput } from "@/client/features/keywords/state/keywordControllerActions";

type UseKeywordControlsFormInput = {
  keywordInput: string;
  locationCode: number;
  resultLimit: ResultLimit;
  keywordMode: KeywordMode;
};

type KeywordControlsValues = {
  keyword: string;
  locationCode: number;
  resultLimit: ResultLimit;
  mode: KeywordMode;
};

function getKeywordSearchValidationErrors(
  value: KeywordControlsValues,
  shouldValidateUntouchedField: boolean,
) {
  if (parseKeywordInput(value.keyword).length > 0) {
    return null;
  }

  if (!shouldValidateUntouchedField) {
    return null;
  }

  return createFormValidationErrors({
    fields: {
      keyword: "Please enter at least one keyword.",
    },
  });
}

export function useKeywordControlsForm(
  input: UseKeywordControlsFormInput,
  onSubmit: (value: KeywordControlsValues) => void,
) {
  const form = useForm({
    defaultValues: {
      keyword: input.keywordInput,
      locationCode: input.locationCode,
      resultLimit: input.resultLimit,
      mode: input.keywordMode,
    },
    validators: {
      onChange: ({ formApi, value }) =>
        getKeywordSearchValidationErrors(
          value,
          shouldValidateFieldOnChange(formApi, "keyword"),
        ),
      onSubmit: ({ value }) => getKeywordSearchValidationErrors(value, true),
    },
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });

  useEffect(() => {
    form.reset({
      keyword: input.keywordInput,
      locationCode: input.locationCode,
      resultLimit: input.resultLimit,
      mode: input.keywordMode,
    });
  }, [
    form,
    input.keywordInput,
    input.keywordMode,
    input.locationCode,
    input.resultLimit,
  ]);

  return form;
}
