"use client";
import type { ReactNode } from "react";

import { sepolia } from "@starknet-react/chains";
import { RpcProvider } from "starknet";
import {
  StarknetConfig,
  argent,
  braavos,
  useInjectedConnectors,
  voyager,
} from "@starknet-react/core";

export function StarknetProvider({ children }: { children: ReactNode }) {
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [argent(), braavos()],
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: "always",
    // Randomize the order of the connectors.
    order: "random",
  });

  const myProvider = new RpcProvider({
  nodeUrl: 'https://api.zan.top/public/starknet-sepolia/rpc/v0_10',
  });

  function providerFactory(chain: any) {
  // You can add logic here to return different providers based on the chain
  return myProvider;
 }

  return (
    <StarknetConfig
      chains={[sepolia]}
      provider={providerFactory}
      connectors={connectors}
      explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
}
