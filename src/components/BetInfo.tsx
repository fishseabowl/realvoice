import { useState } from "react";

interface BetInfoProps {
  options: { name: string; value: number }[];
  onBet: (optionName: string, amount: number) => void | Promise<void>;
  onAmountChange?: (betAmount: number) => void | Promise<void>;
}

export default function BetInfo({
  options,
  onBet,
  onAmountChange,
}: BetInfoProps) {
  const [betAmounts, setBetAmounts] = useState<{ [key: string]: number }>({});

  const handleInputChange = (name: string, value: string) => {
    const parsed = parseInt(value, 10) || 0;
    setBetAmounts((prev) => ({
      ...prev,
      [name]: parsed,
    }));

    if (onAmountChange) {
      try {
        onAmountChange(parsed);
      } catch (err) {
        // ignore async handler errors here; caller can handle logging
      }
    }
  };

  const handleBet = (name: string) => {
    const amount = betAmounts[name] || 0;
    if (amount > 0) {
      onBet(name, amount);
      setBetAmounts((prev) => ({ ...prev, [name]: 0 })); // reset input
    } else {
      alert("Please enter a valid amount of STRK tokens.");
    }
  };

  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-xl shadow-inner">
      <h2 className="text-lg font-semibold mb-3">Place your bet</h2>
      <div className="grid gap-4">
        {options.map((o) => (
          <div
            key={o.name}
            className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
          >
            <span className="font-medium">{o.name}</span>
            <input
              type="number"
              min="0"
              value={betAmounts[o.name] || ""}
              onChange={(e) => handleInputChange(o.name, e.target.value)}
              placeholder="STRK"
              className="w-24 px-2 py-1 border rounded mr-2 text-sm"
            />
            <button
              onClick={() => handleBet(o.name)}
              className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white text-sm transition"
            >
              Bet
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
