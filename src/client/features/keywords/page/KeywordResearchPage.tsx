/**
 * @file_id FILE-MVX-AUTO-KEYWORDRESEARCHPAGE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-KEYWORDRESEARCHPAGE
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
 * @generated_at 2026-05-13T13:53:35.172Z
 * @updated_at 2026-05-13T13:53:35.174Z
 * @hash sha256:d7009547a8db3ac6adeabc0eda0cd38acde89af0b4cd37b0b1b5ea95dc10b26c
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.172Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { Link } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { getErrorCode } from "@/client/lib/error-messages";
import { BILLING_ROUTE } from "@/shared/billing";
import { useKeywordResearchController } from "@/client/features/keywords/state/useKeywordResearchController";
import type { KeywordResearchControllerInput } from "@/client/features/keywords/state/useKeywordResearchController";
import { KeywordResearchEmptyState } from "./KeywordResearchEmptyState";
import { KeywordResearchLoadingState } from "./KeywordResearchLoadingState";
import { KeywordResearchResults } from "./KeywordResearchResults";
import { KeywordResearchSearchBar } from "./KeywordResearchSearchBar";
import type { KeywordResearchControllerState } from "./types";

type Props = KeywordResearchControllerInput;

export function KeywordResearchPage(input: Props) {
  const controller = useKeywordResearchController(input);

  return (
    <div className="px-4 py-4 md:px-6 md:py-6 pb-24 md:pb-8 overflow-auto">
      <div className="mx-auto max-w-7xl space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Keyword Research</h1>
          <p className="text-sm text-base-content/70">
            Discover keyword ideas, search demand, and ranking opportunities.
          </p>
        </div>

        <KeywordResearchSearchBar controller={controller} />
        <KeywordResearchContent
          controller={controller}
          projectId={input.projectId}
        />
        <KeywordSaveDialog controller={controller} />
      </div>
    </div>
  );
}

function KeywordResearchContent({
  controller,
  projectId,
}: {
  controller: KeywordResearchControllerState;
  projectId: string;
}) {
  const recentSearchesButton = controller.hasSearched ? (
    <div>
      <Link
        from="/p/$projectId/keywords"
        to="/p/$projectId/keywords"
        params={{ projectId }}
        search={{}}
        replace
        className="btn btn-ghost btn-sm gap-2 px-0 text-base-content/70 hover:bg-transparent"
      >
        <ArrowLeft className="size-4" />
        Recent searches
      </Link>
    </div>
  ) : null;

  if (controller.isLoading) {
    return <KeywordResearchLoadingState />;
  }

  if (controller.researchError) {
    const isCreditsError =
      getErrorCode(controller.researchMutationError) === "INSUFFICIENT_CREDITS";

    return (
      <div className="space-y-4 pt-1">
        {recentSearchesButton}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-xl rounded-xl border border-error/30 bg-error/10 p-5 text-error space-y-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p className="text-sm">{controller.researchError}</p>
            </div>
            {isCreditsError ? (
              <Link to={BILLING_ROUTE} className="btn btn-sm">
                Go to Billing
              </Link>
            ) : (
              <button className="btn btn-sm" onClick={controller.retrySearch}>
                Try again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (controller.rows.length === 0) {
    return (
      <div className="space-y-4 pt-1">
        {recentSearchesButton}
        <KeywordResearchEmptyState
          controller={controller}
          projectId={projectId}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-1">
      {recentSearchesButton}
      <KeywordResearchResults controller={controller} />
    </div>
  );
}

function KeywordSaveDialog({
  controller,
}: {
  controller: KeywordResearchControllerState;
}) {
  if (!controller.showSaveDialog) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          Save {controller.selectedRows.size} Keywords
        </h3>
        <div className="py-4">
          <p className="text-base-content/70 text-sm">
            These keywords will be saved to your current project.
          </p>
        </div>
        <div className="modal-action">
          <button
            className="btn"
            onClick={() => controller.setShowSaveDialog(false)}
          >
            Cancel
          </button>
          <button className="btn btn-primary" onClick={controller.confirmSave}>
            Save
          </button>
        </div>
      </div>
      <div
        className="modal-backdrop"
        onClick={() => controller.setShowSaveDialog(false)}
      />
    </div>
  );
}
