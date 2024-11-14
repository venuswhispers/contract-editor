"use client";
import React from "react";
import dynamic from "next/dynamic";

const RainbowProvider = dynamic(() => import("@/providers/rainbowProvider"), { ssr: false });
const ThemeProvider = dynamic(() => import("@/providers/themeProvider"), { ssr: false });
const ToastProvider = dynamic(() => import("@/providers/notificationProvider"), { ssr: false });
const ActiveWeb3Provider = dynamic(() => import("@/providers/web3Provider"), { ssr: false });
import { NextUIProvider } from "@nextui-org/react";

const ThemeClient = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NextUIProvider>
        <ToastProvider>
            <RainbowProvider>
              <ActiveWeb3Provider>
                  {children}
              </ActiveWeb3Provider>
            </RainbowProvider>
        </ToastProvider>
      </NextUIProvider>
    </ThemeProvider>
  );
};

export default ThemeClient;
