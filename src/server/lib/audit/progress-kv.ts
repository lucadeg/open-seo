/**
 * @file_id FILE-MVX-AUTO-PROGRESS-KV-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-PROGRESS-KV
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
 * @generated_at 2026-05-13T13:53:37.907Z
 * @updated_at 2026-05-13T13:53:37.909Z
 * @hash sha256:084c6625301ed36b92675a8fe3ed6e028b40bdc6f0e28a681894df4ce9b7cfd0
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:37.907Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */
import { env } from "cloudflare:workers";
import { z } from "zod";
import { jsonCodec } from "@/shared/json";

const KV_PREFIX = "audit-progress:";
const TTL_SECONDS = 30 * 60; // 30 minutes
const MAX_ENTRIES = 300;

const crawledUrlEntrySchema = z.object({
  url: z.string(),
  statusCode: z.number(),
  title: z.string(),
  /** Unix timestamp ms when this page was crawled */
  crawledAt: z.number(),
});

type CrawledUrlEntry = z.infer<typeof crawledUrlEntrySchema>;

const crawledEntriesCodec = jsonCodec(z.array(crawledUrlEntrySchema));

function parseCrawledEntries(json: string | null): CrawledUrlEntry[] {
  if (!json) return [];
  const parsed = crawledEntriesCodec.safeParse(json);
  return parsed.success ? parsed.data : [];
}

function key(auditId: string): string {
  return `${KV_PREFIX}${auditId}`;
}

/**
 * Append a crawled URL entry to the progress list.
 * Newest entries are prepended so the array is sorted newest-first.
 */
async function pushCrawledUrl(
  auditId: string,
  entry: CrawledUrlEntry,
): Promise<void> {
  await pushCrawledUrls(auditId, [entry]);
}

/**
 * Append multiple crawled URL entries in one KV write.
 * New entries are prepended and the list is capped.
 */
async function pushCrawledUrls(
  auditId: string,
  nextEntries: CrawledUrlEntry[],
): Promise<void> {
  if (nextEntries.length === 0) return;

  const k = key(auditId);
  const existing = await env.KV.get(k, "text");
  const entries = parseCrawledEntries(existing);
  const merged = [...nextEntries, ...entries].slice(0, MAX_ENTRIES);

  await env.KV.put(k, JSON.stringify(merged), {
    expirationTtl: TTL_SECONDS,
  });
}

/**
 * Read all crawled URL entries for a running audit.
 * Returns newest-first.
 */
async function getCrawledUrls(auditId: string): Promise<CrawledUrlEntry[]> {
  const data = await env.KV.get(key(auditId), "text");
  return parseCrawledEntries(data);
}

/**
 * Delete the progress key (called after audit completes).
 */
async function clear(auditId: string): Promise<void> {
  await env.KV.delete(key(auditId));
}

export const AuditProgressKV = {
  pushCrawledUrl,
  pushCrawledUrls,
  getCrawledUrls,
  clear,
} as const;
