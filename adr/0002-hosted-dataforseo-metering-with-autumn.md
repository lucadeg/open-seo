/**
 * @file_id FILE-MVX-AUTO-0002-HOSTED-DATAFORSEO-METERING-WITH-AUTUMN-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-0002-HOSTED-DATAFORSEO-METERING-WITH-AUTUMN
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
 * @generated_at 2026-05-13T13:53:32.510Z
 * @updated_at 2026-05-13T13:53:32.511Z
 * @hash sha256:c548efed7e136c19a926735b706f411f6d341959d93d9fb21db85b33d657fc16
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:32.510Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

# Hosted DataForSEO metering with Autumn

## Status

Accepted

## Context

In hosted mode, OpenSEO uses platform-managed DataForSEO credentials and bills each organization for actual provider usage.

The low-level DataForSEO helpers can make live requests directly. If feature code imports them freely, it is easy to skip billing checks, forget usage tracking, or meter against estimated cost instead of the cost DataForSEO actually returned.

Autumn's billing model fits this flow: check access before the call, then track usage after the call succeeds.

## Decision

Hosted DataForSEO access must go through `createDataforseoClient`.

We model hosted SEO data billing in Autumn as a credit system:

- `base-plan` grants recurring `usage_credits`
- `credit-top-up` sells more `usage_credits`
- `seo_data_usage` is the metered feature DataForSEO calls consume
- `1000` credits equals `$1`

In hosted mode, the client:

- accepts `BillingCustomerContext`, not an Autumn customer ID
- resolves the Autumn customer from `organizationId`
- checks `seo_data_usage` before calling DataForSEO, using a small minimum balance guardrail
- executes a raw `fetch*Raw` helper that returns parsed data plus provider billing metadata
- tracks the actual reported DataForSEO cost in Autumn after the call succeeds

In non-hosted mode, the client skips Autumn and executes the DataForSEO call directly.

Raw `fetch*Raw` helpers remain low-level transport and parsing functions. They are not the application entry point for hosted features.

## Rationale

This makes the metered path the easiest path. Feature code asks for DataForSEO data once and gets billing enforcement by default.

It also keeps billing aligned with provider-reported cost. We do not know the exact charge until DataForSEO responds, so the client does a preflight balance check and records the exact usage event afterwards.

## Consequences

- New DataForSEO capabilities should be added to `src/server/lib/dataforseoClient.ts`, not called from feature code via raw helpers.
- Hosted feature services must pass billing customer context into the client.
- Subscription eligibility remains a separate concern handled by auth middleware; the client is responsible for usage metering.
- Direct raw DataForSEO imports in hosted application code should be treated as billing bypasses.
