/**
 * @file_id FILE-MVX-AUTO-USELOCALHISTORYSTORE-001
 * @artifact_kind implementation
 * @project_id PRJ-HERMES-UNCHAINED
 * @workspace_id WKS-MVX-ROOT
 * @app_id APP-BACKEND
 * @module_id MOD-IDE-WEB
 * @component_id COMP-USELOCALHISTORYSTORE
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
 * @generated_at 2026-05-13T13:53:35.673Z
 * @updated_at 2026-05-13T13:53:35.675Z
 * @hash sha256:185faae2a1e988d1064b6ab5982822bf2df1dd4121034bc073c54385edb27c2e
 * @reviewers architect/lucadeg
 * @last_verified_at 2026-05-13T13:53:35.673Z
 * @review_state draft
 * @admissibility candidate
 * @impl_status_tmp_mock true
 */

import { useCallback, useEffect, useRef, useState } from "react";

type UseLocalHistoryStoreOptions<TItem, TAddInput> = {
  storageKey: string;
  maxItems?: number;
  parse: (raw: string) => TItem[] | null;
  isSameItem: (existing: TItem, next: TAddInput) => boolean;
  createItem: (input: TAddInput) => TItem;
  getItemKey: (item: TItem) => number;
};

function loadHistory<TItem>(
  storageKey: string,
  parse: (raw: string) => TItem[] | null,
  maxItems: number,
): TItem[] {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];

    const parsed = parse(raw);
    return parsed ? parsed.slice(0, maxItems) : [];
  } catch {
    return [];
  }
}

function saveHistory<TItem>(storageKey: string, items: TItem[]) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(items));
  } catch {
    // storage full or unavailable - silently ignore
  }
}

export function useLocalHistoryStore<TItem, TAddInput>({
  storageKey,
  maxItems = 20,
  parse,
  isSameItem,
  createItem,
  getItemKey,
}: UseLocalHistoryStoreOptions<TItem, TAddInput>) {
  const parseRef = useRef(parse);
  const [history, setHistory] = useState<TItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    parseRef.current = parse;
  }, [parse]);

  useEffect(() => {
    setHistory(loadHistory(storageKey, parseRef.current, maxItems));
    setIsLoaded(true);
  }, [maxItems, storageKey]);

  const addItem = useCallback(
    (input: TAddInput) => {
      setHistory((prev) => {
        const filtered = prev.filter(
          (existing) => !isSameItem(existing, input),
        );
        const next = [createItem(input), ...filtered].slice(0, maxItems);
        saveHistory(storageKey, next);
        return next;
      });
    },
    [createItem, isSameItem, maxItems, storageKey],
  );

  const removeItem = useCallback(
    (itemKey: number) => {
      setHistory((prev) => {
        const next = prev.filter((item) => getItemKey(item) !== itemKey);
        saveHistory(storageKey, next);
        return next;
      });
    },
    [getItemKey, storageKey],
  );

  const clearItems = useCallback(() => {
    setHistory([]);
    saveHistory(storageKey, []);
  }, [storageKey]);

  return { history, isLoaded, addItem, removeItem, clearItems };
}
