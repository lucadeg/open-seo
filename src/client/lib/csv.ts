/**
 * @file_id FILE-MVX-AUTO-CSV-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-CSV
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
 * @generated_at 2026-05-13T13:53:35.796Z
 * @updated_at 2026-05-13T13:53:35.798Z
 * @hash sha256:c7155e0141c978a1faae9e7c25c8c5c49b50ca2f4eaca3aeb2ba26cf974436e2
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.796Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import Papa from "papaparse";

export type CsvValue = string | number | boolean | null | undefined;

export type ExportValue = string | number | boolean;

export function buildCsv(headers: string[], rows: CsvValue[][]): string {
  const normalizedRows = rows.map((row) =>
    row.map((value) => normalizeExportValue(value ?? "")),
  );

  return Papa.unparse(
    {
      fields: headers,
      data: normalizedRows,
    },
    {
      quotes: true,
      newline: "\n",
    },
  );
}

export function normalizeExportValue(value: CsvValue): ExportValue {
  const normalized =
    typeof value === "number" ? roundExportNumber(value) : value;
  return sanitizeCsvValue(normalized ?? "");
}

function roundExportNumber(value: number): number {
  if (!Number.isFinite(value)) return value;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

// Prevent CSV/TSV injection (formula injection) by prefixing dangerous
// characters with a single quote. See OWASP guidance:
// https://owasp.org/www-community/attacks/CSV_Injection
function sanitizeCsvValue(
  value: string | number | boolean,
): string | number | boolean {
  if (typeof value !== "string" || value.length === 0) {
    return value;
  }

  if (["=", "+", "-", "@", "\t", "\r", "\n"].includes(value[0])) {
    return `'${value}`;
  }

  return value;
}

export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
