/**
 * @file_id FILE-MVX-AUTO-DATAFORSEOBACKLINKS-TEST-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-DATAFORSEOBACKLINKS-TEST
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
 * @generated_at 2026-05-13T13:53:38.079Z
 * @updated_at 2026-05-13T13:53:38.080Z
 * @hash sha256:56c4855720bb63b943f138bfe6904b318684e363a00c8d2cc06a87c84bc9291c
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:38.079Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@/server/lib/errors";
import type * as DataforseoBacklinksSupport from "@/server/lib/dataforseoBacklinksSupport";

vi.mock("@/server/lib/runtime-env", () => ({
  getRequiredEnvValue: vi.fn(async () => "test-api-key"),
}));

const { classifyBacklinksError } = vi.hoisted(() => ({
  classifyBacklinksError: vi.fn(),
}));

vi.mock("@/server/lib/dataforseoBacklinksSupport", async () => {
  const actual = await vi.importActual<typeof DataforseoBacklinksSupport>(
    "@/server/lib/dataforseoBacklinksSupport",
  );
  return { ...actual, classifyBacklinksError };
});

import {
  fetchBacklinksHistoryRaw,
  fetchBacklinksRowsRaw,
  fetchBacklinksSummaryRaw,
  normalizeBacklinksTarget,
} from "@/server/lib/dataforseoBacklinks";

describe("normalizeBacklinksTarget", () => {
  it("treats explicit homepage URLs as page lookups", () => {
    expect(normalizeBacklinksTarget("https://Example.com/")).toEqual({
      apiTarget: "https://example.com/",
      displayTarget: "https://example.com/",
      scope: "page",
    });
  });

  it("trims trailing slashes from non-root page URLs", () => {
    expect(
      normalizeBacklinksTarget("https://github.com/every-app/open-seo/"),
    ).toEqual({
      apiTarget: "https://github.com/every-app/open-seo",
      displayTarget: "https://github.com/every-app/open-seo",
      scope: "page",
    });
  });

  it("keeps trailing slashes for root page URLs", () => {
    expect(normalizeBacklinksTarget("https://example.com/")).toEqual({
      apiTarget: "https://example.com/",
      displayTarget: "https://example.com/",
      scope: "page",
    });
  });

  it("treats bare hostnames as domain lookups", () => {
    expect(normalizeBacklinksTarget("Example.com")).toEqual({
      apiTarget: "example.com",
      displayTarget: "example.com",
      scope: "domain",
    });
  });

  it("lets callers force domain scope for full URLs", () => {
    expect(
      normalizeBacklinksTarget("https://Example.com/pricing", {
        scope: "domain",
      }),
    ).toEqual({
      apiTarget: "example.com",
      displayTarget: "example.com",
      scope: "domain",
    });
  });

  it("normalizes domain scope for URLs with query strings or fragments", () => {
    expect(
      normalizeBacklinksTarget(
        "https://Example.com/pricing?utm_source=newsletter#hero",
        {
          scope: "domain",
        },
      ),
    ).toEqual({
      apiTarget: "example.com",
      displayTarget: "example.com",
      scope: "domain",
    });
  });

  it("lets callers force page scope for bare hostnames", () => {
    expect(normalizeBacklinksTarget("Example.com", { scope: "page" })).toEqual({
      apiTarget: "https://example.com/",
      displayTarget: "https://example.com/",
      scope: "page",
    });
  });

  it("rejects page targets with query strings or fragments", () => {
    expectValidationError(() =>
      normalizeBacklinksTarget("https://example.com/pricing?token=secret#hero"),
    );
  });

  it("rejects page targets with embedded credentials", () => {
    expectValidationError(() =>
      normalizeBacklinksTarget("https://user:pass@example.com/private"),
    );
  });
});

describe("fetchBacklinksSummaryRaw", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("classifies top-level DataForSEO body errors using status_code", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          status_code: 40204,
          status_message: "Backlinks subscription required",
          tasks: [],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    classifyBacklinksError.mockImplementation((status: number | undefined) => {
      if (status === 40204) {
        return new AppError(
          "BACKLINKS_NOT_ENABLED",
          "Backlinks is not enabled",
        );
      }
      return null;
    });

    await expect(
      fetchBacklinksSummaryRaw({
        target: "example.com",
      }),
    ).rejects.toMatchObject({ code: "BACKLINKS_NOT_ENABLED" });

    expect(classifyBacklinksError).toHaveBeenCalledWith(
      40204,
      expect.stringContaining("Backlinks subscription required"),
      "/v3/backlinks/summary/live",
    );
  });

  it("treats null summary results as a valid zero-data response", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          status_code: 20000,
          status_message: "Ok.",
          tasks: [
            {
              status_code: 20000,
              status_message: "Ok.",
              result: [null],
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    classifyBacklinksError.mockReturnValue(null);

    await expect(
      fetchBacklinksSummaryRaw({
        target: "not-a-real-input.example",
      }),
    ).resolves.toMatchObject({ data: {} });
  });

  it("treats empty summary results as a valid zero-data response", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          status_code: 20000,
          status_message: "Ok.",
          tasks: [
            {
              status_code: 20000,
              status_message: "Ok.",
              result: [],
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    classifyBacklinksError.mockReturnValue(null);

    await expect(
      fetchBacklinksSummaryRaw({
        target: "example.com",
      }),
    ).resolves.toMatchObject({ data: {} });
  });

  it("treats empty backlinks rows and history results as valid empty arrays", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            status_code: 20000,
            status_message: "Ok.",
            tasks: [
              {
                status_code: 20000,
                status_message: "Ok.",
                result: [],
              },
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            status_code: 20000,
            status_message: "Ok.",
            tasks: [
              {
                status_code: 20000,
                status_message: "Ok.",
                result: [],
              },
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      );
    classifyBacklinksError.mockReturnValue(null);

    await expect(
      fetchBacklinksRowsRaw({
        target: "example.com",
      }),
    ).resolves.toMatchObject({ data: [] });
    await expect(
      fetchBacklinksHistoryRaw({
        target: "example.com",
        dateFrom: "2025-01-01",
        dateTo: "2025-12-31",
      }),
    ).resolves.toMatchObject({ data: [] });
  });
});

function expectValidationError(fn: () => unknown) {
  try {
    fn();
  } catch (error) {
    expect(error).toMatchObject({ code: "VALIDATION_ERROR" });
    return;
  }

  throw new Error("Expected normalizeBacklinksTarget to throw");
}
