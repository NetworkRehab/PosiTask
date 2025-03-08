import React, { useEffect, useState } from "react";
import { getTasks, completeTask, updateTaskNotes } from "../database";

type Task = {
  id: number;
  description: string;
  points: number;
  completed: boolean;
  completedAt: string | null;
  notes: string;
};

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  async function refresh() {
    const data = await getTasks();
    setTasks(data);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleComplete(id: number) {
    await completeTask(id);
    refresh();
  }

  async function handleNotes(id: number, notes: string) {
    await updateTaskNotes(id, notes);
    refresh();
  }

  return (
    <div className="space-y-2">
      {tasks.map((t) => (
        <div key={t.id} className="border p-2 flex flex-col">
          <div className="flex justify-between">
            <div>
              {t.description} ({t.points}pts)
            </div>
            <button
              onClick={() => handleComplete(t.id)}
              disabled={t.completed}
              className="bg-green-500 text-white px-2 rounded"
            >
              {t.completed ? "Done" : "Complete"}
            </button>
          </div>
          <textarea
            className="border mt-2 p-1"
            placeholder="Notes..."
            value={t.notes}
            onChange={(e) => handleNotes(t.id, e.target.value)}
          />
          {t.completed && <span className="text-sm">Completed at: {t.completedAt}</span>}
        </div>
      ))}
    </div>
  );
}
