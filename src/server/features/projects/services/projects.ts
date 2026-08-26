/**
 * @file_id FILE-MVX-AUTO-PROJECTS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-PROJECTS
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
 * @generated_at 2026-05-13T13:53:37.755Z
 * @updated_at 2026-05-13T13:53:37.756Z
 * @hash sha256:040ea0efa075db7b670557ee8ac3c7a9a01c4286ab23bc6864103f8d7093de1b
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:37.755Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import type {
  CreateProjectInput,
  DeleteProjectInput,
} from "@/types/schemas/projects";
import { ProjectRepository } from "@/server/features/projects/repositories/ProjectRepository";
import { AppError } from "@/server/lib/errors";

function mapProject(project: {
  id: string;
  name: string;
  domain: string | null;
  createdAt: string;
}) {
  return {
    id: project.id,
    name: project.name,
    domain: project.domain,
    createdAt: project.createdAt,
  };
}

export async function listProjects(organizationId: string) {
  const rows = await ProjectRepository.listProjects(organizationId);
  return rows.map(mapProject);
}

export async function createProject(
  organizationId: string,
  input: CreateProjectInput,
) {
  const id = await ProjectRepository.createProject(
    organizationId,
    input.name,
    input.domain,
  );
  return { id };
}

export async function deleteProject(
  organizationId: string,
  input: DeleteProjectInput,
) {
  await ProjectRepository.deleteProject(input.projectId, organizationId);
  return { success: true };
}

export async function getOrCreateDefaultProject(organizationId: string) {
  const existing = await ProjectRepository.listProjects(organizationId);
  if (existing.length > 0) {
    return mapProject(existing[0]);
  }

  const id = await ProjectRepository.createProject(
    organizationId,
    "Default",
    undefined,
  );

  return {
    id,
    name: "Default",
    domain: null,
    createdAt: new Date().toISOString(),
  };
}

export async function getProject(projectId: string) {
  const project = await ProjectRepository.getProjectById(projectId);
  if (!project) {
    throw new AppError("NOT_FOUND");
  }

  return mapProject(project);
}

export async function getProjectForOrganization(
  organizationId: string,
  projectId: string,
) {
  const project = await ProjectRepository.getProjectForOrganization(
    projectId,
    organizationId,
  );
  if (!project) {
    throw new AppError("NOT_FOUND");
  }

  return mapProject(project);
}
