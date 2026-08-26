import type { ComponentType, ReactNode } from "react";
import { Clock, History, X } from "lucide-react";

type Props<TItem extends { timestamp: number }> = {
  history: TItem[];
  historyLoaded: boolean;
  onRemoveHistoryItem: (timestamp: number) => void;
  /**
 * @file_id FILE-MVX-AUTO-SEARCHHISTORYSECTION-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-SEARCHHISTORYSECTION
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
 * @generated_at 2026-05-13T13:53:33.679Z
 * @updated_at 2026-05-13T13:53:33.681Z
 * @hash sha256:c2413b1a433d184fb45d8fe9b93be434e1dae6f71b20151399a2df0559d05606
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:33.679Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */
  renderItemLink: (item: TItem, content: ReactNode) => ReactNode;
  /** Icon component rendered in the empty state (e.g. Sparkles, MessageSquare). */
  emptyIcon: ComponentType<{ className?: string }>;
  /** Empty-state headline copy. */
  emptyMessage: string;
  /**
   * Label noun used in the "{n} recent {noun}(s)" header (e.g. "lookup",
   * "prompt"). Pluralization is handled by the component.
   */
  noun: string;
  /** Item body — primary (and optional secondary) text shown in each row. */
  renderItem: (item: TItem) => ReactNode;
};

export function SearchHistorySection<TItem extends { timestamp: number }>({
  history,
  historyLoaded,
  onRemoveHistoryItem,
  renderItemLink,
  emptyIcon: EmptyIcon,
  emptyMessage,
  noun,
  renderItem,
}: Props<TItem>) {
  if (!historyLoaded) {
    return null;
  }

  if (history.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-base-300 bg-base-100/70 p-6 text-center text-base-content/55 space-y-2">
        <EmptyIcon className="size-9 mx-auto opacity-35" />
        <p className="text-base font-medium text-base-content/80">
          {emptyMessage}
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-base-300 bg-base-100 p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="size-4 text-base-content/45" />
          <span className="text-sm text-base-content/60">
            {history.length} recent {noun}
            {history.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="grid gap-2">
        {history.map((item) => (
          <div
            key={item.timestamp}
            className="group flex items-center gap-2 rounded-lg border border-base-300 bg-base-100 p-2"
          >
            {renderItemLink(
              item,
              <>
                <Clock className="size-4 text-base-content/40 shrink-0" />
                <div className="min-w-0">{renderItem(item)}</div>
              </>,
            )}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-base-content/40">
                {new Date(item.timestamp).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <button
                type="button"
                className="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100 p-1"
                onClick={() => onRemoveHistoryItem(item.timestamp)}
                aria-label="Remove from history"
              >
                <X className="size-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export const HISTORY_ITEM_LINK_CLASS =
  "flex min-w-0 flex-1 items-center gap-3 rounded-md px-1 py-1 text-left transition-colors hover:bg-base-200";
