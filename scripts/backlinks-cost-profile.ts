/**
 * @file_id FILE-MVX-AUTO-BACKLINKS-COST-PROFILE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-BACKLINKS-COST-PROFILE
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
 * @generated_at 2026-05-13T13:53:32.920Z
 * @updated_at 2026-05-13T13:53:32.921Z
 * @hash sha256:2caf1b9cc62e2807c13e1b447dcd98dbb89a0330f7138bb540779ffdaaee5c31
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:32.920Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import process from "node:process";
import { createBacklinksService } from "@/server/features/backlinks/services/BacklinksService";
import type { BillingCustomerContext } from "@/server/billing/subscription";
import type {
  BacklinksLookupInput,
  BacklinksTargetScope,
} from "@/types/schemas/backlinks";
import { loadLocalEnv, parseArgs } from "./cli-utils";

loadLocalEnv();

const args = parseArgs(process.argv.slice(2));
const inMemoryCache = new Map<string, string>();
const service = createBacklinksService({
  async get(key) {
    const raw = inMemoryCache.get(key);
    return raw ? parseCachedValue(raw) : null;
  },
  async set(key, data) {
    inMemoryCache.set(key, JSON.stringify(data));
  },
});

await main();

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

  const input = buildInput(args);
  const billingCustomer = buildBillingCustomer(args);
  const repeat = parsePositiveInteger(args.repeat, 1);
  const includeTabs = parseBoolean(args.includeTabs, true);
  const runs = [];

  for (let index = 0; index < repeat; index += 1) {
    const overview = await service.profileOverview(input, billingCustomer);
    const domains = includeTabs
      ? await service.profileReferringDomains(input, billingCustomer)
      : null;
    const pages = includeTabs
      ? await service.profileTopPages(input, billingCustomer)
      : null;

    runs.push({
      run: index + 1,
      overview: {
        backlinksRows: overview.overview.backlinks.length,
        trendRows: overview.overview.trends.length,
        newLostRows: overview.overview.newLostTrends.length,
      },
      domainsTab: domains
        ? {
            rows: domains.rows.length,
          }
        : null,
      pagesTab: pages
        ? {
            rows: pages.rows.length,
          }
        : null,
    });
  }

  console.log(
    JSON.stringify(
      {
        input,
        repeat,
        includeTabs,
        runs,
      },
      null,
      2,
    ),
  );
}

function buildInput(cliArgs: Record<string, string>): BacklinksLookupInput {
  const target = cliArgs.target;
  const scope = parseScope(cliArgs.scope);
  if (!target) {
    printUsageAndExit("Missing target.");
  }
  if (!process.env.DATAFORSEO_API_KEY) {
    printUsageAndExit("Missing DATAFORSEO_API_KEY.");
  }

  return {
    target,
    scope,
  };
}

function buildBillingCustomer(
  cliArgs: Record<string, string>,
): BillingCustomerContext {
  return {
    organizationId: cliArgs.organizationId ?? "local",
    userId: cliArgs.userId ?? "local-user",
    userEmail: cliArgs.userEmail ?? "local@example.com",
  };
}

function parseBoolean(value: string | undefined, fallback: boolean) {
  if (value == null) return fallback;
  return value === "true";
}

function parseScope(
  value: string | undefined,
): BacklinksTargetScope | undefined {
  if (!value) return undefined;
  if (value === "domain" || value === "page") return value;
  printUsageAndExit(`Invalid scope: ${value}. Expected domain or page.`);
}

function parsePositiveInteger(value: string | undefined, fallback: number) {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function printUsageAndExit(message: string): never {
  console.error(message);
  console.error(
    "Usage: pnpm billing:backlinks --target=example.com --confirmLive=true [--scope=domain|page] [--repeat=1] [--includeTabs=true|false] [--allowCi=true]",
  );
  process.exit(1);
}

function parseCachedValue(raw: string): unknown {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}
