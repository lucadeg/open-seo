import process from "node:process";
import {
  buildLlmTarget,
  CHATGPT_LANGUAGE_CODE,
  CHATGPT_LOCATION_CODE,
  fetchLlmAggregatedMetricsRaw,
  fetchLlmMentionsSearchRaw,
  fetchLlmTopPagesRaw,
  type LlmPlatform,
} from "@/server/lib/dataforseoLlm";
import { applyBillingMarkupUsd } from "@/shared/billing";
import { loadLocalEnv, parseArgs } from "./cli-utils";

loadLocalEnv();

const args = parseArgs(process.argv.slice(2));

await main();

/**
 * @file_id FILE-MVX-AUTO-BRAND-LOOKUP-COST-PROFILE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-BRAND-LOOKUP-COST-PROFILE
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
 * @generated_at 2026-05-13T13:53:32.994Z
 * @updated_at 2026-05-13T13:53:32.995Z
 * @hash sha256:db884cd58febe594e8bed07ebdb85e263fc6de1895493498743bb996437d1f4c
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:32.994Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */
async function main() {
  if (process.env.CI === "true" && args.allowCi !== "true") {
    printUsageAndExit(
      "Refusing to run live billing checks in CI without --allowCi=true.",
    );
  }

  if (args.confirmLive !== "true") {
    printUsageAndExit(
      "This command makes live, billable DataForSEO requests. Re-run with --confirmLive=true.",
    );
  }

  if (!process.env.DATAFORSEO_API_KEY) {
    printUsageAndExit("Missing DATAFORSEO_API_KEY.");
  }

  const target = args.target;
  if (!target) {
    printUsageAndExit("Missing --target.");
  }

  const targetType = parseTargetType(args.targetType);
  const userLocationCode = parsePositiveInteger(args.locationCode, 2840);
  const userLanguageCode = args.languageCode ?? "en";
  const repeat = parsePositiveInteger(args.repeat, 1);

  const llmTarget = buildLlmTarget({ type: targetType, value: target });
  const platforms: LlmPlatform[] = ["chat_gpt", "google"];

  const allRuns: RunSummary[] = [];

  for (let runIndex = 0; runIndex < repeat; runIndex += 1) {
    const calls: CallRecord[] = [];

    for (const platform of platforms) {
      // ChatGPT data is only indexed for US/en, mirroring the production
      // brandLookup service.
      const locationCode =
        platform === "chat_gpt" ? CHATGPT_LOCATION_CODE : userLocationCode;
      const languageCode =
        platform === "chat_gpt" ? CHATGPT_LANGUAGE_CODE : userLanguageCode;

      const aggregated = await fetchLlmAggregatedMetricsRaw({
        target: llmTarget,
        platform,
        locationCode,
        languageCode,
        internalListLimit: 20,
      });
      calls.push(toRecord(platform, "aggregated_metrics", aggregated.billing));

      const topPages = await fetchLlmTopPagesRaw({
        target: llmTarget,
        platform,
        locationCode,
        languageCode,
        itemsListLimit: 10,
      });
      calls.push(toRecord(platform, "top_pages", topPages.billing));

      const mentions = await fetchLlmMentionsSearchRaw({
        target: llmTarget,
        platform,
        locationCode,
        languageCode,
        limit: 25,
      });
      calls.push(toRecord(platform, "mentions_search", mentions.billing));
    }

    const totalRawUsd = sum(calls.map((c) => c.rawUsd));
    allRuns.push({
      run: runIndex + 1,
      calls,
      totalRawUsd: round(totalRawUsd),
      totalBilledUsd: applyBillingMarkupUsd(totalRawUsd),
    });
  }

  const aggregateRawUsd = sum(allRuns.map((r) => r.totalRawUsd));
  const aggregateBilledUsd = applyBillingMarkupUsd(aggregateRawUsd);

  console.log(
    JSON.stringify(
      {
        input: {
          target,
          targetType,
          userLocationCode,
          userLanguageCode,
          repeat,
        },
        runs: allRuns,
        aggregate: {
          totalRawUsd: round(aggregateRawUsd),
          totalBilledUsd: aggregateBilledUsd,
          avgRawPerLookupUsd: round(aggregateRawUsd / allRuns.length),
          avgBilledPerLookupUsd: round(aggregateBilledUsd / allRuns.length),
        },
      },
      null,
      2,
    ),
  );
}

type CallRecord = {
  platform: LlmPlatform;
  endpoint: string;
  path: string;
  resultCount: number | null;
  rawUsd: number;
  billedUsd: number;
};

type RunSummary = {
  run: number;
  calls: CallRecord[];
  totalRawUsd: number;
  totalBilledUsd: number;
};

function toRecord(
  platform: LlmPlatform,
  endpoint: string,
  billing: { costUsd: number; path: string[]; resultCount: number | null },
): CallRecord {
  return {
    platform,
    endpoint,
    path: billing.path.join("/"),
    resultCount: billing.resultCount,
    rawUsd: round(billing.costUsd),
    billedUsd: applyBillingMarkupUsd(billing.costUsd),
  };
}

function parseTargetType(value: string | undefined): "domain" | "keyword" {
  if (!value || value === "domain") return "domain";
  if (value === "keyword") return "keyword";
  printUsageAndExit(
    `Invalid --targetType: ${value}. Expected domain or keyword.`,
  );
}

function parsePositiveInteger(value: string | undefined, fallback: number) {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function round(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

function printUsageAndExit(message: string): never {
  console.error(message);
  console.error(
    "Usage: pnpm billing:brand-lookup --target=example.com --confirmLive=true [--targetType=domain|keyword] [--locationCode=2840] [--languageCode=en] [--repeat=1] [--allowCi=true]",
  );
  process.exit(1);
}
