/**
 * @file_id FILE-MVX-AUTO-PROMPTEXPLORERHISTORYSECTION-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-PROMPTEXPLORERHISTORYSECTION
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
 * @generated_at 2026-05-13T13:53:33.593Z
 * @updated_at 2026-05-13T13:53:33.595Z
 * @hash sha256:4615aa690a3bd71d96c595440428fa372f9003fa174d3ec91f0a1269e6516459
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:33.593Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { Link } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import {
  HISTORY_ITEM_LINK_CLASS,
  SearchHistorySection,
} from "@/client/features/ai-search/components/SearchHistorySection";
import { formatModelLabel } from "@/client/features/ai-search/platformLabels";
import type { PromptExplorerSearchHistoryItem } from "@/client/hooks/usePromptExplorerSearchHistory";

type Props = {
  projectId: string;
  history: PromptExplorerSearchHistoryItem[];
  historyLoaded: boolean;
  onRemoveHistoryItem: (timestamp: number) => void;
};

export function PromptExplorerHistorySection({ projectId, ...props }: Props) {
  return (
    <SearchHistorySection
      {...props}
      emptyIcon={MessageSquare}
      emptyMessage="Enter a prompt to compare model answers"
      noun="prompt"
      renderItemLink={(item, content) => (
        <Link
          from="/p/$projectId/prompt-explorer"
          to="/p/$projectId/prompt-explorer"
          params={{ projectId }}
          search={{
            q: item.prompt,
            models: item.models,
            web: item.webSearch ? undefined : false,
            cc:
              item.webSearchCountryCode === "US"
                ? undefined
                : item.webSearchCountryCode,
            hb: item.highlightBrand || undefined,
          }}
          replace
          className={HISTORY_ITEM_LINK_CLASS}
        >
          {content}
        </Link>
      )}
      renderItem={(item) => (
        <>
          <p className="font-medium text-base-content truncate">
            {item.prompt}
          </p>
          <p className="text-sm text-base-content/60 truncate">
            {item.models.map(formatModelLabel).join(", ")}
          </p>
        </>
      )}
    />
  );
}
