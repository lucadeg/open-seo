/**
 * @file_id FILE-MVX-AUTO-BILLINGUSAGECHART-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-BILLINGUSAGECHART
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
 * @generated_at 2026-05-13T13:53:34.348Z
 * @updated_at 2026-05-13T13:53:34.350Z
 * @hash sha256:00faea673a5cf682f76384ac7eaec4b444216f34e7d681d3c48127babf972ce1
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.348Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { useAggregateEvents } from "autumn-js/react";
import { useEffect, useRef, useState } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import {
  AUTUMN_SEO_DATA_BALANCE_FEATURE_ID,
  AUTUMN_SEO_DATA_TOPUP_BALANCE_FEATURE_ID,
  autumnSeoDataCreditsToUsd,
} from "@/shared/billing";

const BILLING_USAGE_FEATURE_IDS: string[] = [
  AUTUMN_SEO_DATA_BALANCE_FEATURE_ID,
  AUTUMN_SEO_DATA_TOPUP_BALANCE_FEATURE_ID,
];

export function BillingUsageChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => setChartWidth(el.clientWidth);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const eventsQuery = useAggregateEvents({
    featureId: BILLING_USAGE_FEATURE_IDS,
    range: "30d",
    binSize: "day",
  });

  const chartData = (eventsQuery.list ?? []).map((row) => ({
    date: row.period,
    credits: autumnSeoDataCreditsToUsd(
      BILLING_USAGE_FEATURE_IDS.reduce(
        (sum, featureId) => sum + (row.values?.[featureId] ?? 0),
        0,
      ),
    ),
  }));

  const totalSpend = chartData.reduce((sum, d) => sum + d.credits, 0);

  return (
    <div className="rounded-lg border border-base-300 bg-base-100 p-4 space-y-3">
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-semibold">Usage</span>
        <span className="text-xs text-base-content/50">Last 30 days</span>
      </div>

      <div className="text-2xl font-semibold tabular-nums">
        ${totalSpend.toFixed(2)}
      </div>

      <div ref={containerRef} className="w-full h-32 min-w-0">
        {eventsQuery.isLoading ? null : chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <span className="text-sm text-base-content/40">
              No usage recorded yet
            </span>
          </div>
        ) : chartWidth > 0 ? (
          <BarChart
            width={chartWidth}
            height={128}
            data={chartData}
            margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              opacity={0.06}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatShortDate}
              tick={{ fontSize: 10, fill: "#888" }}
              tickLine={false}
              axisLine={false}
              minTickGap={40}
            />
            <YAxis
              tickFormatter={formatUsdAxis}
              tick={{ fontSize: 10, fill: "#888" }}
              tickLine={false}
              axisLine={false}
              width={44}
            />
            <Tooltip
              content={<UsageTooltip />}
              cursor={{ fill: "rgba(150,150,150,0.1)" }}
            />
            <Bar
              dataKey="credits"
              fill="#7c3aed"
              radius={[2, 2, 0, 0]}
              maxBarSize={12}
            />
          </BarChart>
        ) : null}
      </div>
    </div>
  );
}

function UsageTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: number;
}) {
  if (!active || !payload?.length || label == null) return null;

  return (
    <div className="rounded-md border border-base-300 bg-base-100 px-3 py-2 shadow-sm">
      <p className="text-xs text-base-content/60">
        {new Date(label).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}
      </p>
      <p className="text-sm font-medium tabular-nums">
        ${payload[0].value.toFixed(2)}
      </p>
    </div>
  );
}

function formatShortDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatUsdAxis(value: number) {
  return `$${value % 1 === 0 ? value : value.toFixed(2)}`;
}
