interface BetInfoProps {
  options: { name: string; value: number }[];
}

export default function BetInfo({ options }: BetInfoProps) {
  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-xl shadow-inner">
      <h2 className="text-lg font-semibold mb-3">Place your bet</h2>
      <div className="grid gap-3">
        {options.map((o) => (
          <button
            key={o.name}
            className="px-4 py-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium transition"
          >
            Bet on {o.name}
          </button>
        ))}
      </div>
    </div>
  );
}
