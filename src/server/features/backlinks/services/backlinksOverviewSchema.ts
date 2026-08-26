/**
 * @file_id FILE-MVX-AUTO-BACKLINKSOVERVIEWSCHEMA-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-BACKLINKSOVERVIEWSCHEMA
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
 * @generated_at 2026-05-13T13:53:37.347Z
 * @updated_at 2026-05-13T13:53:37.348Z
 * @hash sha256:2887407d27e1a144bcf3b89fc4dd184727b226ec450c50ccfb1a04f23392de92
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:37.347Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { z } from "zod";

const backlinksRowSchema = z.object({
  domainFrom: z.string().nullable(),
  urlFrom: z.string().nullable(),
  urlTo: z.string().nullable(),
  anchor: z.string().nullable(),
  itemType: z.string().nullable(),
  isDofollow: z.boolean().nullable(),
  relAttributes: z.array(z.string()),
  rank: z.number().nullable(),
  domainFromRank: z.number().nullable(),
  pageFromRank: z.number().nullable(),
  spamScore: z.number().nullable(),
  firstSeen: z.string().nullable(),
  lastSeen: z.string().nullable(),
  isLost: z.boolean(),
  isBroken: z.boolean(),
  linksCount: z.number().nullable(),
});

export const referringDomainRowSchema = z.object({
  domain: z.string().nullable(),
  backlinks: z.number().nullable(),
  referringPages: z.number().nullable(),
  rank: z.number().nullable(),
  spamScore: z.number().nullable(),
  firstSeen: z.string().nullable(),
  brokenBacklinks: z.number().nullable(),
  brokenPages: z.number().nullable(),
});

export const topPageRowSchema = z.object({
  page: z.string().nullable(),
  backlinks: z.number().nullable(),
  referringDomains: z.number().nullable(),
  rank: z.number().nullable(),
  brokenBacklinks: z.number().nullable(),
});

const backlinksTrendRowSchema = z.object({
  date: z.string(),
  backlinks: z.number().nullable(),
  referringDomains: z.number().nullable(),
  rank: z.number().nullable(),
});

const backlinksNewLostTrendRowSchema = z.object({
  date: z.string(),
  newBacklinks: z.number().nullable(),
  lostBacklinks: z.number().nullable(),
  newReferringDomains: z.number().nullable(),
  lostReferringDomains: z.number().nullable(),
});

export const backlinksOverviewSchema = z.object({
  target: z.string(),
  displayTarget: z.string(),
  scope: z.enum(["domain", "page"]),
  summary: z.object({
    rank: z.number().nullable(),
    backlinks: z.number().nullable(),
    referringPages: z.number().nullable(),
    referringDomains: z.number().nullable(),
    brokenBacklinks: z.number().nullable(),
    brokenPages: z.number().nullable(),
    backlinksSpamScore: z.number().nullable(),
    targetSpamScore: z.number().nullable(),
    newBacklinks: z.number().nullable(),
    lostBacklinks: z.number().nullable(),
    newReferringDomains: z.number().nullable(),
    lostReferringDomains: z.number().nullable(),
  }),
  backlinks: z.array(backlinksRowSchema),
  referringDomains: z.array(referringDomainRowSchema),
  topPages: z.array(topPageRowSchema),
  trends: z.array(backlinksTrendRowSchema),
  newLostTrends: z.array(backlinksNewLostTrendRowSchema),
  fetchedAt: z.string(),
});

export type BacklinksOverviewResult = z.infer<typeof backlinksOverviewSchema>;
