"use client";

import dynamic from "next/dynamic";
import { useAccount, useBalance } from "@starknet-react/core";
import SideNav from "./SideNav";

const WalletBar = dynamic(() => import("./WalletBar"), { ssr: false });

interface WalletLayoutProps {
  children: React.ReactNode;
}

export default function WalletLayout({ children }: WalletLayoutProps) {
  const { address: userAddress, account: userAccount } = useAccount();

  const {
    isLoading,
    isError,
    error,
    data: balanceData,
  } = useBalance({
    token:
      "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    address: userAddress,
    watch: true,
  });

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <SideNav onSelect={() => {}} />

      {/* Main */}
      <div className="flex-1 relative flex flex-col items-center">
        {/* Wallet Bar */}
        <div className="absolute top-4 right-4 z-50">
          <WalletBar />
        </div>

        {/* Balance */}
        <div className="absolute top-[4.5rem] right-4 z-40">
          {isLoading && <p>Loading balance...</p>}
          {isError && <p>Error: {error?.message}</p>}
          {!isLoading && !isError && balanceData && (
            <div className="p-3 bg-white border border-black text-blue-600">
              <p>Token: {balanceData.symbol}</p>
              <p>
                Balance: {Number(balanceData.formatted).toFixed(8)}
              </p>
            </div>
          )}
        </div>

        {/* Page Content */}
        <div className="w-full h-full pt-20 px-6">
          {children}
        </div>
      </div>
    </div>
  );
}
