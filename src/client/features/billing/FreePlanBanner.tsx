/**
 * @file_id FILE-MVX-AUTO-FREEPLANBANNER-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-FREEPLANBANNER
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
 * @generated_at 2026-05-13T13:53:34.363Z
 * @updated_at 2026-05-13T13:53:34.365Z
 * @hash sha256:870713ff7cd0d3de6260b89628a4e66a1009cdd344ea191f9e4a3f7b12c71688
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.363Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { Link } from "@tanstack/react-router";
import { AutumnProvider, useCustomer } from "autumn-js/react";
import { useSession } from "@/lib/auth-client";
import { getCustomerPlanStatus } from "@/client/features/billing/plan-detection";
import {
  AUTUMN_SEO_DATA_BALANCE_FEATURE_ID,
  AUTUMN_SEO_DATA_TOPUP_BALANCE_FEATURE_ID,
  BILLING_ROUTE,
  LOW_CREDITS_THRESHOLD_USD,
  SUBSCRIBE_ROUTE,
  autumnSeoDataCreditsToUsd,
} from "@/shared/billing";

export function FreePlanBanner() {
  return (
    <AutumnProvider>
      <FreePlanBannerContent />
    </AutumnProvider>
  );
}

function FreePlanBannerContent() {
  const { data: session } = useSession();
  const customerQuery = useCustomer({
    queryOptions: {
      enabled: Boolean(session?.user?.id),
    },
  });

  if (customerQuery.isLoading || !customerQuery.data) {
    return null;
  }

  const planStatus = getCustomerPlanStatus(customerQuery.data);
  const isFreePlan = planStatus === "free";

  const monthlyRemaining = autumnSeoDataCreditsToUsd(
    customerQuery.data.balances?.[AUTUMN_SEO_DATA_BALANCE_FEATURE_ID]
      ?.remaining ?? 0,
  );
  const topUpRemaining = autumnSeoDataCreditsToUsd(
    customerQuery.data.balances?.[AUTUMN_SEO_DATA_TOPUP_BALANCE_FEATURE_ID]
      ?.remaining ?? 0,
  );
  const totalRemaining = monthlyRemaining + topUpRemaining;

  const isOutOfCredits = totalRemaining <= 0;
  const isLowCredits =
    !isOutOfCredits && totalRemaining < LOW_CREDITS_THRESHOLD_USD;

  const creditsActionLink = isFreePlan ? (
    <Link
      to={SUBSCRIBE_ROUTE}
      search={{ upgrade: true }}
      className="link link-primary font-medium"
    >
      Upgrade your plan
    </Link>
  ) : (
    <Link to={BILLING_ROUTE} className="link link-primary font-medium">
      Buy more credits
    </Link>
  );

  if (isOutOfCredits) {
    return (
      <BannerShell variant="error">
        You&rsquo;ve used all your credits. {creditsActionLink} to continue
        using OpenSEO.
      </BannerShell>
    );
  }

  if (isLowCredits) {
    return (
      <BannerShell variant="warning">
        You&rsquo;re running low on credits. {creditsActionLink} to keep using
        OpenSEO.
      </BannerShell>
    );
  }

  if (isFreePlan) {
    return (
      <BannerShell variant="info">
        We hope you&rsquo;re enjoying OpenSEO!{" "}
        <Link
          to={SUBSCRIBE_ROUTE}
          search={{ upgrade: true }}
          className="link link-primary font-medium"
        >
          Upgrade anytime
        </Link>{" "}
        or{" "}
        <Link to="/support" className="link link-primary font-medium">
          reach out with questions
        </Link>
        .
      </BannerShell>
    );
  }

  return null;
}

function BannerShell({
  variant,
  children,
}: {
  variant: "info" | "warning" | "error";
  children: React.ReactNode;
}) {
  const alertClass =
    variant === "error"
      ? "alert-error"
      : variant === "warning"
        ? "alert-warning"
        : "alert-info";

  return (
    <div className="shrink-0 px-4 py-2.5 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className={`alert text-sm ${alertClass}`}>
          <span>{children}</span>
        </div>
      </div>
    </div>
  );
}
