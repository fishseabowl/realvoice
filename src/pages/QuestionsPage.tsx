import { useNavigate } from "react-router-dom";
import BetPieChart from "../components/BetPieChart";

const questions = [
  {
    id: 1,
    question: "Who will be the next mayor of New York City?",
    options: [
      { name: "Zohran Mamdani", value: 45 },
      { name: "Scott M. Stringer", value: 30 },
      { name: "Andrew Cuomo", value: 25 },
    ],
  },
  {
    id: 2,
    question: "Will Bitcoin go up?",
    options: [
      { name: "Yes", value: 60 },
      { name: "No", value: 40 },
    ],
  },
];

export default function QuestionsPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {questions.map((q) => (
        <div
          key={q.id}
          className="bg-white rounded-2xl shadow p-4 cursor-pointer hover:shadow-lg transition"
          onClick={() => navigate(`/question/${q.id}`)}
        >
          <h2 className="text-lg font-semibold mb-2">{q.question}</h2>
          {/* pass q.options as `data` */}
          <BetPieChart data={q.options} />
        </div>
      ))}
    </div>
  );
}
