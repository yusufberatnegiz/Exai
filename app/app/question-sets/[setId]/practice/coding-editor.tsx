"use client";

import React, { Component, useRef, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";

// ── Fallback textarea (mirrors CodingTextarea in practice-client) ──────────────

function FallbackTextarea({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = value.substring(0, start) + "  " + value.substring(end);
      onChange(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2;
      });
    }
  }

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      spellCheck={false}
      autoCorrect="off"
      autoCapitalize="none"
      autoComplete="off"
      placeholder="// Write your solution here..."
      rows={10}
      className="w-full font-mono text-sm bg-gray-50 text-gray-800
        border border-gray-200 rounded-xl px-4 py-3 resize-y leading-relaxed
        placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20
        focus:border-blue-400 transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed"
    />
  );
}

// ── Error boundary ─────────────────────────────────────────────────────────────

type EBState = { hasError: boolean };

class EditorErrorBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  EBState
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): EBState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// ── Monaco editor component ────────────────────────────────────────────────────

export type CodingEditorProps = {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  language?: string;
  onCmdEnter?: () => void;
};

export default function CodingEditor({
  value,
  onChange,
  disabled,
  language = "javascript",
  onCmdEnter,
}: CodingEditorProps) {
  // Keep a ref so the Monaco command always calls the latest callback,
  // avoiding stale closures after the user types (answers state changes).
  const onCmdEnterRef = useRef(onCmdEnter);
  useEffect(() => {
    onCmdEnterRef.current = onCmdEnter;
  }, [onCmdEnter]);

  const handleMount: OnMount = (editor, monaco) => {
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => onCmdEnterRef.current?.()
    );
  };

  const fallback = (
    <FallbackTextarea value={value} onChange={onChange} disabled={disabled} />
  );

  return (
    <EditorErrorBoundary fallback={fallback}>
      <div className="rounded-xl border border-gray-700 overflow-hidden">
        <Editor
          height={300}
          defaultLanguage={language}
          language={language}
          value={value}
          onChange={(v) => onChange(v ?? "")}
          theme="vs-dark"
          onMount={handleMount}
          loading={
            <div className="h-[300px] flex items-center justify-center text-sm text-gray-500 bg-gray-900">
              Loading editor…
            </div>
          }
          options={{
            minimap: { enabled: false },
            lineNumbers: "on",
            fontSize: 13,
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace",
            scrollBeyondLastLine: false,
            readOnly: disabled,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: "on",
            padding: { top: 12, bottom: 12 },
            scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
            overviewRulerLanes: 0,
            renderLineHighlight: "line",
            folding: false,
            lineDecorationsWidth: 8,
            lineNumbersMinChars: 3,
            glyphMargin: false,
            contextmenu: false,
          }}
        />
      </div>
    </EditorErrorBoundary>
  );
}
