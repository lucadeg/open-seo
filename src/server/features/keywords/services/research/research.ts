/**
 * @file_id FILE-MVX-AUTO-RESEARCH-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-RESEARCH
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
 * @generated_at 2026-05-13T13:53:37.657Z
 * @updated_at 2026-05-13T13:53:37.659Z
 * @hash sha256:d984b66560e94e9c141d7de459a276025fabadbb9d84edff7bd7bea1de3d5148
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:37.657Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { AppError } from "@/server/lib/errors";
import type { BillingCustomerContext } from "@/server/billing/subscription";
import {
  CACHE_TTL,
  buildCacheKey,
  getCached,
  setCached,
} from "@/server/lib/r2-cache";
import { KeywordResearchRepository } from "@/server/features/keywords/repositories/KeywordResearchRepository";
import type { KeywordResearchRow } from "@/types/keywords";
import type { ResearchKeywordsInput } from "@/types/schemas/keywords";
import { z } from "zod";
import { type EnrichedKeyword, normalizeKeyword } from "./helpers";
import { fetchResearchRowsBySource } from "./research-data";
import {
  AUTO_KEYWORD_SOURCES,
  MIN_NON_SEED_FOR_AUTO,
  countNonSeedKeywords,
  hasSufficientCoverage,
  type KeywordMode,
  type KeywordSource,
} from "./selection";

type SourceAttempt = {
  source: KeywordSource;
  rowCount: number;
  nonSeedCount: number;
};

type ResearchDiagnostics = {
  requestedMode: KeywordMode;
  threshold: number;
  sourceAttempts: SourceAttempt[];
};

type ResearchResult = {
  rows: KeywordResearchRow[];
  source: KeywordSource;
  usedFallback: boolean;
  diagnostics: ResearchDiagnostics;
};

type CachedResult = ResearchResult;

const cachedKeywordRowSchema = z.object({
  keyword: z.string(),
  searchVolume: z.number().nullable(),
  trend: z.array(
    z.object({
      year: z.number(),
      month: z.number(),
      searchVolume: z.number(),
    }),
  ),
  cpc: z.number().nullable(),
  competition: z.number().nullable(),
  keywordDifficulty: z.number().nullable(),
  intent: z.enum([
    "informational",
    "commercial",
    "transactional",
    "navigational",
    "unknown",
  ]),
});

const sourceAttemptSchema = z.object({
  source: z.enum(["related", "suggestions", "ideas"]),
  rowCount: z.number(),
  nonSeedCount: z.number(),
});

const cachedResultSchema = z.object({
  rows: z.array(cachedKeywordRowSchema),
  source: z.enum(["related", "suggestions", "ideas"]),
  usedFallback: z.boolean(),
  diagnostics: z.object({
    requestedMode: z.enum(["auto", "related", "suggestions", "ideas"]),
    threshold: z.number(),
    sourceAttempts: z.array(sourceAttemptSchema),
  }),
});

const CACHE_VERSION = 2;

function getMode(input: ResearchKeywordsInput): KeywordMode {
  return input.mode ?? "auto";
}

async function fetchRowsFromSource(
  source: KeywordSource,
  input: ResearchKeywordsInput,
  seedKeyword: string,
  billingCustomer: BillingCustomerContext,
): Promise<EnrichedKeyword[]> {
  return fetchResearchRowsBySource(
    {
      source,
      seedKeyword,
      locationCode: input.locationCode,
      languageCode: input.languageCode,
      resultLimit: input.resultLimit,
    },
    billingCustomer,
  );
}

async function fetchAutoRows(
  input: ResearchKeywordsInput,
  seedKeyword: string,
  billingCustomer: BillingCustomerContext,
): Promise<ResearchResult> {
  const attempts: SourceAttempt[] = [];
  let lastSource: KeywordSource = "related";
  const accumulatedRows: EnrichedKeyword[] = [];
  const seenKeywords = new Set<string>();

  for (const source of AUTO_KEYWORD_SOURCES) {
    const rows = await fetchRowsFromSource(
      source,
      input,
      seedKeyword,
      billingCustomer,
    );
    for (const row of rows) {
      if (accumulatedRows.length >= input.resultLimit) break;
      if (seenKeywords.has(row.keyword)) continue;
      seenKeywords.add(row.keyword);
      accumulatedRows.push(row);
    }

    attempts.push({
      source,
      rowCount: rows.length,
      nonSeedCount: countNonSeedKeywords(rows, seedKeyword),
    });

    lastSource = source;

    if (
      hasSufficientCoverage(accumulatedRows, seedKeyword, MIN_NON_SEED_FOR_AUTO)
    ) {
      return {
        rows: accumulatedRows,
        source,
        usedFallback: source !== AUTO_KEYWORD_SOURCES[0],
        diagnostics: {
          requestedMode: "auto",
          threshold: MIN_NON_SEED_FOR_AUTO,
          sourceAttempts: attempts,
        },
      };
    }
  }

  return {
    rows: accumulatedRows,
    source: lastSource,
    usedFallback: true,
    diagnostics: {
      requestedMode: "auto",
      threshold: MIN_NON_SEED_FOR_AUTO,
      sourceAttempts: attempts,
    },
  };
}

async function fetchManualRows(
  mode: Exclude<KeywordMode, "auto">,
  input: ResearchKeywordsInput,
  seedKeyword: string,
  billingCustomer: BillingCustomerContext,
): Promise<ResearchResult> {
  const rows = await fetchRowsFromSource(
    mode,
    input,
    seedKeyword,
    billingCustomer,
  );
  const attempt: SourceAttempt = {
    source: mode,
    rowCount: rows.length,
    nonSeedCount: countNonSeedKeywords(rows, seedKeyword),
  };

  return {
    rows,
    source: mode,
    usedFallback: false,
    diagnostics: {
      requestedMode: mode,
      threshold: MIN_NON_SEED_FOR_AUTO,
      sourceAttempts: [attempt],
    },
  };
}

function isUsableCachedResult(cached: CachedResult): boolean {
  if (cached.rows.length === 0) return false;

  return true;
}

async function buildResearchCacheKey(
  input: ResearchKeywordsInput,
  normalizedKeywords: string[],
  mode: KeywordMode,
  billingCustomer: BillingCustomerContext,
): Promise<string> {
  return buildCacheKey("kw:research", {
    cacheVersion: CACHE_VERSION,
    organizationId: billingCustomer.organizationId,
    projectId: input.projectId,
    keywords: normalizedKeywords,
    locationCode: input.locationCode,
    languageCode: input.languageCode,
    resultLimit: input.resultLimit,
    mode,
    depth: 3,
  });
}

function persistRows(input: ResearchKeywordsInput, rows: EnrichedKeyword[]) {
  void Promise.all(
    rows.map((row) =>
      KeywordResearchRepository.upsertKeywordMetric({
        projectId: input.projectId,
        keyword: row.keyword,
        locationCode: input.locationCode,
        languageCode: input.languageCode,
        searchVolume: row.searchVolume,
        cpc: row.cpc,
        competition: row.competition,
        keywordDifficulty: row.keywordDifficulty,
        intent: row.intent,
        monthlySearchesJson: JSON.stringify(row.trend),
      }),
    ),
  ).catch((error) => {
    console.error("keywords.research.persist-metrics failed:", error);
  });
}

export async function research(
  input: ResearchKeywordsInput,
  billingCustomer: BillingCustomerContext,
): Promise<ResearchResult> {
  const uniqueKeywords = [
    ...new Set(input.keywords.map(normalizeKeyword)),
  ].filter((keyword) => keyword.length > 0);

  if (uniqueKeywords.length === 0) {
    throw new AppError("VALIDATION_ERROR");
  }

  const seedKeyword = uniqueKeywords[0];
  const mode = getMode(input);
  const cacheKey = await buildResearchCacheKey(
    input,
    uniqueKeywords,
    mode,
    billingCustomer,
  );

  const cachedRaw = await getCached(cacheKey);
  const cachedResult = cachedResultSchema.safeParse(cachedRaw);
  const cached: CachedResult | null = cachedResult.success
    ? cachedResult.data
    : null;

  if (cached && isUsableCachedResult(cached)) {
    return cached;
  }

  const result =
    mode === "auto"
      ? await fetchAutoRows(input, seedKeyword, billingCustomer)
      : await fetchManualRows(mode, input, seedKeyword, billingCustomer);

  await setCached(cacheKey, result, CACHE_TTL.researchResult);
  persistRows(input, result.rows);

  return result;
}
