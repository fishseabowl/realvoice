import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import WalletLayout from "../components/WalletLayout";
import BetPieChart from "../components/BetPieChart";

export default function QuestionsPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:3001/api/questions");
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error("Failed to load questions:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <WalletLayout>
        <div className="p-6">Loading...</div>
      </WalletLayout>
    );
  }

  return (
    <WalletLayout>
      <div className="p-6">
        {/* --- Questions Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {questions.map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-2xl shadow p-4 cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(`/question/${q.id}`)}
            >
              <h2 className="text-lg font-semibold mb-2">
                {q.text}
              </h2>

              <BetPieChart
                data={q.options.map((opt: any) => ({
                  name: opt.name,
                  value: opt.value,
                }))}
              />
            </div>
          ))}
        </div>
      </div>
    </WalletLayout>
  );
}
