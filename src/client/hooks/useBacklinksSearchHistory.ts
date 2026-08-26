/**
 * @file_id FILE-MVX-AUTO-USEBACKLINKSSEARCHHISTORY-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-USEBACKLINKSSEARCHHISTORY
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
 * @generated_at 2026-05-13T13:53:35.636Z
 * @updated_at 2026-05-13T13:53:35.638Z
 * @hash sha256:138608d41126c7bc87e53c988b4c14eb65894deabf6b836ed09558e1ac4085bf
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.636Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { z } from "zod";
import { useLocalHistoryStore } from "@/client/hooks/useLocalHistoryStore";
import { jsonCodec } from "@/shared/json";

export interface BacklinksSearchHistoryItem {
  target: string;
  scope: "domain" | "page";
  timestamp: number;
}

type AddBacklinksSearchInput = Omit<BacklinksSearchHistoryItem, "timestamp">;

const MAX_HISTORY = 20;

const backlinksSearchHistoryItemSchema = z.object({
  target: z.string(),
  scope: z.enum(["domain", "page"]),
  timestamp: z.number(),
});

const backlinksSearchHistorySchema = z.array(backlinksSearchHistoryItemSchema);
const backlinksSearchHistoryCodec = jsonCodec(backlinksSearchHistorySchema);

function isSameSearch(
  a: BacklinksSearchHistoryItem,
  b: AddBacklinksSearchInput,
): boolean {
  return a.target === b.target && a.scope === b.scope;
}

export function useBacklinksSearchHistory(projectId: string) {
  const { history, isLoaded, addItem, removeItem } = useLocalHistoryStore<
    BacklinksSearchHistoryItem,
    AddBacklinksSearchInput
  >({
    storageKey: `backlinks-search-history:${projectId}`,
    maxItems: MAX_HISTORY,
    parse: (raw) => {
      const parsed = backlinksSearchHistoryCodec.safeParse(raw);
      return parsed.success ? parsed.data : null;
    },
    isSameItem: isSameSearch,
    createItem: (item) => ({
      ...item,
      timestamp: Date.now(),
    }),
    getItemKey: (item) => item.timestamp,
  });

  return {
    history,
    isLoaded,
    addSearch: addItem,
    removeHistoryItem: removeItem,
  };
}
