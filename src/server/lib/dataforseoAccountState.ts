/**
 * @file_id FILE-MVX-AUTO-DATAFORSEOACCOUNTSTATE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-DATAFORSEOACCOUNTSTATE
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
 * @generated_at 2026-05-13T13:53:38.073Z
 * @updated_at 2026-05-13T13:53:38.074Z
 * @hash sha256:1a496ed70f433a1b900d66178da420fb34751295f941033e50c26983de1a2dd0
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:38.073Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { z } from "zod";
import { AppError } from "@/server/lib/errors";
import { getRequiredEnvValue } from "@/server/lib/runtime-env";

const API_BASE = "https://api.dataforseo.com";

const userDataResponseSchema = z
  .object({
    status_code: z.number().optional(),
    tasks: z
      .array(
        z
          .object({
            status_code: z.number().optional(),
            result: z
              .array(
                z
                  .object({
                    backlinks_subscription_expiry_date: z
                      .string()
                      .nullable()
                      .optional(),
                    llm_mentions_subscription_expiry_date: z
                      .string()
                      .nullable()
                      .optional(),
                  })
                  .passthrough(),
              )
              .nullable()
              .optional(),
          })
          .passthrough(),
      )
      .optional(),
  })
  .passthrough();

type DataforseoAccountState = {
  backlinksSubscriptionExpiryDate: string | null;
  llmMentionsSubscriptionExpiryDate: string | null;
};

export function hasActiveDataforseoSubscription(
  expiryDate: string | null,
): boolean {
  if (!expiryDate) return false;

  const expiryTime = Date.parse(expiryDate);
  return Number.isFinite(expiryTime) && expiryTime > Date.now();
}

export async function fetchDataforseoAccountState(): Promise<DataforseoAccountState | null> {
  const apiKey = await getRequiredEnvValue("DATAFORSEO_API_KEY");
  const response = await fetch(`${API_BASE}/v3/appendix/user_data`, {
    method: "GET",
    headers: { Authorization: `Basic ${apiKey}` },
  });

  if (!response.ok) {
    throw new AppError(
      "INTERNAL_ERROR",
      `DataForSEO HTTP ${response.status} on /v3/appendix/user_data`,
    );
  }

  const raw = await response.json();
  const parsed = userDataResponseSchema.safeParse(raw);
  if (!parsed.success || parsed.data.status_code !== 20000) return null;

  const task = parsed.data.tasks?.[0];
  if (!task || task.status_code !== 20000) return null;

  const result = task.result?.[0];
  if (!result) return null;

  return {
    backlinksSubscriptionExpiryDate:
      result.backlinks_subscription_expiry_date ?? null,
    llmMentionsSubscriptionExpiryDate:
      result.llm_mentions_subscription_expiry_date ?? null,
  };
}
