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
 * @generated_at 2026-05-13T13:53:39.728Z
 * @updated_at 2026-05-13T13:53:39.730Z
 * @hash sha256:f7611b3aca73a1e8861a30d4a8e69c03bbcfca5e0d64b61286dfccfe673a1f8b
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:39.728Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";
import { getGuidePosts } from "@/lib/content.functions";
import { buildPageSeo } from "@/lib/seo";

const guideIndexDescription = "Founder-focused guides from OpenSEO.";

export const Route = createFileRoute("/guides/")({
  head: () =>
    buildPageSeo({
      title: "OpenSEO Guides",
      description: guideIndexDescription,
      path: "/guides",
    }),
  component: GuideIndex,
  loader: async () => await getGuidePosts(),
});

function GuideIndex() {
  const guides = Route.useLoaderData();

  return (
    <HomeLayout {...baseOptions()}>
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-24">
        <h1 className="text-4xl font-bold mb-8">Guides</h1>

        {guides.length === 0 ? (
          <p className="text-fd-muted-foreground">
            No guides yet. Check back soon.
          </p>
        ) : (
          <div className="space-y-8">
            {guides.map((guide) => (
              <article key={guide.url} className="border-b pb-8 last:border-b-0">
                <Link
                  to="/guides/$"
                  params={{ _splat: guide.slugs.join("/") }}
                  className="group"
                >
                  <h2 className="text-2xl font-semibold group-hover:text-fd-primary transition-colors mb-2">
                    {guide.title}
                  </h2>
                  {guide.description && (
                    <p className="text-fd-muted-foreground">
                      {guide.description}
                    </p>
                  )}
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </HomeLayout>
  );
}
