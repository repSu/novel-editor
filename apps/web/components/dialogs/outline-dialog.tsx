"use client";

import { DialogTitle } from "@radix-ui/react-dialog"; // Import DialogTitle

export function OutlineDialogContent() {
  return (
    <div className="flex flex-col p-6 bg-gray-50 rounded-lg">
      {" "}
      {/* Added background and rounding */}
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        {" "}
        {/* Header with Save button */}
        {/* Use DialogTitle instead of h2 */}
        <DialogTitle className="text-lg font-semibold text-gray-800">作品大纲</DialogTitle>
        {/* Placeholder Save button - replace with actual button component */}
        <button type="button" className="text-orange-500 font-semibold">
          保存
        </button>
      </div>
      {/* Body */}
      <div className="space-y-6 overflow-y-auto flex-1">
        {" "}
        {/* Make body scrollable */}
        {/* Worldview */}
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-gray-800">世界观</h3>
          <div className="space-y-3 rounded-md bg-white p-3 shadow-sm">
            <div className="text-sm text-gray-700">世界背景</div>
            <div className="text-sm text-gray-500">描述世界的基本历史、风土人情</div>
          </div>
          <div className="space-y-3 rounded-md bg-white p-3 shadow-sm">
            <div className="text-sm text-gray-700">金手指</div>
            <div className="text-sm text-gray-500">主角独有的能力或特质，能够起到推动剧情，解决矛盾危机的作用</div>
          </div>
          <div className="space-y-3 rounded-md bg-white p-3 shadow-sm">
            <div className="text-sm text-gray-700">背景事件</div>
            {/* Add content here */}
          </div>
        </div>
        {/* Characters */}
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-gray-800">角色</h3>
          <div className="space-y-3 rounded-md bg-white p-3 shadow-sm">
            <div className="text-sm text-gray-700">主角</div>
            <div className="text-sm text-gray-500 space-y-1">
              <div>姓名:</div>
              <div>性别:</div>
              <div>性格:</div>
              <div>外貌:</div>
              <div>人物简介:</div>
              <div>人物关系:</div>
            </div>
          </div>
          {/* Add other characters here */}
        </div>
        {/* Plot Outline */}
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-gray-800">剧情大纲</h3>
          <div className="space-y-3 rounded-md bg-white p-3 shadow-sm">
            <div className="text-sm text-gray-700">主线</div>
            <div className="text-sm text-gray-500">主角的主要目标，主线故事的起因、经过、结果。</div>
          </div>
          <div className="space-y-3 rounded-md bg-white p-3 shadow-sm">
            <div className="text-sm text-gray-700">支线</div>
            <div className="text-sm text-gray-500">
              主角的次要目标，支线故事的起因、经过、结果。支线通常是依附于主线目标，将主线目标拆分成若干
            </div>
          </div>
          {/* Add other plot points here */}
        </div>
      </div>
      {/* Floating button (Placeholder) */}
      <div className="absolute bottom-6 right-6">
        {/* Replace with actual button component */}
        <button
          type="button"
          className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg"
        >
          {/* Placeholder icon */}
          <span className="text-xl">☰</span>
        </button>
      </div>
    </div>
  );
}

// Need to import or define useState if not already globally available in the context
// import { useState } from 'react'; // Not needed for this component based on current structure
