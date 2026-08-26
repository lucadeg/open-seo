/**
 * @file_id FILE-MVX-AUTO-BRANDLOOKUPFILTERING-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-BRANDLOOKUPFILTERING
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
 * @generated_at 2026-05-13T13:53:33.388Z
 * @updated_at 2026-05-13T13:53:33.389Z
 * @hash sha256:fc3c20305832746bd96816e2652137970dfc6ea2c92ff0e17be28c31a3be6855
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:33.388Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { parseTerms } from "@/client/features/keywords/utils";
import type { BrandLookupResult } from "@/types/schemas/ai-search";
import type {
  QueriesFilterValues,
  TopPagesFilterValues,
} from "./brandLookupFilterTypes";

function passesNumericFilter(
  value: number | null | undefined,
  min: string,
  max: string,
): boolean {
  if (value == null) return true;
  const minN = Number(min);
  if (min && !Number.isNaN(minN) && value < minN) return false;
  const maxN = Number(max);
  if (max && !Number.isNaN(maxN) && value > maxN) return false;
  return true;
}

function passesTextFilter(
  haystack: string,
  includeTerms: string[],
  excludeTerms: string[],
): boolean {
  const lower = haystack.toLowerCase();
  if (
    includeTerms.length > 0 &&
    !includeTerms.some((term) => lower.includes(term))
  ) {
    return false;
  }
  if (excludeTerms.some((term) => lower.includes(term))) {
    return false;
  }
  return true;
}

export function filterTopPages(
  rows: BrandLookupResult["topPages"],
  filters: TopPagesFilterValues,
): BrandLookupResult["topPages"] {
  const includeTerms = parseTerms(filters.include);
  const excludeTerms = parseTerms(filters.exclude);

  return rows.filter((row) => {
    const textFields = [row.url, row.domain]
      .filter((v): v is string => Boolean(v))
      .join(" ");

    if (!passesTextFilter(textFields, includeTerms, excludeTerms)) return false;
    if (filters.platform && row.platform !== filters.platform) return false;
    if (
      !passesNumericFilter(
        row.mentions,
        filters.minMentions,
        filters.maxMentions,
      )
    ) {
      return false;
    }
    return true;
  });
}

export function filterQueries(
  rows: BrandLookupResult["topQueries"],
  filters: QueriesFilterValues,
): BrandLookupResult["topQueries"] {
  const includeTerms = parseTerms(filters.include);
  const excludeTerms = parseTerms(filters.exclude);

  return rows.filter((row) => {
    const textFields = [row.question, ...row.brandsMentioned].join(" ");

    if (!passesTextFilter(textFields, includeTerms, excludeTerms)) return false;
    if (filters.platform && row.platform !== filters.platform) return false;
    if (
      !passesNumericFilter(
        row.aiSearchVolume,
        filters.minVolume,
        filters.maxVolume,
      )
    ) {
      return false;
    }
    return true;
  });
}

export function countActiveFilters(values: Record<string, string>): number {
  return Object.values(values).filter((v) => v.trim() !== "").length;
}
