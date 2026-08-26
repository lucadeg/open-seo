/**
 * @file_id FILE-MVX-AUTO-SITEAUDITWORKFLOW-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-SITEAUDITWORKFLOW
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
 * @generated_at 2026-05-13T13:53:38.547Z
 * @updated_at 2026-05-13T13:53:38.549Z
 * @hash sha256:f244f84a19d3a34394522f0a8aa5c39b108fbf05ac5b9dabd762bce2301a5fdc
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:38.547Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */
import {
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep,
} from "cloudflare:workers";
import type { BillingCustomerContext } from "@/server/billing/subscription";
import { AuditRepository } from "@/server/features/audit/repositories/AuditRepository";
import type { AuditConfig } from "@/server/lib/audit/types";
import { captureServerEvent } from "@/server/lib/posthog";
import { runAuditPhases } from "@/server/workflows/siteAuditWorkflowPhases";

interface AuditParams {
  auditId: string;
  billingCustomer: BillingCustomerContext;
  projectId: string;
  startUrl: string;
  config: AuditConfig;
}

export class SiteAuditWorkflow extends WorkflowEntrypoint<Env, AuditParams> {
  async run(event: WorkflowEvent<AuditParams>, step: WorkflowStep) {
    const { auditId, billingCustomer, projectId, startUrl, config } =
      event.payload;

    const audit = await AuditRepository.getAuditForWorkflow(
      auditId,
      event.instanceId,
    );

    if (!audit) {
      throw new Error("Audit workflow context mismatch");
    }

    if (audit.projectId !== projectId) {
      throw new Error("Audit workflow project mismatch");
    }

    try {
      await runAuditPhases(step, {
        auditId,
        workflowInstanceId: event.instanceId,
        billingCustomer,
        projectId,
        startUrl,
        config,
      });
    } catch (error) {
      console.error(`Audit ${auditId} failed:`, error);
      await step.do("mark-failed", async () => {
        await AuditRepository.failAudit(auditId, event.instanceId);

        const latestAudit = await AuditRepository.getAuditForWorkflow(
          auditId,
          event.instanceId,
        );

        await captureServerEvent({
          distinctId: billingCustomer.userId,
          event: "site_audit:complete",
          organizationId: billingCustomer.organizationId,
          properties: {
            project_id: projectId,
            status: "failed",
            pages_crawled: latestAudit?.pagesCrawled,
            pages_total: latestAudit?.pagesTotal,
            run_lighthouse: config.lighthouseStrategy !== "none",
          },
        });
      });
      throw error;
    }
  }
}
