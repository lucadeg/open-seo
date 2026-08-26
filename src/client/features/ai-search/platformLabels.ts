import type {
  PromptExplorerModel,
  WebSearchCountryCode,
} from "@/types/schemas/ai-search";

const MENTION_PLATFORM_LABELS: Record<"chat_gpt" | "google", string> = {
  chat_gpt: "ChatGPT",
  google: "Google AI Overview",
};

const MODEL_LABELS: Record<PromptExplorerModel, string> = {
  chat_gpt: "ChatGPT",
  claude: "Claude",
  gemini: "Gemini",
  perplexity: "Perplexity",
};

/**
 * @file_id FILE-MVX-AUTO-PLATFORMLABELS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-PLATFORMLABELS
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
 * @generated_at 2026-05-13T13:53:33.691Z
 * @updated_at 2026-05-13T13:53:33.692Z
 * @hash sha256:dea02d70a0e07dbfe59906233eceb3f49f8edb3e9e1b0ae19d2d3c98ca4add3a
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:33.691Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */
type ModelAccent = {
  border: string;
  dot: string;
};

const MODEL_ACCENTS: Record<PromptExplorerModel, ModelAccent> = {
  chat_gpt: {
    border: "border-l-emerald-500",
    dot: "bg-emerald-500",
  },
  claude: {
    border: "border-l-orange-500",
    dot: "bg-orange-500",
  },
  gemini: {
    border: "border-l-sky-500",
    dot: "bg-sky-500",
  },
  perplexity: {
    border: "border-l-violet-500",
    dot: "bg-violet-500",
  },
};

export function formatPlatformLabel(platform: "chat_gpt" | "google"): string {
  return MENTION_PLATFORM_LABELS[platform];
}

export function formatModelLabel(model: PromptExplorerModel): string {
  return MODEL_LABELS[model];
}

export function getModelAccent(model: PromptExplorerModel): ModelAccent {
  return MODEL_ACCENTS[model];
}

const COUNTRY_LABELS: Record<WebSearchCountryCode, string> = {
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  IE: "Ireland",
  DE: "Germany",
  FR: "France",
  ES: "Spain",
  IT: "Italy",
  NL: "Netherlands",
  PT: "Portugal",
  PL: "Poland",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  BR: "Brazil",
  MX: "Mexico",
  IN: "India",
  JP: "Japan",
  KR: "South Korea",
  SG: "Singapore",
  HK: "Hong Kong",
  TW: "Taiwan",
  ZA: "South Africa",
};

export function formatCountryLabel(code: WebSearchCountryCode): string {
  return COUNTRY_LABELS[code];
}

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

/** Render a count for display. Null/undefined renders as an em-dash. */
export function formatCount(value: number | null | undefined): string {
  if (value == null) return "—";
  return NUMBER_FORMATTER.format(value);
}
