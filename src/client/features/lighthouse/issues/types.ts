/**
 * @file_id FILE-MVX-AUTO-TYPES-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-TYPES
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
 * @generated_at 2026-05-13T13:53:35.369Z
 * @updated_at 2026-05-13T13:53:35.371Z
 * @hash sha256:34e426077175a0fd9a3e0602673141ee2fbdb9bcfdb0214557a913c8504241f8
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.369Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import type { z } from "zod";
import type { getAuditLighthouseIssues } from "@/serverFunctions/lighthouse";
import {
  LIGHTHOUSE_CATEGORY_TABS,
  type LighthouseCategoryTab,
} from "@/shared/lighthouse";
import type { lighthouseAuditExportSchema } from "@/types/schemas/lighthouse";

export const categoryTabs = LIGHTHOUSE_CATEGORY_TABS;

export type CategoryTab = LighthouseCategoryTab;

export type ExportPayload = Omit<
  z.infer<typeof lighthouseAuditExportSchema>,
  "projectId" | "resultId"
>;

type LighthouseIssuesResponse = Awaited<
  ReturnType<typeof getAuditLighthouseIssues>
>;

export type LighthouseIssue = LighthouseIssuesResponse["issues"][number];
export type LighthouseScores = NonNullable<LighthouseIssuesResponse["scores"]>;
export type LighthouseMetrics = NonNullable<
  LighthouseIssuesResponse["metrics"]
>;
