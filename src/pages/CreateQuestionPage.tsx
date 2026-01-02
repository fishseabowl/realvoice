import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateQuestionPage() {
  const [text, setText] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const navigate = useNavigate();

  function updateOption(index: number, value: string) {
    const copy = [...options];
    copy[index] = value;
    setOptions(copy);
  }

  function addOption() {
    setOptions([...options, ""]);
  }

  async function submit() {
    if (!text || options.some((o) => !o)) {
      alert("Please fill all fields");
      return;
    }

    const res = await fetch("http://localhost:3001/api/admin/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, options }),
    });

    if (res.ok) {
      alert("Question created");
      navigate("/admin");
    } else {
      alert("Failed to create question");
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Question</h1>

      <input
        className="w-full border p-3 rounded mb-4"
        placeholder="Question text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="space-y-2">
        {options.map((opt, i) => (
          <input
            key={i}
            className="w-full border p-3 rounded"
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => updateOption(i, e.target.value)}
          />
        ))}
      </div>

      <button
        onClick={addOption}
        className="mt-4 px-4 py-2 rounded bg-gray-200"
      >
        + Add option
      </button>

      <button
        onClick={submit}
        className="ml-4 px-4 py-2 rounded bg-blue-600 text-white"
      >
        Create
      </button>
    </div>
  );
}
