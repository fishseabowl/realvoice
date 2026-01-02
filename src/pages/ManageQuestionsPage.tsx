import { useEffect, useState } from "react";

export default function ManageQuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/questions")
      .then((res) => res.json())
      .then(setQuestions);
  }, []);

  async function closeQuestion(id: number) {
    await fetch(`http://localhost:3001/api/admin/questions/${id}/close`, {
      method: "POST",
    });
    location.reload();
  }

  async function setWinner(questionId: number, optionId: number) {
    await fetch(
      `http://localhost:3001/api/admin/questions/${questionId}/winner`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId }),
      },
    );
    location.reload();
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Questions</h1>

      {questions.map((q) => (
        <div key={q.id} className="mb-6 p-6 rounded-2xl bg-white shadow">
          <h2 className="font-semibold text-lg mb-2">{q.text}</h2>
          <p className="text-sm text-gray-500 mb-2">Status: {q.status}</p>

          <div className="space-y-2">
            {q.options.map((opt: any) => (
              <div key={opt.id} className="flex justify-between">
                <span>
                  {opt.name} ({opt.value})
                </span>
                {q.status === "closed" && (
                  <button
                    className="text-sm text-green-600"
                    onClick={() => setWinner(q.id, opt.id)}
                  >
                    Set Winner
                  </button>
                )}
              </div>
            ))}
          </div>

          {q.status === "open" && (
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => closeQuestion(q.id)}
            >
              Close Question
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
