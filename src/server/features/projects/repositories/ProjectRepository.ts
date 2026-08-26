/**
 * @file_id FILE-MVX-AUTO-PROJECTREPOSITORY-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-PROJECTREPOSITORY
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
 * @generated_at 2026-05-13T13:53:37.725Z
 * @updated_at 2026-05-13T13:53:37.726Z
 * @hash sha256:0999dd991861ad0b5f35af62f3cde1704dbfcfa774836b9a21c5270a86ab1c1f
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:37.725Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { AppError } from "@/server/lib/errors";

async function listProjects(organizationId: string) {
  return db.query.projects.findMany({
    where: eq(projects.organizationId, organizationId),
    orderBy: desc(projects.createdAt),
  });
}

async function getProjectForOrganization(
  projectId: string,
  organizationId: string,
) {
  return db.query.projects.findFirst({
    where: and(
      eq(projects.id, projectId),
      eq(projects.organizationId, organizationId),
    ),
  });
}

async function getProjectById(projectId: string) {
  return db.query.projects.findFirst({
    where: eq(projects.id, projectId),
  });
}

async function createProject(
  organizationId: string,
  name: string,
  domain?: string,
) {
  const id = crypto.randomUUID();
  await db.insert(projects).values({
    id,
    organizationId,
    name,
    domain,
  });
  return id;
}

async function deleteProject(projectId: string, organizationId: string) {
  const project = await getProjectForOrganization(projectId, organizationId);
  if (!project) {
    throw new AppError("NOT_FOUND");
  }

  await db
    .delete(projects)
    .where(
      and(
        eq(projects.id, projectId),
        eq(projects.organizationId, organizationId),
      ),
    );
}

export const ProjectRepository = {
  listProjects,
  getProjectForOrganization,
  getProjectById,
  createProject,
  deleteProject,
} as const;
