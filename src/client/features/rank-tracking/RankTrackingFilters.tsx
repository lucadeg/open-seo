/**
 * @file_id FILE-MVX-AUTO-RANKTRACKINGFILTERS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-RANKTRACKINGFILTERS
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
 * @generated_at 2026-05-13T13:53:35.546Z
 * @updated_at 2026-05-13T13:53:35.547Z
 * @hash sha256:77452dcd45f7391152149f4b94a3bb07141651d970f514263670654455bb4340
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.546Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { RotateCcw } from "lucide-react";
import type { RankTrackingRow } from "@/types/schemas/rank-tracking";

export type Filters = {
  include: string;
  exclude: string;
  minDesktopPos: string;
  maxDesktopPos: string;
  minMobilePos: string;
  maxMobilePos: string;
};

export const EMPTY_FILTERS: Filters = {
  include: "",
  exclude: "",
  minDesktopPos: "",
  maxDesktopPos: "",
  minMobilePos: "",
  maxMobilePos: "",
};

export function FilterPanel({
  filters,
  setFilters,
  activeFilterCount,
  onReset,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  activeFilterCount: number;
  onReset: () => void;
}) {
  const update = (key: keyof Filters, value: string) =>
    setFilters({ ...filters, [key]: value });

  return (
    <div className="shrink-0 border-b border-base-300 bg-gradient-to-b from-base-100 to-base-200/30 px-4 py-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">Refine results</p>
          {activeFilterCount > 0 && (
            <span className="badge badge-xs badge-primary border-0 text-primary-content">
              {activeFilterCount} active
            </span>
          )}
        </div>
        <button
          className="btn btn-xs btn-ghost gap-1"
          onClick={onReset}
          disabled={activeFilterCount === 0}
        >
          <RotateCcw className="size-3" />
          Clear all
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-base-content/60">
            Include
          </p>
          <input
            className="input input-bordered input-sm w-full bg-base-100"
            placeholder="e.g. seo, tool"
            value={filters.include}
            onChange={(e) => update("include", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-base-content/60">
            Exclude
          </p>
          <input
            className="input input-bordered input-sm w-full bg-base-100"
            placeholder="e.g. free, cheap"
            value={filters.exclude}
            onChange={(e) => update("exclude", e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <RangeFilter
          title="Desktop position"
          minValue={filters.minDesktopPos}
          maxValue={filters.maxDesktopPos}
          onMinChange={(v) => update("minDesktopPos", v)}
          onMaxChange={(v) => update("maxDesktopPos", v)}
        />
        <RangeFilter
          title="Mobile position"
          minValue={filters.minMobilePos}
          maxValue={filters.maxMobilePos}
          onMinChange={(v) => update("minMobilePos", v)}
          onMaxChange={(v) => update("maxMobilePos", v)}
        />
      </div>
    </div>
  );
}

function RangeFilter({
  title,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
}: {
  title: string;
  minValue: string;
  maxValue: string;
  onMinChange: (v: string) => void;
  onMaxChange: (v: string) => void;
}) {
  return (
    <div className="rounded-lg border border-base-300 bg-base-100 p-2.5 space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-base-content/60">
        {title}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <input
          className="input input-bordered input-xs bg-base-100"
          placeholder="Min"
          type="number"
          value={minValue}
          onChange={(e) => onMinChange(e.target.value)}
        />
        <input
          className="input input-bordered input-xs bg-base-100"
          placeholder="Max"
          type="number"
          value={maxValue}
          onChange={(e) => onMaxChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export function applyFilters(
  rows: RankTrackingRow[],
  filters: Filters,
): RankTrackingRow[] {
  const includeTerms = filters.include
    ? filters.include
        .toLowerCase()
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  const excludeTerms = filters.exclude
    ? filters.exclude
        .toLowerCase()
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return rows.filter((row) => {
    const kw = row.keyword.toLowerCase();

    if (includeTerms.length > 0 && !includeTerms.some((t) => kw.includes(t)))
      return false;

    if (excludeTerms.some((t) => kw.includes(t))) return false;

    if (
      !matchesPositionFilter(
        row.desktop.position,
        filters.minDesktopPos,
        filters.maxDesktopPos,
      )
    )
      return false;

    if (
      !matchesPositionFilter(
        row.mobile.position,
        filters.minMobilePos,
        filters.maxMobilePos,
      )
    )
      return false;

    return true;
  });
}

export function matchesPositionFilter(
  position: number | null,
  minValue: string,
  maxValue: string,
): boolean {
  if (!minValue && !maxValue) return true;

  const max = maxValue === "" ? Infinity : Number(maxValue);
  if (max === 0) return position === null;

  if (position === null) return false;

  const min = minValue === "" ? 0 : Number(minValue);
  return position >= min && position <= max;
}

export function countActiveFilters(filters: Filters): number {
  let count = 0;
  if (filters.include) count++;
  if (filters.exclude) count++;
  if (filters.minDesktopPos || filters.maxDesktopPos) count++;
  if (filters.minMobilePos || filters.maxMobilePos) count++;
  return count;
}
