import type { ReactNode } from "react";
import { useAccount, useBalance } from "@starknet-react/core";
import SideNav from "./SideNav";
import WalletBar from "./WalletBar";

interface WalletLayoutProps {
  children: ReactNode;
}

export default function WalletLayout({ children }: WalletLayoutProps) {
  const { address } = useAccount();

  const {
    isLoading,
    isError,
    error,
    data: balanceData,
  } = useBalance({
    token:
      "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d", // Sepolia ETH
    address,
    watch: true,
    enabled: Boolean(address),
  });

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <SideNav />

      {/* Main content */}
      <div className="flex-1 relative ml-32">
        {/* WalletBar */}
        <div className="absolute top-4 right-4 z-50">
          <WalletBar />
        </div>

        {/* Balance */}
        <div className="absolute top-[4.5rem] right-4 z-40">
          {isLoading && <p>Loading balance...</p>}

          {isError && (
            <p className="text-red-500">
              Error: {error?.message}
            </p>
          )}

          {!isLoading && !isError && balanceData && (
            <div className="p-3 bg-white border border-black rounded shadow text-blue-600">
              <p>Token: {balanceData.symbol}</p>
              <p>
                Balance:{" "}
                {Number(balanceData.formatted).toFixed(8)}
              </p>
            </div>
          )}

          {!address && (
            <p className="text-gray-500">
              Connect wallet to see balance
            </p>
          )}
        </div>

        {/* Page */}
        <main className="pt-20 px-6 h-full overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
