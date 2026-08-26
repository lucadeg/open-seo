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
 * @generated_at 2026-05-13T13:53:38.845Z
 * @updated_at 2026-05-13T13:53:38.846Z
 * @hash sha256:88143d11011c58da47eeff8375bec4dfee9fed1c77a4262882ab9bad69d1da3a
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:38.845Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { createServerFn } from "@tanstack/react-start";
import { AuditRepository } from "@/server/features/audit/repositories/AuditRepository";
import {
  buildLighthouseExportFile,
  readStoredLighthousePayload,
} from "@/server/lib/lighthousePayload";
import { AppError } from "@/server/lib/errors";
import { getJsonFromR2 } from "@/server/lib/r2";
import { requireProjectContext } from "@/serverFunctions/middleware";
import {
  lighthouseAuditExportSchema,
  lighthouseAuditIssueSchema,
} from "@/types/schemas/lighthouse";

async function getAuditLighthouseData(input: {
  projectId: string;
  resultId: string;
}) {
  const site = await AuditRepository.getLighthouseResultById({
    lighthouseResultId: input.resultId,
    projectId: input.projectId,
  });

  if (!site) {
    throw new AppError("NOT_FOUND");
  }

  const r2Key = site.lighthouse.r2Key;
  if (!r2Key) {
    throw new AppError("NOT_FOUND");
  }

  const payloadJson = await getJsonFromR2(r2Key);
  const payload = readStoredLighthousePayload(payloadJson);

  return {
    id: site.lighthouse.id,
    strategy: site.lighthouse.strategy,
    finalUrl: site.page?.url ?? "",
    createdAt: site.audit.startedAt,
    payloadJson,
    payload,
  };
}

export const getAuditLighthouseIssues = createServerFn({ method: "POST" })
  .middleware(requireProjectContext)
  .inputValidator((data: unknown) => lighthouseAuditIssueSchema.parse(data))
  .handler(async ({ data, context }) => {
    const lighthouse = await getAuditLighthouseData({
      projectId: context.projectId,
      resultId: data.resultId,
    });

    return {
      id: lighthouse.id,
      finalUrl:
        lighthouse.payload.storedPayload?.metadata.finalUrl ??
        lighthouse.finalUrl,
      strategy: lighthouse.strategy,
      createdAt: lighthouse.createdAt,
      hasIssueDetails: lighthouse.payload.report.hasIssueDetails,
      scores: lighthouse.payload.storedPayload?.scores ?? null,
      metrics: lighthouse.payload.storedPayload?.metrics ?? null,
      issues: lighthouse.payload.report.issues,
    };
  });

export const exportAuditLighthouseIssues = createServerFn({ method: "POST" })
  .middleware(requireProjectContext)
  .inputValidator((data: unknown) => lighthouseAuditExportSchema.parse(data))
  .handler(async ({ data, context }) => {
    const lighthouse = await getAuditLighthouseData({
      projectId: context.projectId,
      resultId: data.resultId,
    });

    return buildLighthouseExportFile({
      idField: "resultId",
      idValue: lighthouse.id,
      finalUrl: lighthouse.finalUrl,
      strategy: lighthouse.strategy,
      createdAt: lighthouse.createdAt,
      payloadJson: lighthouse.payloadJson,
      mode: data.mode,
      category: data.mode === "category" ? data.category : undefined,
    });
  });
