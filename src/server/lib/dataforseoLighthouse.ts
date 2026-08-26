/**
 * @file_id FILE-MVX-AUTO-DATAFORSEOLIGHTHOUSE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-DATAFORSEOLIGHTHOUSE
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
 * @generated_at 2026-05-13T13:53:38.183Z
 * @updated_at 2026-05-13T13:53:38.187Z
 * @hash sha256:b763d5195295743d70112de60ad107246ab0c73abe30a065e591dda2cecdd3b4
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:38.183Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { env } from "cloudflare:workers";
import {
  parseDataforseoLighthousePayload,
  requestCategories,
  type LighthouseStrategy,
} from "@/server/lib/dataforseoLighthousePayload";
import type { DataforseoApiResponse } from "@/server/lib/dataforseoCost";
import type { StoredLighthousePayload } from "@/server/lib/lighthouseStoredPayload";

const DATAFORSEO_LIGHTHOUSE_ENDPOINT =
  "https://api.dataforseo.com/v3/on_page/lighthouse/live/json";

export async function fetchDataforseoLighthouseResultRaw(input: {
  url: string;
  strategy: LighthouseStrategy;
}): Promise<DataforseoApiResponse<StoredLighthousePayload>> {
  const response = await fetch(DATAFORSEO_LIGHTHOUSE_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${env.DATAFORSEO_API_KEY?.trim() ?? ""}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      {
        url: input.url,
        for_mobile: input.strategy === "mobile",
        categories: requestCategories,
      },
    ]),
    signal: AbortSignal.timeout(60_000),
  });

  const rawText = await response.text();

  if (!response.ok) {
    throw new Error(
      `DataForSEO Lighthouse request failed (${response.status}): ${rawText}`,
    );
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawText);
  } catch {
    throw new Error(
      `DataForSEO Lighthouse returned non-JSON content (content-type: ${response.headers.get("content-type") ?? "unknown"}): ${rawText}`,
    );
  }

  const data = parseDataforseoLighthousePayload(payload, input);

  return {
    data,
    billing: {
      path: ["v3", "on_page", "lighthouse", "live", "json"],
      costUsd: data.metadata.cost ?? 0,
      resultCount: 1,
    },
  };
}
