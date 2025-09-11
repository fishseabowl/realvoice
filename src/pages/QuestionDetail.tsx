import { useParams, useNavigate } from "react-router-dom";
import BetPieChart from "../components/BetPieChart";
import BetInfo from "../components/BetInfo";

const data: Record<
  string,
  { question: string; options: { name: string; value: number }[] }
> = {
  1: {
    question: "Who will be the next mayor of New York City?",
    options: [
      { name: "Zohran Mamdani", value: 45 },
      { name: "Scott M. Stringer", value: 30 },
      { name: "Andrew Cuomo", value: 25 },
    ],
  },
  2: {
    question: "Will Bitcoin go up?",
    options: [
      { name: "Yes", value: 60 },
      { name: "No", value: 40 },
    ],
  },
};

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const q = data[id as keyof typeof data];

  if (!q) return <div className="p-6">Question not found</div>;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate("/")}
        className="mb-4 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-4">{q.question}</h1>
      {/* static chart on detail page */}
      <BetPieChart data={q.options} />
      <BetInfo options={q.options} />
    </div>
  );
}
