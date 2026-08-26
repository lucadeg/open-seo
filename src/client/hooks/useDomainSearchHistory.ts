/**
 * @file_id FILE-MVX-AUTO-USEDOMAINSEARCHHISTORY-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-USEDOMAINSEARCHHISTORY
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
 * @generated_at 2026-05-13T13:53:35.661Z
 * @updated_at 2026-05-13T13:53:35.663Z
 * @hash sha256:4e6a4920bca81924b36c74e98d75306cd62e3f02a025174e7add419082c860fb
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.661Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { z } from "zod";
import { useLocalHistoryStore } from "@/client/hooks/useLocalHistoryStore";
import { jsonCodec } from "@/shared/json";

type DomainSortMode = "rank" | "traffic" | "volume" | "score" | "cpc";
type DomainTab = "keywords" | "pages";

export interface DomainSearchHistoryItem {
  domain: string;
  subdomains: boolean;
  sort: DomainSortMode;
  tab: DomainTab;
  search?: string;
  locationCode?: number;
  timestamp: number;
}

type AddDomainSearchInput = Omit<DomainSearchHistoryItem, "timestamp">;

const MAX_HISTORY = 20;

const domainSearchHistoryItemSchema = z.object({
  domain: z.string(),
  subdomains: z.boolean(),
  sort: z.enum(["rank", "traffic", "volume", "score", "cpc"]),
  tab: z.enum(["keywords", "pages"]),
  search: z.string().optional(),
  locationCode: z.number().int().positive().optional(),
  timestamp: z.number(),
});

const domainSearchHistorySchema = z.array(domainSearchHistoryItemSchema);
const domainSearchHistoryCodec = jsonCodec(domainSearchHistorySchema);

function normalizeSearchText(value: string | undefined): string {
  return value?.trim() ?? "";
}

function isSameSearch(
  a: DomainSearchHistoryItem,
  b: AddDomainSearchInput,
): boolean {
  return (
    a.domain === b.domain &&
    a.subdomains === b.subdomains &&
    a.sort === b.sort &&
    a.tab === b.tab &&
    a.locationCode === b.locationCode &&
    normalizeSearchText(a.search) === normalizeSearchText(b.search)
  );
}

export function useDomainSearchHistory(projectId: string) {
  const { history, isLoaded, addItem, removeItem, clearItems } =
    useLocalHistoryStore<DomainSearchHistoryItem, AddDomainSearchInput>({
      storageKey: `domain-search-history:${projectId}`,
      maxItems: MAX_HISTORY,
      parse: (raw) => {
        const parsed = domainSearchHistoryCodec.safeParse(raw);
        return parsed.success ? parsed.data : null;
      },
      isSameItem: isSameSearch,
      createItem: (item) => ({
        ...item,
        search: normalizeSearchText(item.search) || undefined,
        timestamp: Date.now(),
      }),
      getItemKey: (item) => item.timestamp,
    });

  return {
    history,
    isLoaded,
    addSearch: addItem,
    clearHistory: clearItems,
    removeHistoryItem: removeItem,
  };
}
