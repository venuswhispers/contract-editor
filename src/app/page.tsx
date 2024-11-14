"use client"
import React from "react";

import dynamic from "next/dynamic";
import { Spinner } from "@nextui-org/spinner";
// abis
import FACTORY from "@/constants/abis/factory.json";
import ICO from "@/constants/abis/ICO.json";
// addresses
import { FACTORY_ADDRESSES, DAI_ADDRESSES, CHAIN_DATA } from "@/constants/constants";
import { Contract, providers } from "ethers";
// icons
import { Icon } from "@iconify/react/dist/iconify.js";
// hooks
import useActiveWeb3 from "@/hooks/useActiveWeb3";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import { IVulcan, METATYPE } from "@/types";
import { formatEther } from "viem";
import { Button } from "@nextui-org/react";

export default function Home() {
  //hooks
  const { address, isConnecting, isConnected } = useActiveWeb3();
  // modal hook
  const { openConnectModal } = useConnectModal();

  const [icos, setICOs] = React.useState<METATYPE[]>([]);
  const [metaData, setMetaData] = React.useState<IVulcan[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="text-white">fff</div>
    </div>
  );
}
