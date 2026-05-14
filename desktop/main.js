const { app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain, dialog, Notification } = require("electron");
const path = require("path");
const fs = require("fs");

if (process.platform === "win32") {
  app.setAppUserModelId("com.spinyuk.desktop");
}

let mainWindow;
let tray;
let lastSpinResult = "Belum ada hasil spin.";

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    title: "SpinYuk Desktop",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, "src", "index.html"));

  mainWindow.on("close", (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  const contextMenu = Menu.buildFromTemplate([
    {
        label: "Buka SpinYuk",
        click: () => {
            mainWindow.show();
            mainWindow.focus();
        }
    },
    {
        label: "Spin Cepat",
        click: () => {
            mainWindow.show();
            mainWindow.focus();
            mainWindow.webContents.send("tray-quick-spin");
        }
    },
    {
        label: "Lihat Hasil Terakhir",
        click: () => {
            dialog.showMessageBox(mainWindow, {
                type: "info",
                title: "Hasil Spin Terakhir",
                message: "Hasil Spin Terakhir",
                detail: lastSpinResult
            });
        }
    },
    {
        label: "Export History",
        click: () => {
            mainWindow.show();
            mainWindow.focus();
            mainWindow.webContents.send("tray-export-history");
        }
    },
    { type: "separator" },
    {
        label: "Sembunyikan",
        click: () => {
            mainWindow.hide();
        }
    },
    {
        label: "Keluar",
        click: () => {
            app.isQuiting = true;
            app.quit();
        }
    }
  ]);

  const iconPath = path.join(__dirname, "icon.png");

  tray = new Tray(iconPath);
  tray.setToolTip("SpinYuk Desktop");
  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    mainWindow.show();
  });
}

app.whenReady().then(() => {
    Menu.setApplicationMenu(null);
  createWindow();

  try {
    createTray();
  } catch (error) {
    console.log("System tray belum aktif. Tambahkan file icon.png di folder desktop.");
  }

  globalShortcut.register("Control+Shift+S", () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

ipcMain.handle("import-file", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: "Import File Pilihan Spinner",
    properties: ["openFile"],
    filters: [
      { name: "Text Files", extensions: ["txt"] },
      { name: "JSON Files", extensions: ["json"] }
    ]
  });

  if (result.canceled) {
    return {
      success: false,
      message: "Import dibatalkan"
    };
  }

  const filePath = result.filePaths[0];
  const fileContent = fs.readFileSync(filePath, "utf-8");

  let items = [];

  if (filePath.endsWith(".json")) {
    items = JSON.parse(fileContent);
  } else {
    items = fileContent
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "");
  }

  return {
    success: true,
    filePath,
    items
  };
});

ipcMain.handle("export-history", async (event, history) => {
  if (!history || history.length === 0) {
    return {
      success: false,
      message: "Belum ada riwayat spin untuk diexport."
    };
  }

  const result = await dialog.showSaveDialog(mainWindow, {
    title: "Export Riwayat Spin",
    defaultPath: "riwayat-spinyuk.txt",
    filters: [
      { name: "Text Files", extensions: ["txt"] },
      { name: "JSON Files", extensions: ["json"] }
    ]
  });

  if (result.canceled) {
    return {
      success: false,
      message: "Export dibatalkan."
    };
  }

  const filePath = result.filePath;

  let content = "";

  if (filePath.endsWith(".json")) {
    content = JSON.stringify(history, null, 2);
  } else {
    content = "RIWAYAT SPIN - SPINYUK DESKTOP\n";
    content += "=================================\n\n";

    history.forEach((item, index) => {
      content += `${index + 1}. Hasil: ${item.result}\n`;
      content += `   Room : ${item.room || "Room Lokal"}\n`;
      content += `   User : ${item.user || "User"}\n`;
      content += `   Waktu: ${item.time}\n\n`;
    });
  }

  fs.writeFileSync(filePath, content, "utf-8");

  return {
    success: true,
    filePath
  };
});

ipcMain.handle("show-notification", async (event, payload) => {
  const title = payload?.title || "SpinYuk Desktop";
  const body = payload?.body || "Notifikasi SpinYuk";

  new Notification({
    title,
    body
  }).show();

  return true;
});

ipcMain.on("update-last-result", (event, result) => {
  lastSpinResult = result || "Belum ada hasil spin.";
});