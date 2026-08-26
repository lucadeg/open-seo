/**
 * @file_id FILE-MVX-AUTO-SEO-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-SEO
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
 * @generated_at 2026-05-13T13:53:39.581Z
 * @updated_at 2026-05-13T13:53:39.582Z
 * @hash sha256:39fb2d2c1cbafffc530d74f566ad3e1de5180e21f3b1558fcb0f93b575dd536f
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:39.581Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

const DEFAULT_SITE_URL = "https://openseo.so";
const DEFAULT_SOCIAL_IMAGE_PATH = "/social-card.png";
const DEFAULT_SOCIAL_IMAGE_ALT = "OpenSEO product preview";

export const SITE_URL = (
  process.env.SITE_URL ??
  process.env.VITE_SITE_URL ??
  DEFAULT_SITE_URL
).replace(/\/+$/, "");

export function toCanonicalPath(path: string): string {
  if (!path || path === "/") return "/";

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized.replace(/\/+$/, "");
}

export function toCanonicalUrl(path: string): string {
  return new URL(toCanonicalPath(path), `${SITE_URL}/`).href;
}

type BuildSeoParams = {
  title: string;
  path: string;
  description?: string;
  titleSuffix?: string;
  ogType?: "website" | "article";
  imagePath?: string;
  imageAlt?: string;
};

export function buildPageSeo({
  title,
  path,
  description,
  titleSuffix,
  ogType = "website",
  imagePath = DEFAULT_SOCIAL_IMAGE_PATH,
  imageAlt = DEFAULT_SOCIAL_IMAGE_ALT,
}: BuildSeoParams) {
  const fullTitle = titleSuffix ? `${title} - ${titleSuffix}` : title;
  const canonicalUrl = toCanonicalUrl(path);
  const socialImageUrl = toCanonicalUrl(imagePath);

  return {
    meta: [
      { title: fullTitle },
      ...(description ? [{ name: "description", content: description }] : []),
      { property: "og:site_name", content: "OpenSEO" },
      { property: "og:type", content: ogType },
      { property: "og:title", content: fullTitle },
      ...(description
        ? [{ property: "og:description", content: description }]
        : []),
      { property: "og:url", content: canonicalUrl },
      { property: "og:image", content: socialImageUrl },
      { property: "og:image:alt", content: imageAlt },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      ...(description
        ? [{ name: "twitter:description", content: description }]
        : []),
      { name: "twitter:image", content: socialImageUrl },
      { name: "twitter:image:alt", content: imageAlt },
    ],
    links: [{ rel: "canonical", href: canonicalUrl }],
  };
}
