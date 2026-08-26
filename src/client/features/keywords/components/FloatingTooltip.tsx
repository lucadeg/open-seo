/**
 * @file_id FILE-MVX-AUTO-FLOATINGTOOLTIP-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-FLOATINGTOOLTIP
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
 * @generated_at 2026-05-13T13:53:34.877Z
 * @updated_at 2026-05-13T13:53:34.879Z
 * @hash sha256:3841180b79726aff38c0742481552133507692fae35233973c6e706a1b92eecc
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:34.877Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import type { ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";

type Position = { top: number; left: number };

export function FloatingTooltip({
  id,
  position,
  children,
}: {
  id: string;
  position: Position;
  children: ReactNode;
}) {
  return (
    <span
      id={id}
      role="tooltip"
      className="pointer-events-none fixed z-[1000] w-max max-w-64 -translate-x-1/2 -translate-y-full rounded-md border border-base-300 bg-base-100 px-2.5 py-2 text-[11px] font-normal normal-case leading-snug text-base-content shadow-md"
      style={{ left: position.left, top: position.top }}
    >
      {children}
    </span>
  );
}

export function useFloatingTooltip<T extends HTMLElement>({
  delayMs = 150,
  enabled = true,
}: {
  delayMs?: number;
  enabled?: boolean;
} = {}) {
  const tooltipId = useId();
  const triggerRef = useRef<T | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });

  const updatePosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({
      top: rect.top - 8,
      left: rect.left + rect.width / 2,
    });
  };

  const clearOpenTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const open = () => {
    if (!enabled) return;
    updatePosition();
    setIsOpen(true);
  };

  const scheduleOpen = () => {
    if (!enabled) return;
    clearOpenTimeout();
    timeoutRef.current = setTimeout(() => {
      open();
      timeoutRef.current = null;
    }, delayMs);
  };

  const close = () => {
    clearOpenTimeout();
    setIsOpen(false);
  };

  useEffect(() => clearOpenTimeout, []);

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleReposition = () => updatePosition();
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [isOpen]);

  return {
    close,
    isOpen,
    open,
    position,
    scheduleOpen,
    tooltipId,
    triggerRef,
  };
}
