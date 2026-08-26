/**
 * @file_id FILE-MVX-AUTO-KEYWORDS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-KEYWORDS
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
 * @generated_at 2026-05-13T13:53:39.178Z
 * @updated_at 2026-05-13T13:53:39.180Z
 * @hash sha256:ba9a5d986a3ea5d27d589568141792342f4235114bc767a272dbdce9071b8b91
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:39.178Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { z } from "zod";

export const researchKeywordsSchema = z.object({
  projectId: z.string().min(1),
  keywords: z.array(z.string().min(1)).min(1).max(200),
  locationCode: z.number().int().positive().default(2840),
  languageCode: z.string().min(2).max(8).default("en"),
  resultLimit: z
    .union([z.literal(150), z.literal(300), z.literal(500)])
    .default(150),
  mode: z
    .enum(["auto", "related", "suggestions", "ideas"])
    .optional()
    .default("auto"),
});

export const saveKeywordsSchema = z.object({
  projectId: z.string().min(1),
  keywords: z.array(z.string().min(1)).min(1).max(500),
  locationCode: z.number().int().positive().default(2840),
  languageCode: z.string().min(2).max(8).default("en"),
  metrics: z
    .array(
      z.object({
        keyword: z.string().min(1),
        searchVolume: z.number().int().nonnegative().nullable().optional(),
        cpc: z.number().nonnegative().nullable().optional(),
        competition: z.number().min(0).max(1).nullable().optional(),
        keywordDifficulty: z
          .number()
          .int()
          .min(0)
          .max(100)
          .nullable()
          .optional(),
        intent: z
          .enum([
            "informational",
            "commercial",
            "transactional",
            "navigational",
            "unknown",
          ])
          .nullable()
          .optional(),
        monthlySearches: z
          .array(
            z.object({
              year: z.number().int().positive(),
              month: z.number().int().min(1).max(12),
              searchVolume: z.number().int().nonnegative(),
            }),
          )
          .optional(),
      }),
    )
    .max(500)
    .optional(),
});

export const removeSavedKeywordsSchema = z.object({
  projectId: z.string().min(1),
  savedKeywordIds: z.array(z.string().min(1)).min(1).max(2000),
});

export const getSavedKeywordsSchema = z.object({
  projectId: z.string().min(1),
});

export type ResearchKeywordsInput = z.infer<typeof researchKeywordsSchema>;
export type SaveKeywordsInput = z.infer<typeof saveKeywordsSchema>;
export type RemoveSavedKeywordsInput = z.infer<
  typeof removeSavedKeywordsSchema
>;
export const serpAnalysisSchema = z.object({
  projectId: z.string().min(1),
  keyword: z.string().min(1),
  locationCode: z.number().int().positive().default(2840),
  languageCode: z.string().min(2).max(8).default("en"),
});

export type GetSavedKeywordsInput = z.infer<typeof getSavedKeywordsSchema>;

/* ------------------------------------------------------------------ */
/*  URL search params schema for /p/$projectId/keywords                */
/* ------------------------------------------------------------------ */

const keywordSortFields = [
  "keyword",
  "searchVolume",
  "cpc",
  "competition",
  "keywordDifficulty",
] as const;

const sortDirs = ["asc", "desc"] as const;
const keywordModes = ["auto", "related", "suggestions", "ideas"] as const;

export const keywordsSearchSchema = z.object({
  q: z.string().optional(),
  loc: z.coerce.number().int().positive().optional(),
  kLimit: z.union([z.literal(150), z.literal(300), z.literal(500)]).optional(),
  mode: z.enum(keywordModes).optional(),
  sort: z.enum(keywordSortFields).optional(),
  order: z.enum(sortDirs).optional(),
  minVol: z.string().optional(),
  maxVol: z.string().optional(),
  minCpc: z.string().optional(),
  maxCpc: z.string().optional(),
  minKd: z.string().optional(),
  maxKd: z.string().optional(),
  include: z.string().optional(),
  exclude: z.string().optional(),
});
