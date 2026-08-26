/**
 * @file_id FILE-MVX-AUTO-AUTHCONFIGERRORCARD-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-AUTHCONFIGERRORCARD
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
 * @generated_at 2026-05-13T13:53:33.058Z
 * @updated_at 2026-05-13T13:53:33.059Z
 * @hash sha256:38bbb2beb2925571fe677e2ace6a5c8b8c8d78d0482c0ae8c04c933a8bc073e7
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:33.058Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { ShieldAlert } from "lucide-react";

const README_CLOUDFLARE_ACCESS_URL =
  "https://github.com/every-app/open-seo#cloudflare-deployment--access-setup";

type AuthConfigErrorCardProps = {
  message: string;
  onRetry?: () => void;
};

export function AuthConfigErrorCard({
  message,
  onRetry,
}: AuthConfigErrorCardProps) {
  return (
    <div className="card w-full max-w-2xl bg-base-100 border border-base-300 shadow-xl">
      <div className="card-body gap-4">
        <h2 className="card-title gap-2">
          <ShieldAlert className="size-5 text-error" />
          Authentication setup required
        </h2>

        <div className="alert alert-error">
          <span>{message}</span>
        </div>

        <p className="text-sm text-base-content/70">
          Check the auth environment variables for your selected
          <code className="mx-1">AUTH_MODE</code>. Cloudflare Access requires
          <code className="mx-1">TEAM_DOMAIN</code> and
          <code className="mx-1">POLICY_AUD</code>. Hosted mode requires
          <code className="mx-1">BETTER_AUTH_SECRET</code> and
          <code className="ml-1">BETTER_AUTH_URL</code>.
        </p>

        <div className="card-actions justify-end">
          {onRetry ? (
            <button className="btn btn-ghost btn-sm" onClick={onRetry}>
              Try Again
            </button>
          ) : null}
          <a
            className="btn btn-primary btn-sm"
            href={README_CLOUDFLARE_ACCESS_URL}
            target="_blank"
            rel="noreferrer"
          >
            Open Setup Guide
          </a>
        </div>
      </div>
    </div>
  );
}
