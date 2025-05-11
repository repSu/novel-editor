"use client";
import { copyToClipboard, toastUnavailable } from "@/lib/utils";
import { ChevronLeft, Cloud, Copy, List, Redo, Settings, Sparkles, SpellCheck, Trash2, Undo } from "lucide-react"; // Added Trash2
import type { EditorInstance } from "novel";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner"; // Import toast
import { useDebouncedCallback } from "use-debounce";

import { AiToolboxDialogContent } from "@/components/dialogs/ai-toolbox-dialog";
import { OutlineDialogContent } from "@/components/dialogs/outline-dialog";
import { SettingsDialogContent } from "@/components/dialogs/settings-dialog";
import { TypoCheckDialogContent } from "@/components/dialogs/typo-check-dialog";
import TailwindAdvancedEditor from "@/components/tailwind/advanced-editor";
import { Button } from "@/components/tailwind/ui/button";
import LoadingCircle from "@/components/tailwind/ui/icons/loading-circle";

const SaveStatus = ({
  status,
  wordCount,
}: {
  status: "saved" | "saving" | "error";
  wordCount: number;
}) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      {status === "saving" ? (
        <>
          <LoadingCircle dimensions="h-4 w-4" />
          <span>保存中...</span>
        </>
      ) : status === "error" ? (
        <span className="text-red-500">保存失败</span>
      ) : (
        <span>已保存</span>
      )}
      <span>|</span>
      <span>{wordCount}字</span>
    </div>
  );
};

export default function Page() {
  const [isTypoCheckOpen, setIsTypoCheckOpen] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [displayTitle, setDisplayTitle] = useState(""); // Initialize with empty string

  const editorRef = useRef<{ getEditor: () => EditorInstance | null }>(null);

  const saveTitle = (newTitle: string) => {
    const titleToSave = newTitle.trim(); // Trim whitespace
    window.localStorage.setItem("novel-title", titleToSave);
    setSaveStatus("saved");
    // If the title becomes empty, ensure the h1's innerHTML is also cleared
    // to help with CSS :empty selector, and update displayTitle state.
    if (titleRef.current && titleToSave === "") {
      titleRef.current.innerHTML = "";
    }
    // Keep the displayTitle state consistent with what's being saved.
    // This ensures that if the user clears the title, the state reflects that,
    // allowing the :empty CSS pseudo-class to potentially work.
    setDisplayTitle(titleToSave);
  };

  const debouncedTitleUpdate = useDebouncedCallback(saveTitle, 500);

  // Helper to update placeholder class based on title content
  const updatePlaceholderVisibility = (element: HTMLElement | null, title: string) => {
    if (element) {
      if (title.trim() === "") {
        element.classList.add("title-is-empty");
      } else {
        element.classList.remove("title-is-empty");
      }
    }
  };

  useEffect(() => {
    const savedTitle = window.localStorage.getItem("novel-title");
    const initialTitle = savedTitle || "";

    if (titleRef.current) {
      titleRef.current.textContent = initialTitle;
    }
    setDisplayTitle(initialTitle);
    updatePlaceholderVisibility(titleRef.current, initialTitle); // Set initial class

    const timer = setTimeout(() => {
      const content = window.localStorage.getItem("novel-text-length");
      if (content) {
        setWordCount(Number.parseInt(content));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");
  const [wordCount, setWordCount] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const [isAiToolboxOpen, setIsAiToolboxOpen] = useState(false);

  const handleClearContent = () => {
    // Add confirmation dialog
    if (window.confirm("确定要清空所有内容吗？此操作将清除所有记录，若误触请点击取消。")) {
      // Clear title
      if (titleRef.current) {
        titleRef.current.textContent = "";
        saveTitle(""); // Save empty title and update state
        updatePlaceholderVisibility(titleRef.current, ""); // Update placeholder visibility
      }

      // Clear editor content
      const editor = editorRef.current?.getEditor();
      if (editor) {
        editor.commands.clearContent(true); // Clear content and trigger save/update
        // clearContent(true) should trigger onUpdate -> saveContent -> onWordCountChange
        // Manually set state for immediate UI feedback
        setWordCount(0);
        setSaveStatus("saved"); // Assume saved state after clearing
        // Ensure local storage length is updated too
        window.localStorage.setItem("novel-text-length", "0");
      }
      toast.error("内容已清空"); // Notify user
    }
    // If user cancels, do nothing.
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-10">
        <div className="flex h-14 items-center justify-between px-4">
          <Button variant="ghost" size="icon" onClick={toastUnavailable}>
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
              <Settings className="h-5 w-5 text-gray-600" />
            </Button>

            {/* <Button variant="ghost" size="icon" onClick={() => setIsTypoCheckOpen(true)}> */}
            <Button variant="ghost" size="icon" onClick={() => toastUnavailable()}>
              <SpellCheck className="h-5 w-5 text-gray-600" />
            </Button>

            {/* <Button variant="ghost" size="icon" onClick={() => setIsOutlineOpen(true)}> */}
            <Button variant="ghost" size="icon" onClick={() => toastUnavailable()}>
              <List className="h-5 w-5 text-gray-600" />
            </Button>

            <Button variant="ghost" size="icon" onClick={toastUnavailable}>
              <Cloud className="h-5 w-5 text-gray-600" />
            </Button>
          </div>

          <Button variant="ghost" className="text-orange-300 font-semibold" onClick={toastUnavailable}>
            下一步
          </Button>
        </div>
        <div className="flex h-10 items-center justify-between px-4 text-sm text-gray-500">
          <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 cursor-pointer hover:bg-gray-200">
            <span>第一卷：初见</span>
            <ChevronLeft className="h-4 w-4 rotate-180 transform" />
          </div>
          <SaveStatus status={saveStatus} wordCount={wordCount} />
        </div>
      </header>

      <main id="main-content-area" className="flex-1 overflow-y-auto p-4">
        <div className="mb-2">
          <h1
            ref={titleRef}
            className="font-medium outline-none page-main-title"
            data-placeholder="第1章 踏花归去马蹄香" // Added data-placeholder
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => {
              const currentText = e.currentTarget.textContent || "";
              setSaveStatus("saving");
              updatePlaceholderVisibility(e.currentTarget as HTMLElement, currentText);
              debouncedTitleUpdate(currentText);
            }}
            onBlur={(e) => {
              const currentText = e.currentTarget.textContent || "";
              updatePlaceholderVisibility(e.currentTarget as HTMLElement, currentText);
              saveTitle(currentText); // Ensure save on blur
            }}
          >
            {/* Content is primarily managed by textContent and contentEditable. */}
            {/* displayTitle state is used for React's rendering cycle and consistency. */}
            {/* Initial content is set by useEffect. */}
          </h1>
        </div>

        <div className="min-h-[60vh]">
          <TailwindAdvancedEditor
            ref={editorRef}
            onSaveStatusChange={(status) => {
              setSaveStatus(status === "Saved" ? "saved" : "saving");
            }}
            onWordCountChange={setWordCount}
          />
        </div>
      </main>

      <footer className="flex h-auto items-center justify-center p-4 sticky bottom-0 z-10 border-t">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editorRef.current?.getEditor()?.commands.undo()}
            className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          >
            <Undo className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editorRef.current?.getEditor()?.commands.redo()}
            className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          >
            <Redo className="h-5 w-5" />
          </Button>

          <Button
            className="flex items-center rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 px-5 py-2.5 text-white shadow-md hover:shadow-lg transition-shadow"
            onClick={() => setIsAiToolboxOpen(true)}
          >
            <Sparkles className="h-4 w-2.5" /> AI工具箱
          </Button>

          {/* Helper function to handle copying content to clipboard */}
          {(() => {
            const handleCopyContent = () => {
              const title = titleRef.current?.textContent || "";
              let content = editorRef.current?.getEditor()?.getText() || "";

              // Replace multiple newlines with a single newline
              content = content.replace(/\n+/g, "\n");

              // Construct the text to copy
              // If title exists, add a newline between title and content.
              // If content is empty or starts with a newline, this handles it gracefully.
              const textToCopy = title ? `${title.trim()}\n${content.trim()}` : content.trim();

              copyToClipboard(textToCopy);
            };

            return (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyContent}
                className="ml-2 h-8 w-16 flex items-center border-slate-300 hover:bg-slate-100 text-slate-600"
              >
                <Copy className="h-4 w-2.5" /> 复制
              </Button>
            );
          })()}

          {/* Clear Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearContent}
            className="ml-2 h-8 w-16 flex items-center border-slate-300 hover:bg-red-100 text-red-600 hover:border-red-400" // Adjusted style for clear action
          >
            <Trash2 className="h-4 w-2.5" /> 清空
          </Button>
        </div>
      </footer>

      {isAiToolboxOpen && (
        <AiToolboxDialogContent
          editor={editorRef.current?.getEditor() || null}
          onClose={() => setIsAiToolboxOpen(false)}
        />
      )}
      {isSettingsOpen && <SettingsDialogContent onClose={() => setIsSettingsOpen(false)} />}
      {isTypoCheckOpen && <TypoCheckDialogContent onClose={() => setIsTypoCheckOpen(false)} />}
      {isOutlineOpen && <OutlineDialogContent onClose={() => setIsOutlineOpen(false)} />}
    </div>
  );
}
