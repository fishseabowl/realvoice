import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAccount } from "@starknet-react/core";
import WalletLayout from "../components/WalletLayout";
import BetPieChart from "../components/BetPieChart";
import BetInfo from "../components/BetInfo";

export default function QuestionDetail() {
  const { id } = useParams();
  const { address } = useAccount();
  const navigate = useNavigate();

  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [advice, setAdvice] = useState<string | null>(null);
  const [riskLevel, setRiskLevel] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  async function loadQuestion() {
    try {
      const res = await fetch(
        `http://localhost:3001/api/questions/${id}?userId=${address || ""}`
      );
      const data = await res.json();
      setQuestion(data);
    } catch (err) {
      console.error("Failed to load question:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, address]);

  async function fetchAdvice(betAmount: number) {
    if (!question || betAmount <= 0) {
      setAdvice(null);
      setRiskLevel(null);
      return;
    }

    try {
      setLoadingAdvice(true);
      const res = await fetch("http://localhost:3001/api/advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: question.question,
          betAmount,
        }),
      });

      const data = await res.json();
      setAdvice(data.aiAdvice);
      setRiskLevel(data.riskLevel);
    } catch {
      setAdvice("AI advisor unavailable.");
    } finally {
      setLoadingAdvice(false);
    }
  }

  async function handleBet(optionName: string, amount: number) {
    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }

    if (!question || question.status !== "open") {
      alert("Betting is closed.");
      return;
    }

    const option = question.options.find(
      (o: any) => o.name === optionName
    );
    if (!option) {
      alert("Option not found");
      return;
    }

    const res = await fetch("http://localhost:3001/api/bets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: question.id,
        optionId: option.id,
        userId: address,
        amount,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Bet failed");
      return;
    }

    // Reload full question to refresh:
    // - option totals
    // - user summary
    // - bet history
    loadQuestion();
  }

  if (loading) {
    return (
      <WalletLayout>
        <div>Loading...</div>
      </WalletLayout>
    );
  }

  if (!question) {
    return (
      <WalletLayout>
        <div>Question not found</div>
      </WalletLayout>
    );
  }

  return (
    <WalletLayout>
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold mb-4">
          {question.question}
        </h1>

        {question.status !== "open" && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            Betting is closed
          </div>
        )}

        <BetPieChart data={question.options} />

        {/* Bet Summary */}
        {address && question.userTotalBet > 0 && (
          <div className="mt-6 p-4 border rounded bg-gray-50">
            <h3 className="font-semibold mb-2">
              Your Bets (Summary)
            </h3>

            {question.options.map((o: any) => (
              <div key={o.id}>
                {o.name}: {question.userBetsByOption[o.id] || 0}
              </div>
            ))}

            <div className="mt-2 font-medium">
              Total Bet: {question.userTotalBet}
            </div>
          </div>
        )}

        {/* Bet History */}
        {address && question.userBetHistory?.length > 0 && (
          <div className="mt-6 p-4 border rounded bg-white">
            <h3 className="font-semibold mb-2">Bet History</h3>
            <ul className="text-sm space-y-1">
              {question.userBetHistory.map((b: any) => (
                <li key={b.id} className="flex justify-between">
                  <span>
                    {b.optionName} — {b.amount}
                  </span>
                  <span className="text-gray-500">
                    {new Date(b.time).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* AI Advisor */}
        <div className="mt-6 p-4 rounded border bg-gray-50">
          <h3 className="font-semibold mb-2">
            🤖 AI Market Advisor
          </h3>

          {loadingAdvice && <p>Analyzing...</p>}
          {!loadingAdvice && advice && <p>{advice}</p>}
          {!loadingAdvice && riskLevel && (
            <p className="mt-1 text-sm text-gray-600">
              Risk level: {riskLevel}
            </p>
          )}
        </div>

        <BetInfo
          options={question.options}
          onBet={handleBet}
          onAmountChange={fetchAdvice}
          disabled={question.status !== "open" || !address}
        />
      </div>
    </WalletLayout>
  );
}
