/**
 * @file_id FILE-MVX-AUTO-INDEX-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-INDEX
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
 * @generated_at 2026-05-13T13:53:39.800Z
 * @updated_at 2026-05-13T13:53:39.802Z
 * @hash sha256:3d11321e25f9ac54959a0a3c3b1fd99802ef220c048d8da03fd1c62933a6285b
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:39.800Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { createFileRoute } from "@tanstack/react-router";
import { buildPageSeo } from "@/lib/seo";

const homeTitle = "OpenSEO - Open Source SEO Platform";
const homeDescription =
  "Own your SEO. OpenSEO helps teams manage keyword research, backlink analysis, competitor monitoring, and site audits without expensive monthly SEO software subscriptions.";

export const Route = createFileRoute("/_marketing/")({
  head: () =>
    buildPageSeo({
      title: homeTitle,
      description: homeDescription,
      path: "/",
      imageAlt: "OpenSEO keyword research dashboard preview",
    }),
  component: Home,
});

// ─── Page ────────────────────────────────────────────────────────────

function Home() {
  return (
    <>
      {/* Headline */}
      <h1 className="text-3xl font-bold tracking-tight leading-tight">
        Own your SEO
      </h1>

      <p className="text-neutral-700 mt-4 leading-relaxed">
        Open source alternative to Semrush and Ahrefs
      </p>

      {/* Features */}
      <ul className="mt-5 space-y-3">
        {[
          "Keyword Research",
          "Backlink Analysis",
          "Competitor Insights",
          "Rank Tracking",
          "AI Visibility",
        ].map((item) => (
          <li key={item} className="flex gap-2.5 text-sm text-neutral-800">
            <span className="text-neutral-500 mt-[2px]">&mdash;</span>
            {item}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-6">
        <a
          href="https://app.openseo.so/sign-up"
          className="inline-flex items-center justify-center h-10 px-5 text-sm font-medium bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-colors"
        >
          Try now
        </a>
        <p className="text-xs text-neutral-500 mt-3">
          No credit card required.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-8">
        {/* Self-host — after video on mobile, before on desktop */}
        <div className="order-2 md:order-1 rounded-lg border border-neutral-200 bg-neutral-50 px-5 py-5">
          <p className="text-sm font-semibold text-neutral-900">
            Self-host via Docker or Cloudflare
          </p>
          <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
            100% open source (MIT). Bring your own DataForSEO api key. Fork and
            vibe code custom features for your workflow.
          </p>
          <a
            href="https://github.com/every-app/open-seo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-neutral-900 hover:text-neutral-700 transition-colors"
          >
            View on GitHub
            <span aria-hidden="true">&rarr;</span>
          </a>
          <hr className="mt-4" />
          <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
            Don&apos;t want to self-host?{" "}
            <a
              href="https://app.openseo.so/sign-up"
              className="font-medium text-neutral-900 hover:text-neutral-700 transition-colors"
            >
              Try the managed version.
            </a>
          </p>
        </div>

        {/* Demo */}
        <div className="order-1 md:order-2">
          <video
            className="w-full rounded-md border border-neutral-200"
            width={1280}
            height={808}
            poster="/demo-poster.webp"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-label="OpenSEO product demo"
          >
            <source src="/demo.webm" type="video/webm" />
            <source src="/demo.mp4" type="video/mp4" />
            <img
              src="/demo-poster.webp"
              alt="OpenSEO product demo"
              width={1280}
              height={808}
              className="w-full rounded-md border border-neutral-200"
              loading="lazy"
              decoding="async"
            />
          </video>
          <p className="text-[11px] text-neutral-600 mt-2">
            Keyword research in OpenSEO
          </p>
        </div>
      </div>
    </>
  );
}
