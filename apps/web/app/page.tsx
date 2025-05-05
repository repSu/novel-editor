"use client";
import { AiToolboxDialogContent } from "@/components/dialogs/ai-toolbox-dialog"; // Import AI toolbox dialog
import { OutlineDialogContent } from "@/components/dialogs/outline-dialog"; // Import outline dialog
import { SettingsDialogContent } from "@/components/dialogs/settings-dialog"; // Import settings dialog
import { TypoCheckDialogContent } from "@/components/dialogs/typo-check-dialog"; // Import the new dialog content component
import TailwindAdvancedEditor from "@/components/tailwind/advanced-editor";
import { Button } from "@/components/tailwind/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/tailwind/ui/dialog"; // Import Dialog components
import LoadingCircle from "@/components/tailwind/ui/icons/loading-circle";
import { ChevronLeft, Cloud, List, Settings, SpellCheck } from "lucide-react"; // Import necessary icons
import { useEffect, useRef, useState } from "react"; // Import hooks
import { useDebouncedCallback } from "use-debounce";

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
  // Add state declarations
  const [isTypoCheckOpen, setIsTypoCheckOpen] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [displayTitle, setDisplayTitle] = useState("第1章 请输入标题");

  const saveTitle = (newTitle: string) => {
    window.localStorage.setItem("novel-title", newTitle);
    setSaveStatus("saved");
    // 不再直接更新displayTitle，避免重新渲染导致光标跳转
    // 内容通过ref保持最新
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

    // 延迟统计确保编辑器初始化完成
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
  const [isAiToolboxOpen, setIsAiToolboxOpen] = useState(false); // Add state for AI Toolbox

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10">
        {/* Top Header Row */}
        <div className="flex h-14 items-center justify-between px-4">
          {/* Left: Back Button */}
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-6 w-6" />
          </Button>

          {/* Center: Icon Buttons with Dialogs */}
          <div className="flex items-center gap-2">
            {/* Typo Check Dialog */}
            <Dialog open={isTypoCheckOpen} onOpenChange={setIsTypoCheckOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <SpellCheck className="h-5 w-5 text-gray-600" />
                </Button>
              </DialogTrigger>
              {/* Use the imported TypoCheckDialogContent component */}
              <DialogContent className="p-0 sm:max-w-[425px]">
                {/* Remove default padding, keep max-width */}
                <TypoCheckDialogContent />
              </DialogContent>
            </Dialog>

            {/* Settings Dialog */}
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5 text-gray-600" />
                </Button>
              </DialogTrigger>
              {/* Use the imported SettingsDialogContent component */}
              <DialogContent className="p-0 sm:max-w-[425px]">
                {" "}
                {/* Remove padding, keep max-width */}
                <SettingsDialogContent />
              </DialogContent>
            </Dialog>

            {/* Outline Dialog */}
            <Dialog open={isOutlineOpen} onOpenChange={setIsOutlineOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <List className="h-5 w-5 text-gray-600" />
                </Button>
              </DialogTrigger>
              {/* Use the imported OutlineDialogContent component */}
              <DialogContent className="p-0 sm:max-w-[425px]">
                {" "}
                {/* Remove padding, keep max-width */}
                <OutlineDialogContent />
              </DialogContent>
            </Dialog>

            {/* Cloud Button (no dialog for now) */}
            <Button variant="ghost" size="icon">
              <Cloud className="h-5 w-5 text-gray-600" />
            </Button>
          </div>

          {/* Right: Next Step Button */}
          <Button variant="ghost" className="text-orange-500 font-semibold">
            下一步
          </Button>
        </div>
        {/* Bottom Header Row */}
        <div className="flex h-10 items-center justify-between px-4 text-sm text-gray-500">
          <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 cursor-pointer hover:bg-gray-200">
            <span>第一卷：初见</span>
            <ChevronLeft className="h-4 w-4 rotate-180 transform" />
          </div>
          <SaveStatus status={saveStatus} wordCount={wordCount} />
        </div>
      </header>
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4">
        {" "}
        {/* Make content scrollable */}
        {/* Volume/Chapter Selector (Placeholder) */}
        {/* Editable Title */}
        <div className="mb-2">
          <h1
            ref={titleRef}
            className="text-2xl font-medium text-gray-800 outline-none"
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
        {/* Editor Component */}
        {/* We might need to adjust the container or props later */}
        <div className="min-h-[60vh]">
          <TailwindAdvancedEditor
            onSaveStatusChange={(status) => {
              setSaveStatus(status === "Saved" ? "saved" : "saving");
            }}
            onWordCountChange={setWordCount}
          />
        </div>
      </main>
      {/* Footer (Placeholder) */}
      <footer className="flex h-16 items-center justify-center border-t bg-white p-4 sticky bottom-0 z-10">
        {/* AI Toolbox Dialog */}
        <Dialog open={isAiToolboxOpen} onOpenChange={setIsAiToolboxOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 px-6 py-2 text-white shadow-md hover:shadow-lg transition-shadow">
              {/* Placeholder for AI icon */}
              <span className="mr-2">✨</span> AI工具箱
            </Button>
          </DialogTrigger>
          {/* Use the imported AiToolboxDialogContent component */}
          <DialogContent className="p-0 sm:max-w-[425px]">
            {" "}
            {/* Adjust size and padding as needed */}
            <AiToolboxDialogContent />
          </DialogContent>
        </Dialog>
      </footer>
    </div>
  );
}
