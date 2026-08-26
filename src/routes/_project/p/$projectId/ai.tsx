/**
 * @file_id FILE-MVX-AUTO-AI-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-AI
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
 * @generated_at 2026-05-13T13:53:36.592Z
 * @updated_at 2026-05-13T13:53:36.593Z
 * @hash sha256:14077f96c05fe9057507ac0433258277f04547ec7487e63643ad65e5c52f9d6e
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:36.592Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

const DISCORD_URL = "https://discord.gg/c9uGs3cFXr";
const SUPPORT_EMAIL = "ben@openseo.so";
const SAM_GITHUB_URL = "https://github.com/every-app/sam";
const DATAFORSEO_MCP_DOCS_URL =
  "https://dataforseo.com/help-center/setting-up-the-official-dataforseo-mcp-server-simple-guide";

export const Route = createFileRoute("/_project/p/$projectId/ai")({
  component: AiPage,
});

function AiPage() {
  return (
    <div className="px-4 py-12 md:px-6 md:py-20 pb-24 md:pb-8 overflow-auto">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold">AI & Agents</h1>
        <p className="mt-2 text-sm text-base-content/70 leading-relaxed">
          OpenSEO is brand new. Our goal is to build the most powerful and
          intuitive tool to help your websites rank better. AI will play a large
          role in that.
        </p>
        <p className="mt-3 text-sm text-base-content/70 leading-relaxed">
          Lots of other SEO tools have an overwhelming number of
          &ldquo;features&rdquo;. We think many of these can be hidden by
          default, only shown to you when you want them.
        </p>
        <p className="mt-3 text-sm text-base-content/70 leading-relaxed">
          This is community-driven — we want to hear what matters to you. Reach
          out on{" "}
          <a
            className="link link-primary"
            href={DISCORD_URL}
            target="_blank"
            rel="noreferrer"
          >
            Discord
          </a>{" "}
          or email{" "}
          <a className="link link-primary" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
          .
        </p>

        {/* Sam */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Sam: AI SEO Teammate</h2>
          <p className="mt-2 text-sm text-base-content/70 leading-relaxed">
            Sam turns your Claude Code or favorite coding agent into a powerful
            SEO teammate. Sam has a specialized workflow for writing great
            content, but you can teach Sam about your SEO workflow and needs and
            it will customize itself for you.
          </p>
          <p className="mt-3 text-sm text-base-content/70 leading-relaxed">
            Sam handles keyword research, source discovery, and drafting — with
            a built-in QA loop that checks quality and accuracy before you
            publish.
          </p>
          <p className="mt-3 text-sm text-base-content/70 leading-relaxed">
            Works with DataForSEO MCP for real SEO data. Model-agnostic — use it
            with Claude Code, GPT, or others.
          </p>
          <ul className="mt-4 space-y-2">
            {[
              "Keyword research & topic analysis",
              "Source discovery & verification",
              "Content drafting with QA",
            ].map((item) => (
              <li
                key={item}
                className="flex gap-2.5 text-sm text-base-content/70"
              >
                <span className="mt-[2px] shrink-0 text-base-content/40">
                  &mdash;
                </span>
                {item}
              </li>
            ))}
          </ul>
          <a
            href={SAM_GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-base-content hover:text-base-content/60 transition-colors"
          >
            View on GitHub
            <ArrowUpRight className="size-3.5" />
          </a>
        </section>

        {/* Use any coding agent */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Use any coding agent</h2>
          <p className="mt-2 text-sm text-base-content/70 leading-relaxed">
            Pair your preferred agent with the DataForSEO MCP server to access
            keyword volumes, SERP results, backlink profiles, and more.
          </p>
          <p className="mt-3 text-sm text-base-content/60">
            Claude Code &middot; Cursor &middot; Windsurf &middot; Codex
            &middot; any MCP-compatible agent
          </p>
          <a
            href={DATAFORSEO_MCP_DOCS_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-base-content hover:text-base-content/60 transition-colors"
          >
            DataForSEO MCP setup guide
            <ArrowUpRight className="size-3.5" />
          </a>
        </section>

        {/* Roadmap */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Roadmap</h2>
          <ul className="mt-4 space-y-4">
            {[
              {
                title: "In-app SEO Research Agent",
                description:
                  "Ask questions and run research without leaving OpenSEO",
              },
              {
                title: "Content Assistant",
                description:
                  "Generate drafts using saved keywords and business context",
              },
              {
                title: "More MCP integrations",
              },
            ].map((item) => (
              <li key={item.title}>
                <p className="flex gap-2.5 text-sm text-base-content/70">
                  <span className="mt-[2px] shrink-0 text-base-content/40">
                    &mdash;
                  </span>
                  <span>
                    <span className="font-medium text-base-content">
                      {item.title}
                    </span>
                    {item.description ? (
                      <>
                        <br />
                        {item.description}
                      </>
                    ) : null}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
