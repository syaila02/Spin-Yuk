const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  importFile: () => ipcRenderer.invoke("import-file"),
  exportHistory: (history) => ipcRenderer.invoke("export-history", history),

  updateLastResult: (result) => ipcRenderer.send("update-last-result", result),

  onTrayQuickSpin: (callback) => {
    ipcRenderer.on("tray-quick-spin", callback);
  },

  onTrayExportHistory: (callback) => {
    ipcRenderer.on("tray-export-history", callback);
  }
});