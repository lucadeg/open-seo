/**
 * @file_id FILE-MVX-AUTO-KEYWORDUI-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-KEYWORDUI
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
 * @generated_at 2026-05-13T13:53:34.916Z
 * @updated_at 2026-05-13T13:53:34.918Z
 * @hash sha256:42fe8525921909d380dc1114900cd14a5ef8dcfea63adf623346b01f6bd7e1db
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.916Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import type { KeywordResearchRow } from "@/types/keywords";
import { formatNumber, scoreTierClass } from "../utils";
import { IntentBadge } from "./IntentBadge";
export { SerpAnalysisCard } from "./SerpAnalysisCard";

export type { SortDir, SortField } from "./DisplayPrimitives";
export {
  AreaTrendChart,
  HeaderHelpLabel,
  SortHeader,
} from "./DisplayPrimitives";

export function OverviewStats({ keyword }: { keyword: KeywordResearchRow }) {
  return (
    <div className="shrink-0 bg-base-100 border border-base-300 rounded-xl px-4 py-2.5 flex items-center gap-4 min-h-[48px]">
      <div className="flex items-center gap-2 min-w-0 shrink-0">
        <span className="font-bold text-base truncate max-w-[240px] capitalize">
          {keyword.keyword}
        </span>
        <ScoreBadge value={keyword.keywordDifficulty} size="sm" />
      </div>

      <div className="w-px h-6 bg-base-300 shrink-0" />

      <div className="flex items-center gap-4 text-sm flex-wrap min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-base-content/50">Vol</span>
          <span className="font-semibold tabular-nums">
            {formatNumber(keyword.searchVolume)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-base-content/50">CPC</span>
          <span className="font-semibold tabular-nums">
            {keyword.cpc == null ? "-" : `$${keyword.cpc.toFixed(2)}`}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-base-content/50">Comp</span>
          <span className="font-semibold tabular-nums">
            {keyword.competition == null ? "-" : keyword.competition.toFixed(2)}
          </span>
        </div>
        <IntentBadge intent={keyword.intent} />
      </div>
    </div>
  );
}

function ScoreBadge({
  value,
  size = "sm",
}: {
  value: number | null;
  size?: "sm" | "lg";
}) {
  if (value == null) return null;

  const tierClass = scoreTierClass(value);
  const sizeClasses =
    size === "lg"
      ? "size-9 text-sm font-bold"
      : "size-6 text-[10px] font-semibold";

  return (
    <span
      className={`score-badge ${tierClass} inline-flex items-center justify-center rounded-full ${sizeClasses}`}
    >
      {value}
    </span>
  );
}
