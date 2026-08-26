/**
 * @file_id FILE-MVX-AUTO-0001-PROJECT-SCOPING-FOR-SERVER-FUNCTIONS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-0001-PROJECT-SCOPING-FOR-SERVER-FUNCTIONS
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
 * @generated_at 2026-05-13T13:53:32.498Z
 * @updated_at 2026-05-13T13:53:32.500Z
 * @hash sha256:c2410902669155a2aea42aca0fc64c35a4a190788ae12145ebb834a01c5c86b9
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:32.498Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

# Project scoping for server functions

## Status

Accepted

## Context

TanStack Start server functions do not know which route called them, so they cannot infer the active project from the URL.

We used to keep the selected project in session state and read it indirectly from middleware. That made project scope implicit and caused drift between the current page, the current request, and other open tabs.

## Decision

Project-scoped server functions must accept `projectId` in their input.

Global server-function middleware now always resolves the authenticated user and organization. If the payload includes `projectId`, that same global middleware loads the project for the current organization and adds it to server-function context.

Function-level middleware is still used for type narrowing:

- `requireAuthenticatedContext` guarantees authenticated context is present.
- `requireProjectContext` guarantees `context.project` is present for project-scoped handlers.

In practice:

- `organizationId` comes from global middleware.
- `projectId` comes from explicit input.
- `context.project` exists only when the request included a valid `projectId`.
- handlers use `context.project.id`, not session-backed current-project state.

## Rationale

Explicit `projectId` matches how server functions actually work: the request payload, not the route, defines the target resource.

This gives us:

- request-level project scope
- correct multi-tab behavior
- authorization tied to the current request
- simpler, more testable handlers

## Consequences

- Project-scoped server functions should validate `projectId` in input and use `requireProjectContext`.
- Organization-scoped server functions should use authenticated context only.
- Global middleware is the single place that resolves auth, organization, and optional project context.
- The session is no longer the source of truth for the selected project.
- Hosted mode may still apply product-level feature defaults after project access is resolved. For example, backlinks access can be treated as platform-enabled in hosted deployments, but the request must still be scoped to a project first.
