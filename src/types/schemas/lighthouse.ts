/**
 * @file_id FILE-MVX-AUTO-LIGHTHOUSE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-LIGHTHOUSE
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
 * @generated_at 2026-05-13T13:53:39.183Z
 * @updated_at 2026-05-13T13:53:39.187Z
 * @hash sha256:48fd976e423e2fe5d2fd62fe39f12da9db99c285286ead3a6f6e728ec02c78ca
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:39.183Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { z } from "zod";
import {
  LIGHTHOUSE_CATEGORIES,
  LIGHTHOUSE_CATEGORY_TABS,
} from "@/shared/lighthouse";

export const lighthouseAuditIssueSchema = z.object({
  projectId: z.string().min(1, "Project id is required"),
  resultId: z.string().min(1, "Result id is required"),
});

export const lighthouseAuditExportSchema = z.object({
  projectId: z.string().min(1, "Project id is required"),
  resultId: z.string().min(1, "Result id is required"),
  mode: z.enum(["full", "issues", "category"]),
  category: z.enum(LIGHTHOUSE_CATEGORIES).optional(),
});

export const lighthouseIssuesSearchSchema = z.object({
  auditId: z.string().optional().catch(undefined),
  category: z.enum(LIGHTHOUSE_CATEGORY_TABS).catch("all").default("all"),
});
