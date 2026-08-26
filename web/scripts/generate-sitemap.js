/**
 * @file_id FILE-MVX-AUTO-GENERATE-SITEMAP-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-GENERATE-SITEMAP
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
 * @generated_at 2026-05-13T13:53:39.418Z
 * @updated_at 2026-05-13T13:53:39.420Z
 * @hash sha256:5873d8e1c9a2a14ac6df8670812f52f4f7c55ba40d3c8bc394ddcec9c72eba84
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:39.418Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

#!/usr/bin/env node

import { existsSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIST_DIR = join(__dirname, "../dist/client");
const GUIDE_CONTENT_DIR = join(__dirname, "../content/guides");

const DEFAULT_SITE_URL = "https://openseo.so";
const SITE_URL = (process.env.SITE_URL ?? DEFAULT_SITE_URL).replace(/\/+$/, "");

const STATIC_PATHS = [
  "/",
  "/pricing",
  "/privacy",
  "/terms-and-conditions",
  "/guides",
];

function getGuideEntries(dir = GUIDE_CONTENT_DIR, segments = []) {
  if (!existsSync(dir)) {
    return [];
  }

  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith(".")) {
      return [];
    }

    const entryPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      return getGuideEntries(entryPath, [...segments, entry.name]);
    }

    if (!entry.isFile() || !/\.(md|mdx)$/i.test(entry.name)) {
      return [];
    }

    const slug = entry.name.replace(/\.(md|mdx)$/i, "");
    return [
      {
        path: `/guides/${[...segments, slug].join("/")}`,
        lastmod: statSync(entryPath).mtime.toISOString(),
      },
    ];
  });
}

function toCanonicalUrl(path) {
  if (path === "/") {
    return `${SITE_URL}/`;
  }

  return `${SITE_URL}${path.replace(/\/+$/, "")}`;
}

function main() {
  if (!existsSync(DIST_DIR) || !statSync(DIST_DIR).isDirectory()) {
    throw new Error(`Build output directory does not exist: ${DIST_DIR}`);
  }

  const entries = new Map();
  for (const path of STATIC_PATHS) {
    entries.set(path, { path, lastmod: null });
  }
  for (const guide of getGuideEntries()) {
    entries.set(guide.path, guide);
  }

  const sorted = Array.from(entries.values()).sort((a, b) =>
    toCanonicalUrl(a.path).localeCompare(toCanonicalUrl(b.path)),
  );

  const sitemapBody = sorted
    .map(({ path, lastmod }) => {
      const loc = toCanonicalUrl(path);
      const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";
      return `  <url>\n    <loc>${loc}</loc>${lastmodTag}\n  </url>`;
    })
    .join("\n");

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapBody}\n</urlset>\n`;

  const sitemapPath = join(DIST_DIR, "sitemap.xml");
  writeFileSync(sitemapPath, sitemapXml);

  console.log(`Generated sitemap with ${sorted.length} URLs at ${sitemapPath}`);
}

main();
