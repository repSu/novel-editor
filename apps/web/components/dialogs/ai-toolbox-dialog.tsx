"use client";
import { DialogTitle } from "@radix-ui/react-dialog";

import {
  BookOpen, // 开书灵感
  Edit, // AI续写
  Feather, // 卡文锦囊
  Globe, // AI助手
  PenTool, // 自定义描写
  PencilLine, // AI扩写
  PencilRuler, // AI改写
  Smile, // AI起名
} from "lucide-react";

// Define the AI tools data
const aiTools = [
  { name: "AI扩写", icon: PencilLine },
  { name: "AI改写", icon: PencilRuler },
  { name: "自定义描写", icon: PenTool },
  { name: "AI续写", icon: Edit },
  { name: "AI起名", icon: Smile },
  { name: "卡文锦囊", icon: Feather },
  { name: "开书灵感", icon: BookOpen },
  { name: "AI助手", icon: Globe },
];

export function AiToolboxDialogContent() {
  return (
    <div className="flex flex-col p-6 bg-gray-50 rounded-lg">
      {" "}
      {/* Added background and rounding */}
      {/* Header */}
      <div className="mb-6 text-center">
        {" "}
        {/* Centered header */}
        {/* Use DialogTitle instead of h2 */}
        <DialogTitle className="text-lg font-semibold text-gray-800">AI工具箱</DialogTitle>
        {/* Dialog provides close button */}
      </div>
      {/* Body - Grid of AI Tools */}
      <div className="grid grid-cols-4 gap-4 text-center">
        {" "}
        {/* 4 columns grid */}
        {aiTools.map((tool) => (
          <div key={tool.name} className="flex flex-col items-center justify-center space-y-1 cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
              {/* Use the Lucide icon component */}
              <tool.icon className="h-6 w-6 text-orange-500" />
            </div>
            <span className="text-xs text-gray-600">{tool.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
