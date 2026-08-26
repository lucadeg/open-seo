/**
 * @file_id FILE-MVX-AUTO-VERIFY-EMAIL-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-VERIFY-EMAIL
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
 * @generated_at 2026-05-13T13:53:36.366Z
 * @updated_at 2026-05-13T13:53:36.367Z
 * @hash sha256:34103e625019a5bafedee429ab24b75d8a03571335ff4f256a334500d15a6453
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:36.366Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AuthPageCard,
  AuthPageShell,
  authRedirectSearchSchema,
} from "@/client/features/auth/AuthPage";
import { captureClientEvent } from "@/client/lib/posthog";
import { authClient, useSession } from "@/lib/auth-client";
import { isHostedClientAuthMode } from "@/lib/auth-mode";
import { getSignInSearch, normalizeAuthRedirect } from "@/lib/auth-redirect";
import { z } from "zod";

const verificationIssueSchema = z
  .enum(["invalid_token", "token_expired", "user_not_found", "unknown"])
  .catch("unknown");

const verifyEmailSearchSchema = authRedirectSearchSchema.extend({
  error: z.string().optional(),
  email: z.string().optional(),
});

export const Route = createFileRoute("/verify-email")({
  validateSearch: verifyEmailSearchSchema,
  component: VerifyEmailPage,
});

function getVerificationErrorMessage(error: string | undefined) {
  switch ((error ?? "").toLowerCase()) {
    case "invalid_token":
      return "This link is no longer valid. Request a new email to keep going.";
    case "token_expired":
      return "This link has expired. Request a new email to keep going.";
    case "user_not_found":
      return "We couldn't find this account anymore. Try creating it again.";
    default:
      return error
        ? "We couldn't confirm this email. Request a new email and try again."
        : null;
  }
}

function getVerifyEmailPageCopy({
  isHostedMode,
  errorMessage,
  isWaiting,
  isPending,
  isVerified,
  email,
}: {
  isHostedMode: boolean;
  errorMessage: string | null;
  isWaiting: boolean;
  isPending: boolean;
  isVerified: boolean;
  email: string | undefined;
}) {
  if (!isHostedMode) {
    return {
      title: "Verify email",
      helperText: "Email confirmation isn't available right now.",
    };
  }

  if (errorMessage) {
    return {
      title: "We couldn't confirm your email",
      helperText: errorMessage,
    };
  }

  if (isWaiting && email) {
    return {
      title: "Verify your email",
      helperText: `Click the link we sent to ${email} to verify your email.`,
    };
  }

  if (isPending) {
    return {
      title: "Verify email",
      helperText: "Checking your email confirmation.",
    };
  }

  if (isVerified) {
    return {
      title: "Email confirmed",
      helperText: "You're all set. Taking you to your account now.",
    };
  }

  return {
    title: "Email confirmed",
    helperText: "Your email is confirmed. You can sign in now.",
  };
}

function VerifyEmailPage() {
  const search = Route.useSearch();
  const redirectTo = normalizeAuthRedirect(search.redirect);
  const isHostedMode = isHostedClientAuthMode();
  const { data: session, isPending } = useSession();
  const errorMessage = getVerificationErrorMessage(search.error);
  const verificationIssueType = search.error
    ? verificationIssueSchema.parse(search.error)
    : null;
  const email = search.email;
  const isWaiting = !errorMessage && !session?.user?.emailVerified && !!email;
  const [isResending, setIsResending] = useState(false);
  const isVerified = !!session?.user?.emailVerified;
  const pageCopy = getVerifyEmailPageCopy({
    isHostedMode,
    errorMessage,
    isWaiting,
    isPending,
    isVerified,
    email,
  });

  useEffect(() => {
    if (!isVerified) {
      return;
    }

    captureClientEvent("auth:verification_success", {
      redirect_to: redirectTo,
    });

    // Full page reload instead of client-side navigation: the auth→app
    // transition needs a clean server-side load so that all server function
    // handlers are freshly registered (client-side nav during Vite HMR can
    // hit the server before updated handlers are ready, causing
    // "action is not a function" errors).
    window.location.replace(redirectTo);
  }, [isVerified, redirectTo]);

  useEffect(() => {
    if (!verificationIssueType) {
      return;
    }

    captureClientEvent("auth:verification_issue", {
      issue_type: verificationIssueType,
    });
  }, [verificationIssueType]);

  async function handleResend() {
    if (!email) return;
    setIsResending(true);
    try {
      const callbackURL = new URL("/verify-email", window.location.origin);
      if (redirectTo !== "/")
        callbackURL.searchParams.set("redirect", redirectTo);
      const result = await authClient.sendVerificationEmail({
        email,
        callbackURL: callbackURL.toString(),
      });
      if (result.error) {
        toast.error(result.error.message || "We couldn't send another email.");
        return;
      }
      captureClientEvent("auth:verification_resend");
      toast.success("A new email is on the way.");
    } catch {
      toast.error(
        "We couldn't send another email right now. Please try again.",
      );
    } finally {
      setIsResending(false);
    }
  }

  return (
    <AuthPageShell>
      <AuthPageCard
        title={pageCopy.title}
        helperText={pageCopy.helperText}
        footer={
          <p className="text-sm">
            <Link
              to="/sign-in"
              search={getSignInSearch(redirectTo)}
              className="text-base-content/50 hover:text-base-content transition-colors"
            >
              Back to sign in
            </Link>
          </p>
        }
      >
        {!isHostedMode ? null : errorMessage ? (
          <div className="space-y-3">
            <div className="alert alert-error">
              <span>{errorMessage}</span>
            </div>
            <Link
              to="/sign-in"
              search={getSignInSearch(redirectTo)}
              className="btn btn-soft w-full"
            >
              Back to sign in
            </Link>
          </div>
        ) : isWaiting ? (
          <div className="space-y-4">
            <button
              type="button"
              className="btn btn-soft w-full"
              onClick={() => void handleResend()}
              disabled={isResending}
            >
              {isResending ? "Sending email..." : "Resend email"}
            </button>
          </div>
        ) : isPending ? (
          <div className="flex justify-center py-4">
            <span className="loading loading-spinner loading-md" />
          </div>
        ) : isVerified ? (
          <div className="flex justify-center py-4">
            <span className="loading loading-spinner loading-md" />
          </div>
        ) : (
          <Link
            to="/sign-in"
            search={getSignInSearch(redirectTo)}
            className="btn btn-soft w-full"
          >
            Sign in to continue
          </Link>
        )}
      </AuthPageCard>
    </AuthPageShell>
  );
}
