"use client";

import { DialogTitle } from "@radix-ui/react-dialog"; // Import DialogTitle
// import { Label } from "@/components/tailwind/ui/label"; // Commented out - Component likely missing
// import { Slider } from "@/components/tailwind/ui/slider"; // Commented out - Component likely missing
// import { Switch } from "@/components/tailwind/ui/switch"; // Commented out - Component likely missing
import { ChevronRight, Moon } from "lucide-react";

// Placeholder for color options
const backgroundColors = [
  { value: "white", style: "bg-white border" },
  { value: "beige", style: "bg-yellow-50" },
  { value: "green", style: "bg-green-50" },
  { value: "blue", style: "bg-blue-50" },
  { value: "dark", style: "bg-gray-800" },
];

export function SettingsDialogContent() {
  // Placeholder state for settings - replace with actual logic
  const [fontSize, setFontSize] = useState(50); // Example: 0-100 range for slider
  const [selectedBg, setSelectedBg] = useState("white");
  const [customTitleStyle, setCustomTitleStyle] = useState(true);
  const [screenAlwaysOn, setScreenAlwaysOn] = useState(false);

  return (
    <div className="flex flex-col p-6 bg-gray-50 rounded-lg">
      {" "}
      {/* Added background and rounding */}
      {/* Header */}
      <div className="mb-6 text-center">
        {" "}
        {/* Centered header */}
        {/* Use DialogTitle instead of h2 */}
        <DialogTitle className="text-lg font-semibold text-gray-800">设置</DialogTitle>
        {/* Dialog provides close button */}
      </div>
      {/* Body */}
      <div className="space-y-6">
        {/* Font Size */}
        <div className="space-y-2">
          {/* <Label htmlFor="font-size-slider" className="text-sm font-medium text-gray-700"> */}
          <span className="text-sm font-medium text-gray-700">
            {" "}
            {/* Placeholder for Label */}
            字号
          </span>
          {/* </Label> */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">A</span>
            {/* Placeholder for Slider */}
            <div className="flex-1 h-2 bg-gray-200 rounded-full flex items-center">
              <div className="h-4 w-4 bg-white rounded-full border shadow" style={{ marginLeft: `${fontSize}%` }} />{" "}
              {/* Self-closing tag */}
            </div>
            <span className="text-lg text-gray-500">A</span>
          </div>
        </div>

        {/* Background Color */}
        <div className="space-y-2">
          {/* <Label className="text-sm font-medium text-gray-700">背景</Label> */}
          <span className="text-sm font-medium text-gray-700">背景</span> {/* Placeholder for Label */}
          <div className="flex justify-between items-center space-x-2">
            {backgroundColors.map((color) => (
              <button
                type="button" // Added type="button"
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
          {" "}
          {/* Added type="button" */}
          <span className="text-sm font-medium text-gray-700">历史记录</span>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </button>

        {/* Custom Title Style */}
        <div className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm">
          {/* <Label htmlFor="custom-title-switch" className="text-sm font-medium text-gray-700"> */}
          <span className="text-sm font-medium text-gray-700">
            {" "}
            {/* Placeholder for Label */}
            自定义标题样式
          </span>
          {/* </Label> */}
          {/* Placeholder for Switch */}
          <div
            onClick={() => setCustomTitleStyle(!customTitleStyle)}
            onKeyUp={(e) => {
              if (e.key === "Enter" || e.key === " ") setCustomTitleStyle(!customTitleStyle);
            }} // Added keyboard event
            role="switch" // Added role for accessibility
            aria-checked={customTitleStyle} // Added aria-checked for accessibility
            tabIndex={0} // Make it focusable
            className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer ${customTitleStyle ? "bg-orange-500" : "bg-gray-300"}`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transform transition-transform ${customTitleStyle ? "translate-x-5" : "translate-x-0"}`}
            />{" "}
            {/* Self-closing tag */}
          </div>
        </div>

        {/* Screen Always On */}
        <div className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm">
          {/* <Label htmlFor="screen-on-switch" className="text-sm font-medium text-gray-700"> */}
          <span className="text-sm font-medium text-gray-700">
            {" "}
            {/* Placeholder for Label */}
            屏幕常亮
          </span>
          {/* </Label> */}
          {/* Placeholder for Switch */}
          <div
            onClick={() => setScreenAlwaysOn(!screenAlwaysOn)}
            onKeyUp={(e) => {
              if (e.key === "Enter" || e.key === " ") setScreenAlwaysOn(!screenAlwaysOn);
            }} // Added keyboard event
            role="switch" // Added role for accessibility
            aria-checked={screenAlwaysOn} // Added aria-checked for accessibility
            tabIndex={0} // Make it focusable
            className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer ${screenAlwaysOn ? "bg-orange-500" : "bg-gray-300"}`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transform transition-transform ${screenAlwaysOn ? "translate-x-5" : "translate-x-0"}`}
            />{" "}
            {/* Self-closing tag */}
          </div>
        </div>
      </div>
    </div>
  );
}

// Need to import or define useState if not already globally available in the context
import { useState } from "react";
