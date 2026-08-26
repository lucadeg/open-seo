/**
 * @file_id FILE-MVX-AUTO-MAINTAINERS-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-MAINTAINERS
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
 * @generated_at 2026-05-13T13:53:32.632Z
 * @updated_at 2026-05-13T13:53:32.634Z
 * @hash sha256:e233430ea072d37bee0bb9c8fa213009a9874e4fd2600b4f136939e68e478a61
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:32.632Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

# Maintainers

This document covers maintainer-only workflow notes that do not belong in the public project README.

## Release updates

GitHub Releases are the main user-facing update channel for OpenSEO.

- Ask interested users to watch the repo and enable release notifications.
- Do not treat stars as a contact list; GitHub does not expose a way to message stargazers directly.

## Release notes workflow

Generate notes from commits since the latest semver tag:

```sh
pnpm release:notes
```

Useful variants:

```sh
pnpm release:notes -- --from v0.0.1 --to HEAD
pnpm release:notes -- --draft v0.0.2
```

Supported inputs:

- `--from <tag>`: start changelog generation from a specific tag
- `--to <ref>`: end at a specific ref, default is `HEAD`
- `--draft <tag>`: create a GitHub draft release for that tag using the generated notes
- `--repo <owner/repo>`: override the GitHub repo
- `--help`: show help

The generator:

- uses commits since the latest semver tag by default
- filters out maintenance-only commits like `chore:`, `ci:`, `test:`, `build:`, and `release:`
- groups the remaining changes into short user-facing sections
- can create a draft GitHub release when `--draft` is provided

Store finalized notes in `release-notes/` as versioned Markdown files such as `release-notes/v0.0.2.md`.

Recommended release flow:

```sh
pnpm -s release:notes
# edit and save the final copy in release-notes/v0.0.2.md
gh release create v0.0.2 --target main --title v0.0.2 --notes-file release-notes/v0.0.2.md
```

For now, prefer patch releases while the project is still in rapid early development unless there is a clear reason to cut a minor or major release.

## OpenCode slash command

For convenience inside OpenCode, use:

```text
/release-notes
```

The command definition lives at `.opencode/command/release-notes.md` and forwards any extra arguments to the same generator script.
