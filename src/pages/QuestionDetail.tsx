import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BetPieChart from "../components/BetPieChart";
import BetInfo from "../components/BetInfo";

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch question by ID
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`http://localhost:3001/api/questions/${id}`);
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

  // Handle placing a bet
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

      // Update the frontend's option value with backend updated value
      const updatedOptions = question.options.map((opt: any) =>
        opt.id === data.option.id ? { ...opt, value: data.option.value } : opt
      );

      setQuestion({ ...question, options: updatedOptions });

      alert("Bet placed successfully!");

    } catch (err) {
      console.error("Bet error:", err);
      alert("Failed to place bet.");
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;
  if (!question) return <div className="p-6">Question not found</div>;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate("/")}
        className="mb-4 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-4">{question.question}</h1>

      <BetPieChart data={question.options} />

      <BetInfo
        options={question.options}
        onBet={handleBet}
      />
    </div>
  );
}
