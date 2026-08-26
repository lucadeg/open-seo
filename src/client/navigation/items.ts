/**
 * @file_id FILE-MVX-AUTO-ITEMS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-ITEMS
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
 * @generated_at 2026-05-13T13:53:35.953Z
 * @updated_at 2026-05-13T13:53:35.954Z
 * @hash sha256:7d50e3a78d48ea0170e5baf52a9b6ae3a62ea8885404b6a08d531cac3c8ba1e4
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.953Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import {
  Bookmark,
  Bot,
  ClipboardCheck,
  Globe,
  Link2,
  MessageSquare,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { linkOptions } from "@tanstack/react-router";

const projectNavItems = [
  {
    to: "/p/$projectId/keywords" as const,
    label: "Keyword Research",
    icon: Search,
    matchSegment: "/keywords",
  },
  {
    to: "/p/$projectId/saved" as const,
    label: "Saved Keywords",
    icon: Bookmark,
    matchSegment: "/saved",
  },
  {
    to: "/p/$projectId/rank-tracking" as const,
    label: "Rank Tracking",
    icon: TrendingUp,
    matchSegment: "/rank-tracking",
  },
  {
    to: "/p/$projectId/domain" as const,
    label: "Domain Overview",
    icon: Globe,
    matchSegment: "/domain",
  },
  {
    to: "/p/$projectId/backlinks" as const,
    label: "Backlinks",
    icon: Link2,
    matchSegment: "/backlinks",
  },
  {
    to: "/p/$projectId/audit" as const,
    label: "Site Audit",
    icon: ClipboardCheck,
    matchSegment: "/audit",
  },
  {
    to: "/p/$projectId/brand-lookup" as const,
    label: "Brand Lookup",
    icon: Sparkles,
    matchSegment: "/brand-lookup",
  },
  {
    to: "/p/$projectId/prompt-explorer" as const,
    label: "Prompt Explorer",
    icon: MessageSquare,
    matchSegment: "/prompt-explorer",
  },
  {
    to: "/p/$projectId/ai" as const,
    label: "AI & Agents",
    icon: Bot,
    matchSegment: "/ai",
  },
] as const;

function getProjectNavItems(projectId: string) {
  return linkOptions(
    projectNavItems.map((item) => ({
      ...item,
      params: { projectId },
      search: {},
    })),
  );
}

export function getProjectNavGroups(projectId: string) {
  const all = getProjectNavItems(projectId);
  const bySegment = (seg: string) => all.find((i) => i.matchSegment === seg)!;

  return [
    {
      type: "group" as const,
      label: "Keywords",
      icon: Search,
      matchSegments: ["/keywords", "/saved", "/rank-tracking"],
      items: [
        bySegment("/keywords"),
        bySegment("/saved"),
        bySegment("/rank-tracking"),
      ],
    },
    {
      type: "group" as const,
      label: "Domain",
      icon: Globe,
      matchSegments: ["/domain", "/backlinks", "/audit"],
      items: [
        bySegment("/domain"),
        bySegment("/backlinks"),
        bySegment("/audit"),
      ],
    },
    {
      type: "group" as const,
      label: "AI Visibility",
      icon: Sparkles,
      matchSegments: ["/brand-lookup", "/prompt-explorer"],
      items: [bySegment("/brand-lookup"), bySegment("/prompt-explorer")],
    },
    {
      type: "standalone" as const,
      item: bySegment("/ai"),
    },
  ];
}

export const dataforseoHelpLinkOptions = linkOptions({
  to: "/help/dataforseo-api-key",
});
