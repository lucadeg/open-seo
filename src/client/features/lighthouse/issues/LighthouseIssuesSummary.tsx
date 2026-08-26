/**
 * @file_id FILE-MVX-AUTO-LIGHTHOUSEISSUESSUMMARY-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-LIGHTHOUSEISSUESSUMMARY
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
 * @generated_at 2026-05-13T13:53:35.356Z
 * @updated_at 2026-05-13T13:53:35.357Z
 * @hash sha256:2a4556ef7cf440ecf42b114b8a772dbd828bcb70f4d4c7b50b5530feb6036e02
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.356Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import type { LighthouseMetrics, LighthouseScores } from "./types";

export function LighthouseIssuesSummary({
  scores,
  metrics,
}: {
  scores?: LighthouseScores | null;
  metrics?: LighthouseMetrics | null;
}) {
  const metricItems = getMetricItems(metrics);

  if (!scores && metricItems.length === 0) {
    return null;
  }

  return (
    <>
      {scores ? (
        <div className="grid grid-cols-4 gap-3">
          <ScoreGauge label="Performance" score={scores.performance} />
          <ScoreGauge label="Accessibility" score={scores.accessibility} />
          <ScoreGauge label="Best Practices" score={scores["best-practices"]} />
          <ScoreGauge label="SEO" score={scores.seo} />
        </div>
      ) : null}
      {metricItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 rounded-box border border-base-300 bg-base-200/25 px-4 py-3">
          {metricItems.map((metric) => (
            <div
              key={metric.label}
              className="flex items-baseline justify-between gap-2 py-1"
            >
              <span className="text-xs text-base-content/50 uppercase tracking-wide">
                {metric.label}
              </span>
              <span className="text-sm font-semibold tabular-nums text-base-content">
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}

function scoreColor(score: number | null) {
  if (score == null) return "text-base-content/40";
  if (score >= 90) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-error";
}

function scoreStrokeColor(score: number | null) {
  if (score == null) return "stroke-base-content/20";
  if (score >= 90) return "stroke-success";
  if (score >= 50) return "stroke-warning";
  return "stroke-error";
}

function ScoreGauge({ label, score }: { label: string; score: number | null }) {
  const displayScore = score ?? 0;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = (displayScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5 py-2">
      <div className="relative size-16">
        <svg viewBox="0 0 64 64" className="size-full -rotate-90">
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            strokeWidth="4"
            className="stroke-base-300/60"
          />
          {score != null ? (
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${progress} ${circumference}`}
              className={scoreStrokeColor(score)}
            />
          ) : null}
        </svg>
        <span
          className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${scoreColor(score)}`}
        >
          {score ?? "-"}
        </span>
      </div>
      <span className="text-[11px] text-base-content/55 text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

function getMetricItems(metrics?: LighthouseMetrics | null) {
  if (!metrics) return [];

  return [
    { label: "FCP", value: metrics.firstContentfulPaint.displayValue },
    { label: "LCP", value: metrics.largestContentfulPaint.displayValue },
    { label: "TBT", value: metrics.totalBlockingTime.displayValue },
    { label: "SI", value: metrics.speedIndex.displayValue },
    { label: "TTI", value: metrics.timeToInteractive.displayValue },
    { label: "CLS", value: metrics.cumulativeLayoutShift.displayValue },
    { label: "INP", value: metrics.interactionToNextPaint.displayValue },
    { label: "TTFB", value: metrics.serverResponseTime.displayValue },
  ].filter(
    (metric): metric is { label: string; value: string } =>
      metric.value != null,
  );
}
