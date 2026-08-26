/**
 * @file_id FILE-MVX-AUTO-CLOUDFLAREACCESS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-CLOUDFLAREACCESS
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
 * @generated_at 2026-05-13T13:53:36.105Z
 * @updated_at 2026-05-13T13:53:36.108Z
 * @hash sha256:36b38463b5d0c231ef9fbf675ef966bde5a46f743d0e863450685d0209afbf39
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:36.105Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { env } from "cloudflare:workers";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { AppError } from "@/server/lib/errors";
import { resolveDelegatedContext } from "./delegated";
import type { EnsuredUserContext } from "./types";

const jwksByTeamDomain = new Map<
  string,
  ReturnType<typeof createRemoteJWKSet>
>();

function getJwks(teamDomain: string) {
  const existing = jwksByTeamDomain.get(teamDomain);
  if (existing) {
    return existing;
  }

  const jwks = createRemoteJWKSet(
    new URL(`${teamDomain}/cdn-cgi/access/certs`),
  );

  jwksByTeamDomain.set(teamDomain, jwks);

  return jwks;
}

function getValidatedTeamDomain(teamDomain: string) {
  const normalizedTeamDomain = teamDomain.trim().replace(/\/+$/, "");

  try {
    const parsed = new URL(normalizedTeamDomain);

    if (parsed.protocol !== "https:") {
      throw new Error("TEAM_DOMAIN must use https");
    }

    return parsed.origin;
  } catch {
    throw new AppError(
      "AUTH_CONFIG_MISSING",
      "TEAM_DOMAIN must be a full https URL like https://your-team.cloudflareaccess.com",
    );
  }
}

export async function resolveCloudflareAccessContext(
  headers: Headers,
): Promise<EnsuredUserContext> {
  const teamDomain = env.TEAM_DOMAIN
    ? getValidatedTeamDomain(env.TEAM_DOMAIN)
    : null;
  const policyAud = env.POLICY_AUD?.trim() || null;

  if (!teamDomain || !policyAud) {
    throw new AppError(
      "AUTH_CONFIG_MISSING",
      "Missing Cloudflare Access configuration",
    );
  }

  const token = headers.get("cf-access-jwt-assertion");

  if (!token) {
    throw new AppError("UNAUTHENTICATED");
  }

  try {
    const jwks = getJwks(teamDomain);
    const { payload } = await jwtVerify(token, jwks, {
      issuer: teamDomain,
      audience: policyAud,
    });
    const userId = typeof payload.sub === "string" ? payload.sub : null;
    const userEmail = typeof payload.email === "string" ? payload.email : null;

    if (!userId || !userEmail) {
      throw new AppError("UNAUTHENTICATED");
    }

    return resolveDelegatedContext(userId, userEmail);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("UNAUTHENTICATED");
  }
}
