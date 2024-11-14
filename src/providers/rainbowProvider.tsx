"use client";
import React from "react";
import { useTheme } from "next-themes";
import {
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "@/constants/wagmiConfig";
import { useAtom } from "jotai";
import { userAtom } from "@/store/user";

const queryClient = new QueryClient();

const RainbowProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  const [user] = useAtom(userAtom);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default RainbowProvider;
