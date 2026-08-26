/**
 * @file_id FILE-MVX-AUTO-AISEARCHPAIDPLANGATE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-AISEARCHPAIDPLANGATE
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
 * @generated_at 2026-05-13T13:53:33.437Z
 * @updated_at 2026-05-13T13:53:33.438Z
 * @hash sha256:c3ca3e27cfe13a47deda25fec4843f2e810c95c4be44a525a9df4f74467fa042
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:33.437Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { Link } from "@tanstack/react-router";
import { Sparkles, type LucideIcon } from "lucide-react";
import { SUBSCRIBE_ROUTE } from "@/shared/billing";

type Props = {
  feature: string;
  description: string;
  bullets: Array<{ icon: LucideIcon; title: string; body: string }>;
};

export function AiSearchPaidPlanGate({ feature, description, bullets }: Props) {
  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm">
      <div className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xl space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" />
            Paid plan
          </span>
          <h2 className="text-xl font-semibold tracking-tight">
            Unlock {feature}
          </h2>
          <p className="text-sm text-base-content/70">{description}</p>
        </div>
        <Link
          to={SUBSCRIBE_ROUTE}
          search={{ upgrade: true }}
          className="btn btn-primary shrink-0"
        >
          Upgrade
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 border-t border-base-300 px-6 py-6 sm:grid-cols-3">
        {bullets.map(({ icon: Icon, title, body }) => (
          <div key={title} className="space-y-2">
            <div className="inline-flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-4" />
            </div>
            <h3 className="text-sm font-semibold">{title}</h3>
            <p className="text-xs leading-relaxed text-base-content/65">
              {body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
