/**
 * @file_id FILE-MVX-AUTO-BACKLINKSSERVICE-BILLING-TEST-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-BACKLINKSSERVICE-BILLING-TEST
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
 * @generated_at 2026-05-13T13:53:37.362Z
 * @updated_at 2026-05-13T13:53:37.363Z
 * @hash sha256:83f239b89ebd91e88284d5f082478d91416037aae565caff0affc179293b245e
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:37.362Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { beforeEach, expect, it, vi } from "vitest";

const backlinksSummaryMock = vi.fn();
const backlinksRowsMock = vi.fn();
const referringDomainsMock = vi.fn();
const domainPagesMock = vi.fn();
const backlinksHistoryMock = vi.fn();

vi.mock("@/server/lib/r2-cache", () => ({
  buildCacheKey: vi.fn(
    async (prefix: string, params: Record<string, unknown>) =>
      `${prefix}:${JSON.stringify(params)}`,
  ),
  getCached: vi.fn(async () => null),
  setCached: vi.fn(async () => undefined),
}));

vi.mock("@/server/lib/dataforseoBacklinks", () => ({
  normalizeBacklinksTarget: vi.fn(),
}));

vi.mock("@/server/lib/dataforseoClient", () => ({
  createDataforseoClient: vi.fn(() => ({
    backlinks: {
      summary: backlinksSummaryMock,
      rows: backlinksRowsMock,
      referringDomains: referringDomainsMock,
      domainPages: domainPagesMock,
      history: backlinksHistoryMock,
    },
  })),
}));

import { normalizeBacklinksTarget } from "@/server/lib/dataforseoBacklinks";
import { createBacklinksService } from "./BacklinksService";

const billingCustomer = {
  organizationId: "org_123",
  userId: "user_123",
  userEmail: "team@example.com",
};

const cache = new Map<string, string>();
const service = createBacklinksService({
  async get(key) {
    const raw = cache.get(key);
    return raw ? parseCachedValue(raw) : null;
  },
  async set(key, data) {
    cache.set(key, JSON.stringify(data));
  },
});

beforeEach(() => {
  cache.clear();
  vi.clearAllMocks();
});

it("profiles only the initial overview calls and reuses cache on repeat", async () => {
  vi.mocked(normalizeBacklinksTarget).mockReturnValue({
    apiTarget: "example.com",
    displayTarget: "example.com",
    scope: "domain",
  });
  backlinksSummaryMock.mockResolvedValue({
    rank: 42,
    backlinks: 1200,
    referring_pages: 900,
    referring_domains: 320,
    broken_backlinks: 12,
    broken_pages: 3,
    backlinks_spam_score: 5,
    info: { target_spam_score: 4 },
    new_backlinks: 25,
    lost_backlinks: 10,
    new_referring_domains: 8,
    lost_referring_domains: 2,
  });
  backlinksRowsMock.mockResolvedValue([
    {
      domain_from: "source.example",
      url_from: "https://source.example/post",
      url_to: "https://example.com/",
      anchor: "Example",
      item_type: "content",
      dofollow: true,
      rank: 77,
      domain_from_rank: 65,
      page_from_rank: 54,
      backlink_spam_score: 3,
      first_seen: "2026-01-01",
      last_visited: "2026-03-01",
      lost_date: null,
      is_lost: false,
      is_broken: false,
      links_count: 1,
      rel_attributes: ["noopener"],
    },
  ]);
  backlinksHistoryMock.mockResolvedValue([
    {
      date: "2026-02-01",
      backlinks: 1100,
      referring_domains: 300,
      rank: 40,
      new_backlinks: 20,
      lost_backlinks: 5,
      new_referring_domains: 3,
      lost_referring_domains: 1,
    },
  ]);

  const first = await service.profileOverview(
    { target: "example.com" },
    billingCustomer,
  );
  const second = await service.profileOverview(
    { target: "example.com" },
    billingCustomer,
  );

  expect(first.overview.referringDomains).toEqual([]);
  expect(first.overview.topPages).toEqual([]);
  expect(referringDomainsMock).not.toHaveBeenCalled();
  expect(domainPagesMock).not.toHaveBeenCalled();
  expect(backlinksSummaryMock).toHaveBeenCalledOnce();
  expect(backlinksHistoryMock).toHaveBeenCalledOnce();
  expect(second).toEqual(first);
});

it("profiles referring domains and top pages separately", async () => {
  vi.mocked(normalizeBacklinksTarget).mockReturnValue({
    apiTarget: "https://example.com/foo",
    displayTarget: "https://example.com/foo",
    scope: "page",
  });
  referringDomainsMock.mockResolvedValue([
    {
      domain: "source.example",
      backlinks: 4,
      referring_pages: 2,
      rank: 65,
      first_seen: "2026-01-01",
      broken_backlinks: 0,
      broken_pages: 0,
      backlinks_spam_score: 2,
      target_spam_score: 4,
    },
  ]);
  domainPagesMock.mockResolvedValue([
    {
      page: "https://example.com/foo",
      backlinks: 100,
      referring_domains: 20,
      rank: 50,
      broken_backlinks: 0,
    },
  ]);

  const domains = await service.profileReferringDomains(
    { target: "https://example.com/foo" },
    billingCustomer,
  );
  const pages = await service.profileTopPages(
    { target: "https://example.com/foo" },
    billingCustomer,
  );

  expect(domains.rows).toHaveLength(1);
  expect(domains.rows[0]?.spamScore).toBe(2);
  expect(pages.rows).toHaveLength(1);
});

it("does not fall back to target spam score for referring domains", async () => {
  vi.mocked(normalizeBacklinksTarget).mockReturnValue({
    apiTarget: "example.com",
    displayTarget: "example.com",
    scope: "domain",
  });
  referringDomainsMock.mockResolvedValue([
    {
      domain: "source.example",
      backlinks: 4,
      referring_pages: 2,
      rank: 65,
      first_seen: "2026-01-01",
      broken_backlinks: 0,
      broken_pages: 0,
      backlinks_spam_score: null,
      target_spam_score: 4,
    },
  ]);

  const domains = await service.profileReferringDomains(
    { target: "example.com" },
    billingCustomer,
  );

  expect(domains.rows).toHaveLength(1);
  expect(domains.rows[0]?.spamScore).toBeNull();
});

it("keeps cache entries isolated per organization", async () => {
  vi.mocked(normalizeBacklinksTarget).mockReturnValue({
    apiTarget: "example.com",
    displayTarget: "example.com",
    scope: "domain",
  });
  backlinksSummaryMock.mockResolvedValue({
    rank: 42,
    backlinks: 1200,
    referring_pages: 900,
    referring_domains: 320,
    broken_backlinks: 12,
    broken_pages: 3,
    backlinks_spam_score: 5,
    info: { target_spam_score: 4 },
    new_backlinks: 25,
    lost_backlinks: 10,
    new_referring_domains: 8,
    lost_referring_domains: 2,
  });
  backlinksRowsMock.mockResolvedValue([]);
  backlinksHistoryMock.mockResolvedValue([]);

  const input = { target: "example.com" };

  await service.profileOverview(input, billingCustomer);
  await service.profileOverview(input, {
    organizationId: "org_456",
    userId: "user_456",
    userEmail: "other@example.com",
  });

  expect(backlinksSummaryMock).toHaveBeenCalledTimes(2);
});

function parseCachedValue(raw: string): unknown {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}
