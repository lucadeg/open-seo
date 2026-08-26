/**
 * @file_id FILE-MVX-AUTO-DISCOVERY-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-DISCOVERY
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
 * @generated_at 2026-05-13T13:53:37.848Z
 * @updated_at 2026-05-13T13:53:37.850Z
 * @hash sha256:a0f3b81a385d3913a1801e760dda07bb33fea3b82023354b0c3ac286afe286a8
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:37.848Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */
import robotsParser from "robots-parser";
import { XMLParser } from "fast-xml-parser";
import { isSameOrigin, normalizeUrl } from "./url-utils";

const SITEMAP_FETCH_TIMEOUT_MS = 15_000;
const MAX_SITEMAP_DEPTH = 3;
const MAX_SITEMAP_DOCS = 300;
const SITEMAP_CONCURRENCY = 5;
const SITEMAP_RETRIES = 1;

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  isArray: (name) => name === "sitemap" || name === "url",
});

export interface RobotsResult {
  isAllowed: (url: string) => boolean;
  sitemapUrls: string[];
}

/**
 * Fetch and parse robots.txt for a given origin.
 * Returns a helper to check if URLs are allowed + discovered sitemap URLs.
 */
export async function fetchRobotsTxt(origin: string): Promise<RobotsResult> {
  const robotsUrl = `${origin}/robots.txt`;
  try {
    const response = await fetch(robotsUrl, {
      headers: { "User-Agent": "OpenSEO-Audit/1.0" },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      // No robots.txt = everything allowed
      return {
        isAllowed: () => true,
        sitemapUrls: [],
      };
    }

    const text = await response.text();
    const robots = robotsParser(robotsUrl, text);

    return {
      isAllowed: (url: string) => robots.isAllowed(url) ?? true,
      sitemapUrls: robots.getSitemaps(),
    };
  } catch (error) {
    console.warn("Failed to fetch robots.txt:", error);
    return {
      isAllowed: () => true,
      sitemapUrls: [],
    };
  }
}

/**
 * Fetch and parse a sitemap (supports sitemap index recursion).
 * Returns a flat list of page URLs found.
 */
function isProbablySitemapXml(
  contentType: string | null,
  body: string,
): boolean {
  if (contentType?.toLowerCase().includes("xml")) {
    return true;
  }

  const trimmed = body.trimStart().toLowerCase();
  return (
    trimmed.startsWith("<?xml") ||
    trimmed.startsWith("<urlset") ||
    trimmed.startsWith("<sitemapindex")
  );
}

function getSitemapLocations(input: unknown): string[] {
  if (!input) return [];
  const entries = Array.isArray(input) ? input : [input];
  return entries
    .map((entry) => {
      if (isRecord(entry)) {
        const loc = entry["loc"];
        return typeof loc === "string" ? loc : null;
      }
      return null;
    })
    .filter((loc): loc is string => typeof loc === "string");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}

function getParsedSitemapSections(parsed: unknown): {
  sitemap: unknown;
  url: unknown;
} {
  if (!parsed || typeof parsed !== "object") {
    return { sitemap: undefined, url: undefined };
  }

  const root = parsed as {
    sitemapindex?: { sitemap?: unknown };
    urlset?: { url?: unknown };
  };

  return {
    sitemap: root.sitemapindex?.sitemap,
    url: root.urlset?.url,
  };
}

function isTimeoutError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  return "name" in error && error.name === "TimeoutError";
}

function parseXmlDocument(body: string): unknown {
  return xmlParser.parse(body) as unknown;
}

async function fetchSitemapDocumentWithRetry(sitemapUrl: string): Promise<{
  nestedSitemaps: string[];
  pageUrls: string[];
  timedOut: boolean;
}> {
  const normalizedSitemapUrl = normalizeUrl(sitemapUrl);
  if (!normalizedSitemapUrl) {
    return { nestedSitemaps: [], pageUrls: [], timedOut: false };
  }

  let lastError: unknown = null;

  for (let attempt = 0; attempt <= SITEMAP_RETRIES; attempt++) {
    try {
      const response = await fetch(normalizedSitemapUrl, {
        headers: { "User-Agent": "OpenSEO-Audit/1.0" },
        signal: AbortSignal.timeout(SITEMAP_FETCH_TIMEOUT_MS),
      });

      const finalUrl = normalizeUrl(response.url, normalizedSitemapUrl);
      if (!finalUrl || !isSameOrigin(finalUrl, normalizedSitemapUrl)) {
        return { nestedSitemaps: [], pageUrls: [], timedOut: false };
      }

      if (!response.ok) {
        return { nestedSitemaps: [], pageUrls: [], timedOut: false };
      }

      const body = await response.text();
      if (!isProbablySitemapXml(response.headers.get("content-type"), body)) {
        return { nestedSitemaps: [], pageUrls: [], timedOut: false };
      }

      const parsed = parseXmlDocument(body);
      const sections = getParsedSitemapSections(parsed);
      const nestedSitemaps = getSitemapLocations(sections.sitemap)
        .map((loc) => normalizeUrl(loc, finalUrl))
        .filter((loc): loc is string => loc !== null);
      const pageUrls = getSitemapLocations(sections.url)
        .map((loc) => normalizeUrl(loc, finalUrl))
        .filter((loc): loc is string => loc !== null);

      return { nestedSitemaps, pageUrls, timedOut: false };
    } catch (error) {
      lastError = error;
      if (!isTimeoutError(error) || attempt === SITEMAP_RETRIES) {
        break;
      }
    }
  }

  return {
    nestedSitemaps: [],
    pageUrls: [],
    timedOut: isTimeoutError(lastError),
  };
}

/**
 * Discover all page URLs from robots.txt + sitemaps for an origin.
 * Also tries the default /sitemap.xml if not listed in robots.txt.
 */
export async function discoverUrls(
  origin: string,
  maxPages = 50,
): Promise<{ urls: string[]; robots: RobotsResult; sitemapUrls: Set<string> }> {
  const robots = await fetchRobotsTxt(origin);

  // Collect sitemap URLs: from robots.txt + default location
  const sitemapSources = new Set(robots.sitemapUrls);
  sitemapSources.add(`${origin}/sitemap.xml`);

  const maxDiscoveredUrls = Math.min(Math.max(maxPages * 20, 500), 50_000);
  const allUrls = new Set<string>();

  const queue: Array<{ url: string; depth: number }> = Array.from(
    sitemapSources,
  )
    .map((url) => normalizeUrl(url, origin))
    .filter((url): url is string => url !== null)
    .filter((url) => isSameOrigin(url, origin))
    .map((url) => ({ url, depth: MAX_SITEMAP_DEPTH }));
  const seenSitemapDocs = new Set<string>();
  let fetchedDocs = 0;
  let failedDocs = 0;
  let timedOutDocs = 0;

  while (queue.length > 0 && allUrls.size < maxDiscoveredUrls) {
    if (fetchedDocs >= MAX_SITEMAP_DOCS) {
      break;
    }
    const batch = queue.splice(0, SITEMAP_CONCURRENCY);
    await Promise.all(
      batch.map(async ({ url, depth }) => {
        const normalizedUrl = normalizeUrl(url);
        if (
          !normalizedUrl ||
          !isSameOrigin(normalizedUrl, origin) ||
          depth <= 0 ||
          seenSitemapDocs.has(normalizedUrl)
        ) {
          return;
        }

        seenSitemapDocs.add(normalizedUrl);
        fetchedDocs += 1;

        const result = await fetchSitemapDocumentWithRetry(normalizedUrl);
        if (
          result.pageUrls.length === 0 &&
          result.nestedSitemaps.length === 0
        ) {
          failedDocs += 1;
          if (result.timedOut) {
            timedOutDocs += 1;
          }
          return;
        }

        for (const pageUrl of result.pageUrls) {
          if (!isSameOrigin(pageUrl, origin)) continue;
          if (allUrls.size >= maxDiscoveredUrls) break;
          allUrls.add(pageUrl);
        }

        if (depth <= 1) return;

        for (const nestedUrl of result.nestedSitemaps) {
          if (!isSameOrigin(nestedUrl, origin)) continue;
          if (!seenSitemapDocs.has(nestedUrl)) {
            queue.push({ url: nestedUrl, depth: depth - 1 });
          }
        }
      }),
    );
  }

  if (failedDocs > 0) {
    console.warn(
      `Sitemap discovery completed with partial failures for ${origin}: fetched=${fetchedDocs}, failed=${failedDocs}, timedOut=${timedOutDocs}, discoveredUrls=${allUrls.size}`,
    );
  }

  return {
    urls: Array.from(allUrls),
    robots,
    sitemapUrls: allUrls,
  };
}
