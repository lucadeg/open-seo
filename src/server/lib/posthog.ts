import { env } from "cloudflare:workers";
import { PostHog } from "posthog-node";
import { isHostedServerAuthMode } from "@/server/lib/runtime-env";

/**
 * @file_id FILE-MVX-AUTO-POSTHOG-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-POSTHOG
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
 * @generated_at 2026-05-13T13:53:38.413Z
 * @updated_at 2026-05-13T13:53:38.415Z
 * @hash sha256:a06018908dc914296522fda32d2f5d2637012b0b21c4e25ba3e24633c41bd161
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:38.413Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */
function getServerPostHogClient(): PostHog | null {
  const apiKey = env.POSTHOG_PUBLIC_KEY?.trim();
  const host = env.POSTHOG_HOST?.trim();
  if (!apiKey || !host) return null;

  return new PostHog(apiKey, {
    host,
    flushAt: 1,
    flushInterval: 0,
  });
}

export async function captureServerError(
  error: unknown,
  properties: Record<string, string | null | undefined> = {},
) {
  if (!(await isHostedServerAuthMode())) {
    return;
  }

  const client = getServerPostHogClient();
  if (!client) return;

  try {
    await client.captureExceptionImmediate(error, undefined, {
      source: "server",
      ...properties,
    });
  } catch (posthogError) {
    console.error("posthog server capture failed", posthogError);
  } finally {
    await client.shutdown().catch(() => {});
  }
}

export async function captureServerEvent(args: {
  distinctId: string;
  event: string;
  properties?: Record<string, unknown>;
  organizationId: string;
}) {
  if (!(await isHostedServerAuthMode())) {
    return;
  }

  const client = getServerPostHogClient();
  if (!client) return;

  try {
    client.capture({
      distinctId: args.distinctId,
      event: args.event,
      properties: args.properties,
      groups: {
        organization: args.organizationId,
      },
    });
  } catch (posthogError) {
    console.error("posthog server capture failed", posthogError);
  } finally {
    await client.shutdown().catch(() => {});
  }
}
