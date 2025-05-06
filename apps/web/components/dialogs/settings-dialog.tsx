"use client";

import useLocalStorage from "@/hooks/use-local-storage";
import { ChevronRight, Moon, X } from "lucide-react";
import { useEffect, useState } from "react";

// Define props type
interface SettingsDialogContentProps {
  onClose: () => void;
}

// Placeholder for color options
const backgroundColors = [
  { value: "white", style: "bg-white border" },
  { value: "beige", style: "bg-yellow-50" },
  { value: "green", style: "bg-green-50" },
  { value: "blue", style: "bg-blue-50" },
  { value: "dark", style: "bg-gray-800" },
];

export function SettingsDialogContent({ onClose }: SettingsDialogContentProps) {
  // Settings state
  const [fontSizeScale, setFontSizeScale] = useLocalStorage<number>("novel__font-size-scale", 1);
  const [selectedBg, setSelectedBg] = useState("white");
  const [customTitleStyle, setCustomTitleStyle] = useState(true);
  const [screenAlwaysOn, setScreenAlwaysOn] = useState(false);

  useEffect(() => {
    // Ensure the code runs only in the client-side
    if (typeof window !== "undefined") {
      document.documentElement.style.setProperty("--font-size-scale-factor", fontSizeScale.toString());
    }
  }, [fontSizeScale]);

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full flex flex-col p-4 bg-gray-50 rounded-t-lg shadow-lg z-20 border-t border-gray-200">
      {/* Header with Close Button */}
      <div className="flex justify-between items-center mb-4">
        <div className="w-8" /> {/* Empty div to push title to center */}
        <h2 className="text-lg font-semibold text-gray-800 text-center">设置</h2>
        <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      {/* Body */}
      <div className="space-y-6">
        {/* Font Size */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-700">字号</span>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">A</span>
            <input
              type="range"
              min="0.8" // Min scale 80%
              max="1.5" // Max scale 150%
              step="0.05" // Step 5%
              value={fontSizeScale}
              onChange={(e) => setFontSizeScale(Number.parseFloat(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer dark:bg-gray-700 accent-orange-500"
              id="font-size-slider"
            />
            <span className="text-lg text-gray-500">A</span>
          </div>
        </div>

        {/* Background Color */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-700">背景</span>
          <div className="flex justify-between items-center space-x-2">
            {backgroundColors.map((color) => (
              <button
                type="button"
                key={color.value}
                onClick={() => setSelectedBg(color.value)}
                className={`h-8 w-8 rounded-full border-2 ${
                  selectedBg === color.value ? "border-orange-500" : "border-transparent"
                } ${color.style} flex items-center justify-center`}
                aria-label={`Set background to ${color.value}`}
              >
                {color.value === "dark" && <Moon className="h-4 w-4 text-white" />}
              </button>
            ))}
          </div>
        </div>

        {/* History */}
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-md bg-white p-3 text-left shadow-sm hover:bg-gray-50"
        >
          <span className="text-sm font-medium text-gray-700">历史记录</span>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </button>

        {/* Custom Title Style */}
        <div className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm">
          <span className="text-sm font-medium text-gray-700">自定义标题样式</span>
          <div
            onClick={() => setCustomTitleStyle(!customTitleStyle)}
            onKeyUp={(e) => {
              if (e.key === "Enter" || e.key === " ") setCustomTitleStyle(!customTitleStyle);
            }}
            role="switch"
            aria-checked={customTitleStyle}
            tabIndex={0}
            className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer ${customTitleStyle ? "bg-orange-500" : "bg-gray-300"}`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transform transition-transform ${customTitleStyle ? "translate-x-5" : "translate-x-0"}`}
            />
          </div>
        </div>

        {/* Screen Always On */}
        <div className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm">
          <span className="text-sm font-medium text-gray-700">屏幕常亮</span>
          <div
            onClick={() => setScreenAlwaysOn(!screenAlwaysOn)}
            onKeyUp={(e) => {
              if (e.key === "Enter" || e.key === " ") setScreenAlwaysOn(!screenAlwaysOn);
            }}
            role="switch"
            aria-checked={screenAlwaysOn}
            tabIndex={0}
            className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer ${screenAlwaysOn ? "bg-orange-500" : "bg-gray-300"}`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transform transition-transform ${screenAlwaysOn ? "translate-x-5" : "translate-x-0"}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
