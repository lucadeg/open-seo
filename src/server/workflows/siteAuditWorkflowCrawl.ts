/**
 * @file_id FILE-MVX-AUTO-SITEAUDITWORKFLOWCRAWL-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-SITEAUDITWORKFLOWCRAWL
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
 * @generated_at 2026-05-13T13:53:38.559Z
 * @updated_at 2026-05-13T13:53:38.561Z
 * @hash sha256:aea5c49d61ba651b4a8596a6229caec7eec86737f930d1389d19dffe7bd54bf8
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:38.559Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import type { WorkflowStep } from "cloudflare:workers";
import type { RobotsResult } from "@/server/lib/audit/discovery";
import type { StepPageResult } from "@/server/lib/audit/types";
import { isSameOrigin, normalizeUrl } from "@/server/lib/audit/url-utils";
import { AuditRepository } from "@/server/features/audit/repositories/AuditRepository";
import { AuditProgressKV } from "@/server/lib/audit/progress-kv";
import { crawlPage } from "@/server/workflows/site-audit-workflow-helpers";

const CRAWL_CONCURRENCY = 25;

function shouldQueueCrawlLink(
  link: string,
  origin: string,
  robots: RobotsResult,
  visited: Set<string>,
  queued: Set<string>,
): boolean {
  return (
    isSameOrigin(link, origin) &&
    robots.isAllowed(link) &&
    !visited.has(link) &&
    !queued.has(link)
  );
}

type CrawlPhaseParams = {
  auditId: string;
  workflowInstanceId: string;
  origin: string;
  startUrl: string;
  maxPages: number;
  robots: RobotsResult;
  sitemapUrls: string[];
};

export async function runCrawlPhase(
  step: WorkflowStep,
  params: CrawlPhaseParams,
): Promise<StepPageResult[]> {
  const {
    auditId,
    workflowInstanceId,
    origin,
    startUrl,
    maxPages,
    robots,
    sitemapUrls,
  } = params;
  const visited = new Set<string>();
  const queue: string[] = [];
  const queued = new Set<string>();
  const allPages: StepPageResult[] = [];

  seedCrawlQueue({
    startUrl,
    origin,
    robots,
    sitemapUrls,
    visited,
    queued,
    queue,
  });

  let crawlBatchIndex = 0;
  while (queue.length > 0 && allPages.length < maxPages) {
    const urlsToCrawl = selectNextCrawlBatch(
      queue,
      queued,
      visited,
      robots,
      maxPages - allPages.length,
    );
    if (urlsToCrawl.length === 0) continue;

    crawlBatchIndex += 1;
    const crawledBatch = await runCrawlBatch(
      step,
      crawlBatchIndex,
      urlsToCrawl,
      origin,
    );
    allPages.push(...crawledBatch);

    enqueueDiscoveredLinks({
      crawledBatch,
      queue,
      queued,
      visited,
      origin,
      robots,
    });
    await persistCrawlProgress({
      step,
      crawlBatchIndex,
      auditId,
      workflowInstanceId,
      crawledBatch,
      pagesCrawled: allPages.length,
      visitedCount: visited.size,
      queueLength: queue.length,
      maxPages,
    });
  }

  return allPages;
}

function seedCrawlQueue({
  startUrl,
  origin,
  robots,
  sitemapUrls,
  visited,
  queued,
  queue,
}: {
  startUrl: string;
  origin: string;
  robots: RobotsResult;
  sitemapUrls: string[];
  visited: Set<string>;
  queued: Set<string>;
  queue: string[];
}) {
  const normalizedStart = normalizeUrl(startUrl) ?? startUrl;
  if (
    robots.isAllowed(normalizedStart) &&
    isSameOrigin(normalizedStart, origin)
  ) {
    queue.push(normalizedStart);
    queued.add(normalizedStart);
  }

  for (const sitemapUrl of sitemapUrls) {
    const normalized = normalizeUrl(sitemapUrl);
    if (!normalized) continue;
    if (!shouldQueueCrawlLink(normalized, origin, robots, visited, queued)) {
      continue;
    }
    queue.push(normalized);
    queued.add(normalized);
  }
}

function selectNextCrawlBatch(
  queue: string[],
  queued: Set<string>,
  visited: Set<string>,
  robots: RobotsResult,
  remaining: number,
) {
  const batchSize = Math.min(CRAWL_CONCURRENCY, remaining);
  const urlsToCrawl: string[] = [];

  while (queue.length > 0 && urlsToCrawl.length < batchSize) {
    const url = queue.shift()!;
    queued.delete(url);
    if (visited.has(url)) continue;
    if (!robots.isAllowed(url)) continue;
    visited.add(url);
    urlsToCrawl.push(url);
  }

  return urlsToCrawl;
}

async function runCrawlBatch(
  step: WorkflowStep,
  crawlBatchIndex: number,
  urlsToCrawl: string[],
  origin: string,
): Promise<StepPageResult[]> {
  return step.do(`crawl-batch-${crawlBatchIndex}`, async () => {
    const settled = await Promise.allSettled(
      urlsToCrawl.map((url) => crawlPage(url, origin)),
    );
    return settled.flatMap((result) => {
      if (result.status === "fulfilled" && result.value) {
        return [result.value];
      }
      return [];
    });
  });
}

function enqueueDiscoveredLinks(params: {
  crawledBatch: StepPageResult[];
  queue: string[];
  queued: Set<string>;
  visited: Set<string>;
  origin: string;
  robots: RobotsResult;
}) {
  const { crawledBatch, queue, queued, visited, origin, robots } = params;
  for (const pageResult of crawledBatch) {
    for (const link of pageResult.internalLinks.filter((candidate) =>
      shouldQueueCrawlLink(candidate, origin, robots, visited, queued),
    )) {
      queue.push(link);
      queued.add(link);
    }
  }
}

async function persistCrawlProgress(params: {
  step: WorkflowStep;
  crawlBatchIndex: number;
  auditId: string;
  workflowInstanceId: string;
  crawledBatch: StepPageResult[];
  pagesCrawled: number;
  visitedCount: number;
  queueLength: number;
  maxPages: number;
}) {
  const {
    step,
    crawlBatchIndex,
    auditId,
    workflowInstanceId,
    crawledBatch,
    pagesCrawled,
    visitedCount,
    queueLength,
    maxPages,
  } = params;
  await step.do(`kv-progress-batch-${crawlBatchIndex}`, async () => {
    await AuditProgressKV.pushCrawledUrls(
      auditId,
      crawledBatch.map((pageResult) => ({
        url: pageResult.url,
        statusCode: pageResult.statusCode,
        title: pageResult.title,
        crawledAt: Date.now(),
      })),
    );
  });

  await step.do(`progress-batch-${crawlBatchIndex}`, async () => {
    await AuditRepository.updateAuditProgress(auditId, workflowInstanceId, {
      pagesCrawled,
      pagesTotal: Math.min(visitedCount + queueLength, maxPages),
    });
  });
}
