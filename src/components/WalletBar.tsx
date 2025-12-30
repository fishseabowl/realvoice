"use client";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { Button } from "./ui/Button";

function WalletConnected() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div>
      <span>Connected: {address}</span>
      <button
        className="bg-yellow-300 border border-black hover:bg-yellow-500 text-black font-regular py-2 px-4"
        onClick={() => disconnect()}
      >
        Disconnect
      </button>
    </div>
  );
}

function ConnectWallet() {
  const { connectors, connect } = useConnect();

  return (
    <div>
      <span>Choose a wallet: </span>
      {connectors.map((connector) => {
        return (
          <Button
            key={connector.id}
            onClick={() => connect({ connector })}
            className="gap-x-2 mr-2"
          >
            {connector.id}
          </Button>
        );
      })}
    </div>
  );
}

export default function WalletBar() {
  const { address } = useAccount();

  return address ? <WalletConnected /> : <ConnectWallet />;
}
