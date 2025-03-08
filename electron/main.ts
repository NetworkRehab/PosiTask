import { app, BrowserWindow, dialog, ipcMain } from "electron";
import * as path from "path";
import * as sqlcipher from "sqlcipher";

let mainWindow: BrowserWindow;
let db: any;
let userPassword = "";

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false
    }
  });
  mainWindow.loadURL("http://localhost:1234");
}

async function getPasswordFromUser() {
  const { response } = await dialog.showMessageBox({
    type: "info",
    buttons: ["OK"],
    title: "Enter Password",
    message: "Please enter the password in the next prompt."
  });
  if (response === 0) {
    const passPrompt = await dialog.showInputBox({});
    userPassword = passPrompt || "";
  }
}

app.whenReady().then(async () => {
  await getPasswordFromUser();
  const sqlite = sqlcipher.verbose();
  db = new sqlite.Database("encrypted.db");
  db.run(`PRAGMA key = '${userPassword}'`);
  db.run(
    "CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, description TEXT, points INTEGER, completed INTEGER, completedAt TEXT, notes TEXT)"
  );

  ipcMain.handle("tasks:add", async (_event, { description, points }) => {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO tasks (description, points, completed, completedAt, notes) VALUES (?, ?, 0, NULL, '')",
        [description, points],
        function (err: Error) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  });

  ipcMain.handle("tasks:get", async () => {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM tasks", [], (err: Error, rows: any[]) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  });

  ipcMain.handle("tasks:complete", async (_event, taskId: number) => {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      db.run(
        "UPDATE tasks SET completed=1, completedAt=? WHERE id=?",
        [now, taskId],
        function (err: Error) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  });

  ipcMain.handle("tasks:updateNotes", async (_event, { taskId, notes }) => {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE tasks SET notes=? WHERE id=?",
        [notes, taskId],
        function (err: Error) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  });

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
