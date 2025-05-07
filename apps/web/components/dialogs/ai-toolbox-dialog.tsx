"use client";
import useLocalStorage from "@/hooks/use-local-storage";
import { APP_THEME_COLORS } from "@/lib/theme-config";
import { copyToClipboard } from "@/lib/utils";
import type { Editor as TiptapEditor } from "@tiptap/core";
import {
  ArrowDownWideNarrow,
  ArrowUp,
  BookOpen,
  CheckCheck,
  Copy,
  Edit,
  Feather,
  Globe,
  PencilLine,
  PencilRuler,
  Smile,
  X,
} from "lucide-react";
import { addAIHighlight, getPrevText } from "novel";
import { useRef, useState } from "react";
import Markdown from "react-markdown";
import { toast } from "sonner";
import { Button } from "../tailwind/ui/button";
import { Command, CommandInput } from "../tailwind/ui/command";
import CrazySpinner from "../tailwind/ui/icons/crazy-spinner";
import Magic from "../tailwind/ui/icons/magic";
import { ScrollArea } from "../tailwind/ui/scroll-area";

const aiTools = [
  { name: "扩写", icon: PencilLine, option: "longer" },
  { name: "润色", icon: PencilRuler, option: "improve" },
  { name: "缩写", icon: ArrowDownWideNarrow, option: "shorter" }, // Add shorter
  { name: "纠错", icon: CheckCheck, option: "fix" }, // Add fix
  // { name: "自定义描写", icon: PenTool, option: "zap" }, // 'zap' will be handled by the input field
  { name: "续写", icon: Edit, option: "continue" }, // Map to 'continue'
  // Keep other tools for potential future implementation, but without 'option' for now
  { name: "AI起名", icon: Smile },
  { name: "卡文锦囊", icon: Feather },
  { name: "开书灵感", icon: BookOpen },
  { name: "AI助手", icon: Globe }, // This could potentially be the 'zap' command trigger? Or a general chat?
];

// Define props type
interface CompleteOptions {
  body: {
    option: string;
    command?: string;
  };
}

interface AiToolboxDialogContentProps {
  editor: TiptapEditor; // Use the correctly imported type
  onClose: () => void;
}

export function AiToolboxDialogContent({ editor, onClose }: AiToolboxDialogContentProps) {
  const [inputValue, setInputValue] = useState("");
  const [completion, setCompletion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [selectedBg] = useLocalStorage<string>("novel__background-color", "white");

  const complete = async (text: string, options?: CompleteOptions) => {
    setIsLoading(true);
    setCompletion("");
    // Don't clear input value here, let the user decide
    // setInputValue("");

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      addAIHighlight(editor); // Highlight the text being processed
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: text,
          ...options?.body,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      let buffer = "";
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        for (const line of lines) {
          try {
            const chunk = JSON.parse(line);
            const content = chunk.choices[0]?.delta?.content || "";
            setCompletion((prev) => prev + content);
          } catch (e) {
            console.error("Error parsing stream data:", e, line);
          }
        }
      }
    } catch (err) {
      // Use default catch or 'unknown' and check type
      if (err instanceof Error) {
        // Type assertion or check instanceof Error
        if (err.name !== "AbortError") {
          console.error("AI request failed:", err);
          toast.error(`AI请求失败: ${err.message}`);
          editor.chain().unsetHighlight().run(); // Remove highlight on error
        }
      } else {
        // Handle non-Error types or cases where err is not an Error instance
        console.error("AI request failed with unknown error type:", err);
        toast.error("AI请求发生未知错误");
        editor.chain().unsetHighlight().run(); // Remove highlight on error
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
      // Keep highlight until user interacts (replace/discard)
    }
  };

  const handleToolClick = (option: string) => {
    let text = "";
    try {
      const slice = editor.state.selection.content();
      text = editor.storage.markdown.serializer.serialize(slice.content);
    } catch {
      // 弹框提示错误，并在toast里面打印editor
      toast.error(`未选择文本，无法获取前文内容, editor: ${editor}, option: ${option}`);
      return;
    }

    // Handle 'continue' specifically to get previous text
    if (option === "continue") {
      const pos = editor.state.selection.from;
      // Make sure getPrevText exists and handles potential errors
      try {
        text = getPrevText(editor, pos);
      } catch (e) {
        console.error("Error getting previous text:", e);
        toast.error("无法获取前文内容");
        return;
      }
    }

    if (!text && option !== "continue") {
      toast.error("请先选中文本");
      return;
    }

    complete(text, { body: { option } });
  };

  const handleCustomSubmit = () => {
    const slice = editor.state.selection.content();
    const text = editor.storage.markdown.serializer.serialize(slice.content);

    if (!inputValue) {
      toast.error("请输入自定义指令");
      return;
    }

    // Use selected text if available, otherwise prompt might be empty if user only provides command
    const prompt = text || "";
    const command = inputValue;

    complete(prompt, {
      body: { option: "zap", command: command },
    });
  };

  const hasCompletion = completion.length > 0;

  return (
    // Wrap the content in Command to provide the necessary context for cmdk components
    <Command
      className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full h-auto px-4 pt-4 pb-0 rounded-t-lg shadow-xl z-50 border ${
        selectedBg === "dark" ? "border-gray-600" : "border-border"
      } ${APP_THEME_COLORS.find((tc) => tc.value === selectedBg)?.applyClass || "bg-white"}`}
    >
      {" "}
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="w-8" /> {/* Spacer */}
        <h2 className="text-sm font-semibold text-foreground text-center">AI工具箱</h2>
        <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-muted">
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
      {/* Completion Result Area */}
      {hasCompletion && !isLoading && (
        <div className="flex flex-col mb-12">
          {" "}
          {/* Removed temp border */} {/* Removed mb-4 and border/rounded/bg-muted/30 */}
          <ScrollArea className="p-2 px-4 max-h-[200px] border border-border rounded-md overflow-y-auto bg-white/90">
            {" "}
            {/* Added border and overflow-y-auto */} {/* Removed flex-grow */} {/* Moved max-h here */}{" "}
            {/* Removed max-h-[200px] and overflow-y-auto */}
            <div className="prose prose-sm dark:prose-invert max-w-full">
              <Markdown>{completion}</Markdown>
            </div>
          </ScrollArea>
          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 px-2 pt-2 pb-0">
            {" "}
            {/* Adjusted padding */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                editor.chain().unsetHighlight().run();
                setCompletion("");
              }}
              className="bg-transparent text-muted-foreground hover:bg-blue-500/10 hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              删除
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                editor.chain().insertContentAt(editor.state.selection.to, `\n${completion}`).unsetHighlight().run();
                setCompletion("");
                onClose(); // Close dialog after inserting
              }}
              className="bg-transparent text-muted-foreground hover:bg-blue-500/10 hover:text-foreground"
            >
              <ArrowDownWideNarrow className="h-4 w-4 mr-1" />
              插入
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                editor.chain().deleteSelection().insertContent(completion).unsetHighlight().run();
                setCompletion("");
                onClose(); // Close dialog after replacing
              }}
              className="bg-transparent text-muted-foreground hover:bg-blue-500/10 hover:text-foreground"
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              替换
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(completion)}
              className="bg-transparent text-muted-foreground hover:bg-blue-500/10 hover:text-foreground"
            >
              <Copy className="h-4 w-4 mr-1" />
              复制
            </Button>
          </div>
        </div>
      )}
      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex h-12 w-full items-center justify-center px-4 text-sm font-medium text-muted-foreground mb-12 text-purple-500">
          {" "}
          {/* Removed temp border */} {/* Removed mb-4 */}
          <Magic className="mr-2 h-4 w-4 shrink-0" />
          思考中
          <div className="ml-2 mt-1">
            <CrazySpinner />
          </div>
        </div>
      )}
      {/* Tool Buttons Area (Hide when loading or showing completion) */}
      {!isLoading && !hasCompletion && (
        <div className="flex flex-wrap justify-center">
          {" "}
          {/* Removed temp border */} {/* Removed mb-4 */}
          {aiTools.map((tool) => (
            <button
              type="button"
              key={tool.name}
              onClick={() => tool.option && handleToolClick(tool.option)}
              disabled={!tool.option || isLoading}
              className="flex flex-col items-center mx-1.5 my-1 p-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              title={tool.name}
            >
              <tool.icon className="h-6 w-6 text-blue-500" />
              <span className="text-xs text-muted-foreground mt-1.5 text-center overflow-hidden text-ellipsis block whitespace-nowrap w-14">
                {tool.name}
              </span>
            </button>
          ))}
        </div>
      )}
      {/* Custom Input Area (Hide when loading or showing completion) */}
      {!isLoading && !hasCompletion && (
        <div className="relative mb-12">
          {" "}
          {/* Removed negative bottom margin */}
          {/* Replace CommandInput with a standard input */}
          <CommandInput
            value={inputValue}
            onValueChange={setInputValue} // Use onValueChange for CommandInput
            placeholder={hasCompletion ? "基于结果继续提问..." : "编辑或生成..."}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                handleCustomSubmit();
              }
            }}
            // CommandInput typically handles its own styling, but we can add some if needed
            // className="..."
          />
          <Button
            size="icon"
            className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-purple-500 hover:bg-purple-900"
            onClick={handleCustomSubmit}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Command>
  );
}
