/**
 * @file_id FILE-MVX-AUTO-THEMEPREFERENCEMENUITEMS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-THEMEPREFERENCEMENUITEMS
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
 * @generated_at 2026-05-13T13:53:33.372Z
 * @updated_at 2026-05-13T13:53:33.373Z
 * @hash sha256:af7c4f6b24688021ef87d05af5fc89e9b294928f60112a47d21411b5d47d709b
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:33.372Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { Monitor, Moon, Sun } from "lucide-react";
import { type ThemePreference, useThemePreference } from "@/client/lib/theme";

const THEME_OPTIONS: {
  value: ThemePreference;
  label: string;
  icon: typeof Sun;
}[] = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

export function ThemePreferenceMenuItems() {
  const { themePreference, setThemePreference } = useThemePreference();

  return (
    <>
      <li className="menu-title pt-2">
        <span>Theme</span>
      </li>

      <li>
        <div
          role="radiogroup"
          aria-label="Theme preference"
          className="flex gap-0.5 rounded-lg bg-base-200 p-0.5"
        >
          {THEME_OPTIONS.map((option) => {
            const isActive = option.value === themePreference;
            const Icon = option.icon;

            return (
              <div
                key={option.value}
                className="tooltip tooltip-bottom flex flex-1 before:whitespace-nowrap"
                data-tip={option.label}
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  aria-label={option.label}
                  className={`flex flex-1 cursor-pointer items-center justify-center rounded-md px-2.5 py-1.5 transition-colors ${
                    isActive
                      ? "bg-base-100 text-base-content shadow-sm"
                      : "text-base-content/50 hover:text-base-content/80"
                  }`}
                  onClick={() => setThemePreference(option.value)}
                >
                  <Icon className="size-4" />
                </button>
              </div>
            );
          })}
        </div>
      </li>
    </>
  );
}
