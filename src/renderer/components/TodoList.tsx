import { useState } from 'react'

interface Task {
  points: number
  status: 'pending' | 'in-progress' | 'completed'
  notes: string
  completionDate?: Date
}

export function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([])

  function addTask() {
    setTasks([
      ...tasks,
      {
        points: 1,
        status: 'pending',
        notes: '',
        completionDate: undefined,
      },
    ])
  }

  function handleTaskChange(index: number, field: keyof Task, value: string | number | Date | undefined) {
    setTasks((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  return (
    <div className="p-4 text-white">
      <button onClick={addTask} className="px-4 py-2 bg-teal-500 rounded">
        Add Task
      </button>
      <ul className="mt-4 list-disc list-inside">
        {tasks.map((task, idx) => (
          <li key={idx} className="mt-2 flex gap-2">
            <input
              type="number"
              value={task.points}
              onChange={(e) => handleTaskChange(idx, 'points', Number(e.target.value))}
              className="w-20 text-black px-2"
            />
            <select
              value={task.status}
              onChange={(e) => handleTaskChange(idx, 'status', e.target.value)}
              className="text-black"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In-Progress</option>
              <option value="completed">Completed</option>
            </select>
            <input
              type="text"
              placeholder="Notes"
              value={task.notes}
              onChange={(e) => handleTaskChange(idx, 'notes', e.target.value)}
              className="text-black px-2"
            />
            <input
              type="date"
              onChange={(e) => handleTaskChange(idx, 'completionDate', e.target.value ? new Date(e.target.value) : undefined)}
              className="text-black"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}