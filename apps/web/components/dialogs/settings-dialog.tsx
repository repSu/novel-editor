"use client";

import useLocalStorage from "@/hooks/use-local-storage";
import { APP_THEME_COLORS } from "@/lib/theme-config"; // Import shared config
import { ChevronRight, Moon, X } from "lucide-react";
import { useState } from "react";

// Define props type
interface SettingsDialogContentProps {
  onClose: () => void;
}

export function SettingsDialogContent({ onClose }: SettingsDialogContentProps) {
  // Settings state
  const [fontSizeScale, setFontSizeScale] = useLocalStorage<number>("novel__font-size-scale", 1);
  const [selectedBg, setSelectedBg] = useLocalStorage<string>("novel__background-color", "white");
  const [customTitleStyle, setCustomTitleStyle] = useState(true);
  const [screenAlwaysOn, setScreenAlwaysOn] = useState(false);
  return (
    <>
      {/* Overlay for the dialog */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        role="button"
        tabIndex={-1}
        aria-label="Close settings"
      />
      {/* Main dialog content */}
      <div
        className={`fixed bottom-0 left-0 right-0 w-full flex flex-col p-5 rounded-t-2xl shadow-2xl z-50
          ${APP_THEME_COLORS.find((tc) => tc.value === selectedBg)?.applyClass || "bg-white"}
          ${selectedBg === "dark" ? "text-gray-100" : "text-gray-800"}
        `}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex justify-center items-center mb-5 pt-1">
          <button
            type="button"
            onClick={onClose}
            className={`absolute left-0 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors
              ${selectedBg === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}
            `}
            aria-label="Close"
          >
            <X className={`h-[22px] w-[22px] ${selectedBg === "dark" ? "text-gray-400" : "text-gray-500"}`} />
          </button>
          <h2 className={`text-lg font-medium ${selectedBg === "dark" ? "text-gray-100" : "text-gray-900"}`}>设置</h2>
        </div>

        {/* Body */}
        <div className="space-y-3.5">
          {/* Combined Card for Font Size and Background Color */}
          <div className={`rounded-lg ${selectedBg === "dark" ? "bg-gray-700" : "bg-white shadow-sm"}`}>
            {/* Font Size Section */}
            <div className="p-4 flex items-center justify-between">
              <span
                className={`text-sm font-medium w-[15%] flex-shrink-0 ${selectedBg === "dark" ? "text-gray-200" : "text-gray-700"}`}
              >
                字号
              </span>
              <div className="flex items-center gap-x-3 flex-grow">
                <span className={`text-xs ${selectedBg === "dark" ? "text-gray-400" : "text-gray-500"}`}>A</span>
                <input
                  type="range"
                  min="0.8"
                  max="1.5"
                  step="0.05"
                  value={fontSizeScale}
                  onChange={(e) => setFontSizeScale(Number.parseFloat(e.target.value))}
                  className={`custom-slider-thumb flex-1 h-5 rounded-full appearance-none cursor-pointer
                    ${selectedBg === "dark" ? "bg-gray-600" : "bg-gray-200"}
                  `}
                  id="font-size-slider"
                />
                <span className={`text-lg ${selectedBg === "dark" ? "text-gray-400" : "text-gray-500"}`}>A</span>
              </div>
            </div>

            {/* Divider */}
            <hr className={`mx-4 ${selectedBg === "dark" ? "border-gray-600" : "border-gray-200"}`} />

            {/* Background Color Section */}
            <div className="p-4 flex items-center justify-between">
              <span
                className={`text-sm font-medium w-[15%] flex-shrink-0 ${selectedBg === "dark" ? "text-gray-200" : "text-gray-700"}`}
              >
                背景
              </span>
              <div className="flex items-center flex-grow overflow-x-auto flex-nowrap gap-x-5 justify-start py-1 px-1">
                {APP_THEME_COLORS.map((themeColor) => (
                  <button
                    type="button"
                    key={themeColor.value}
                    onClick={() => setSelectedBg(themeColor.value)}
                    className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all duration-150 flex-shrink-0
                      ${selectedBg === themeColor.value ? "border-orange-500" : themeColor.value === "white" && selectedBg !== "dark" ? "border-gray-300" : themeColor.value === "white" && selectedBg === "dark" ? "border-gray-500" : "border-transparent"}
                      ${themeColor.previewStyle}
                      ${selectedBg === "dark" && themeColor.value !== "dark" && themeColor.previewStyle === "bg-white border" ? "!border-gray-400" : ""}
                    `}
                    aria-label={`Set background to ${themeColor.name || themeColor.value}`}
                  >
                    {themeColor.value === "dark" && <Moon className="h-[18px] w-[18px] text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* History Card */}
          <button
            type="button"
            className={`flex w-full items-center justify-between p-4 rounded-lg transition-colors
              ${selectedBg === "dark" ? "bg-gray-700 hover:bg-gray-600/70" : "bg-white shadow-sm hover:bg-gray-50"}
            `}
          >
            <span className={`text-sm font-medium ${selectedBg === "dark" ? "text-gray-200" : "text-gray-700"}`}>
              历史记录
            </span>
            <ChevronRight className={`h-5 w-5 ${selectedBg === "dark" ? "text-gray-400" : "text-gray-400"}`} />
          </button>

          {/* Toggle Items Container */}
          <div className={`p-4 rounded-lg space-y-4 ${selectedBg === "dark" ? "bg-gray-700" : "bg-white shadow-sm"}`}>
            {/* Custom Title Style */}
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${selectedBg === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                自定义标题样式
              </span>
              <div
                onClick={() => setCustomTitleStyle(!customTitleStyle)}
                onKeyUp={(e) => {
                  if (e.key === "Enter" || e.key === " ") setCustomTitleStyle(!customTitleStyle);
                }}
                role="switch"
                aria-checked={customTitleStyle}
                tabIndex={0}
                className={`relative inline-flex items-center h-[22px] w-[42px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75
                  ${customTitleStyle ? "bg-orange-500" : selectedBg === "dark" ? "bg-gray-500" : "bg-gray-300"}
                `}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out
                    ${customTitleStyle ? "translate-x-[20px]" : "translate-x-0"}`}
                />
              </div>
            </div>

            {/* Screen Always On */}
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${selectedBg === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                屏幕常亮
              </span>
              <div
                onClick={() => setScreenAlwaysOn(!screenAlwaysOn)}
                onKeyUp={(e) => {
                  if (e.key === "Enter" || e.key === " ") setScreenAlwaysOn(!screenAlwaysOn);
                }}
                role="switch"
                aria-checked={screenAlwaysOn}
                tabIndex={0}
                className={`relative inline-flex items-center h-[22px] w-[42px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75
                  ${screenAlwaysOn ? "bg-orange-500" : selectedBg === "dark" ? "bg-gray-500" : "bg-gray-300"}
                `}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out
                    ${screenAlwaysOn ? "translate-x-[20px]" : "translate-x-0"}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
