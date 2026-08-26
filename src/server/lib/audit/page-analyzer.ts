/**
 * @file_id FILE-MVX-AUTO-PAGE-ANALYZER-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-PAGE-ANALYZER
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
 * @generated_at 2026-05-13T13:53:37.873Z
 * @updated_at 2026-05-13T13:53:37.875Z
 * @hash sha256:c11a3c48dd5379ccbe8b149c8ea0bd6572a16f5bb2c1c75aea45df53383443d0
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:37.873Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */
import * as cheerio from "cheerio";
import { normalizeUrl, isSameOrigin } from "./url-utils";
import type { PageAnalysis } from "./types";

/**
 * Analyze an HTML string and extract all SEO-relevant data.
 */
export function analyzeHtml(
  html: string,
  pageUrl: string,
  statusCode: number,
  responseTimeMs: number,
  redirectUrl: string | null = null,
): PageAnalysis {
  const $ = cheerio.load(html);

  // --- Title ---
  const title = $("title").first().text().trim();

  // --- Meta description ---
  const metaDescription =
    $('meta[name="description"]').first().attr("content")?.trim() ?? "";

  // --- Canonical ---
  const canonical = $('link[rel="canonical"]').first().attr("href") ?? null;

  // --- Robots meta ---
  const robotsMeta = $('meta[name="robots"]').first().attr("content") ?? null;

  // --- Open Graph ---
  const ogTitle =
    $('meta[property="og:title"]').first().attr("content") ?? null;
  const ogDescription =
    $('meta[property="og:description"]').first().attr("content") ?? null;
  const ogImage =
    $('meta[property="og:image"]').first().attr("content") ?? null;

  // --- Headings ---
  const h1s: string[] = [];
  $("h1").each((_, el) => {
    h1s.push($(el).text().trim());
  });

  const headingOrder: number[] = [];
  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    const tag =
      "tagName" in el && typeof el.tagName === "string"
        ? el.tagName.toLowerCase()
        : null;
    if (tag) {
      const level = parseInt(tag.charAt(1), 10);
      if (!isNaN(level)) headingOrder.push(level);
    }
  });

  // --- Word count (visible text in body) ---
  // Remove script/style/noscript tags, then count words in remaining text
  const bodyClone = $("body").clone();
  bodyClone.find("script, style, noscript, svg").remove();
  const bodyText = bodyClone.text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText ? bodyText.split(/\s+/).length : 0;

  // --- Images ---
  const images: Array<{ src: string | null; alt: string | null }> = [];
  $("img").each((_, el) => {
    images.push({
      src: $(el).attr("src") ?? null,
      alt: $(el).attr("alt") ?? null,
    });
  });

  // --- Links ---
  const internalLinks: string[] = [];
  const externalLinks: string[] = [];

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;

    // Skip javascript:, mailto:, tel:, #anchors
    if (/^(javascript:|mailto:|tel:|#)/.test(href)) return;

    const resolved = normalizeUrl(href, pageUrl);
    if (!resolved) return;

    if (isSameOrigin(resolved, pageUrl)) {
      internalLinks.push(resolved);
    } else {
      externalLinks.push(resolved);
    }
  });

  // --- Structured data (JSON-LD) ---
  let hasStructuredData = false;
  $('script[type="application/ld+json"]').each(() => {
    hasStructuredData = true;
  });

  // --- Hreflang ---
  const hreflangTags: string[] = [];
  $('link[rel="alternate"][hreflang]').each((_, el) => {
    const hreflang = $(el).attr("hreflang");
    if (hreflang) hreflangTags.push(hreflang);
  });

  return {
    url: pageUrl,
    statusCode,
    redirectUrl,
    responseTimeMs,
    title,
    metaDescription,
    canonical,
    robotsMeta,
    ogTitle,
    ogDescription,
    ogImage,
    h1s,
    headingOrder,
    wordCount,
    images,
    internalLinks,
    externalLinks,
    hasStructuredData,
    hreflangTags,
  };
}
