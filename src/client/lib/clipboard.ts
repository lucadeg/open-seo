/**
 * @file_id FILE-MVX-AUTO-CLIPBOARD-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-CLIPBOARD
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
 * @generated_at 2026-05-13T13:53:35.756Z
 * @updated_at 2026-05-13T13:53:35.757Z
 * @hash sha256:d51e67a665ce07aded9844c34a6c00048b400b29405454394fc01272c8bc7568
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.756Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { normalizeExportValue, type CsvValue, type ExportValue } from "./csv";

export const GOOGLE_SHEETS_NEW_URL = "https://sheets.new";

export async function copyTableToClipboard(
  headers: string[],
  rows: CsvValue[][],
): Promise<void> {
  if (typeof navigator === "undefined" || !navigator.clipboard?.write) {
    throw new Error("Clipboard API not available in this browser.");
  }

  const safeRows = rows.map((row) =>
    row.map((value) => normalizeExportValue(value ?? "")),
  );

  const tsv = buildTsv(headers, safeRows);
  const html = buildHtmlTable(headers, safeRows);

  // Wrap blobs in Promise.resolve for Safari <17.4 compatibility — older
  // Safari requires Promise<Blob> values; modern browsers accept either.
  await navigator.clipboard.write([
    new ClipboardItem({
      "text/plain": Promise.resolve(new Blob([tsv], { type: "text/plain" })),
      "text/html": Promise.resolve(new Blob([html], { type: "text/html" })),
    }),
  ]);
}

function buildTsv(headers: string[], rows: ExportValue[][]): string {
  const lines = [headers.map(tsvCell).join("\t")];
  for (const row of rows) {
    lines.push(row.map(tsvCell).join("\t"));
  }
  return lines.join("\n");
}

function tsvCell(value: ExportValue): string {
  if (typeof value !== "string") return String(value);
  return value.replace(/[\t\r\n]+/g, " ");
}

function buildHtmlTable(headers: string[], rows: ExportValue[][]): string {
  const thead = `<thead><tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead>`;
  const tbody = `<tbody>${rows
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${escapeHtmlCell(cell)}</td>`).join("")}</tr>`,
    )
    .join("")}</tbody>`;
  return `<table>${thead}${tbody}</table>`;
}

function escapeHtmlCell(value: ExportValue): string {
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  if (isLinkableUrl(value)) {
    const safeValue = escapeHtml(value);
    return `<a href="${escapeHtml(value)}">${safeValue}</a>`;
  }
  return escapeHtml(value);
}

function isLinkableUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
