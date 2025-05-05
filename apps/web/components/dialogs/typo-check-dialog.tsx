"use client";
// import { Label } from "@/components/tailwind/ui/label"; // Commented out - Component likely missing
// import { RadioGroup, RadioGroupItem } from "@/components/tailwind/ui/radio-group"; // Commented out - Component likely missing
import { DialogTitle } from "@radix-ui/react-dialog"; // Import DialogTitle

// Placeholder for the illustration component/element
const EmptyBoxIllustration = () => (
  <div className="my-8 text-center text-gray-400">
    {/* Basic SVG placeholder */}
    <svg
      className="mx-auto h-24 w-24"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby="emptyBoxTitle"
    >
      <title id="emptyBoxTitle">Empty Box Illustration</title> {/* Added title for accessibility */}
      <path d="M20 30 L80 30 L70 70 L30 70 Z" stroke="currentColor" strokeWidth="2" />
      <path d="M30 30 L40 15 L60 15 L70 30" stroke="currentColor" strokeWidth="2" />
      <path d="M45 45 Q 50 55 55 45" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M40 55 Q 50 65 60 55" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
    {/* Replace with actual illustration if available */}
  </div>
);

export function TypoCheckDialogContent() {
  return (
    <div className="flex flex-col p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        {/* Use DialogTitle instead of h2 */}
        <DialogTitle className="text-lg font-semibold text-gray-800">
          错别字・<span className="text-orange-500">0</span>
        </DialogTitle>
        {/* Radio button - Temporarily replaced with simple text due to missing components */}
        <div className="flex items-center space-x-2">
          {/* <input type="radio" id="typo-reader-only" name="typo-filter" value="reader" className="h-4 w-4 text-orange-500 border-gray-300 focus:ring-orange-500"/> */}
          {/* <Label htmlFor="typo-reader-only" className="text-sm font-medium text-gray-500">仅看读者纠错</Label> */}
          <span className="text-sm font-medium text-gray-500">仅看读者纠错 (Radio Placeholder)</span>
        </div>
        {/* Dialog already provides a close button, no need for an extra one here */}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <EmptyBoxIllustration />
        <p className="text-gray-500">暂无错别字</p>
      </div>
    </div>
  );
}
