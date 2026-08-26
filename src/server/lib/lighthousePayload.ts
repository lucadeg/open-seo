/**
 * @file_id FILE-MVX-AUTO-LIGHTHOUSEPAYLOAD-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-LIGHTHOUSEPAYLOAD
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
 * @generated_at 2026-05-13T13:53:38.358Z
 * @updated_at 2026-05-13T13:53:38.360Z
 * @hash sha256:0c832c9d5943b0846b95db510bb0c6760f39177ab99e6605c829382242fbe8a7
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:38.358Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { sortBy } from "remeda";
import type { LighthouseCategory } from "@/shared/lighthouse";
import { jsonCodec } from "@/shared/json";
import {
  storedLighthousePayloadSchema,
  type StoredLighthouseIssue,
  type StoredLighthousePayload,
} from "@/server/lib/lighthouseStoredPayload";

const storedPayloadCodec = jsonCodec(storedLighthousePayloadSchema);

type ExportMode = "full" | "issues" | "category";

type LighthouseIssueReport = {
  issues: StoredLighthouseIssue[];
  hasIssueDetails: boolean;
};

function sortIssues(issues: StoredLighthouseIssue[]) {
  return sortBy(
    issues,
    [
      (issue) => (issue.impactMs ?? 0) * 1000 + (issue.impactBytes ?? 0),
      "desc",
    ],
    [(issue) => issue.score ?? 100, "asc"],
  );
}

function parseStoredLighthousePayload(
  payloadJson: string,
): StoredLighthousePayload | null {
  const storedPayload = storedPayloadCodec.safeParse(payloadJson);
  if (storedPayload.success) {
    return storedPayload.data;
  }

  try {
    JSON.parse(payloadJson);
  } catch {
    throw new Error("Invalid Lighthouse payload JSON");
  }

  return null;
}

function buildLighthouseIssueReport(
  storedPayload: StoredLighthousePayload | null,
  categoryFilter?: LighthouseCategory,
): LighthouseIssueReport {
  if (!storedPayload) {
    return {
      hasIssueDetails: false,
      issues: [],
    };
  }

  const filteredIssues = categoryFilter
    ? storedPayload.issues.filter((issue) => issue.category === categoryFilter)
    : storedPayload.issues;

  return {
    hasIssueDetails: storedPayload.hasIssueDetails,
    issues: sortIssues(filteredIssues),
  };
}

export function readStoredLighthousePayload(
  payloadJson: string,
  categoryFilter?: LighthouseCategory,
) {
  const storedPayload = parseStoredLighthousePayload(payloadJson);

  return {
    storedPayload,
    report: buildLighthouseIssueReport(storedPayload, categoryFilter),
  };
}

export function buildLighthouseExportFile(input: {
  idField: "auditId" | "resultId";
  idValue: string;
  finalUrl: string;
  strategy: "mobile" | "desktop";
  createdAt: string;
  payloadJson: string;
  mode: ExportMode;
  category?: LighthouseCategory;
}) {
  const safeDate = input.createdAt.replace(/[:.]/g, "-");
  const baseName = `lighthouse-${input.strategy}-${safeDate}`;

  if (input.mode === "full") {
    return {
      filename: `${baseName}-payload.json`,
      content: input.payloadJson,
    };
  }

  const { report } = readStoredLighthousePayload(
    input.payloadJson,
    input.category,
  );

  return {
    filename:
      input.mode === "category" && input.category
        ? `${baseName}-${input.category}-issues.json`
        : `${baseName}-issues.json`,
    content: JSON.stringify(
      {
        [input.idField]: input.idValue,
        finalUrl: input.finalUrl,
        strategy: input.strategy,
        createdAt: input.createdAt,
        category: input.category ?? "all",
        issues: report.issues,
      },
      null,
      2,
    ),
  };
}
