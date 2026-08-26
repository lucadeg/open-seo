/**
 * @file_id FILE-MVX-AUTO-BACKLINKSSEARCHSCOPE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-BACKLINKSSEARCHSCOPE
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
 * @generated_at 2026-05-13T13:53:34.180Z
 * @updated_at 2026-05-13T13:53:34.182Z
 * @hash sha256:c1ff9b847476e4c34c269abe92685c12fc8997f12615cdab5ca2efc44c905084
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.180Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import type { BacklinksTargetScope } from "@/types/schemas/backlinks";

export function inferBacklinksSearchScopeFromTarget(
  target: string,
): BacklinksTargetScope {
  const trimmed = target.trim();
  if (!trimmed) {
    return "domain";
  }

  const hasExplicitProtocol = /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(trimmed);

  try {
    const parsed = new URL(
      hasExplicitProtocol ? trimmed : `https://${trimmed}`,
    );
    return parsed.pathname !== "/" ? "page" : "domain";
  } catch {
    return "domain";
  }
}

export function resolveBacklinksSearchScope({
  target,
  selectedScope,
  userSelectedScope,
}: {
  target: string;
  selectedScope: BacklinksTargetScope;
  userSelectedScope: boolean;
}): BacklinksTargetScope {
  if (userSelectedScope) {
    return selectedScope;
  }

  return inferBacklinksSearchScopeFromTarget(target);
}

export function getPersistedBacklinksSearchScope(
  target: string,
  scope: BacklinksTargetScope,
): BacklinksTargetScope | undefined {
  return scope === inferBacklinksSearchScopeFromTarget(target)
    ? undefined
    : scope;
}
