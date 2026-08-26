/**
 * @file_id FILE-MVX-AUTO-USEDOMAINPAGESQUERY-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-USEDOMAINPAGESQUERY
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
 * @generated_at 2026-05-13T13:53:34.770Z
 * @updated_at 2026-05-13T13:53:34.771Z
 * @hash sha256:01b4239fe93b53a0005e7f74c6211556a0ddc757925b69296eb4b8d8af2b7615
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.770Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getDomainPagesPage } from "@/serverFunctions/domain";
import { toPageSortMode } from "@/client/features/domain/utils";
import type { DomainSortMode, SortOrder } from "@/client/features/domain/types";

type DomainPagesQueryInput = {
  projectId: string;
  domain: string;
  includeSubdomains: boolean;
  locationCode: number;
  languageCode: string;
  page: number;
  pageSize: number;
  sortMode: DomainSortMode;
  sortOrder: SortOrder;
  searchTerm: string;
  enabled: boolean;
};

export function useDomainPagesQuery(input: DomainPagesQueryInput) {
  const trimmedSearch = input.searchTerm.trim();
  const pageSortMode = toPageSortMode(input.sortMode);

  return useQuery({
    enabled: input.enabled && Boolean(input.domain),
    queryKey: [
      "domain-pages",
      input.projectId,
      input.domain,
      input.includeSubdomains,
      input.locationCode,
      input.languageCode,
      input.page,
      input.pageSize,
      pageSortMode,
      input.sortOrder,
      trimmedSearch || undefined,
    ],
    queryFn: () =>
      getDomainPagesPage({
        data: {
          projectId: input.projectId,
          domain: input.domain,
          includeSubdomains: input.includeSubdomains,
          locationCode: input.locationCode,
          languageCode: input.languageCode,
          page: input.page,
          pageSize: input.pageSize,
          sortMode: pageSortMode,
          sortOrder: input.sortOrder,
          search: trimmedSearch || undefined,
        },
      }),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}
