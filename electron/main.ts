import { app, BrowserWindow, dialog, ipcMain } from "electron";
import * as path from "path";
const sqlite3 = require("sqlite3").verbose(); // replaced sqlcipher

let mainWindow: BrowserWindow | null = null;
let db: any;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    }
  });

  // In development, use the React dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL("http://localhost:1234");
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built files
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  try {
    // Create (unencrypted) database file "database.db"
    db = new sqlite3.Database("database.db");

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
  } catch (error) {
    dialog.showErrorBox('Error', 'Failed to initialize the application');
    app.quit();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (db) db.close();
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
