import React, { useState } from "react";
import { addTask } from "../database";

export default function TaskForm() {
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await addTask(description, points);
    setDescription("");
    setPoints(0);
  }

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        className="border p-1"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        className="border p-1 w-20"
        placeholder="Points"
        value={points}
        onChange={(e) => setPoints(Number(e.target.value))}
      />
      <button className="bg-blue-500 text-white px-3 py-1 rounded">Add</button>
    </form>
  );
}
