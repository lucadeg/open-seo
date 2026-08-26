/**
 * @file_id FILE-MVX-AUTO-CLIPBOARD-TEST-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-CLIPBOARD-TEST
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
 * @generated_at 2026-05-13T13:53:35.744Z
 * @updated_at 2026-05-13T13:53:35.745Z
 * @hash sha256:57d9c026ce32fb8208396522f6a419ea147444b8c86961f11d94ee2d53c9b39c
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.744Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { copyTableToClipboard } from "./clipboard";

type WrittenItem = {
  plain: string;
  html: string;
};

class FakeClipboardItem {
  constructor(public types: Record<string, Promise<Blob> | Blob>) {}
  async getType(type: string): Promise<Blob> {
    return await this.types[type];
  }
}

function mockClipboard() {
  vi.stubGlobal("ClipboardItem", FakeClipboardItem);
  const written: WrittenItem[] = [];
  const writeMock = vi.fn(async (items: FakeClipboardItem[]) => {
    for (const item of items) {
      const plainBlob = await item.getType("text/plain");
      const htmlBlob = await item.getType("text/html");
      written.push({
        plain: await plainBlob.text(),
        html: await htmlBlob.text(),
      });
    }
  });
  vi.stubGlobal("navigator", { clipboard: { write: writeMock } });
  return { written, writeMock };
}

describe("copyTableToClipboard", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("emits TSV with tab/newline separators", async () => {
    const { written } = mockClipboard();
    await copyTableToClipboard(
      ["Keyword", "Volume"],
      [
        ["seo audit", 1200],
        ["site speed", 800],
      ],
    );
    expect(written[0].plain).toBe(
      "Keyword\tVolume\nseo audit\t1200\nsite speed\t800",
    );
  });

  it("emits HTML with raw numeric cells (no comma formatting)", async () => {
    const { written } = mockClipboard();
    await copyTableToClipboard(["Volume"], [[1234]]);
    expect(written[0].html).toContain("<td>1234</td>");
  });

  it("rounds decimal numbers to at most two places", async () => {
    const { written } = mockClipboard();
    await copyTableToClipboard(["Traffic"], [[1250.321954]]);
    expect(written[0].plain).toBe("Traffic\n1250.32");
    expect(written[0].html).toContain("<td>1250.32</td>");
  });

  it("emits URL cells as HTML links for spreadsheet paste", async () => {
    const { written } = mockClipboard();
    await copyTableToClipboard(["URL"], [["https://example.com/tools"]]);
    expect(written[0].plain).toBe("URL\nhttps://example.com/tools");
    expect(written[0].html).toContain(
      '<td><a href="https://example.com/tools">https://example.com/tools</a></td>',
    );
  });

  it("sanitizes formula-injection cells with a leading apostrophe", async () => {
    const { written } = mockClipboard();
    await copyTableToClipboard(["Keyword"], [['=HYPERLINK("evil")']]);
    // OWASP guard prefixes the cell with `'` so Sheets/Excel treat it as text.
    expect(written[0].plain).toContain("'=HYPERLINK");
    expect(written[0].html).toMatch(/<td>'=HYPERLINK/);
  });

  it("escapes HTML special characters in string cells", async () => {
    const { written } = mockClipboard();
    await copyTableToClipboard(["Title"], [['<script>alert("x")</script>']]);
    expect(written[0].html).not.toContain("<script>");
    expect(written[0].html).toContain("&lt;script&gt;");
  });

  it("flattens tabs and newlines inside string cells", async () => {
    const { written } = mockClipboard();
    await copyTableToClipboard(["Body"], [["one\ttwo\nthree"]]);
    // Single space replaces both \t and \n so the row stays one line in TSV.
    expect(written[0].plain).toBe("Body\none two three");
  });

  it("treats null and undefined as empty cells", async () => {
    const { written } = mockClipboard();
    await copyTableToClipboard(["A", "B"], [[null, undefined]]);
    expect(written[0].plain).toBe("A\tB\n\t");
  });

  it("throws when the Clipboard API is unavailable", async () => {
    vi.stubGlobal("navigator", {});
    await expect(copyTableToClipboard(["X"], [["y"]])).rejects.toThrow(
      /Clipboard API not available/,
    );
  });
});
