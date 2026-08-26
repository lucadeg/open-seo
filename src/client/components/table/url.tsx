/**
 * @file_id FILE-MVX-AUTO-URL-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-URL
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
 * @generated_at 2026-05-13T13:53:33.367Z
 * @updated_at 2026-05-13T13:53:33.369Z
 * @hash sha256:4e468897ee2e9307d04e911a4d7f2f43548778daa60786c6310f492e46c6cc1b
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:33.367Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { ExternalLink } from "lucide-react";

export function formatUrlForDisplay(value: string): string {
  try {
    const url = new URL(value);
    const hash = url.hash.startsWith("#:~:") ? "" : url.hash;
    const cleaned = `${url.protocol}//${url.host}${url.pathname}${url.search}${hash}`;
    try {
      return decodeURI(cleaned);
    } catch {
      return cleaned;
    }
  } catch {
    return value;
  }
}

export function resolveUrlHref(
  value: string | null | undefined,
  baseDomain?: string,
): string | null {
  if (!value) return null;
  if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(value)) {
    return getSafeExternalUrl(value);
  }
  if (!baseDomain) return null;
  return getSafeExternalUrl(
    `https://${baseDomain}${value.startsWith("/") ? value : `/${value}`}`,
  );
}

export function ExternalUrlCell({
  value,
  label,
  baseDomain,
  className = "link link-primary inline-flex items-center gap-1",
  display = "formatted",
  empty = "-",
}: {
  value: string | null | undefined;
  label?: string | null;
  baseDomain?: string;
  className?: string;
  display?: "formatted" | "path" | "raw";
  empty?: string;
}) {
  const href = resolveUrlHref(value, baseDomain);
  if (!value || !href) {
    return <span className="text-base-content/40">{empty}</span>;
  }

  const visibleLabel = label ?? getUrlDisplayLabel(value, display);
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      <span className="truncate">{visibleLabel}</span>
      <ExternalLink className="size-3 shrink-0" />
    </a>
  );
}

function getUrlDisplayLabel(
  value: string,
  display: "formatted" | "path" | "raw",
) {
  if (display === "raw") return value;
  if (display === "path") {
    try {
      return new URL(value).pathname;
    } catch {
      return value;
    }
  }
  return formatUrlForDisplay(value);
}

function getSafeExternalUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
}
