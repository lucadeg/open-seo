/**
 * @file_id FILE-MVX-AUTO-SIDEBAR-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-SIDEBAR
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
 * @generated_at 2026-05-13T13:53:33.268Z
 * @updated_at 2026-05-13T13:53:33.270Z
 * @hash sha256:178df8d09e0f6c4becc05c99bda80026026a22d9093d4f4dfb86b14c87480b6c
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:33.268Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { Link } from "@tanstack/react-router";
import { ChevronsUpDown, X } from "lucide-react";
import { getProjectNavGroups } from "@/client/navigation/items";

interface SidebarProps {
  projectId: string;
  onNavigate?: () => void;
  onClose?: () => void;
}

export function Sidebar({ projectId, onNavigate, onClose }: SidebarProps) {
  const navGroups = getProjectNavGroups(projectId);

  return (
    <div className="sidebar w-64 border-r border-base-300 h-full bg-base-100 flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b border-base-300 flex items-center justify-between">
        <span className="font-semibold text-base-content">OpenSEO</span>
        {onClose && (
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Project picker */}
      <div className="px-3 py-3 border-b border-base-300">
        <div
          className="tooltip tooltip-bottom w-full"
          data-tip="Multiple projects coming soon"
        >
          <button className="btn btn-ghost btn-sm w-full justify-between font-medium text-sm cursor-default">
            <span className="truncate">Default</span>
            <ChevronsUpDown className="size-3.5 shrink-0 text-base-content/40" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 pl-3 overflow-y-auto">
        {navGroups.map((entry) => {
          if (entry.type === "standalone") {
            const { icon: Icon, ...linkProps } = entry.item;
            return (
              <Link
                key={linkProps.to}
                {...linkProps}
                onClick={onNavigate}
                activeOptions={{ exact: false, includeSearch: false }}
                className="relative flex items-center gap-3 px-4 py-2 text-sm text-base-content/60 transition-colors hover:bg-base-200 hover:text-base-content"
                activeProps={{ className: "text-base-content font-medium" }}
              >
                {({ isActive }: { isActive: boolean }) => (
                  <>
                    {isActive ? (
                      <div className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full bg-primary" />
                    ) : null}
                    <Icon className="h-5 w-5" />
                    {entry.item.label}
                  </>
                )}
              </Link>
            );
          }

          return (
            <div key={entry.label} className="mb-2">
              <div className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-base-content/40">
                {entry.label}
              </div>
              {entry.items.map((item) => {
                const { icon: Icon, ...linkProps } = item;
                return (
                  <Link
                    key={linkProps.to}
                    {...linkProps}
                    onClick={onNavigate}
                    activeOptions={{ exact: false, includeSearch: false }}
                    className="relative flex items-center gap-3 px-4 py-2 text-sm text-base-content/60 transition-colors hover:bg-base-200 hover:text-base-content"
                    activeProps={{ className: "text-base-content font-medium" }}
                  >
                    {({ isActive }: { isActive: boolean }) => (
                      <>
                        {isActive ? (
                          <div className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full bg-primary" />
                        ) : null}
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
