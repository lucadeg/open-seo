/**
 * @file_id FILE-MVX-AUTO-DATAFORSEOBACKLINKSTARGET-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-DATAFORSEOBACKLINKSTARGET
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
 * @generated_at 2026-05-13T13:53:38.124Z
 * @updated_at 2026-05-13T13:53:38.126Z
 * @hash sha256:594941b914b6a56c639d266b36c42ef5b56cd829a1bfab4260a49ec6c59e04b1
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:38.124Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { AppError } from "@/server/lib/errors";
import type { BacklinksLookupInput } from "@/types/schemas/backlinks";

type NormalizedBacklinkTarget = {
  apiTarget: string;
  displayTarget: string;
  scope: "domain" | "page";
};

type NormalizeBacklinksTargetOptions = {
  scope?: BacklinksLookupInput["scope"];
};

function normalizePageTargetUrl(url: URL, hostname: string): string {
  const normalizedUrl = new URL(url.toString());
  normalizedUrl.hostname = hostname;

  if (normalizedUrl.pathname.length > 1) {
    normalizedUrl.pathname = normalizedUrl.pathname.replace(/\/+$/, "");
  }

  return normalizedUrl.toString();
}

export function normalizeBacklinksTarget(
  input: string,
  options: NormalizeBacklinksTargetOptions = {},
): NormalizedBacklinkTarget {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new AppError("VALIDATION_ERROR", "Target is required");
  }

  const hasExplicitProtocol = /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(trimmed);
  const withProtocol = hasExplicitProtocol ? trimmed : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(withProtocol);
  } catch {
    throw new AppError("VALIDATION_ERROR", "Target is invalid");
  }

  const exactHostname = parsed.hostname.toLowerCase();
  const domainHostname = exactHostname.replace(/^www\./, "");
  if (!domainHostname || !domainHostname.includes(".")) {
    throw new AppError("VALIDATION_ERROR", "Target is invalid");
  }

  if (parsed.username || parsed.password) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Page URLs with embedded credentials are not supported",
    );
  }

  const hasMeaningfulPath = parsed.pathname !== "/";
  const requestedScope = options.scope;

  if (requestedScope === "domain") {
    return {
      apiTarget: domainHostname,
      displayTarget: domainHostname,
      scope: "domain",
    };
  }

  if (parsed.search || parsed.hash) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Page URLs with query strings or fragments are not supported",
    );
  }

  if (requestedScope === "page") {
    const normalizedUrl = new URL(parsed.toString());
    if (!hasExplicitProtocol && !hasMeaningfulPath) {
      normalizedUrl.pathname = "/";
    }

    const normalizedTarget = normalizePageTargetUrl(
      normalizedUrl,
      exactHostname,
    );
    return {
      apiTarget: normalizedTarget,
      displayTarget: normalizedTarget,
      scope: "page",
    };
  }

  if (hasExplicitProtocol || hasMeaningfulPath) {
    const normalizedTarget = normalizePageTargetUrl(parsed, exactHostname);
    return {
      apiTarget: normalizedTarget,
      displayTarget: normalizedTarget,
      scope: "page",
    };
  }

  return {
    apiTarget: domainHostname,
    displayTarget: domainHostname,
    scope: "domain",
  };
}
