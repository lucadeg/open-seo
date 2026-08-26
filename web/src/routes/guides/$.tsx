/**
 * @file_id FILE-MVX-AUTO---001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP--
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
 * @generated_at 2026-05-13T13:53:39.702Z
 * @updated_at 2026-05-13T13:53:39.704Z
 * @hash sha256:e6e3c22af899fc0b58fdbe9c78b5fe847c57a3ecd3bae3508508bb202055a791
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:39.702Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { createClientLoader } from "fumadocs-mdx/runtime/vite";
import { DocsBody } from "fumadocs-ui/page";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { baseOptions } from "@/lib/layout.shared";
import { Suspense } from "react";
import { getGuidePost } from "@/lib/content.functions";
import { guide } from "../../../source.generated";
import { buildPageSeo } from "@/lib/seo";

export const Route = createFileRoute("/guides/$")({
  loader: async ({ params }: { params: { _splat?: string } }) => {
    const slugs = params._splat?.split("/") ?? [];
    const data = await getGuidePost({ data: slugs });
    await clientMdxLoader.preload(data.path);
    return data;
  },
  head: ({ loaderData }: { loaderData?: unknown }) => {
    const data = loaderData as
      | { title?: string; description?: string; url?: string }
      | undefined;
    const title = data?.title ?? "OpenSEO Guides";
    const description = data?.description;
    return buildPageSeo({
      title,
      description,
      path: data?.url ?? "/guides",
      titleSuffix: "OpenSEO Guides",
      ogType: "article",
    });
  },
  component: GuidePost,
});

const clientMdxLoader = createClientLoader(guide, {
  id: "guide",
  component({ default: MDX }) {
    return (
      <DocsBody className="text-fd-foreground [&_h2]:text-fd-foreground [&_h3]:text-fd-foreground [&_li]:text-fd-foreground/90 [&_p]:text-fd-foreground/90 [&_strong]:text-fd-foreground">
        <MDX
          components={{
            ...defaultMdxComponents,
          }}
        />
      </DocsBody>
    );
  },
});

function GuidePost() {
  const data = Route.useLoaderData() as {
    path: string;
    title: string;
    description?: string;
  };
  const Content = clientMdxLoader.getComponent(data.path);

  return (
    <HomeLayout {...baseOptions()}>
      <article className="max-w-3xl mx-auto px-6 py-12 md:py-24 text-fd-foreground">
        <GuideHeader title={data.title} description={data.description} />
        <Suspense>
          <Content />
        </Suspense>
      </article>
    </HomeLayout>
  );
}

function GuideHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-8">
      <div className="mb-4">
        <Link
          to="/guides"
          className="inline-flex items-center gap-2 text-sm font-medium text-fd-muted-foreground transition-colors hover:text-fd-primary"
        >
          <span aria-hidden="true">&larr;</span>
          <span>Back to Guides</span>
        </Link>
      </div>
      <h1 className="mb-4 text-4xl font-bold text-fd-foreground md:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="max-w-2xl text-lg leading-8 text-fd-muted-foreground md:text-xl">
          {description}
        </p>
      )}
    </header>
  );
}
