/**
 * @file_id FILE-MVX-AUTO--CONFIGID-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP--CONFIGID
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
 * @generated_at 2026-05-13T13:53:36.779Z
 * @updated_at 2026-05-13T13:53:36.780Z
 * @hash sha256:b3432cc74e6688b7a00b01a0252edba56f364e05c11fadfab05faeba3ada2415
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:36.779Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRankTrackingConfigs } from "@/serverFunctions/rank-tracking";
import { RankTrackingDomainDetail } from "@/client/features/rank-tracking/RankTrackingDomainDetail";
import { RankTrackingConfigModal } from "@/client/features/rank-tracking/RankTrackingConfigModal";

export const Route = createFileRoute(
  "/_project/p/$projectId/rank-tracking/$configId",
)({
  component: RankTrackingConfigRoute,
});

function RankTrackingConfigRoute() {
  const { projectId, configId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showConfigModal, setShowConfigModal] = useState(false);

  const { data: configs, isLoading } = useQuery({
    queryKey: ["rankTrackingConfigs", projectId],
    queryFn: () => getRankTrackingConfigs({ data: { projectId } }),
  });

  const config = configs?.find((c) => c.id === configId) ?? null;

  const invalidateConfigs = () => {
    void queryClient.invalidateQueries({
      queryKey: ["rankTrackingConfigs", projectId],
    });
    void queryClient.invalidateQueries({
      queryKey: ["rankTrackingConfigSummaries", projectId],
    });
  };

  const handleBack = () => {
    void navigate({
      to: "/p/$projectId/rank-tracking",
      params: { projectId },
    });
  };

  if (isLoading) return null;

  if (!config) {
    return (
      <>
        <p className="text-sm text-base-content/70">
          Domain configuration not found.
        </p>
        <button className="btn btn-ghost btn-sm" onClick={handleBack}>
          Back to domains
        </button>
      </>
    );
  }

  return (
    <>
      <RankTrackingDomainDetail
        config={config}
        projectId={projectId}
        onBack={handleBack}
        onEdit={() => setShowConfigModal(true)}
      />

      {showConfigModal && (
        <RankTrackingConfigModal
          projectId={projectId}
          existingConfig={config}
          onClose={() => setShowConfigModal(false)}
          onSaved={() => {
            setShowConfigModal(false);
            invalidateConfigs();
          }}
        />
      )}
    </>
  );
}
