import { z } from "zod";

/**
 * @file_id FILE-MVX-AUTO-DOMAIN-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-DOMAIN
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
 * @generated_at 2026-05-13T13:53:39.171Z
 * @updated_at 2026-05-13T13:53:39.174Z
 * @hash sha256:b7220c0ab1b48ed0a26d0a47097dbb3ba2baf0941bfc8efefb6f0ad4e8942397
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:39.171Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */
export function normalizeDomain(input: string): string {
  let d = input.trim().toLowerCase();
  // Ensure URL() can parse the input by adding a protocol if missing
  if (!/^[a-z]+:\/\//.test(d)) d = `https://${d}`;
  const { hostname } = new URL(d); // throws on truly invalid input
  return hostname.replace(/^www\./, "");
}

/** Zod field: accepts a bare domain or full URL, outputs a clean hostname. */
export const domainField = z
  .string()
  .min(1)
  .max(253)
  .transform((val, ctx) => {
    try {
      const hostname = normalizeDomain(val);
      if (!hostname.includes(".")) {
        ctx.addIssue({ code: "custom", message: "Invalid domain format" });
        return z.NEVER;
      }
      return hostname;
    } catch {
      ctx.addIssue({ code: "custom", message: "Invalid domain format" });
      return z.NEVER;
    }
  });

const booleanSearchParamSchema = z
  .union([z.boolean(), z.enum(["true", "false"])])
  .transform((value) => value === true || value === "true");

export const domainOverviewSchema = z.object({
  projectId: z.string().uuid(),
  domain: z.string().min(1, "Domain is required").max(255),
  includeSubdomains: z.boolean().default(true),
  locationCode: z.number().int().positive().default(2840),
  languageCode: z.string().min(2).max(8).default("en"),
});

/* ------------------------------------------------------------------ */
/*  URL search params schema for /p/$projectId/domain                  */
/* ------------------------------------------------------------------ */

const domainSortModes = ["rank", "traffic", "volume", "score", "cpc"] as const;
const domainSortOrders = ["asc", "desc"] as const;
const domainTabs = ["keywords", "pages"] as const;

export const domainKeywordSuggestionsSchema = z.object({
  projectId: z.string().uuid(),
  domain: domainField,
  locationCode: z.number().int().positive(),
  languageCode: z.string().min(2).max(8),
});

export const DOMAIN_KEYWORDS_PAGE_SIZES = [50, 100, 200] as const;
export const DEFAULT_DOMAIN_KEYWORDS_PAGE_SIZE = 100;
export const MAX_DATAFORSEO_FILTER_CONDITIONS = 8;

const optionalNumber = z
  .union([
    z.number(),
    z.string().transform((value, ctx) => {
      const trimmed = value.trim();
      if (trimmed === "") return undefined;
      const parsed = Number(trimmed);
      if (!Number.isFinite(parsed)) {
        ctx.addIssue({ code: "custom", message: "Invalid number" });
        return z.NEVER;
      }
      return parsed;
    }),
  ])
  .optional();

const domainKeywordsFiltersSchema = z.object({
  include: z.string().optional(),
  exclude: z.string().optional(),
  minTraffic: optionalNumber,
  maxTraffic: optionalNumber,
  minVol: optionalNumber,
  maxVol: optionalNumber,
  minCpc: optionalNumber,
  maxCpc: optionalNumber,
  minKd: optionalNumber,
  maxKd: optionalNumber,
  minRank: optionalNumber,
  maxRank: optionalNumber,
});

export type DomainKeywordsFilters = z.infer<typeof domainKeywordsFiltersSchema>;

export const domainKeywordsPageRequestSchema = z.object({
  projectId: z.string().uuid(),
  domain: z.string().min(1).max(255),
  includeSubdomains: z.boolean().default(true),
  locationCode: z.number().int().positive().default(2840),
  languageCode: z.string().min(2).max(8).default("en"),
  page: z.number().int().positive().default(1),
  pageSize: z
    .number()
    .int()
    .refine((value) =>
      (DOMAIN_KEYWORDS_PAGE_SIZES as readonly number[]).includes(value),
    )
    .default(DEFAULT_DOMAIN_KEYWORDS_PAGE_SIZE),
  sortMode: z.enum(domainSortModes).default("rank"),
  sortOrder: z.enum(domainSortOrders).default("asc"),
  filters: domainKeywordsFiltersSchema.default({}),
  search: z.string().optional(),
});

const domainPagesSortModes = ["traffic", "keywords"] as const;

export const domainPagesPageRequestSchema = z.object({
  projectId: z.string().uuid(),
  domain: z.string().min(1).max(255),
  includeSubdomains: z.boolean().default(true),
  locationCode: z.number().int().positive().default(2840),
  languageCode: z.string().min(2).max(8).default("en"),
  page: z.number().int().positive().default(1),
  pageSize: z
    .number()
    .int()
    .refine((value) =>
      (DOMAIN_KEYWORDS_PAGE_SIZES as readonly number[]).includes(value),
    )
    .default(DEFAULT_DOMAIN_KEYWORDS_PAGE_SIZE),
  sortMode: z.enum(domainPagesSortModes).default("traffic"),
  sortOrder: z.enum(domainSortOrders).default("desc"),
  search: z.string().optional(),
});

const filterStringParam = z.string().optional();
const filterNumberParam = z.coerce.number().optional();

export const domainSearchSchema = z.object({
  domain: z.string().optional(),
  subdomains: booleanSearchParamSchema.optional(),
  sort: z.enum(domainSortModes).optional(),
  order: z.enum(domainSortOrders).optional(),
  tab: z.enum(domainTabs).optional(),
  search: z.string().optional(),
  loc: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional(),
  size: z.coerce
    .number()
    .int()
    .refine((value) =>
      (DOMAIN_KEYWORDS_PAGE_SIZES as readonly number[]).includes(value),
    )
    .optional(),
  include: filterStringParam,
  exclude: filterStringParam,
  minTraffic: filterNumberParam,
  maxTraffic: filterNumberParam,
  minVol: filterNumberParam,
  maxVol: filterNumberParam,
  minCpc: filterNumberParam,
  maxCpc: filterNumberParam,
  minKd: filterNumberParam,
  maxKd: filterNumberParam,
  minRank: filterNumberParam,
  maxRank: filterNumberParam,
});
