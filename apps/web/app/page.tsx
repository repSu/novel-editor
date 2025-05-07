"use client";
import { ChevronLeft, Cloud, List, Settings, SpellCheck } from "lucide-react";
import type { EditorInstance } from "novel";
import { useEffect, useRef, useState } from "react";
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
  const [displayTitle, setDisplayTitle] = useState("第1章 请输入标题");

  const editorRef = useRef<{ getEditor: () => EditorInstance | null }>(null);

  const saveTitle = (newTitle: string) => {
    window.localStorage.setItem("novel-title", newTitle);
    setSaveStatus("saved");
  };

  const debouncedTitleUpdate = useDebouncedCallback(saveTitle, 500);

  useEffect(() => {
    const savedTitle = window.localStorage.getItem("novel-title");
    if (savedTitle) {
      if (titleRef.current) {
        titleRef.current.textContent = savedTitle;
      }
      setDisplayTitle(savedTitle);
    }

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

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-10">
        <div className="flex h-14 items-center justify-between px-4">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsTypoCheckOpen(true)}>
              <SpellCheck className="h-5 w-5 text-gray-600" />
            </Button>

            <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
              <Settings className="h-5 w-5 text-gray-600" />
            </Button>

            <Button variant="ghost" size="icon" onClick={() => setIsOutlineOpen(true)}>
              <List className="h-5 w-5 text-gray-600" />
            </Button>

            <Button variant="ghost" size="icon">
              <Cloud className="h-5 w-5 text-gray-600" />
            </Button>
          </div>

          <Button variant="ghost" className="text-orange-300 font-semibold">
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

      <main className="flex-1 overflow-y-auto p-4">
        <div className="mb-2">
          <h1
            ref={titleRef}
            className="font-medium outline-none page-main-title"
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => {
              setSaveStatus("saving");
              debouncedTitleUpdate(e.currentTarget.textContent || "");
            }}
            onBlur={(e) => {
              saveTitle(e.currentTarget.textContent || "");
            }}
          >
            {displayTitle}
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

      <footer className="flex h-16 items-center justify-center p-4 sticky bottom-0 z-10 border-t">
        <Button
          className="rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 px-6 py-2 text-white shadow-md hover:shadow-lg transition-shadow"
          onClick={() => setIsAiToolboxOpen(true)}
        >
          <span className="mr-2">✨</span> AI工具箱
        </Button>
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
