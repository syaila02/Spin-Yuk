const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

const itemInput = document.getElementById("itemInput");
const addBtn = document.getElementById("addBtn");
const importBtn = document.getElementById("importBtn");
const exportBtn = document.getElementById("exportBtn");
const clearBtn = document.getElementById("clearBtn");
const spinBtn = document.getElementById("spinBtn");
const resetBtn = document.getElementById("resetBtn");
const focusModeBtn = document.getElementById("focusModeBtn");
const removeWinnerToggle = document.getElementById("removeWinnerToggle");
const totalOptionsStat = document.getElementById("totalOptionsStat");
const totalSpinStat = document.getElementById("totalSpinStat");
const lastResultStat = document.getElementById("lastResultStat");
const removeWinnerStat = document.getElementById("removeWinnerStat");
const itemList = document.getElementById("itemList");
const resultText = document.getElementById("resultText");
const historyList = document.getElementById("historyList");
const roomName = document.getElementById("roomName");
const userName = document.getElementById("userName");
const toastCard = document.getElementById("toastCard");
const toastTitle = document.getElementById("toastTitle");
const toastMessage = document.getElementById("toastMessage");
const toastOkBtn = document.getElementById("toastOkBtn");
const dropZone = document.getElementById("dropZone");
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebarClose = document.getElementById("sidebarClose");
const appSidebar = document.getElementById("appSidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const sidebarLinks = document.querySelectorAll(".sidebar-link");
const quickSpinPage = document.querySelector(".main-layout");
const groupSpinPage = document.getElementById("groupSpinPage");

const groupNamesInput = document.getElementById("groupNamesInput");
const groupCountInput = document.getElementById("groupCountInput");
const memberPerGroupInput = document.getElementById("memberPerGroupInput");
const prepareGroupBtn = document.getElementById("prepareGroupBtn");
const groupSpinBtn = document.getElementById("groupSpinBtn");
const resetGroupBtn = document.getElementById("resetGroupBtn");
const groupResultText = document.getElementById("groupResultText");
const groupProgressText = document.getElementById("groupProgressText");
const groupResultContainer = document.getElementById("groupResultContainer");

const groupCanvas = document.getElementById("groupWheelCanvas");
const groupCtx = groupCanvas.getContext("2d");
const resetConfirmCard = document.getElementById("resetConfirmCard");
const resetYesBtn = document.getElementById("resetYesBtn");
const resetCancelBtn = document.getElementById("resetCancelBtn");
const groupImportBtn = document.getElementById("groupImportBtn");
const groupExportBtn = document.getElementById("groupExportBtn");
const groupDropZone = document.getElementById("groupDropZone");

const groupResetConfirmCard = document.getElementById("groupResetConfirmCard");
const groupResetYesBtn = document.getElementById("groupResetYesBtn");
const groupResetCancelBtn = document.getElementById("groupResetCancelBtn");

const colors = [
  "#7c3aed",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#2563eb",
  "#4f46e5"
];

let items = ["Makan Bakso", "Nonton Film", "Kerja Tugas", "Main Game"];
let history = [];
let currentRotation = 0;
let isSpinning = false;
let groupNames = [];
let groupResults = [];
let groupCount = 0;
let memberPerGroup = 0;
let groupRotation = 0;
let isGroupSpinning = false;

function showToast(title, message) {
  if (!toastCard || !toastTitle || !toastMessage) return;

  toastTitle.textContent = title;
  toastMessage.textContent = message;

  toastCard.classList.remove("closing");
  toastCard.classList.add("show");
}

function closeToast() {
  if (!toastCard) return;

  toastCard.classList.remove("show");
  toastCard.classList.remove("closing");
}

function normalizeItem(value) {
  if (typeof value === "object" && value !== null) {
    return String(value.name || value.item || value.label || "").trim();
  }

  return String(value || "").trim();
}

function isDuplicateItem(value) {
  return items.some(
    (item) => item.toLowerCase() === value.toLowerCase()
  );
}

function saveLocalData() {
  localStorage.setItem("spinyuk_items", JSON.stringify(items));
  localStorage.setItem("spinyuk_history", JSON.stringify(history));
  localStorage.setItem("spinyuk_room", roomName.value);
  localStorage.setItem("spinyuk_user", userName.value);

  if (removeWinnerToggle) {
    localStorage.setItem(
        "spinyuk_remove_winner",
        removeWinnerToggle.checked ? "true" : "false"
    );
  }
}

function loadLocalData() {
  const savedItems = localStorage.getItem("spinyuk_items");
  const savedHistory = localStorage.getItem("spinyuk_history");

  if (savedItems) {
    items = JSON.parse(savedItems);
  }

  if (savedHistory) {
    history = JSON.parse(savedHistory);
  }

  roomName.value = localStorage.getItem("spinyuk_room") || "";
  userName.value = localStorage.getItem("spinyuk_user") || "";

  if (removeWinnerToggle) {
    removeWinnerToggle.checked =
        localStorage.getItem("spinyuk_remove_winner") === "true";
  }
}

function validateBeforeSpin() {
  if (!roomName.value.trim()) {
    showToast("Room Belum Diisi", "Masukkan nama room terlebih dahulu");
    roomName.focus();
    return false;
  }

  if (!userName.value.trim()) {
    showToast("Nama Belum Diisi", "Masukkan nama pengguna terlebih dahulu");
    userName.focus();
    return false;
  }

  if (items.length < 2) {
    showToast("Pilihan Kurang", "Minimal masukkan 2 pilihan untuk memutar spinner");
    return false;
  }

  return true;
}

function parseImportedFile(fileName, text) {
  if (fileName.endsWith(".json")) {
    const parsed = JSON.parse(text);

    if (Array.isArray(parsed)) {
      return parsed;
    }

    if (Array.isArray(parsed.items)) {
      return parsed.items;
    }

    return [];
  }

  return text.split("\n");
}

function addImportedItems(importedItems) {
  let added = 0;

  importedItems.forEach((rawItem) => {
    const value = normalizeItem(rawItem);

    if (!value) return;
    if (isDuplicateItem(value)) return;

    items.push(value);
    added++;
  });

  saveLocalData();
  drawWheel();
  renderItems();
  updateQuickStats();

  if (added > 0) {
    showToast("Import File", "Berhasil menambahkan pilihan");
  } else {
    showToast("Import Gagal", "Tidak ada pilihan baru yang ditambahkan");
  }
}

function drawWheel() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 200;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (items.length === 0) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#1e293b";
    ctx.fill();

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Tambahkan pilihan dulu", centerX, centerY);
    return;
  }

  const anglePerItem = (Math.PI * 2) / items.length;

  items.forEach((item, index) => {
    const startAngle = index * anglePerItem;
    const endAngle = startAngle + anglePerItem;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = colors[index % colors.length];
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + anglePerItem / 2);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px Arial";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    const shortText = item.length > 18 ? item.slice(0, 18) + "..." : item;
    ctx.fillText(shortText, radius - 18, 0);

    ctx.restore();
  });

  ctx.beginPath();
  ctx.arc(centerX, centerY, 45, 0, Math.PI * 2);
  ctx.fillStyle = "#020617";
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = "#c084fc";
  ctx.font = "bold 17px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("SPIN", centerX, centerY);
}

function renderItems() {
  itemList.innerHTML = "";

  if (items.length === 0) {
    itemList.innerHTML = `<p class="empty-text">Belum ada pilihan.</p>`;
    return;
  }

  items.forEach((item, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = item;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Hapus";
    removeBtn.className = "remove-item";
    removeBtn.addEventListener("click", () => {
      items.splice(index, 1);
      saveLocalData();
      drawWheel();
      renderItems();
    });

    li.appendChild(span);
    li.appendChild(removeBtn);
    itemList.appendChild(li);
  });
}

function renderHistory() {
  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = `<p class="empty-text">Belum ada riwayat spin.</p>`;
    return;
  }

  history.forEach((data) => {
    const div = document.createElement("div");
    div.className = "history-item";

    const result = document.createElement("strong");
    result.textContent = data.result;

    const detail = document.createElement("small");
    detail.textContent = `${data.room || "Room Lokal"} • ${data.user || "User"} • ${data.time}`;

    div.appendChild(result);
    div.appendChild(detail);
    historyList.appendChild(div);
  });
}

function addItem() {
  const value = normalizeItem(itemInput.value);

  if (!value) {
    showToast("Input Belum Lengkap", "Masukkan pilihan terlebih dahulu");
    itemInput.focus();
    return;
  }

  if (isDuplicateItem(value)) {
    showToast("Pilihan Duplikat", "Pilihan tersebut sudah ada");
    itemInput.focus();
    return;
  }

  items.push(value);
  itemInput.value = "";

  saveLocalData();
  drawWheel();
  renderItems();
  updateQuickStats();
}

function spinWheel() {
  if (!validateBeforeSpin()) return;
  if (isSpinning) return;

  isSpinning = true;
  spinBtn.disabled = true;
  resultText.textContent = "Sedang memutar...";

  const winnerIndex = Math.floor(Math.random() * items.length);
  const anglePerItem = 360 / items.length;

  const targetAngle = 270 - (winnerIndex * anglePerItem + anglePerItem / 2);
  const extraRotation = 360 * 6;
  currentRotation += extraRotation + targetAngle - (currentRotation % 360);

  canvas.style.transform = `rotate(${currentRotation}deg)`;

  setTimeout(() => {
    const winner = items[winnerIndex];

    const now = new Date();
    const time = now.toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short"
    });

    resultText.textContent = winner;
    showToast("Hasil Spin", winner);

    history.unshift({
      result: winner,
      room: roomName.value.trim(),
      user: userName.value.trim(),
      time
    });

    window.electronAPI.updateLastResult(
      `Hasil: ${winner}\nRoom: ${roomName.value.trim() || "Room Lokal"}\nUser: ${userName.value.trim() || "User"}\nWaktu: ${time}`
    );

    if (removeWinnerToggle && removeWinnerToggle.checked) {
        items.splice(winnerIndex, 1);
        renderItems();
        drawWheel();
    }

    saveLocalData();
    renderHistory();
    updateQuickStats();

    isSpinning = false;
    spinBtn.disabled = false;
  }, 4200);
}

async function exportHistory() {
  const result = await window.electronAPI.exportHistory(history);

  if (!result.success) {
    showToast("Export Gagal", result.message);
    return;
  }

  showToast("Export Berhasil", "Riwayat spin berhasil disimpan");
}

function resetRoom() {
  closeToast();
  resetConfirmCard.classList.add("show");
}

function closeResetConfirm() {
  resetConfirmCard.classList.remove("show");
}

function performResetRoom() {
  closeResetConfirm();
  closeToast();

  items = [];
  history = [];
  currentRotation = 0;
  isSpinning = false;

  roomName.value = "";
  userName.value = "";
  itemInput.value = "";
  resultText.textContent = "Belum ada hasil";
  document.body.classList.remove("focus-mode");

  if (focusModeBtn) {
    focusModeBtn.textContent = "Focus Mode";
  }
  if (removeWinnerToggle) {
    removeWinnerToggle.addEventListener("change", () => {
        saveLocalData();
        updateQuickStats();
    });
  }

  roomName.disabled = false;
  userName.disabled = false;
  itemInput.disabled = false;
  addBtn.disabled = false;
  importBtn.disabled = false;
  exportBtn.disabled = false;
  clearBtn.disabled = false;
  spinBtn.disabled = false;
  resetBtn.disabled = false;

  canvas.style.transition = "none";
  canvas.style.transform = "rotate(0deg)";

  setTimeout(() => {
    canvas.style.transition = "transform 4s cubic-bezier(0.12, 0.82, 0.18, 1)";
  }, 50);

  localStorage.removeItem("spinyuk_items");
  localStorage.removeItem("spinyuk_history");
  localStorage.removeItem("spinyuk_room");
  localStorage.removeItem("spinyuk_user");
  localStorage.removeItem("spinyuk_remove_winner");

  drawWheel();
  renderItems();
  renderHistory();
  updateQuickStats();

  window.electronAPI.updateLastResult("Belum ada hasil spin.");

  setTimeout(() => {
    roomName.focus();
  }, 100);
}

function parseGroupNames(text) {
  return text
    .split(/\n|,/)
    .map((name) => name.trim())
    .filter((name) => name !== "");
}

function removeDuplicateNames(names) {
  const unique = [];

  names.forEach((name) => {
    const exists = unique.some(
      (item) => item.toLowerCase() === name.toLowerCase()
    );

    if (!exists) {
      unique.push(name);
    }
  });

  return unique;
}

function drawGroupWheel() {
  const centerX = groupCanvas.width / 2;
  const centerY = groupCanvas.height / 2;
  const radius = 200;

  groupCtx.clearRect(0, 0, groupCanvas.width, groupCanvas.height);

  if (groupNames.length === 0) {
    groupCtx.beginPath();
    groupCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    groupCtx.fillStyle = "#1e1b4b";
    groupCtx.fill();

    groupCtx.fillStyle = "#cbd5e1";
    groupCtx.font = "bold 18px Arial";
    groupCtx.textAlign = "center";
    groupCtx.fillText("Nama belum disiapkan", centerX, centerY);
    return;
  }

  const anglePerItem = (Math.PI * 2) / groupNames.length;

  groupNames.forEach((name, index) => {
    const startAngle = index * anglePerItem;
    const endAngle = startAngle + anglePerItem;

    groupCtx.beginPath();
    groupCtx.moveTo(centerX, centerY);
    groupCtx.arc(centerX, centerY, radius, startAngle, endAngle);
    groupCtx.closePath();
    groupCtx.fillStyle = colors[index % colors.length];
    groupCtx.fill();

    groupCtx.strokeStyle = "rgba(255, 255, 255, 0.65)";
    groupCtx.lineWidth = 3;
    groupCtx.stroke();

    groupCtx.save();
    groupCtx.translate(centerX, centerY);
    groupCtx.rotate(startAngle + anglePerItem / 2);

    groupCtx.fillStyle = "#ffffff";
    groupCtx.font = "bold 14px Arial";
    groupCtx.textAlign = "right";
    groupCtx.textBaseline = "middle";

    const shortName = name.length > 15 ? name.slice(0, 15) + "..." : name;
    groupCtx.fillText(shortName, radius - 18, 0);

    groupCtx.restore();
  });

  groupCtx.beginPath();
  groupCtx.arc(centerX, centerY, 45, 0, Math.PI * 2);
  groupCtx.fillStyle = "#020617";
  groupCtx.fill();
  groupCtx.strokeStyle = "#ffffff";
  groupCtx.lineWidth = 4;
  groupCtx.stroke();

  groupCtx.fillStyle = "#c084fc";
  groupCtx.font = "bold 17px Arial";
  groupCtx.textAlign = "center";
  groupCtx.textBaseline = "middle";
  groupCtx.fillText("GROUP", centerX, centerY);
}

function renderGroupResults() {
  groupResultContainer.innerHTML = "";

  if (groupResults.length === 0) {
    groupResultContainer.innerHTML = `<p class="empty-text">Kelompok belum dibuat.</p>`;
    return;
  }

  groupResults.forEach((group, index) => {
    const div = document.createElement("div");
    div.className = "group-box";

    const title = document.createElement("h3");
    title.textContent = `Kelompok ${index + 1}`;

    div.appendChild(title);

    if (group.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-member";
      empty.textContent = "Belum ada anggota.";
      div.appendChild(empty);
    } else {
      const ol = document.createElement("ol");

      group.forEach((name) => {
        const li = document.createElement("li");
        li.textContent = name;
        ol.appendChild(li);
      });

      div.appendChild(ol);
    }

    groupResultContainer.appendChild(div);
  });
}

function updateGroupProgress() {
  const totalFilled = groupResults.reduce((total, group) => total + group.length, 0);
  const totalSlots = groupCount * memberPerGroup;

  groupProgressText.textContent =
    `Progress: ${totalFilled}/${totalSlots} anggota terisi. Sisa nama: ${groupNames.length}.`;
}

function prepareGroupSpin() {
  const names = removeDuplicateNames(parseGroupNames(groupNamesInput.value));
  const count = Number(groupCountInput.value);
  const perGroup = Number(memberPerGroupInput.value);

  if (names.length === 0) {
    showToast("Data Kosong", "Masukkan daftar nama terlebih dahulu");
    return;
  }

  if (!count || count < 1) {
    showToast("Jumlah Kelompok Salah", "Masukkan jumlah kelompok minimal 1");
    return;
  }

  if (!perGroup || perGroup < 1) {
    showToast("Jumlah Anggota Salah", "Masukkan anggota per kelompok minimal 1");
    return;
  }

  const totalSlots = count * perGroup;

  if (names.length < totalSlots) {
    showToast("Nama Kurang", `Butuh ${totalSlots} nama untuk pembagian ini`);
    return;
  }

  if (names.length > totalSlots) {
    showToast("Nama Berlebih", `Hanya ${totalSlots} nama pertama yang akan digunakan`);
  }

  groupNames = names.slice(0, totalSlots);
  groupCount = count;
  memberPerGroup = perGroup;
  groupResults = Array.from({ length: groupCount }, () => []);
  groupRotation = 0;
  groupCanvas.style.transform = "rotate(0deg)";
  groupResultText.textContent = "Belum ada hasil";

  drawGroupWheel();
  renderGroupResults();
  updateGroupProgress();

  showToast("Group Spin Siap", "Mulai spin nama satu per satu");
}

function getCurrentTargetGroupIndex() {
  return groupResults.findIndex((group) => group.length < memberPerGroup);
}

function spinGroupName() {
  if (groupNames.length === 0) {
    showToast("Group Spin Selesai", "Semua nama sudah masuk kelompok");
    return;
  }

  if (groupResults.length === 0) {
    showToast("Belum Disiapkan", "Klik Siapkan Group Spin terlebih dahulu");
    return;
  }

  const targetGroupIndex = getCurrentTargetGroupIndex();

  if (targetGroupIndex === -1) {
    showToast("Kelompok Penuh", "Semua kelompok sudah terisi");
    return;
  }

  if (isGroupSpinning) return;

  isGroupSpinning = true;
  groupSpinBtn.disabled = true;
  groupResultText.textContent = "Sedang memutar...";

  const winnerIndex = Math.floor(Math.random() * groupNames.length);
  const anglePerItem = 360 / groupNames.length;

  const targetAngle = 270 - (winnerIndex * anglePerItem + anglePerItem / 2);
  const extraRotation = 360 * 6;
  groupRotation += extraRotation + targetAngle - (groupRotation % 360);

  groupCanvas.style.transform = `rotate(${groupRotation}deg)`;

  setTimeout(() => {
    const winner = groupNames[winnerIndex];

    groupNames.splice(winnerIndex, 1);
    groupResults[targetGroupIndex].push(winner);

    groupResultText.textContent = winner;

    showToast("Hasil Group Spin", `${winner} masuk Kelompok ${targetGroupIndex + 1}`);

    drawGroupWheel();
    renderGroupResults();
    updateGroupProgress();

    isGroupSpinning = false;
    groupSpinBtn.disabled = false;
  }, 4200);
}

function resetGroupSpin() {
  closeToast();

  if (!groupResetConfirmCard) {
    showToast("Reset Gagal", "Modal konfirmasi reset Group Spin belum ditemukan");
    return;
  }

  groupResetConfirmCard.classList.add("show");
}

function closeGroupResetConfirm() {
  if (!groupResetConfirmCard) return;

  groupResetConfirmCard.classList.remove("show");
}

function performResetGroupSpin() {
  closeGroupResetConfirm();

  groupNames = [];
  groupResults = [];
  groupCount = 0;
  memberPerGroup = 0;
  groupRotation = 0;
  isGroupSpinning = false;

  groupNamesInput.value = "";
  groupCountInput.value = 6;
  memberPerGroupInput.value = 5;
  groupResultText.textContent = "Belum ada hasil";
  groupProgressText.textContent = "Belum ada data kelompok.";

  groupSpinBtn.disabled = false;

  groupCanvas.style.transition = "none";
  groupCanvas.style.transform = "rotate(0deg)";

  setTimeout(() => {
    groupCanvas.style.transition = "transform 4s cubic-bezier(0.12, 0.82, 0.18, 1)";
  }, 50);

  drawGroupWheel();
  renderGroupResults();

  setTimeout(() => {
    groupNamesInput.focus();
  }, 100);
}

function appendGroupNames(importedNames) {
  const currentNames = removeDuplicateNames(parseGroupNames(groupNamesInput.value));

  const cleanImportedNames = importedNames
    .map((name) => normalizeItem(name))
    .filter((name) => name !== "");

  const combinedNames = removeDuplicateNames([...currentNames, ...cleanImportedNames]);

  groupNamesInput.value = combinedNames.join("\n");

  if (cleanImportedNames.length > 0) {
    showToast("Import Nama", "Berhasil menambahkan nama");
  } else {
    showToast("Import Gagal", "Tidak ada nama yang bisa ditambahkan");
  }
}

function parseGroupImportedFile(fileName, text) {
  if (fileName.endsWith(".json")) {
    const parsed = JSON.parse(text);

    if (Array.isArray(parsed)) {
      return parsed;
    }

    if (Array.isArray(parsed.items)) {
      return parsed.items;
    }

    if (Array.isArray(parsed.names)) {
      return parsed.names;
    }

    return [];
  }

  return text.split(/\n|,/);
}

async function exportGroupResults() {
  const isEmpty =
    groupResults.length === 0 ||
    groupResults.every((group) => group.length === 0);

  if (isEmpty) {
    showToast("Export Gagal", "Belum ada hasil kelompok untuk diexport");
    return;
  }

  const now = new Date().toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  });

  const exportData = groupResults.map((group, index) => {
    return {
      result: `Kelompok ${index + 1}: ${group.length > 0 ? group.join(", ") : "Belum ada anggota"}`,
      room: "Group Spin",
      user: "SpinYuk Desktop",
      time: now
    };
  });

  const result = await window.electronAPI.exportHistory(exportData);

  if (!result.success) {
    showToast("Export Gagal", result.message);
    return;
  }

  showToast("Export Berhasil", "Hasil kelompok berhasil disimpan");
}

function updateQuickStats() {
  if (totalOptionsStat) {
    totalOptionsStat.textContent = items.length;
  }

  if (totalSpinStat) {
    totalSpinStat.textContent = history.length;
  }

  if (lastResultStat) {
    lastResultStat.textContent = history.length > 0 ? history[0].result : "-";
  }

  if (removeWinnerStat) {
    removeWinnerStat.textContent =
      removeWinnerToggle && removeWinnerToggle.checked ? "Aktif" : "Nonaktif";
  }
}

function toggleFocusMode() {
  document.body.classList.toggle("focus-mode");

  const isFocusMode = document.body.classList.contains("focus-mode");

  if (focusModeBtn) {
    focusModeBtn.textContent = isFocusMode ? "Keluar Focus Mode" : "Focus Mode";
  }

  closeToast();

  if (typeof closeSidebar === "function") {
    closeSidebar();
  }
}

addBtn.addEventListener("click", addItem);

itemInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addItem();
  }
});

spinBtn.addEventListener("click", spinWheel);

clearBtn.addEventListener("click", () => {
  const confirmClear = confirm("Yakin ingin menghapus semua pilihan?");

  if (!confirmClear) return;

  items = [];
  resultText.textContent = "Belum ada hasil";

  saveLocalData();
  drawWheel();
  renderItems();
});

importBtn.addEventListener("click", async () => {
  const result = await window.electronAPI.importFile();

  if (!result.success) {
    showToast("Import Gagal", result.message);
    return;
  }

  addImportedItems(result.items);
});

groupImportBtn.addEventListener("click", async () => {
  const result = await window.electronAPI.importFile();

  if (!result.success) {
    showToast("Import Gagal", result.message);
    return;
  }

  appendGroupNames(result.items);
});

groupExportBtn.addEventListener("click", exportGroupResults);

groupDropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  groupDropZone.classList.add("active");
});

groupDropZone.addEventListener("dragleave", () => {
  groupDropZone.classList.remove("active");
});

groupDropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  groupDropZone.classList.remove("active");

  const file = event.dataTransfer.files[0];

  if (!file) return;

  const isValidFile = file.name.endsWith(".txt") || file.name.endsWith(".json");

  if (!isValidFile) {
    showToast("Import Gagal", "File harus berformat .txt atau .json");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const importedNames = parseGroupImportedFile(file.name, reader.result);
      appendGroupNames(importedNames);
    } catch (error) {
      showToast("Import Gagal", "Format file tidak sesuai atau tidak bisa dibaca");
    }
  };

  reader.readAsText(file);
});

if (groupResetYesBtn) {
  groupResetYesBtn.addEventListener("click", performResetGroupSpin);
}

if (groupResetCancelBtn) {
  groupResetCancelBtn.addEventListener("click", closeGroupResetConfirm);
}

if (groupResetConfirmCard) {
  groupResetConfirmCard.addEventListener("click", (event) => {
    if (event.target === groupResetConfirmCard) {
      closeGroupResetConfirm();
    }
  });
}

exportBtn.addEventListener("click", exportHistory);
resetBtn.addEventListener("click", resetRoom);


roomName.addEventListener("input", saveLocalData);
userName.addEventListener("input", saveLocalData);

toastOkBtn.addEventListener("click", closeToast);
resetYesBtn.addEventListener("click", performResetRoom);
resetCancelBtn.addEventListener("click", closeResetConfirm);
prepareGroupBtn.addEventListener("click", prepareGroupSpin);
groupSpinBtn.addEventListener("click", spinGroupName);

if (resetGroupBtn) {
  resetGroupBtn.addEventListener("click", resetGroupSpin);
}

if (removeWinnerToggle) {
  removeWinnerToggle.addEventListener("change", saveLocalData);
}

if (focusModeBtn) {
  focusModeBtn.addEventListener("click", toggleFocusMode);
}

resetConfirmCard.addEventListener("click", (event) => {
  if (event.target === resetConfirmCard) {
    closeResetConfirm();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && toastCard.classList.contains("show")) {
    closeToast();
  }
});

window.electronAPI.onTrayQuickSpin(() => {
  spinWheel();
});

window.electronAPI.onTrayExportHistory(() => {
  exportHistory();
});

dropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropZone.classList.add("active");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("active");
});

dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropZone.classList.remove("active");

  const file = event.dataTransfer.files[0];

  if (!file) return;

  const isValidFile = file.name.endsWith(".txt") || file.name.endsWith(".json");

  if (!isValidFile) {
    showToast("Import Gagal", "File harus berformat .txt atau .json");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const importedItems = parseImportedFile(file.name, reader.result);
      addImportedItems(importedItems);
    } catch (error) {
      showToast("Import Gagal", "Format file tidak sesuai atau tidak bisa dibaca");
    }
  };

  reader.readAsText(file);
});

function openSidebar() {
  appSidebar.classList.add("open");
  sidebarOverlay.classList.add("show");
  sidebarToggle.classList.add("hide-toggle");
}

function closeSidebar() {
  appSidebar.classList.remove("open");
  sidebarOverlay.classList.remove("show");
  sidebarToggle.classList.remove("hide-toggle");
}

sidebarToggle.addEventListener("click", openSidebar);
sidebarClose.addEventListener("click", closeSidebar);
sidebarOverlay.addEventListener("click", closeSidebar);

function showQuickSpinPage() {
  quickSpinPage.style.display = "grid";
  groupSpinPage.classList.remove("show");
}

function showGroupSpinPage() {
  quickSpinPage.style.display = "none";
  groupSpinPage.classList.add("show");
  drawGroupWheel();
}

sidebarLinks.forEach((link) => {
  link.addEventListener("click", () => {
    sidebarLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");

    const menu = link.dataset.menu;

    if (menu === "quick-spin") {
      showQuickSpinPage();
      closeSidebar();
    }

    if (menu === "group-spin") {
      showGroupSpinPage();
      closeSidebar();
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSidebar();
  }
});

loadLocalData();
drawWheel();
renderItems();
renderHistory();
updateQuickStats();
drawGroupWheel();