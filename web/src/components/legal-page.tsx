/**
 * @file_id FILE-MVX-AUTO-LEGAL-PAGE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-LEGAL-PAGE
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
 * @generated_at 2026-05-13T13:53:39.455Z
 * @updated_at 2026-05-13T13:53:39.457Z
 * @hash sha256:b60ed92d2cd3955eac7a372aa9e272d798e65845abb01a664512e4ce57c3c8a6
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:39.455Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { HomeLayout } from "fumadocs-ui/layouts/home";
import { DocsBody } from "fumadocs-ui/page";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { baseOptions } from "@/lib/layout.shared";

type LegalPageProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function LegalPage({ title, description, children }: LegalPageProps) {
  return (
    <HomeLayout {...baseOptions()}>
      <article className="max-w-3xl mx-auto px-6 py-12 md:py-24">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          {description ? (
            <p className="text-lg text-fd-muted-foreground">{description}</p>
          ) : null}
        </header>

        <DocsBody>{children}</DocsBody>

        <div className="mt-12 border-t border-neutral-200 pt-8">
          <SiteFooter className="text-xs text-neutral-600 [&_a]:transition-colors [&_a]:hover:text-neutral-900" />
        </div>
      </article>
    </HomeLayout>
  );
}
