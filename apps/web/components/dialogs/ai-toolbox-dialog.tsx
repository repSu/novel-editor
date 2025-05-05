"use client";
// Removed: import { DialogTitle } from "@radix-ui/react-dialog";
import { X } from "lucide-react"; // Import X icon for close button

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

// Define props type
interface AiToolboxDialogContentProps {
  onClose: () => void;
}

export function AiToolboxDialogContent({ onClose }: AiToolboxDialogContentProps) {
  return (
    // Removed max-w-screen-md and mx-auto, added z-20, reduced padding, added border-t
    <div className="fixed bottom-0 left-0 right-0 w-full flex flex-col p-4 bg-gradient-to-b from-red-100 to-white rounded-t-lg shadow-lg z-20 border-t border-gray-200">
      {/* Header with Close Button - Reduced bottom margin */}
      <div className="flex justify-between items-center mb-4">
        {/* Empty div to push title to center */}
        <div className="w-8" />
        {/* Replaced DialogTitle with h2 */}
        <h2 className="text-sm font-semibold text-gray-800 text-center">AI工具箱</h2>
        <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      {/* Body - Flex layout for tight spacing */}
      <div className="flex flex-wrap justify-center mb-10">
        {aiTools.map((tool) => (
          // Adjusted spacing and icon/text size for tighter layout
          <div key={tool.name} className="flex flex-col items-center mx-1.5 my-1">
            <tool.icon className="h-7 w-7 text-blue-400 rounded-full" />
            <span className="text-xs text-gray-600 mt-1.5 text-center overflow-hidden text-ellipsis block whitespace-nowrap w-full px-0.5">
              {tool.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
