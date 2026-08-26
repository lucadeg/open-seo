import { env } from "cloudflare:workers";
import { sortBy } from "remeda";

/**
 * @file_id FILE-MVX-AUTO-R2-CACHE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-R2-CACHE
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
 * @generated_at 2026-05-13T13:53:38.428Z
 * @updated_at 2026-05-13T13:53:38.430Z
 * @hash sha256:1f361de49285ed8d52dbedc851a5f256305f01a8389a3aee623b6970718c0fc7
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:38.428Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */
export const CACHE_TTL = {
  /** Related keyword research results */
  researchResult: 86400,
} as const;

const CACHE_PREFIX = "dataforseo-cache/";

/**
 * Build a deterministic cache key from an endpoint slug and input params.
 * Uses a SHA-256 digest for stability across runtimes.
 */
export async function buildCacheKey(
  prefix: string,
  params: Record<string, unknown>,
): Promise<string> {
  const raw = JSON.stringify(
    Object.fromEntries(sortBy(Object.entries(params), ([key]) => key)),
  );

  return `${prefix}:${await sha256Hex(raw)}`;
}

/**
 * Get a cached JSON value from R2. Returns null on miss or expiry.
 * Callers should validate the shape with Zod before trusting it — schema
 * drift between writes and reads is otherwise silent.
 */
export async function getCached(key: string): Promise<unknown> {
  const obj = await env.R2.get(`${CACHE_PREFIX}${key}`);
  if (!obj) return null;

  const expiresAt = obj.customMetadata?.expiresAt;
  if (expiresAt && Date.parse(expiresAt) < Date.now()) return null;

  try {
    return JSON.parse(await obj.text());
  } catch {
    return null;
  }
}

/**
 * Store a JSON value in R2 with a soft TTL via custom metadata.
 */
export async function setCached<T>(
  key: string,
  data: T,
  ttlSeconds: number,
): Promise<void> {
  await env.R2.put(`${CACHE_PREFIX}${key}`, JSON.stringify(data), {
    httpMetadata: { contentType: "application/json" },
    customMetadata: {
      expiresAt: new Date(Date.now() + ttlSeconds * 1000).toISOString(),
    },
  });
}

/**
 * Compute a deterministic SHA-256 digest for cache keys.
 */
async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input),
  );

  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}
