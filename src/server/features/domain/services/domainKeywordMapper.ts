/**
 * @file_id FILE-MVX-AUTO-DOMAINKEYWORDMAPPER-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-DOMAINKEYWORDMAPPER
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
 * @generated_at 2026-05-13T13:53:37.468Z
 * @updated_at 2026-05-13T13:53:37.470Z
 * @hash sha256:9f2c7a9cfa9c9dc8e5e9ac73b5773f798e692b46551b52f1f7520aa9814858d2
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:37.468Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { type DomainRankedKeywordItem } from "@/server/lib/dataforseo";
import { toRelativePath } from "@/server/lib/domainUtils";

export function mapKeywordItem(item: DomainRankedKeywordItem) {
  const keywordData = item.keyword_data;
  const keywordInfo = keywordData?.keyword_info;
  const keywordProperties = keywordData?.keyword_properties;
  const rankedSerpElement = item.ranked_serp_element;
  const serpItem = rankedSerpElement?.serp_item;

  const keyword = keywordData?.keyword ?? item.keyword;
  if (!keyword) return null;

  const url = serpItem?.url ?? rankedSerpElement?.url ?? null;

  const relativeUrl =
    serpItem?.relative_url ??
    rankedSerpElement?.relative_url ??
    (url ? toRelativePath(url) : null);

  const position =
    serpItem?.rank_absolute ?? rankedSerpElement?.rank_absolute ?? null;

  const traffic = serpItem?.etv ?? rankedSerpElement?.etv ?? null;

  const keywordDifficulty =
    keywordProperties?.keyword_difficulty ??
    keywordInfo?.keyword_difficulty ??
    null;

  return {
    keyword,
    position: position != null ? Math.round(position) : null,
    searchVolume:
      keywordInfo?.search_volume != null
        ? Math.round(keywordInfo.search_volume)
        : null,
    traffic: traffic ?? null,
    cpc: keywordInfo?.cpc ?? null,
    url: url ?? null,
    relativeUrl,
    keywordDifficulty:
      keywordDifficulty != null ? Math.round(keywordDifficulty) : null,
  };
}
