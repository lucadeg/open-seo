/**
 * @file_id FILE-MVX-AUTO-USEPROMPTEXPLORERSEARCHHISTORY-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-USEPROMPTEXPLORERSEARCHHISTORY
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
 * @generated_at 2026-05-13T13:53:35.681Z
 * @updated_at 2026-05-13T13:53:35.683Z
 * @hash sha256:b1540de9773c12704500aa64ef913acc63438fef1b47dd525ddc09fcd539701e
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.681Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { z } from "zod";
import { useTimestampedSearchHistory } from "@/client/hooks/useTimestampedSearchHistory";
import {
  promptExplorerModelSchema,
  webSearchCountryCodeSchema,
} from "@/types/schemas/ai-search";

const promptExplorerSearchBodySchema = z.object({
  prompt: z.string(),
  highlightBrand: z.string(),
  models: z.array(promptExplorerModelSchema),
  webSearch: z.boolean(),
  webSearchCountryCode: webSearchCountryCodeSchema,
});

type PromptExplorerSearchBody = z.infer<typeof promptExplorerSearchBodySchema>;

export type PromptExplorerSearchHistoryItem = PromptExplorerSearchBody & {
  timestamp: number;
};

function sameModels(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = a.toSorted();
  const sortedB = b.toSorted();
  return sortedA.every((model, index) => model === sortedB[index]);
}

function isSameSearch(
  a: PromptExplorerSearchBody,
  b: PromptExplorerSearchBody,
): boolean {
  return (
    a.prompt === b.prompt &&
    a.highlightBrand === b.highlightBrand &&
    a.webSearch === b.webSearch &&
    a.webSearchCountryCode === b.webSearchCountryCode &&
    sameModels(a.models, b.models)
  );
}

export function usePromptExplorerSearchHistory(projectId: string) {
  return useTimestampedSearchHistory({
    storageKey: `prompt-explorer-search-history:${projectId}`,
    bodySchema: promptExplorerSearchBodySchema,
    isSame: isSameSearch,
  });
}
