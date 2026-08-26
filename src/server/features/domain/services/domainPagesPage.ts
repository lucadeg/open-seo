/**
 * @file_id FILE-MVX-AUTO-DOMAINPAGESPAGE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-DOMAINPAGESPAGE
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
 * @generated_at 2026-05-13T13:53:37.505Z
 * @updated_at 2026-05-13T13:53:37.507Z
 * @hash sha256:807160edd4c4907311bfeb1990ed0f9f280f0b96234ad0d6b9c04695606f68b0
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:37.505Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { z } from "zod";
import type { BillingCustomerContext } from "@/server/billing/subscription";
import { createDataforseoClient } from "@/server/lib/dataforseoClient";
import { buildCacheKey, getCached, setCached } from "@/server/lib/r2-cache";
import { normalizeDomainInput, toRelativePath } from "@/server/lib/domainUtils";
import type { RelevantPagesItem } from "@/server/lib/dataforseo";

const DOMAIN_PAGES_PAGE_TTL_SECONDS = 12 * 60 * 60;

type DomainPagesSortMode = "traffic" | "keywords";
type DomainPagesSortOrder = "asc" | "desc";

const SORT_FIELD_BY_MODE: Record<DomainPagesSortMode, string> = {
  traffic: "metrics.organic.etv",
  keywords: "metrics.organic.count",
};

const domainPagesPageResultSchema = z.object({
  domain: z.string(),
  page: z.number(),
  pageSize: z.number(),
  totalCount: z.number().nullable(),
  hasMore: z.boolean(),
  pages: z.array(
    z.object({
      page: z.string(),
      relativePath: z.string().nullable(),
      organicTraffic: z.number().nullable(),
      keywords: z.number().nullable(),
    }),
  ),
  fetchedAt: z.string(),
});

type DomainPagesPageResult = z.infer<typeof domainPagesPageResultSchema>;

function escapeLikeTerm(term: string): string {
  return term.replace(/[\\%_]/g, (match) => `\\${match}`);
}

function buildPageFilters(searchTerm?: string): unknown[] {
  const trimmed = searchTerm?.trim();
  if (!trimmed) return [];
  return [["page_address", "ilike", `%${escapeLikeTerm(trimmed)}%`]];
}

function mapPageItem(item: RelevantPagesItem) {
  const url = item.page_address ?? null;
  if (!url) return null;
  const organic = item.metrics?.organic ?? null;
  const traffic = organic?.etv ?? null;
  const keywords = organic?.count ?? null;
  return {
    page: url,
    relativePath: toRelativePath(url),
    organicTraffic: traffic != null ? Math.round(traffic) : null,
    keywords: keywords != null ? Math.round(keywords) : null,
  };
}

export async function getPagesPage(
  input: {
    projectId: string;
    domain: string;
    includeSubdomains: boolean;
    locationCode: number;
    languageCode: string;
    page: number;
    pageSize: number;
    sortMode: DomainPagesSortMode;
    sortOrder: DomainPagesSortOrder;
    search?: string;
  },
  billingCustomer: BillingCustomerContext,
): Promise<DomainPagesPageResult> {
  const domain = normalizeDomainInput(input.domain, input.includeSubdomains);
  const offset = (input.page - 1) * input.pageSize;
  const orderBy = [`${SORT_FIELD_BY_MODE[input.sortMode]},${input.sortOrder}`];
  const filters = buildPageFilters(input.search);

  const cacheKey = await buildCacheKey("domain:pages-page", {
    organizationId: billingCustomer.organizationId,
    projectId: input.projectId,
    domain,
    includeSubdomains: input.includeSubdomains,
    locationCode: input.locationCode,
    languageCode: input.languageCode,
    page: input.page,
    pageSize: input.pageSize,
    sortMode: input.sortMode,
    sortOrder: input.sortOrder,
    search: input.search,
  });

  const cachedRaw = await getCached(cacheKey);
  const cached = domainPagesPageResultSchema.safeParse(cachedRaw);
  if (cached.success) {
    return cached.data;
  }

  const dataforseo = createDataforseoClient(billingCustomer);
  const response = await dataforseo.domain.relevantPages({
    target: domain,
    locationCode: input.locationCode,
    languageCode: input.languageCode,
    limit: input.pageSize,
    offset,
    orderBy,
    filters: filters.length > 0 ? filters : undefined,
  });

  const pages = response.items
    .map(mapPageItem)
    .filter(
      (item): item is NonNullable<ReturnType<typeof mapPageItem>> =>
        item != null,
    );

  const totalCount = response.totalCount;
  const hasMore =
    totalCount != null
      ? offset + pages.length < totalCount
      : pages.length === input.pageSize;

  const result: DomainPagesPageResult = {
    domain,
    page: input.page,
    pageSize: input.pageSize,
    totalCount,
    hasMore,
    pages,
    fetchedAt: new Date().toISOString(),
  };

  void setCached(cacheKey, result, DOMAIN_PAGES_PAGE_TTL_SECONDS).catch(
    (error) => {
      console.error("domain.pages-page.cache-write failed:", error);
    },
  );

  return result;
}
