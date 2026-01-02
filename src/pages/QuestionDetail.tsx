import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BetPieChart from "../components/BetPieChart";
import BetInfo from "../components/BetInfo";

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🧠 AI advice state
  const [advice, setAdvice] = useState<string | null>(null);
  const [riskLevel, setRiskLevel] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // Fetch question
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `http://localhost:3001/api/questions/${id}`
        );
        const data = await res.json();
        setQuestion(data);
      } catch (err) {
        console.error("Failed to load question:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  // 🧠 Fetch AI advice
  async function fetchAdvice(betAmount: number) {
    if (!question || betAmount <= 0) {
      setAdvice(null);
      return;
    }

    try {
      setLoadingAdvice(true);

      const res = await fetch(
        "http://localhost:3001/api/advice",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: question.text,
            betAmount,
          }),
        }
      );

      const data = await res.json();
      setAdvice(data.aiAdvice);
      setRiskLevel(data.riskLevel);
    } catch (err) {
      console.error("AI advice error:", err);
      setAdvice("AI advisor is temporarily unavailable.");
    } finally {
      setLoadingAdvice(false);
    }
  }

  // Handle bet
  async function handleBet(optionName: string, amount: number) {
    if (!question) return;

    const selectedOption = question.options.find(
      (opt: any) => opt.name === optionName
    );

    if (!selectedOption) {
      alert("Option not found.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/bets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question.id,
          optionId: selectedOption.id,
          amount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Bet failed");
        return;
      }

      const updatedOptions = question.options.map((opt: any) =>
        opt.id === data.option.id
          ? { ...opt, value: data.option.value }
          : opt
      );

      setQuestion({
        ...question,
        options: updatedOptions,
      });

      alert("Bet placed successfully!");
    } catch (err) {
      console.error("Bet error:", err);
      alert("Failed to place bet.");
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!question) {
    return <div className="p-6">Question not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <button
        onClick={() => navigate("/")}
        className="mb-4 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-4">
        {question.text}
      </h1>

      <BetPieChart data={question.options} />

      {/* 🧠 AI Advisor Panel */}
      <div className="mt-6 p-4 rounded-xl border bg-gray-50">
        <h3 className="font-semibold mb-2">
          🤖 AI Market Advisor
          {riskLevel && (
            <span
              className={`ml-2 text-xs px-2 py-1 rounded ${
                riskLevel === "low"
                  ? "bg-green-100 text-green-700"
                  : riskLevel === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {riskLevel.toUpperCase()} RISK
            </span>
          )}
        </h3>

        {loadingAdvice && (
          <p className="text-sm text-gray-500">
            Analyzing your bet...
          </p>
        )}

        {!loadingAdvice && advice && (
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {advice}
          </p>
        )}

        {!loadingAdvice && !advice && (
          <p className="text-sm text-gray-400">
            Enter a bet amount to receive AI advice.
          </p>
        )}

        <p className="text-xs text-gray-400 mt-2">
          AI advice is informational only.
        </p>
      </div>

      <BetInfo
        options={question.options}
        onBet={handleBet}
        onAmountChange={fetchAdvice}
      />
    </div>
  );
}
