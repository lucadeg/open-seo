/**
 * @file_id FILE-MVX-AUTO-DATAFORSEO-API-KEY-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-DATAFORSEO-API-KEY
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
 * @generated_at 2026-05-13T13:53:36.421Z
 * @updated_at 2026-05-13T13:53:36.422Z
 * @hash sha256:9c2e7edbadbaa095592e37b3c2478301328012c113920edd4befbcbaac3999ea
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:36.421Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { createFileRoute } from "@tanstack/react-router";

const DATAFORSEO_API_ACCESS_URL = "https://app.dataforseo.com/api-access";

export const Route = createFileRoute("/_app/help/dataforseo-api-key")({
  component: DataforseoApiKeyHelpPage,
});

function DataforseoApiKeyHelpPage() {
  return (
    <div className="px-4 py-4 md:px-6 md:py-6 pb-24 md:pb-8 overflow-auto">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body gap-3">
            <h1 className="text-2xl font-semibold">
              Set up your DataForSEO API key
            </h1>
            <p className="text-sm text-base-content/70">
              OpenSEO needs the <code>DATAFORSEO_API_KEY</code> secret before
              keyword, domain, and SEO data workflows can run.
            </p>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-300">
          <div className="card-body gap-4">
            <h2 className="card-title text-base">Steps</h2>
            <ol className="list-decimal pl-5 text-sm space-y-3 text-base-content/80">
              <li>
                Go to{" "}
                <a
                  className="link link-primary"
                  href={DATAFORSEO_API_ACCESS_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  DataForSEO API Access
                </a>{" "}
                and request API credentials by email.
              </li>
              <li>
                Base64 encode your DataForSEO login and API password in this
                format:
                <pre className="mt-2 p-3 rounded bg-base-200 border border-base-300 overflow-x-auto text-xs">
                  <code>printf '%s' 'YOUR_LOGIN:YOUR_PASSWORD' | base64</code>
                </pre>
              </li>
              <li>
                Save the output as the <code>DATAFORSEO_API_KEY</code> secret in
                your environment.
              </li>
            </ol>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-300">
          <div className="card-body gap-2 text-sm text-base-content/75">
            <h2 className="card-title text-base">
              Cloudflare Workers (Dashboard UI)
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-base-content/80">
              <li>
                In Cloudflare, go to <code>Compute</code> -&gt;{" "}
                <code>Workers &amp; Pages</code>
                and open your OpenSEO Worker.
              </li>
              <li>
                Open <code>Settings</code>.
              </li>
              <li>
                Go to <code>Variables &amp; Secrets</code> and add a new secret
                named
                <code className="mx-1">DATAFORSEO_API_KEY</code>.
              </li>
              <li>
                Paste the base64 value from the terminal command above and save.
              </li>
            </ol>

            <div className="divider my-1" />

            <p>Or set the same secret from your terminal with:</p>
            <pre className="p-3 rounded bg-base-200 border border-base-300 overflow-x-auto text-xs">
              <code>npx wrangler secret put DATAFORSEO_API_KEY</code>
            </pre>
            <p>
              Use the base64 value of <code>login:password</code> when prompted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
