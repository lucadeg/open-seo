/**
 * @file_id FILE-MVX-AUTO-DELEGATED-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-DELEGATED
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
 * @generated_at 2026-05-13T13:53:36.168Z
 * @updated_at 2026-05-13T13:53:36.170Z
 * @hash sha256:16d6fbed41f8fd7e02e8a439729e25c8c0a4b4c0d634e2b6b8c716df1b5c7a02
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:36.168Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { db } from "@/db";
import { delegatedUsers } from "@/db/schema";
import { ensureDelegatedOrganizationForUser } from "@/server/auth/delegated-organization";
import { eq } from "drizzle-orm";
import type { EnsuredUserContext } from "./types";

const LOCAL_ADMIN_USER_ID = "local-admin";
const LOCAL_ADMIN_EMAIL = "admin@localhost";

async function ensureUserRecord(userId: string, userEmail: string) {
  const existingUser = await db.query.delegatedUsers.findFirst({
    where: eq(delegatedUsers.id, userId),
  });

  if (!existingUser) {
    await db.insert(delegatedUsers).values({
      id: userId,
      email: userEmail,
    });

    return userEmail;
  }

  if (existingUser.email !== userEmail) {
    await db
      .update(delegatedUsers)
      .set({ email: userEmail })
      .where(eq(delegatedUsers.id, userId));

    return userEmail;
  }

  return existingUser.email;
}

export async function resolveDelegatedContext(
  userId: string,
  userEmail: string,
): Promise<EnsuredUserContext> {
  const ensuredEmail = await ensureUserRecord(userId, userEmail);
  const organizationId = await ensureDelegatedOrganizationForUser(
    userId,
    ensuredEmail,
  );

  return {
    userId,
    userEmail: ensuredEmail,
    organizationId,
  };
}

export async function resolveLocalNoAuthContext(): Promise<EnsuredUserContext> {
  return resolveDelegatedContext(LOCAL_ADMIN_USER_ID, LOCAL_ADMIN_EMAIL);
}
