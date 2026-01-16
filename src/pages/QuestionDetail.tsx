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

  async function fetchAdvice(betAmount: number) {
    if (!question || betAmount <= 0) {
      setAdvice(null);
      setRiskLevel(null);
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
            topic: question.question,
            betAmount,
          }),
        }
      );

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
    if (!question) return;

    const option = question.options.find(
      (o: any) => o.name === optionName
    );
    if (!option) return alert("Option not found");

    const res = await fetch("http://localhost:3001/api/bets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: question.id,
        optionId: option.id,
        amount,
      }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error);

    setQuestion({
      ...question,
      options: question.options.map((o: any) =>
        o.id === data.option.id ? data.option : o
      ),
    });
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

        <BetPieChart data={question.options} />

        {/* AI Advisor */}
        <div className="mt-6 p-4 rounded border bg-gray-50">
          <h3 className="font-semibold mb-2">
            🤖 AI Market Advisor
          </h3>

          {loadingAdvice && <p>Analyzing...</p>}
          {!loadingAdvice && advice && <p>{advice}</p>}
        </div>

        <BetInfo
          options={question.options}
          onBet={handleBet}
          onAmountChange={fetchAdvice}
        />
      </div>
    </WalletLayout>
  );
}
