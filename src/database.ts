import { ipcRenderer } from "electron";

export async function addTask(description: string, points: number) {
  return ipcRenderer.invoke("tasks:add", { description, points });
}

export async function getTasks() {
  return ipcRenderer.invoke("tasks:get");
}

export async function completeTask(taskId: number) {
  return ipcRenderer.invoke("tasks:complete", taskId);
}

export async function updateTaskNotes(taskId: number, notes: string) {
  return ipcRenderer.invoke("tasks:updateNotes", { taskId, notes });
}
