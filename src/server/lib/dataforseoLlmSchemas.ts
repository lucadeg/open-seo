import { z } from "zod";

/**
 * @file_id FILE-MVX-AUTO-DATAFORSEOLLMSCHEMAS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-DATAFORSEOLLMSCHEMAS
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
 * @generated_at 2026-05-13T13:53:38.282Z
 * @updated_at 2026-05-13T13:53:38.284Z
 * @hash sha256:e40b2065771ebe4f3dec8661d568dc912bcdc83f697e81d0111ff9fbe08d482c
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:38.282Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

// ---------------------------------------------------------------------------
// LLM Mentions — shared bits
// ---------------------------------------------------------------------------

const monthlyVolumeSchema = z
  .object({
    year: z.number().int(),
    month: z.number().int().min(1).max(12),
    search_volume: z.number().nullable().optional(),
  })
  .passthrough();

const mentionSourceSchema = z
  .object({
    url: z.string().nullable().optional(),
    title: z.string().nullable().optional(),
    domain: z.string().nullable().optional(),
  })
  .passthrough();

const brandEntitySchema = z
  .object({
    title: z.string().nullable().optional(),
  })
  .passthrough();

// ---------------------------------------------------------------------------
// LLM Mentions Search — `/v3/ai_optimization/llm_mentions/search/live`
// Returns one row per LLM answer that matched the target.
// ---------------------------------------------------------------------------

export const llmMentionItemSchema = z
  .object({
    question: z.string().nullable().optional(),
    sources: z.array(mentionSourceSchema).nullable().optional(),
    ai_search_volume: z.number().nullable().optional(),
    monthly_searches: z.array(monthlyVolumeSchema).nullable().optional(),
    first_response_at: z.string().nullable().optional(),
    last_response_at: z.string().nullable().optional(),
    brand_entities: z.array(brandEntitySchema).nullable().optional(),
  })
  .passthrough();

export type LlmMentionItem = z.infer<typeof llmMentionItemSchema>;

// ---------------------------------------------------------------------------
// LLM Mentions Aggregated Metrics — `/v3/ai_optimization/llm_mentions/aggregated_metrics/live`
// Each metric category contains an array of group elements with mention counts.
// ---------------------------------------------------------------------------

const groupElementSchema = z
  .object({
    type: z.string().nullable().optional(),
    key: z.string().nullable().optional(),
    mentions: z.number().nullable().optional(),
    ai_search_volume: z.number().nullable().optional(),
    impressions: z.number().nullable().optional(),
  })
  .passthrough();

export const llmAggregatedTotalSchema = z
  .object({
    platform: z.array(groupElementSchema).nullable().optional(),
  })
  .passthrough();

export type LlmAggregatedTotal = z.infer<typeof llmAggregatedTotalSchema>;

// ---------------------------------------------------------------------------
// LLM Mentions Top Pages — `/v3/ai_optimization/llm_mentions/top_pages/live`
// Each item has `key` = page URL plus the same group-element arrays.
// ---------------------------------------------------------------------------

export const llmTopPagesItemSchema = z
  .object({
    key: z.string().nullable().optional(),
    platform: z.array(groupElementSchema).nullable().optional(),
  })
  .passthrough();

export type LlmTopPagesItem = z.infer<typeof llmTopPagesItemSchema>;

// ---------------------------------------------------------------------------
// LLM Responses — shared between ChatGPT/Claude/Gemini/Perplexity
// All four model endpoints return the same envelope shape.
// ---------------------------------------------------------------------------

const responseAnnotationSchema = z
  .object({
    type: z.string().nullable().optional(),
    title: z.string().nullable().optional(),
    url: z.string().nullable().optional(),
  })
  .passthrough();

const responseSectionSchema = z
  .object({
    type: z.string().nullable().optional(),
    text: z.string().nullable().optional(),
    annotations: z.array(responseAnnotationSchema).nullable().optional(),
  })
  .passthrough();

const responseItemSchema = z
  .object({
    type: z.string().nullable().optional(),
    sections: z.array(responseSectionSchema).nullable().optional(),
  })
  .passthrough();

export const llmResponseResultSchema = z
  .object({
    model_name: z.string().nullable().optional(),
    output_tokens: z.number().nullable().optional(),
    web_search: z.boolean().nullable().optional(),
    items: z.array(responseItemSchema).nullable().optional(),
    fan_out_queries: z.array(z.string()).nullable().optional(),
  })
  .passthrough();

export type LlmResponseResult = z.infer<typeof llmResponseResultSchema>;

// ---------------------------------------------------------------------------
// Top-level envelope used by every AI Optimization endpoint.
// We re-declare here (instead of reusing dataforseoSchemas.ts) because the
// `result` shape differs from Labs/SERP — items are not always under
// `result[0].items` and totals/items can both be present.
// ---------------------------------------------------------------------------

const llmTaskSchema = z
  .object({
    status_code: z.number().optional(),
    status_message: z.string().optional(),
    path: z.array(z.string()),
    cost: z.number(),
    result_count: z.number().nullable().optional(),
    result: z.array(z.unknown()).nullable().optional(),
  })
  .passthrough();

export type LlmDataforseoTask = z.infer<typeof llmTaskSchema>;

export const llmResponseEnvelopeSchema = z
  .object({
    status_code: z.number().optional(),
    status_message: z.string().optional(),
    tasks: z.array(llmTaskSchema).optional(),
  })
  .passthrough();
