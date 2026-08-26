/**
 * @file_id FILE-MVX-AUTO-DATAFORSEOACCESSCLASSIFICATION-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-DATAFORSEOACCESSCLASSIFICATION
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
 * @generated_at 2026-05-13T13:53:38.046Z
 * @updated_at 2026-05-13T13:53:38.048Z
 * @hash sha256:4362f9226eac65d6d89e63b496da23a55e29e0f088b1d7787e201589c4f63caa
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:38.046Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { AppError } from "@/server/lib/errors";
import type { ErrorCode } from "@/shared/error-codes";

const ACCESS_SIGNALS = [
  "not available",
  "not enabled",
  "not allowed",
  "access denied",
  "forbidden",
  "insufficient",
  "subscription",
  "upgrade",
  "plan",
  "activate your subscription",
  "plans and subscriptions",
];

const BILLING_SIGNALS = [
  "insufficient funds",
  "balance is too low",
  "payment required",
  "billing",
  "balance",
  "problem billing",
  "recharged",
];

const ACCESS_STATUS_CODES = new Set([40204, 403]);
const BILLING_STATUS_CODES = new Set([40200, 40210, 402]);

type DataforseoAccessClassifier = (
  status: number | undefined,
  details: string,
  path: string,
) => AppError | null;

export function createDataforseoAccessClassifier(config: {
  pathPrefix: string;
  notEnabledCode: ErrorCode;
  notEnabledMessage: string;
  billingIssueCode: ErrorCode;
  billingIssueMessage: string;
}): DataforseoAccessClassifier {
  return (status, details, path) => {
    if (!path.includes(config.pathPrefix)) return null;

    const text = details.toLowerCase();
    const matchesBillingStatus =
      status != null && BILLING_STATUS_CODES.has(status);
    const matchesBillingText = BILLING_SIGNALS.some((signal) =>
      text.includes(signal),
    );
    if (matchesBillingStatus || matchesBillingText) {
      return new AppError(config.billingIssueCode, config.billingIssueMessage);
    }

    const matchesAccessStatus =
      status != null && ACCESS_STATUS_CODES.has(status);
    const matchesAccessText = ACCESS_SIGNALS.some((signal) =>
      text.includes(signal),
    );
    if (!matchesAccessStatus && !matchesAccessText) return null;

    return new AppError(config.notEnabledCode, config.notEnabledMessage);
  };
}
