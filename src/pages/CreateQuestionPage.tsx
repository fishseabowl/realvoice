import { useState } from "react";

export default function CreateQuestionPage() {
  const [text, setText] = useState("");
  const [options, setOptions] = useState([""]);
  const [expiredAt, setExpiredAt] = useState("");

  function updateOption(index: number, value: string) {
    const copy = [...options];
    copy[index] = value;
    setOptions(copy);
  }

  function addOption() {
    setOptions([...options, ""]);
  }

  async function create() {
    const cleanOptions = options.filter((o) => o.trim().length > 0);

    const res = await fetch("http://localhost:3001/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        options: cleanOptions,
        expired_at: expiredAt || null,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Question created!");
    window.location.href = "/";
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Question</h1>

      <label className="font-semibold">Question Text</label>
      <input
        className="border p-2 w-full mb-4"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <label className="font-semibold">Expire Time (optional)</label>
      <input
        type="datetime-local"
        className="border p-2 w-full mb-4"
        value={expiredAt}
        onChange={(e) => setExpiredAt(e.target.value)}
      />

      <h3 className="font-semibold mb-2">Options</h3>

      {options.map((opt, i) => (
        <input
          key={i}
          className="border p-2 w-full mb-2"
          value={opt}
          onChange={(e) => updateOption(i, e.target.value)}
        />
      ))}

      <button
        className="bg-gray-500 text-white px-4 py-2 rounded mt-2"
        onClick={addOption}
      >
        + Add Option
      </button>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        onClick={create}
      >
        Create
      </button>
    </div>
  );
}
