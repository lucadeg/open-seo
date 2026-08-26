/**
 * @file_id FILE-MVX-AUTO--AUTH-SIGN-IN-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP--AUTH-SIGN-IN
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
 * @generated_at 2026-05-13T13:53:36.527Z
 * @updated_at 2026-05-13T13:53:36.528Z
 * @hash sha256:beead5d6846bacdb73cda6d3f75efc3c7d56299793987c6c3bc9fc2403c24acd
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:36.527Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { useForm } from "@tanstack/react-form";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  AuthPageCard,
  authRedirectSearchSchema,
  getFieldError,
  getFormError,
  useAuthPageState,
} from "@/client/features/auth/AuthPage";
import { captureClientEvent } from "@/client/lib/posthog";
import { authClient } from "@/lib/auth-client";
import { getSignInSearch } from "@/lib/auth-redirect";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export const Route = createFileRoute("/_auth/sign-in")({
  validateSearch: authRedirectSearchSchema,
  component: SignInPage,
});

function SignInPage() {
  const search = Route.useSearch();
  const { redirectTo, isHostedMode } = useAuthPageState(search.redirect);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(
    null,
  );
  const [isSendingVerification, setIsSendingVerification] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async ({ formApi, value }) => {
      try {
        const email = value.email.trim();
        captureClientEvent("auth:sign_in_submit", {
          redirect_to: redirectTo,
        });
        setVerificationEmail(null);

        const result = await authClient.signIn.email({
          email,
          password: value.password,
          callbackURL: redirectTo,
        });

        if (!result.error) {
          captureClientEvent("auth:sign_in_success", {
            redirect_to: redirectTo,
          });
          return;
        }

        if (result.error.status === 403) {
          captureClientEvent("auth:sign_in_block_unverified", {
            redirect_to: redirectTo,
          });
          setVerificationEmail(email);
          formApi.setErrorMap({
            onSubmit: {
              form: "Please confirm your email before signing in.",
              fields: {},
            },
          });
          return;
        }

        formApi.setErrorMap({
          onSubmit: {
            form: result.error.message || "We couldn't sign you in.",
            fields: {},
          },
        });
      } catch {
        formApi.setErrorMap({
          onSubmit: {
            form: "Unable to sign in right now. Please try again.",
            fields: {},
          },
        });
      }
    },
  });

  async function handleResendVerification() {
    if (!verificationEmail) {
      return;
    }

    setIsSendingVerification(true);

    try {
      const callbackURL = new URL("/verify-email", window.location.origin);
      if (redirectTo !== "/")
        callbackURL.searchParams.set("redirect", redirectTo);
      const result = await authClient.sendVerificationEmail({
        email: verificationEmail,
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
      setIsSendingVerification(false);
    }
  }

  return (
    <AuthPageCard
      title="Sign in"
      footer={
        isHostedMode ? (
          <div className="flex justify-between text-sm text-base-content/50">
            <Link
              to="/forgot-password"
              search={getSignInSearch(redirectTo)}
              className="text-base-content underline underline-offset-2 hover:text-base-content/80 transition-colors"
            >
              Forgot password?
            </Link>
            <Link
              to="/sign-up"
              search={getSignInSearch(redirectTo)}
              className="text-base-content underline underline-offset-2 hover:text-base-content/80 transition-colors"
            >
              Create account
            </Link>
          </div>
        ) : null
      }
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field name="email">
          {(field) => {
            const error = getFieldError(field.state.meta.errors);

            return (
              <div>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  placeholder="Email address..."
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  autoComplete="email"
                  disabled={!isHostedMode}
                  required
                />
                {error ? (
                  <p className="mt-1 text-sm text-error">{error}</p>
                ) : null}
              </div>
            );
          }}
        </form.Field>

        <form.Field name="password">
          {(field) => {
            const error = getFieldError(field.state.meta.errors);

            return (
              <div>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  placeholder="Password..."
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  autoComplete="current-password"
                  disabled={!isHostedMode}
                  required
                />
                {error ? (
                  <p className="mt-1 text-sm text-error">{error}</p>
                ) : null}
              </div>
            );
          }}
        </form.Field>

        {verificationEmail ? (
          <div className="alert alert-warning items-start">
            <div className="space-y-3">
              <p className="text-sm">
                Please check {verificationEmail} for a link to confirm your
                email.
              </p>
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => {
                  void handleResendVerification();
                }}
                disabled={isSendingVerification}
              >
                {isSendingVerification
                  ? "Sending email..."
                  : "Send another email"}
              </button>
            </div>
          </div>
        ) : null}

        <form.Subscribe
          selector={(state) => ({
            submitError: state.errorMap.onSubmit,
            isSubmitting: state.isSubmitting,
          })}
        >
          {({ submitError, isSubmitting }) => {
            const errorMessage = getFormError(submitError);
            return (
              <>
                {errorMessage ? (
                  <p className="text-sm text-error">{errorMessage}</p>
                ) : null}
                <button
                  className="btn btn-soft w-full"
                  disabled={!isHostedMode || isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
              </>
            );
          }}
        </form.Subscribe>
      </form>
    </AuthPageCard>
  );
}
