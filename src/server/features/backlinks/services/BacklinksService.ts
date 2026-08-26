/**
 * @file_id FILE-MVX-AUTO-BACKLINKSSERVICE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-BACKLINKSSERVICE
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
 * @generated_at 2026-05-13T13:53:37.376Z
 * @updated_at 2026-05-13T13:53:37.377Z
 * @hash sha256:563e9d65c617d08de2952a5736c711502e5bfc3c1bc4011f5b30130f5a8c59c5
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:37.376Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { buildCacheKey, getCached, setCached } from "@/server/lib/r2-cache";
import { normalizeBacklinksTarget } from "@/server/lib/dataforseoBacklinks";
import {
  normalizeBacklinksSpamFilterOptions,
  type BacklinksSpamFilterOptions,
} from "@/types/schemas/backlinks";
import {
  profileBacklinksOverview,
  profileReferringDomainsRows,
  profileTopPagesRows,
  type BacklinksCache,
} from "@/server/features/backlinks/services/backlinksServiceData";
import type { BillingCustomerContext } from "@/server/billing/subscription";
import type { BacklinksLookupInput } from "@/types/schemas/backlinks";

const defaultCache: BacklinksCache = {
  get: getCached,
  set: setCached,
};

function createBacklinksService(cache: BacklinksCache = defaultCache) {
  return {
    async profileOverview(
      input: BacklinksLookupInput,
      billingCustomer: BillingCustomerContext,
      options?: BacklinksSpamFilterOptions,
    ) {
      const cacheKey = await buildBacklinksCacheKey(
        "backlinks:overview",
        input,
        billingCustomer,
        options,
      );

      return profileBacklinksOverview(
        cache,
        cacheKey,
        input,
        billingCustomer,
        options,
      );
    },
    async profileReferringDomains(
      input: BacklinksLookupInput,
      billingCustomer: BillingCustomerContext,
      options?: BacklinksSpamFilterOptions,
    ) {
      const cacheKey = await buildBacklinksCacheKey(
        "backlinks:referring-domains",
        input,
        billingCustomer,
        options,
      );

      return profileReferringDomainsRows(
        cache,
        cacheKey,
        input,
        billingCustomer,
        options,
      );
    },
    async profileTopPages(
      input: BacklinksLookupInput,
      billingCustomer: BillingCustomerContext,
    ) {
      const cacheKey = await buildBacklinksCacheKey(
        "backlinks:top-pages",
        input,
        billingCustomer,
      );

      return profileTopPagesRows(cache, cacheKey, input, billingCustomer);
    },
  } as const;
}

async function buildBacklinksCacheKey(
  prefix: string,
  input: BacklinksLookupInput,
  billingCustomer: BillingCustomerContext,
  options?: BacklinksSpamFilterOptions,
): Promise<string> {
  const normalizedTarget = normalizeBacklinksTarget(input.target, {
    scope: input.scope,
  });
  const cacheKeyInput = {
    organizationId: billingCustomer.organizationId,
    target: normalizedTarget.apiTarget,
    scope: normalizedTarget.scope,
  };

  if (!options) {
    return buildCacheKey(prefix, cacheKeyInput);
  }

  const spamFilterOptions = normalizeBacklinksSpamFilterOptions(options);

  return buildCacheKey(prefix, {
    ...cacheKeyInput,
    hideSpam: String(spamFilterOptions.hideSpam),
    ...(spamFilterOptions.hideSpam
      ? { spamThreshold: String(spamFilterOptions.spamThreshold) }
      : {}),
  });
}

export const BacklinksService = createBacklinksService();
export { createBacklinksService };
