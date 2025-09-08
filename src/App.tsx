import React, { useState } from "react";
import BetPieChart from "./components/BetPieChart";

type BetPayload = {
  question: string;
  yes: number;
  no: number;
};

export default function App() {
  const [question, setQuestion] = useState(
    "Will BTC close above $100k in 2025?",
  );
  const [yes, setYes] = useState(60);
  const [no, setNo] = useState(40);
  const total = Math.max(0, yes) + Math.max(0, no);

  // Example: fetch dynamic bet data (from public/bet.json)
  const loadFromMock = async () => {
    try {
      const res = await fetch("/bet.json");
      const data: BetPayload = await res.json();
      setQuestion(data.question);
      setYes(data.yes);
      setNo(data.no);
    } catch (e) {
      console.error(e);
      alert("Failed to load mock data");
    }
  };

  const clampNum = (n: number) =>
    Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Bet Information</h1>
          <p className="text-gray-500">
            Dynamic Yes/No pie chart with inputs and mock fetch.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Controls */}
          <div className="rounded-2xl bg-white p-4 shadow">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Question
              </label>
              <input
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter market question"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Yes
                </label>
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                  value={yes}
                  onChange={(e) => setYes(clampNum(parseFloat(e.target.value)))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  No
                </label>
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-red-500"
                  value={no}
                  onChange={(e) => setNo(clampNum(parseFloat(e.target.value)))}
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setYes(70);
                  setNo(30);
                }}
                className="rounded-2xl bg-green-600 px-3 py-2 text-white shadow hover:bg-green-700"
              >
                More Yes
              </button>
              <button
                onClick={() => {
                  setYes(40);
                  setNo(60);
                }}
                className="rounded-2xl bg-red-600 px-3 py-2 text-white shadow hover:bg-red-700"
              >
                More No
              </button>
              <button
                onClick={() => {
                  setYes(0);
                  setNo(0);
                }}
                className="rounded-2xl bg-gray-200 px-3 py-2 text-gray-900 hover:bg-gray-300"
              >
                Reset
              </button>
              <button
                onClick={loadFromMock}
                className="rounded-2xl bg-indigo-600 px-3 py-2 text-white shadow hover:bg-indigo-700"
              >
                Load from mock
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Total votes: {total}
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-2xl bg-white p-4 shadow">
            <div className="mb-2 text-sm text-gray-500">Market</div>
            <div className="mb-4 text-lg font-semibold">{question}</div>
            <BetPieChart yes={yes} no={no} />
          </div>
        </div>
      </div>
    </div>
  );
}
