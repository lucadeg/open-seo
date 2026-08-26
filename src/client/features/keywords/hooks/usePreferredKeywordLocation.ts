/**
 * @file_id FILE-MVX-AUTO-USEPREFERREDKEYWORDLOCATION-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-USEPREFERREDKEYWORDLOCATION
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
 * @generated_at 2026-05-13T13:53:35.027Z
 * @updated_at 2026-05-13T13:53:35.028Z
 * @hash sha256:959c58065219020777bf0ef1fe4401f82611528ce1814d6cf7b5022e26581ed6
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.027Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { useEffect, useState } from "react";
import { z } from "zod";
import {
  DEFAULT_LOCATION_CODE,
  isSupportedLocationCode,
} from "@/client/features/keywords/locations";

const STORAGE_KEY = "keyword-preferred-location";
const locationCodeSchema = z.number().int().positive();

function loadPreferredLocationCode() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = locationCodeSchema.parse(JSON.parse(raw));
    return isSupportedLocationCode(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function savePreferredLocationCode(locationCode: number) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(locationCode));
  } catch {
    // storage full or unavailable - silently ignore
  }
}

export function usePreferredKeywordLocation() {
  const [preferredLocationCode, setPreferredLocationCodeState] = useState(
    DEFAULT_LOCATION_CODE,
  );

  useEffect(() => {
    const savedLocationCode = loadPreferredLocationCode();
    if (savedLocationCode != null) {
      setPreferredLocationCodeState(savedLocationCode);
    }
  }, []);

  function setPreferredLocationCode(locationCode: number) {
    if (!isSupportedLocationCode(locationCode)) return;
    setPreferredLocationCodeState(locationCode);
    savePreferredLocationCode(locationCode);
  }

  return { preferredLocationCode, setPreferredLocationCode };
}
