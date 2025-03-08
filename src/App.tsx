import React from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

export default function App() {
  return (
    <div className="max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Encrypted ToDo</h1>
      <TaskForm />
      <TaskList />
    </div>
  );
}
