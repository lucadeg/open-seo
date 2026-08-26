/**
 * @file_id FILE-MVX-AUTO-DATAFORSEOCLIENT-TEST-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-DATAFORSEOCLIENT-TEST
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
 * @generated_at 2026-05-13T13:53:38.130Z
 * @updated_at 2026-05-13T13:53:38.131Z
 * @hash sha256:1ecbbde5af96367086d069e47666fe693c28bbc1dbfeca8ad73c6700153495ad
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:38.130Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  AUTUMN_SEO_DATA_BALANCE_FEATURE_ID,
  AUTUMN_SEO_DATA_CREDITS_PER_USD,
  AUTUMN_SEO_DATA_TOPUP_BALANCE_FEATURE_ID,
  SEO_DATA_COST_MARKUP,
} from "@/shared/billing";

interface TrackCallArg {
  customerId: string;
  featureId: string;
  value: number;
  properties?: { balanceFeatureId: string };
}

const { checkMock, trackMock, getOrCreateMock, isHostedServerAuthModeMock } =
  vi.hoisted(() => ({
    checkMock: vi.fn(),
    trackMock: vi.fn<(arg: TrackCallArg) => void>(),
    getOrCreateMock: vi.fn(),
    isHostedServerAuthModeMock: vi.fn(),
  }));

vi.mock("cloudflare:workers", () => ({
  waitUntil: vi.fn(),
}));

vi.mock("@/server/billing/autumn", () => ({
  autumn: {
    check: checkMock,
    track: trackMock,
  },
}));

vi.mock("@/server/billing/subscription", () => ({
  getOrCreateOrganizationCustomer: getOrCreateMock,
}));

vi.mock("@/server/lib/runtime-env", () => ({
  isHostedServerAuthMode: isHostedServerAuthModeMock,
}));

vi.mock("@/server/lib/posthog", () => ({
  captureServerEvent: vi.fn(),
}));

vi.mock("@/server/lib/dataforseo", () => ({
  fetchKeywordIdeasRaw: vi.fn(),
  fetchKeywordSuggestionsRaw: vi.fn(),
  fetchRelatedKeywordsRaw: vi.fn(),
  fetchDomainRankOverviewRaw: vi.fn(),
  fetchRankedKeywordsRaw: vi.fn(),
  fetchLiveSerpItemsRaw: vi.fn(),
}));

vi.mock("@/server/lib/dataforseoLighthouse", () => ({
  fetchDataforseoLighthouseResultRaw: vi.fn(),
}));

vi.mock("@/server/lib/dataforseoBacklinks", () => ({
  fetchBacklinksHistoryRaw: vi.fn(),
  fetchBacklinksRowsRaw: vi.fn(),
  fetchBacklinksSummaryRaw: vi.fn(),
  fetchDomainPagesSummaryRaw: vi.fn(),
  fetchReferringDomainsRaw: vi.fn(),
}));

vi.mock("@/server/lib/dataforseoLlm", () => ({
  fetchLlmResponseRaw: vi.fn(),
  fetchLlmAggregatedMetricsRaw: vi.fn(),
  fetchLlmMentionsSearchRaw: vi.fn(),
  fetchLlmTopPagesRaw: vi.fn(),
}));

import {
  createDataforseoClient,
  mapDataforseoPathToCreditFeature,
} from "./dataforseoClient";
import { fetchBacklinksSummaryRaw } from "./dataforseoBacklinks";

const billingCustomer = {
  organizationId: "org_123",
  userId: "user_123",
  userEmail: "alice@example.com",
};

const backlinksInput = {
  target: "example.com",
};

function setupHostedMode() {
  isHostedServerAuthModeMock.mockResolvedValue(true);
  getOrCreateMock.mockResolvedValue({ id: "org_123" });
}

function mockBalances(monthly: number, topup: number) {
  checkMock.mockImplementation(async (args: { featureId: string }) => {
    if (args.featureId === AUTUMN_SEO_DATA_BALANCE_FEATURE_ID) {
      return { allowed: true, balance: { remaining: monthly } };
    }
    if (args.featureId === AUTUMN_SEO_DATA_TOPUP_BALANCE_FEATURE_ID) {
      return { allowed: true, balance: { remaining: topup } };
    }
    return { allowed: false, balance: null };
  });
}

function mockDataforseoResult(costUsd: number) {
  vi.mocked(fetchBacklinksSummaryRaw).mockResolvedValue({
    data: { rank: 42 },
    billing: { costUsd, path: ["backlinks", "summary"], resultCount: 1 },
  });
}

describe("meterDataforseoCall with split balances", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("skips billing in non-hosted mode", async () => {
    isHostedServerAuthModeMock.mockResolvedValue(false);
    mockDataforseoResult(0.05);

    const client = createDataforseoClient(billingCustomer);
    const result = await client.backlinks.summary(backlinksInput);

    expect(result).toEqual({ rank: 42 });
    expect(checkMock).not.toHaveBeenCalled();
    expect(trackMock).not.toHaveBeenCalled();
  });

  it("checks both monthly and topup balances in parallel", async () => {
    setupHostedMode();
    mockBalances(5000, 3000);
    mockDataforseoResult(0.05);

    const client = createDataforseoClient(billingCustomer);
    await client.backlinks.summary(backlinksInput);

    expect(checkMock).toHaveBeenCalledTimes(2);
    expect(checkMock).toHaveBeenCalledWith({
      customerId: "org_123",
      featureId: AUTUMN_SEO_DATA_BALANCE_FEATURE_ID,
    });
    expect(checkMock).toHaveBeenCalledWith({
      customerId: "org_123",
      featureId: AUTUMN_SEO_DATA_TOPUP_BALANCE_FEATURE_ID,
    });
  });

  const RAW_COST = 0.05;
  const EXPECTED_CREDITS = Math.ceil(
    RAW_COST * SEO_DATA_COST_MARKUP * AUTUMN_SEO_DATA_CREDITS_PER_USD,
  );

  it("deducts entirely from monthly when monthly has enough", async () => {
    setupHostedMode();
    mockBalances(5000, 3000);
    mockDataforseoResult(RAW_COST);

    const client = createDataforseoClient(billingCustomer);
    await client.backlinks.summary(backlinksInput);

    expect(trackMock).toHaveBeenCalledTimes(1);
    expect(trackMock).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: "org_123",
        featureId: AUTUMN_SEO_DATA_BALANCE_FEATURE_ID,
        value: EXPECTED_CREDITS,
      }),
    );
  });

  it("deducts entirely from topup when monthly is empty", async () => {
    setupHostedMode();
    mockBalances(0, 5000);
    mockDataforseoResult(RAW_COST);

    const client = createDataforseoClient(billingCustomer);
    await client.backlinks.summary(backlinksInput);

    expect(trackMock).toHaveBeenCalledTimes(1);
    expect(trackMock).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: "org_123",
        featureId: AUTUMN_SEO_DATA_TOPUP_BALANCE_FEATURE_ID,
        value: EXPECTED_CREDITS,
      }),
    );
  });

  it("splits deduction across monthly and topup when monthly is partially sufficient", async () => {
    setupHostedMode();
    const monthlyAvailable = 30;
    mockBalances(monthlyAvailable, 5000);
    mockDataforseoResult(RAW_COST);

    const client = createDataforseoClient(billingCustomer);
    await client.backlinks.summary(backlinksInput);

    expect(trackMock).toHaveBeenCalledTimes(2);
    expect(trackMock).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: "org_123",
        featureId: AUTUMN_SEO_DATA_BALANCE_FEATURE_ID,
        value: monthlyAvailable,
      }),
    );
    expect(trackMock).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: "org_123",
        featureId: AUTUMN_SEO_DATA_TOPUP_BALANCE_FEATURE_ID,
        value: EXPECTED_CREDITS - monthlyAvailable,
      }),
    );
  });

  it("throws INSUFFICIENT_CREDITS when both balances are exactly zero", async () => {
    setupHostedMode();
    mockBalances(0, 0);
    mockDataforseoResult(0.05);

    const client = createDataforseoClient(billingCustomer);
    await expect(
      client.backlinks.summary(backlinksInput),
    ).rejects.toMatchObject({ code: "INSUFFICIENT_CREDITS" });

    expect(trackMock).not.toHaveBeenCalled();
  });

  it("includes balanceFeatureId in track properties", async () => {
    setupHostedMode();
    mockBalances(30, 5000);
    mockDataforseoResult(0.05);

    const client = createDataforseoClient(billingCustomer);
    await client.backlinks.summary(backlinksInput);

    const monthlyCall = trackMock.mock.calls.find(
      ([arg]) => arg.featureId === AUTUMN_SEO_DATA_BALANCE_FEATURE_ID,
    );
    const topupCall = trackMock.mock.calls.find(
      ([arg]) => arg.featureId === AUTUMN_SEO_DATA_TOPUP_BALANCE_FEATURE_ID,
    );

    expect(monthlyCall![0].properties?.balanceFeatureId).toBe(
      AUTUMN_SEO_DATA_BALANCE_FEATURE_ID,
    );
    expect(topupCall![0].properties?.balanceFeatureId).toBe(
      AUTUMN_SEO_DATA_TOPUP_BALANCE_FEATURE_ID,
    );
  });
});

describe("mapDataforseoPathToCreditFeature", () => {
  it("maps real keyword research paths", () => {
    expect(
      mapDataforseoPathToCreditFeature([
        "v3",
        "dataforseo_labs",
        "google",
        "related_keywords",
        "live",
      ]),
    ).toBe("keyword_research");
    expect(
      mapDataforseoPathToCreditFeature([
        "v3",
        "dataforseo_labs",
        "google",
        "keyword_suggestions",
        "live",
      ]),
    ).toBe("keyword_research");
  });

  it("maps real serp paths", () => {
    expect(
      mapDataforseoPathToCreditFeature([
        "v3",
        "serp",
        "google",
        "organic",
        "live",
        "regular",
      ]),
    ).toBe("keyword_research");
  });

  it("maps real domain paths", () => {
    expect(
      mapDataforseoPathToCreditFeature([
        "v3",
        "dataforseo_labs",
        "google",
        "domain_rank_overview",
        "live",
      ]),
    ).toBe("domain_overview");
    expect(
      mapDataforseoPathToCreditFeature([
        "v3",
        "dataforseo_labs",
        "google",
        "ranked_keywords",
        "live",
      ]),
    ).toBe("domain_overview");
    expect(
      mapDataforseoPathToCreditFeature([
        "v3",
        "dataforseo_labs",
        "google",
        "relevant_pages",
        "live",
      ]),
    ).toBe("domain_overview");
  });

  it("maps real backlinks paths", () => {
    expect(
      mapDataforseoPathToCreditFeature(["v3", "backlinks", "summary", "live"]),
    ).toBe("backlinks");
    expect(
      mapDataforseoPathToCreditFeature([
        "v3",
        "backlinks",
        "referring_domains",
        "live",
      ]),
    ).toBe("backlinks");
  });

  it("maps real lighthouse/on_page paths to site_audit", () => {
    expect(
      mapDataforseoPathToCreditFeature([
        "v3",
        "on_page",
        "lighthouse",
        "live",
        "json",
      ]),
    ).toBe("site_audit");
  });

  it("maps real ai_optimization paths to ai_search", () => {
    expect(
      mapDataforseoPathToCreditFeature([
        "v3",
        "ai_optimization",
        "llm_mentions",
        "search",
        "live",
      ]),
    ).toBe("ai_search");
    expect(
      mapDataforseoPathToCreditFeature([
        "v3",
        "ai_optimization",
        "llm_mentions",
        "aggregated_metrics",
        "live",
      ]),
    ).toBe("ai_search");
    expect(
      mapDataforseoPathToCreditFeature([
        "v3",
        "ai_optimization",
        "claude",
        "llm_responses",
        "live",
      ]),
    ).toBe("ai_search");
  });
});
