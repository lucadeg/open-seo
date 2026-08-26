import { z } from "zod";

/**
 * @file_id FILE-MVX-AUTO-AI-SEARCH-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-AI-SEARCH
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
 * @generated_at 2026-05-13T13:53:39.039Z
 * @updated_at 2026-05-13T13:53:39.040Z
 * @hash sha256:dcc0bb4ba64e1bb76c3b4468b017ba6d344e3c915663ee6d002d2944ea064b49
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:39.039Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

// ---------------------------------------------------------------------------
// AI Search access setup (self-hosted mode only)
// ---------------------------------------------------------------------------

export const aiSearchProjectSchema = z.object({
  projectId: z.string().min(1),
});

// ---------------------------------------------------------------------------
// Brand Lookup
// ---------------------------------------------------------------------------

/** Maximum allowed length for a free-text brand or domain search input. */
export const BRAND_LOOKUP_MAX_INPUT_LENGTH = 250;

export const brandLookupInputSchema = z.object({
  projectId: z.string().min(1),
  query: z.string().trim().min(1).max(BRAND_LOOKUP_MAX_INPUT_LENGTH),
  locationCode: z.number().int().positive().default(2840),
  languageCode: z.string().min(2).max(8).default("en"),
});

export type BrandLookupInput = z.infer<typeof brandLookupInputSchema>;

const brandPlatformBreakdownSchema = z.object({
  platform: z.enum(["chat_gpt", "google"]),
  status: z.enum(["success", "error"]),
  mentions: z.number().int().nonnegative().nullable(),
  aiSearchVolume: z.number().int().nonnegative().nullable(),
  impressions: z.number().int().nonnegative().nullable(),
});

const brandTopPageSchema = z.object({
  url: z.string(),
  domain: z.string().nullable(),
  mentions: z.number().int().nonnegative().nullable(),
  platform: z.enum(["chat_gpt", "google"]),
});

const brandTopQuerySchema = z.object({
  question: z.string(),
  platform: z.enum(["chat_gpt", "google"]),
  aiSearchVolume: z.number().int().nonnegative().nullable(),
  firstSeenAt: z.string().nullable(),
  lastSeenAt: z.string().nullable(),
  citedSources: z
    .array(
      z.object({
        url: z.string(),
        domain: z.string().nullable(),
        title: z.string().nullable(),
      }),
    )
    .max(10),
  brandsMentioned: z.array(z.string()).max(20),
});

const brandMonthlyVolumeSchema = z.object({
  year: z.number().int(),
  month: z.number().int().min(1).max(12),
  volume: z.number().int().nonnegative().nullable(),
});

export const brandLookupResultSchema = z.object({
  query: z.string(),
  detectedTargetType: z.enum(["domain", "keyword"]),
  resolvedTarget: z.string(),
  fetchedAt: z.string(),
  hasData: z.boolean(),
  totalMentions: z.number().int().nonnegative().nullable(),
  totalAiSearchVolume: z.number().int().nonnegative().nullable(),
  totalImpressions: z.number().int().nonnegative().nullable(),
  perPlatform: z.array(brandPlatformBreakdownSchema),
  topPages: z.array(brandTopPageSchema).max(20),
  topQueries: z.array(brandTopQuerySchema).max(50),
  monthlyVolume: z.array(brandMonthlyVolumeSchema),
});

export type BrandLookupResult = z.infer<typeof brandLookupResultSchema>;

// ---------------------------------------------------------------------------
// Prompt Explorer
// ---------------------------------------------------------------------------

export const PROMPT_EXPLORER_MAX_PROMPT_LENGTH = 500;

/** Stable identifiers for the four LLM models we expose. */
export const PROMPT_EXPLORER_MODELS = [
  "chat_gpt",
  "claude",
  "gemini",
  "perplexity",
] as const;

export const promptExplorerModelSchema = z.enum(PROMPT_EXPLORER_MODELS);
export type PromptExplorerModel = z.infer<typeof promptExplorerModelSchema>;

/**
 * Two-letter ISO country code passed as `web_search_country_iso_code` to each
 * LLM Responses endpoint. Affects the web-search component of the answer
 * (Perplexity, GPT-5, Gemini, Claude when web search is on). DataForSEO
 * accepts any ISO-2 for ChatGPT/Gemini; Claude/Perplexity have a finite
 * supported list. We only expose codes covered by all four.
 */
export const WEB_SEARCH_COUNTRY_CODES = [
  "US",
  "GB",
  "CA",
  "AU",
  "IE",
  "DE",
  "FR",
  "ES",
  "IT",
  "NL",
  "PT",
  "PL",
  "SE",
  "NO",
  "DK",
  "BR",
  "MX",
  "IN",
  "JP",
  "KR",
  "SG",
  "HK",
  "TW",
  "ZA",
] as const;

export const webSearchCountryCodeSchema = z.enum(WEB_SEARCH_COUNTRY_CODES);
export type WebSearchCountryCode = z.infer<typeof webSearchCountryCodeSchema>;

export const promptExplorerInputSchema = z.object({
  projectId: z.string().min(1),
  prompt: z.string().trim().min(1).max(PROMPT_EXPLORER_MAX_PROMPT_LENGTH),
  models: z.array(promptExplorerModelSchema).min(1).max(4),
  highlightBrand: z
    .string()
    .trim()
    .min(1)
    .max(BRAND_LOOKUP_MAX_INPUT_LENGTH)
    .optional(),
  webSearch: z.boolean().default(true),
  webSearchCountryCode: webSearchCountryCodeSchema.optional(),
});

export type PromptExplorerInput = z.infer<typeof promptExplorerInputSchema>;

const promptExplorerCitationSchema = z.object({
  url: z.string(),
  domain: z.string().nullable(),
  title: z.string().nullable(),
  matchedBrand: z.boolean(),
});

export type PromptExplorerCitation = z.infer<
  typeof promptExplorerCitationSchema
>;

export const promptExplorerModelResultSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("success"),
    model: promptExplorerModelSchema,
    modelName: z.string().nullable(),
    text: z.string(),
    citations: z.array(promptExplorerCitationSchema),
    fanOutQueries: z.array(z.string()),
    brandMentioned: z.boolean().nullable(),
    outputTokens: z.number().int().nonnegative().nullable(),
    webSearch: z.boolean(),
  }),
  z.object({
    status: z.literal("error"),
    model: promptExplorerModelSchema,
    errorCode: z.literal("UPSTREAM_ERROR"),
    message: z.string(),
  }),
]);

export type PromptExplorerModelResult = z.infer<
  typeof promptExplorerModelResultSchema
>;

export const promptExplorerResultSchema = z.object({
  prompt: z.string(),
  highlightBrand: z.string().nullable(),
  fetchedAt: z.string(),
  results: z.array(promptExplorerModelResultSchema),
});

export type PromptExplorerResult = z.infer<typeof promptExplorerResultSchema>;

// ---------------------------------------------------------------------------
// URL search params
// ---------------------------------------------------------------------------

/** /p/$projectId/brand-lookup query params — `q` keeps the lookup shareable. */
export const brandLookupSearchSchema = z.object({
  q: z.string().optional(),
});

/**
 * /p/$projectId/prompt-explorer query params. The full prompt config is
 * encoded in the URL so a search is shareable and cmd+click on a history
 * item opens the same answer in a new tab.
 */
export const promptExplorerSearchSchema = z.object({
  q: z.string().optional(),
  models: z
    .union([promptExplorerModelSchema, z.array(promptExplorerModelSchema)])
    .optional()
    .transform((value) =>
      value === undefined ? undefined : Array.isArray(value) ? value : [value],
    ),
  web: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .optional()
    .transform((value) =>
      value === undefined ? undefined : value === true || value === "true",
    ),
  cc: webSearchCountryCodeSchema.optional(),
  hb: z.string().optional(),
});
