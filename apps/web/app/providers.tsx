"use client";

import useLocalStorage from "@/hooks/use-local-storage";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider, useTheme } from "next-themes";
import { type Dispatch, type ReactNode, type SetStateAction, createContext } from "react";
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
      }}
    />
  );
};

export default function Providers({ children }: { children: ReactNode }) {
  const [font, setFont] = useLocalStorage<string>("novel__font", "Default");

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
