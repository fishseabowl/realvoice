import { useState } from "react";

interface BetInfoProps {
  options: { name: string; value: number }[];
  onBet: (optionName: string, amount: number) => void | Promise<void>;
  onAmountChange?: (betAmount: number) => void | Promise<void>;
  disabled?: boolean;
}

export default function BetInfo({
  options,
  onBet,
  onAmountChange,
  disabled = false,
}: BetInfoProps) {
  const [betAmounts, setBetAmounts] = useState<{ [key: string]: number }>({});

  const handleInputChange = (name: string, value: string) => {
    const parsed = parseInt(value, 10) || 0;

    setBetAmounts((prev) => ({
      ...prev,
      [name]: parsed,
    }));

    try {
      onAmountChange?.(parsed);
    } catch {
      // ignore
    }
  };

  const handleBet = (name: string) => {
    if (disabled) return;

    const amount = betAmounts[name] || 0;
    if (amount > 0) {
      onBet(name, amount);
      setBetAmounts((prev) => ({ ...prev, [name]: 0 }));
    } else {
      alert("Please enter a valid amount of STRK tokens.");
    }
  };

  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-xl shadow-inner">
      <h2 className="text-lg font-semibold mb-3">Place your bet</h2>

      {disabled && (
        <div className="mb-3 text-sm text-gray-500">
          Betting is currently unavailable.
        </div>
      )}

      <div className="space-y-3">
        {options.map((o) => (
          <div
            key={o.name}
            className="grid grid-cols-[1fr_96px_80px] items-center gap-4 bg-white p-3 rounded-lg shadow-sm"
          >
            {/* Option name */}
            <span className="font-medium truncate">{o.name}</span>

            {/* Bet input (fixed column) */}
            <input
              type="number"
              min="0"
              value={betAmounts[o.name] || ""}
              onChange={(e) => handleInputChange(o.name, e.target.value)}
              placeholder="STRK"
              disabled={disabled}
              className={`w-full px-2 py-1 border rounded text-sm text-right ${
                disabled ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />

            {/* Bet button (fixed column) */}
            <button
              onClick={() => handleBet(o.name)}
              disabled={disabled}
              className={`px-3 py-1 rounded text-sm transition whitespace-nowrap ${
                disabled
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Bet
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
