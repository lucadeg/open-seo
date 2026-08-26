/**
 * @file_id FILE-MVX-AUTO--AUTH-SIGN-UP-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP--AUTH-SIGN-UP
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
 * @generated_at 2026-05-13T13:53:36.539Z
 * @updated_at 2026-05-13T13:53:36.540Z
 * @hash sha256:aac1785ae88e68bc9748f7f6b78f8c7f1776dfe20324b6fd6c259f9ca9e317d8
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:36.539Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { useForm } from "@tanstack/react-form";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
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
import {
  HOSTED_PASSWORD_MAX_LENGTH,
  HOSTED_PASSWORD_MIN_LENGTH,
} from "@/lib/auth-options";
import { z } from "zod";

const signUpSchema = z
  .object({
    name: z.string().trim(),
    email: z.string().trim().email("Enter a valid email address."),
    password: z
      .string()
      .min(
        HOSTED_PASSWORD_MIN_LENGTH,
        `Password must be at least ${HOSTED_PASSWORD_MIN_LENGTH} characters.`,
      )
      .max(
        HOSTED_PASSWORD_MAX_LENGTH,
        `Password must be at most ${HOSTED_PASSWORD_MAX_LENGTH} characters.`,
      ),
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const Route = createFileRoute("/_auth/sign-up")({
  validateSearch: authRedirectSearchSchema,
  component: SignUpPage,
});

function SignUpPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { redirectTo, isHostedMode } = useAuthPageState(search.redirect);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: signUpSchema,
    },
    onSubmit: async ({ formApi, value }) => {
      try {
        const email = value.email.trim();
        captureClientEvent("auth:sign_up_submit", {
          redirect_to: redirectTo,
        });
        const resolvedName =
          value.name.trim() || email.split("@")[0] || "OpenSEO User";
        const result = await authClient.signUp.email({
          name: resolvedName,
          email,
          password: value.password,
          callbackURL: (() => {
            const url = new URL("/verify-email", window.location.origin);
            url.searchParams.set("redirect", "/subscribe");
            return url.toString();
          })(),
        });

        if (result.error) {
          formApi.setErrorMap({
            onSubmit: {
              form: result.error.message || "Unable to create account.",
              fields: {},
            },
          });
          return;
        }

        captureClientEvent("auth:sign_up_success", {
          redirect_to: redirectTo,
        });
        void navigate({
          to: "/verify-email",
          search: { email, ...getSignInSearch(redirectTo) },
        });
      } catch {
        formApi.setErrorMap({
          onSubmit: {
            form: "Unable to create account right now. Please try again.",
            fields: {},
          },
        });
      }
    },
  });

  return (
    <AuthPageCard
      title="Create your account"
      footer={
        isHostedMode ? (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-base-content/60">
              By signing up, you agree to our{" "}
              <a
                href="https://openseo.so/terms-and-conditions"
                target="_blank"
                rel="noreferrer"
                className="text-base-content underline underline-offset-2 hover:text-base-content/80 transition-colors"
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                href="https://openseo.so/privacy"
                target="_blank"
                rel="noreferrer"
                className="text-base-content underline underline-offset-2 hover:text-base-content/80 transition-colors"
              >
                Privacy Policy
              </a>
              .
            </p>

            <p className="text-sm text-base-content/50">
              Already have an account?{" "}
              <Link
                to="/sign-in"
                search={getSignInSearch(redirectTo)}
                className="text-base-content underline underline-offset-2 hover:text-base-content/80 transition-colors"
              >
                Sign in
              </Link>
            </p>
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
        <form.Field name="name">
          {(field) => {
            const error = getFieldError(field.state.meta.errors);

            return (
              <div>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Name (optional)..."
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  autoComplete="name"
                  disabled={!isHostedMode}
                />
                {error ? (
                  <p className="mt-1 text-sm text-error">{error}</p>
                ) : null}
              </div>
            );
          }}
        </form.Field>

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
                  autoComplete="new-password"
                  disabled={!isHostedMode}
                  required
                  minLength={HOSTED_PASSWORD_MIN_LENGTH}
                  maxLength={HOSTED_PASSWORD_MAX_LENGTH}
                />
                {error ? (
                  <p className="mt-1 text-sm text-error">{error}</p>
                ) : null}
              </div>
            );
          }}
        </form.Field>

        <form.Field name="confirmPassword">
          {(field) => {
            const error = getFieldError(field.state.meta.errors);

            return (
              <div>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  placeholder="Confirm password..."
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  autoComplete="new-password"
                  disabled={!isHostedMode}
                  required
                  minLength={HOSTED_PASSWORD_MIN_LENGTH}
                  maxLength={HOSTED_PASSWORD_MAX_LENGTH}
                />
                {error ? (
                  <p className="mt-1 text-sm text-error">{error}</p>
                ) : null}
              </div>
            );
          }}
        </form.Field>

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
                  {isSubmitting ? "Creating account..." : "Create account"}
                </button>
              </>
            );
          }}
        </form.Subscribe>
      </form>
    </AuthPageCard>
  );
}
