"use client";

import useLocalStorage from "@/hooks/use-local-storage";
import { APP_THEME_COLORS } from "@/lib/theme-config"; // Import the shared config
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider, useTheme } from "next-themes";
import { type Dispatch, type ReactNode, type SetStateAction, createContext, useEffect } from "react";
import { Toaster } from "sonner";

export const AppContext = createContext<{
  font: string;
  setFont: Dispatch<SetStateAction<string>>;
}>({
  font: "Default",
  setFont: () => {},
});

const ToasterProvider = () => {
  const { theme } = useTheme() as {
    theme: "light" | "dark" | "system";
  };
  return (
    <Toaster
      theme={theme}
      toastOptions={{
        className:
          "text-center justify-center rounded-lg bg-black/80 text-white dark:bg-white/90 dark:text-black w-auto py-2",
        descriptionClassName: "text-center",
        unstyled: false,
        duration: 1500, // Default toast duration: 3000ms (3 seconds)
      }}
    />
  );
};

export default function Providers({ children }: { children: ReactNode }) {
  const [font, setFont] = useLocalStorage<string>("novel__font", "Default");
  const [fontSizeScale] = useLocalStorage<number>("novel__font-size-scale", 1);
  const [selectedBg] = useLocalStorage<string>("novel__background-color", "white");

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.style.setProperty("--font-size-scale-factor", fontSizeScale.toString());

      const pageElement = document.querySelector(".flex.h-screen.flex-col");
      if (pageElement) {
        // Remove all possible theme classes first
        APP_THEME_COLORS.forEach((themeColor) => {
          pageElement.classList.remove(themeColor.applyClass);
        });
        pageElement.classList.remove("text-gray-100"); // Reset dark mode text color

        const currentTheme = APP_THEME_COLORS.find((tc) => tc.value === selectedBg);
        if (currentTheme) {
          pageElement.classList.add(currentTheme.applyClass);
          if (currentTheme.value === "dark") {
            pageElement.classList.add("text-gray-100");
          }
        }
      }
    }
  }, [fontSizeScale, selectedBg]);

  return (
    <ThemeProvider attribute="class" enableSystem disableTransitionOnChange defaultTheme="system">
      <AppContext.Provider
        value={{
          font,
          setFont,
        }}
      >
        <ToasterProvider />
        {children}
        <Analytics />
      </AppContext.Provider>
    </ThemeProvider>
  );
}
