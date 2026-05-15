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
const activeModeTitle = document.getElementById("activeModeTitle");
const activeModeDesc = document.getElementById("activeModeDesc");
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

const communitySpinPage = document.getElementById("communitySpinPage");

const communityUserInput = document.getElementById("communityUserInput");
const communityRoomInput = document.getElementById("communityRoomInput");
const communityCreateBtn = document.getElementById("communityCreateBtn");
const communityJoinBtn = document.getElementById("communityJoinBtn");
const communityLeaveBtn = document.getElementById("communityLeaveBtn");
const communityRoomCodeText = document.getElementById("communityRoomCodeText");
const communityUserText = document.getElementById("communityUserText");

const communityOptionInput = document.getElementById("communityOptionInput");
const communityAddOptionBtn = document.getElementById("communityAddOptionBtn");
const communityOptionList = document.getElementById("communityOptionList");
const communitySpinBtn = document.getElementById("communitySpinBtn");
const communityResultText = document.getElementById("communityResultText");

const communityParticipantList = document.getElementById("communityParticipantList");
const communityHistoryList = document.getElementById("communityHistoryList");
const communityWheelCanvas = document.getElementById("communityWheelCanvas");
const communityCtx = communityWheelCanvas.getContext("2d");
const communityPasswordInput = document.getElementById("communityPasswordInput");
const aboutPage = document.getElementById("aboutPage");

const settingsPage = document.getElementById("settingsPage");

const settingLanguage = document.getElementById("settingLanguage");
const settingDefaultUser = document.getElementById("settingDefaultUser");
const settingDefaultRoom = document.getElementById("settingDefaultRoom");
const settingRemoveWinner = document.getElementById("settingRemoveWinner");
const settingSoundEffect = document.getElementById("settingSoundEffect");
const settingBackgroundMusic = document.getElementById("settingBackgroundMusic");
const settingMusicVolume = document.getElementById("settingMusicVolume");
const volumeValueText = document.getElementById("volumeValueText");
const backgroundMusic = document.getElementById("backgroundMusic");
const settingErrorSound = document.getElementById("settingErrorSound");
const successSound = document.getElementById("successSound");
const errorSound = document.getElementById("errorSound");
const settingButtonSound = document.getElementById("settingButtonSound");
const profilePreviewImage = document.getElementById("profilePreviewImage");
const profileInitialText = document.getElementById("profileInitialText");
const profilePreviewName = document.getElementById("profilePreviewName");
const profilePreviewEmail = document.getElementById("profilePreviewEmail");
const profileLoginStatus = document.getElementById("profileLoginStatus");

const profilePhotoInput = document.getElementById("profilePhotoInput");
const chooseProfilePhotoBtn = document.getElementById("chooseProfilePhotoBtn");
const removeProfilePhotoBtn = document.getElementById("removeProfilePhotoBtn");

const profileNameInput = document.getElementById("profileNameInput");
const profileEmailInput = document.getElementById("profileEmailInput");
const saveProfileBtn = document.getElementById("saveProfileBtn");

const saveSettingsBtn = document.getElementById("saveSettingsBtn");
const resetAllLocalBtn = document.getElementById("resetAllLocalBtn");

const authPage = document.getElementById("authPage");

const loginTabBtn = document.getElementById("loginTabBtn");
const registerTabBtn = document.getElementById("registerTabBtn");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginIdentifierInput = document.getElementById("loginIdentifierInput");
const loginPasswordInput = document.getElementById("loginPasswordInput");
const loginBtn = document.getElementById("loginBtn");

const registerNameInput = document.getElementById("registerNameInput");
const registerEmailInput = document.getElementById("registerEmailInput");
const registerPasswordInput = document.getElementById("registerPasswordInput");
const registerBtn = document.getElementById("registerBtn");

const authStatusText = document.getElementById("authStatusText");
const authUserNameText = document.getElementById("authUserNameText");
const authUserEmailText = document.getElementById("authUserEmailText");
const logoutBtn = document.getElementById("logoutBtn");

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
let communityRoom = {
  code: "",
  user: "",
  participants: [],
  options: [],
  history: []
};
let communityRotation = 0;
let authUser = null;

function showToast(title, message) {
  if (!toastCard || !toastTitle || !toastMessage) return;

  toastTitle.textContent = title;
  toastMessage.textContent = message;
  const errorKeywords = [
  "Gagal",
  "Kosong",
  "Kurang",
  "Salah",
  "Duplikat",
  "Belum",
  "Dibatalkan"
];

const isErrorToast = errorKeywords.some((keyword) =>
  title.toLowerCase().includes(keyword.toLowerCase())
);

if (isErrorToast) {
  playErrorSound();
}

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
    fetch("http://localhost:5000/api/spinner/history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        result: winner,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("History saved to backend:", data))
      .catch((err) => console.error("Gagal simpan history:", err));
      
    const now = new Date();
    const time = now.toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short"
    });

    resultText.textContent = winner;
    showToast("Hasil Spin", winner);
    playSuccessSound();

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
    playSuccessSound();

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

function generateRoomCode() {
  const randomNumber = Math.floor(100 + Math.random() * 900);
  return `SPIN${randomNumber}`;
}

function isCommunityJoined() {
  return communityRoom.code && communityRoom.user;
}

function renderCommunityRoom() {
  if (!communityRoomCodeText || !communityUserText) return;

  communityRoomCodeText.textContent = communityRoom.code || "Belum masuk room";
  communityUserText.textContent = communityRoom.user
    ? `Masuk sebagai ${communityRoom.user}`
    : "Nama pengguna belum diatur.";

  communityOptionList.innerHTML = "";

  if (communityRoom.options.length === 0) {
    communityOptionList.innerHTML = `<p class="empty-text">Belum ada pilihan community.</p>`;
  } else {
    communityRoom.options.forEach((option, index) => {
      const li = document.createElement("li");

      const span = document.createElement("span");
      span.textContent = option;

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Hapus";
      removeBtn.className = "remove-item";
      removeBtn.addEventListener("click", () => {
        communityRoom.options.splice(index, 1);
        renderCommunityRoom();
        drawCommunityWheel();
      });

      li.appendChild(span);
      li.appendChild(removeBtn);
      communityOptionList.appendChild(li);
    });
  }

  communityParticipantList.innerHTML = "";

  if (communityRoom.participants.length === 0) {
    communityParticipantList.innerHTML = `<p class="empty-text">Belum ada peserta.</p>`;
  } else {
    communityRoom.participants.forEach((participant) => {
      const div = document.createElement("div");
      div.className = "community-list-item";
      div.textContent = participant;
      communityParticipantList.appendChild(div);
    });
  }

  communityHistoryList.innerHTML = "";

  if (communityRoom.history.length === 0) {
    communityHistoryList.innerHTML = `<p class="empty-text">Belum ada riwayat community.</p>`;
  } else {
    communityRoom.history.forEach((item) => {
      const div = document.createElement("div");
      div.className = "community-list-item";

      div.innerHTML = `
        <strong>${item.result}</strong>
        <span>${item.room} • ${item.user} • ${item.time}</span>
      `;

      communityHistoryList.appendChild(div);
    });
  }
}

function drawCommunityWheel() {
  if (!communityWheelCanvas) return;

  const centerX = communityWheelCanvas.width / 2;
  const centerY = communityWheelCanvas.height / 2;
  const radius = 180;

  communityCtx.clearRect(
    0,
    0,
    communityWheelCanvas.width,
    communityWheelCanvas.height
  );
  if (communityRoom.options.length === 0) {
    communityCtx.beginPath();
    communityCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    communityCtx.fillStyle = "#1e1b4b";
    communityCtx.fill();

    communityCtx.fillStyle = "#e9d5ff";
    communityCtx.font = "bold 16px Arial";
    communityCtx.textAlign = "center";
    communityCtx.fillText(
      "Tambahkan pilihan dulu",
      centerX,
      centerY
    );

    return;
  }

  const anglePerItem = (Math.PI * 2) / communityRoom.options.length;

  communityRoom.options.forEach((item, index) => {
    const startAngle = index * anglePerItem;
    const endAngle = startAngle + anglePerItem;

    communityCtx.beginPath();
    communityCtx.moveTo(centerX, centerY);
    communityCtx.arc(centerX, centerY, radius, startAngle, endAngle);
    communityCtx.closePath();
    communityCtx.fillStyle = colors[index % colors.length];
    communityCtx.fill();

    communityCtx.strokeStyle = "rgba(255,255,255,0.55)";
    communityCtx.lineWidth = 3;
    communityCtx.stroke();

    communityCtx.save();

    communityCtx.translate(centerX, centerY);
    communityCtx.rotate(startAngle + anglePerItem / 2);

    communityCtx.fillStyle = "white";
    communityCtx.font = "bold 14px Arial";
    communityCtx.textAlign = "right";
    communityCtx.textBaseline = "middle";

    const shortText =
      item.length > 16 ? item.slice(0, 16) + "..." : item;

    communityCtx.fillText(shortText, radius - 18, 0);

    communityCtx.restore();
  });

   communityCtx.beginPath();
  communityCtx.arc(centerX, centerY, 42, 0, Math.PI * 2);
  communityCtx.fillStyle = "#0f172a";
  communityCtx.fill();

  communityCtx.strokeStyle = "white";
  communityCtx.lineWidth = 4;
  communityCtx.stroke();

  communityCtx.fillStyle = "#c084fc";
  communityCtx.font = "bold 15px Arial";
  communityCtx.textAlign = "center";
  communityCtx.textBaseline = "middle";
  communityCtx.fillText("SPIN", centerX, centerY);
}

function createCommunityRoom() {
  if (!requireCommunityLogin()) return;
  const user = communityUserInput.value.trim();

  if (!user) {
    showToast("Nama Kosong", "Masukkan nama pengguna terlebih dahulu");
    communityUserInput.focus();
    return;
  }

  const roomCode = generateRoomCode();

  communityRoom = {
    code: roomCode,
    password: communityPasswordInput.value.trim(),
    user,
    participants: [user],
    options: [],
    history: []
  };

  communityRoomInput.value = roomCode;
  communityResultText.textContent = "Belum ada hasil";

  renderCommunityRoom();

  showToast("Room Dibuat", `Kode room: ${roomCode}`);
}

function joinCommunityRoom() {
  if (!requireCommunityLogin()) return;
  const user = communityUserInput.value.trim();
  const roomCode = communityRoomInput.value.trim().toUpperCase();
  const password = communityPasswordInput.value.trim();

  if (!user) {
    showToast("Nama Kosong", "Masukkan nama pengguna terlebih dahulu");
    communityUserInput.focus();
    return;
  }

  if (!roomCode) {
    showToast("Room Kosong", "Masukkan room code terlebih dahulu");
    communityRoomInput.focus();
    return;
  }
  if (!password) {
    showToast("Password Kosong", "Masukkan password room terlebih dahulu");
    return;
  }

  communityRoom = {
    code: roomCode,
    user,
    participants: [user, "Syaila", "Kibar"],
    options: [],
    history: []
  };

  communityResultText.textContent = "Belum ada hasil";

  renderCommunityRoom();

  showToast("Berhasil Join", `Masuk ke room ${roomCode}`);
}

function addCommunityOption() {
  if (!requireCommunityLogin()) return;

  if (!isCommunityJoined()) {
    showToast("Belum Masuk Room", "Create atau join room terlebih dahulu");
    return;
  }

  const option = communityOptionInput.value.trim();

  if (!option) {
    showToast("Input Kosong", "Masukkan pilihan community terlebih dahulu");
    communityOptionInput.focus();
    return;
  }

  const duplicate = communityRoom.options.some(
    (item) => item.toLowerCase() === option.toLowerCase()
  );

  if (duplicate) {
    showToast("Pilihan Duplikat", "Pilihan tersebut sudah ada");
    communityOptionInput.focus();
    return;
  }

  communityRoom.options.push(option);
  communityOptionInput.value = "";

  renderCommunityRoom();
  drawCommunityWheel();
}

function spinCommunityOption() {
  if (!requireCommunityLogin()) return;

  if (!isCommunityJoined()) {
    showToast("Belum Masuk Room", "Create atau join room terlebih dahulu");
    return;
  }

  if (communityRoom.options.length < 2) {
    showToast("Pilihan Kurang", "Minimal masukkan 2 pilihan community");
    return;
  }

  if (isGroupSpinning) return;

  isGroupSpinning = true;
  communitySpinBtn.disabled = true;
  communityResultText.textContent = "Sedang memutar...";

  const winnerIndex = Math.floor(Math.random() * communityRoom.options.length);
  const anglePerItem = 360 / communityRoom.options.length;

  const targetAngle = 270 - (winnerIndex * anglePerItem + anglePerItem / 2);
  const extraRotation = 360 * 6;

  communityRotation +=
    extraRotation +
    targetAngle -
    (communityRotation % 360);

  communityWheelCanvas.style.transform = `rotate(${communityRotation}deg)`;

  setTimeout(() => {
    const winner = communityRoom.options[winnerIndex];

    const time = new Date().toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short"
    });

    communityResultText.textContent = winner;

    communityRoom.history.unshift({
      result: winner,
      room: communityRoom.code,
      user: communityRoom.user,
      time
    });

    renderCommunityRoom();
    drawCommunityWheel();

    showToast("Hasil Community Spin", winner);
    playSuccessSound();

    communitySpinBtn.disabled = false;
    isGroupSpinning = false;
  }, 4200);
}

function leaveCommunityRoom() {
  if (!requireCommunityLogin()) return;
  communityRoom = {
    code: "",
    user: "",
    participants: [],
    options: [],
    history: []
  };

  communityUserInput.value = "";
  communityRoomInput.value = "";
  communityOptionInput.value = "";
  communityResultText.textContent = "Belum ada hasil";

  renderCommunityRoom();
  drawCommunityWheel();

  showToast("Keluar Room", "Community room berhasil dikosongkan");
}

function loadSettingsForm() {
  if (settingDefaultUser) {
    settingDefaultUser.value = localStorage.getItem("spinyuk_user") || "";
  }

  if (settingDefaultRoom) {
    settingDefaultRoom.value = localStorage.getItem("spinyuk_room") || "";
  }

  if (settingRemoveWinner) {
    settingRemoveWinner.checked =
      localStorage.getItem("spinyuk_remove_winner") === "true";
  }

  if (settingLanguage) {
    settingLanguage.value = localStorage.getItem("spinyuk_language") || "id";
  }

  if (settingSoundEffect) {
    settingSoundEffect.checked =
      localStorage.getItem("spinyuk_sound_effect") !== "false";
  }

  if (settingBackgroundMusic) {
    settingBackgroundMusic.checked =
      localStorage.getItem("spinyuk_background_music") === "true";
  }

  if (settingMusicVolume) {
    const savedVolume = localStorage.getItem("spinyuk_music_volume") || "35";
    settingMusicVolume.value = savedVolume;

    if (volumeValueText) {
      volumeValueText.textContent = `${savedVolume}%`;
    }

    if (backgroundMusic) {
      backgroundMusic.volume = Number(savedVolume) / 100;
    }
  }
  if (settingErrorSound) {
    settingErrorSound.checked =
      localStorage.getItem("spinyuk_error_sound") !== "false";
  }
  if (settingButtonSound) {
    settingButtonSound.checked =
      localStorage.getItem("spinyuk_button_sound") !== "false";
  }
}

function saveSettingsForm() {
  const defaultUser = settingDefaultUser.value.trim();
  const defaultRoom = settingDefaultRoom.value.trim();

  localStorage.setItem("spinyuk_user", defaultUser);
  localStorage.setItem("spinyuk_room", defaultRoom);

  if (settingLanguage) {
    localStorage.setItem("spinyuk_language", settingLanguage.value);
  }

  if (settingRemoveWinner) {
    localStorage.setItem(
      "spinyuk_remove_winner",
      settingRemoveWinner.checked ? "true" : "false"
    );
  }

  if (settingSoundEffect) {
    localStorage.setItem(
      "spinyuk_sound_effect",
      settingSoundEffect.checked ? "true" : "false"
    );
  }

  if (settingBackgroundMusic) {
    localStorage.setItem(
      "spinyuk_background_music",
      settingBackgroundMusic.checked ? "true" : "false"
    );
  }

  if (settingMusicVolume) {
    localStorage.setItem("spinyuk_music_volume", settingMusicVolume.value);
  }

  roomName.value = defaultRoom;
  userName.value = defaultUser;

  if (removeWinnerToggle && settingRemoveWinner) {
    removeWinnerToggle.checked = settingRemoveWinner.checked;
  }

  if (backgroundMusic && settingBackgroundMusic) {
    backgroundMusic.volume = Number(settingMusicVolume.value) / 100;

    if (settingBackgroundMusic.checked) {
      backgroundMusic.play().catch(() => {
        showToast("Musik Belum Aktif", "Klik tombol simpan sekali lagi untuk memulai musik");
      });
    } else {
      backgroundMusic.pause();
    }
  }
  if (settingErrorSound) {
    localStorage.setItem(
      "spinyuk_error_sound",
      settingErrorSound.checked ? "true" : "false"
    );
  }
  if (settingButtonSound) {
    localStorage.setItem(
      "spinyuk_button_sound",
      settingButtonSound.checked ? "true" : "false"
    );
  }

  saveLocalData();
  updateQuickStats();

  showToast("Pengaturan Disimpan", "Preferensi aplikasi berhasil diperbarui");
}

function applyBackgroundMusicSetting() {
  if (!backgroundMusic || !settingBackgroundMusic || !settingMusicVolume) return;

  backgroundMusic.volume = Number(settingMusicVolume.value) / 100;

  if (settingBackgroundMusic.checked) {
    backgroundMusic.play().catch(() => {
      showToast("Musik Belum Aktif", "Klik Simpan Pengaturan sekali lagi untuk memulai musik");
    });
  } else {
    backgroundMusic.pause();
  }
}

function resetAllLocalData() {
  closeToast();

  items = [];
  history = [];
  currentRotation = 0;
  isSpinning = false;

  roomName.value = "";
  userName.value = "";
  itemInput.value = "";
  resultText.textContent = "Belum ada hasil";

  if (removeWinnerToggle) {
    removeWinnerToggle.checked = false;
  }

  if (settingDefaultUser) {
    settingDefaultUser.value = "";
  }

  if (settingDefaultRoom) {
    settingDefaultRoom.value = "";
  }

  if (settingRemoveWinner) {
    settingRemoveWinner.checked = false;
  }

  if (settingLanguage) {
    settingLanguage.value = "id";
  }

  if (settingSoundEffect) {
    settingSoundEffect.checked = true;
  }

  if (settingErrorSound) {
    settingErrorSound.checked = true;
  }

  if (settingBackgroundMusic) {
    settingBackgroundMusic.checked = false;
  }

  if (settingMusicVolume) {
    settingMusicVolume.value = 35;
  }

  if (volumeValueText) {
    volumeValueText.textContent = "35%";
  }

  if (backgroundMusic) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    backgroundMusic.volume = 0.35;
  }

  if (settingButtonSound) {
    settingButtonSound.checked = true;
  }

  localStorage.removeItem("spinyuk_items");
  localStorage.removeItem("spinyuk_history");
  localStorage.removeItem("spinyuk_room");
  localStorage.removeItem("spinyuk_user");
  localStorage.removeItem("spinyuk_remove_winner");
  localStorage.removeItem("spinyuk_language");
  localStorage.removeItem("spinyuk_sound_effect");
  localStorage.removeItem("spinyuk_error_sound");
  localStorage.removeItem("spinyuk_background_music");
  localStorage.removeItem("spinyuk_music_volume");
  localStorage.removeItem("spinyuk_button_sound");
  localStorage.removeItem("spinyuk_profile_name");
  localStorage.removeItem("spinyuk_profile_email");
  localStorage.removeItem("spinyuk_profile_photo");

  groupNames = [];
  groupResults = [];
  groupCount = 0;
  memberPerGroup = 0;
  groupRotation = 0;
  isGroupSpinning = false;

  if (groupNamesInput) groupNamesInput.value = "";
  if (groupCountInput) groupCountInput.value = 6;
  if (memberPerGroupInput) memberPerGroupInput.value = 5;
  if (groupResultText) groupResultText.textContent = "Belum ada hasil";
  if (groupProgressText) groupProgressText.textContent = "Belum ada data kelompok.";

  communityRoom = {
    code: "",
    user: "",
    participants: [],
    options: [],
    history: []
  };

  if (communityUserInput) communityUserInput.value = "";
  if (communityRoomInput) communityRoomInput.value = "";
  if (communityPasswordInput) communityPasswordInput.value = "";
  if (communityOptionInput) communityOptionInput.value = "";
  if (communityResultText) communityResultText.textContent = "Belum ada hasil";

  canvas.style.transition = "none";
  canvas.style.transform = "rotate(0deg)";

  if (groupCanvas) {
    groupCanvas.style.transition = "none";
    groupCanvas.style.transform = "rotate(0deg)";
  }

  if (communityWheelCanvas) {
    communityWheelCanvas.style.transition = "none";
    communityWheelCanvas.style.transform = "rotate(0deg)";
  }

  setTimeout(() => {
    canvas.style.transition = "transform 4s cubic-bezier(0.12, 0.82, 0.18, 1)";

    if (groupCanvas) {
      groupCanvas.style.transition = "transform 4s cubic-bezier(0.12, 0.82, 0.18, 1)";
    }

    if (communityWheelCanvas) {
      communityWheelCanvas.style.transition = "transform 4s cubic-bezier(0.12, 0.82, 0.18, 1)";
    }
  }, 50);

  document.body.style.pointerEvents = "auto";
  document.body.classList.remove("focus-mode");

  drawWheel();
  renderItems();
  renderHistory();
  updateQuickStats();

  drawGroupWheel();
  renderGroupResults();

  renderCommunityRoom();

  if (typeof drawCommunityWheel === "function") {
    drawCommunityWheel();
  }

  window.electronAPI.updateLastResult("Belum ada hasil spin.");

  if (profilePhotoInput) {
    profilePhotoInput.value = "";
  }

  renderProfileSettings();

  showToast("Reset Berhasil", "Semua data lokal aplikasi berhasil dikosongkan");

  setTimeout(() => {
    if (settingDefaultUser) {
      settingDefaultUser.focus();
    }
  }, 120);
}

const API_BASE_URL = "http://localhost:3000";

function getSavedAuthUser() {
  const saved = localStorage.getItem("spinyuk_auth_user");
  return saved ? JSON.parse(saved) : null;
}

function saveAuthUser(user, token) {
  authUser = user;

  localStorage.setItem("spinyuk_auth_user", JSON.stringify(user));

  if (token) {
    localStorage.setItem("spinyuk_auth_token", token);
  }

  renderAuthStatus();
}

function clearAuthUser() {
  authUser = null;

  localStorage.removeItem("spinyuk_auth_user");
  localStorage.removeItem("spinyuk_auth_token");

  renderAuthStatus();
}

async function authRegister(payload) {
  /*
    NANTI KALAU BACKEND SUDAH SIAP, GANTI ISI FUNGSI INI MENJADI FETCH API:

    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    return await response.json();
  */

  const users = JSON.parse(localStorage.getItem("spinyuk_mock_users") || "[]");

  const emailExist = users.some(
    (user) => user.email.toLowerCase() === payload.email.toLowerCase()
  );

  if (emailExist) {
    return {
      success: false,
      message: "Email sudah terdaftar"
    };
  }

  const newUser = {
    id: Date.now(),
    name: payload.name,
    email: payload.email,
    password: payload.password
  };

  users.push(newUser);
  localStorage.setItem("spinyuk_mock_users", JSON.stringify(users));

  return {
    success: true,
    message: "Registrasi berhasil",
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    },
    token: "mock-token-" + Date.now()
  };
}

async function authLogin(payload) {
  /*
    NANTI KALAU BACKEND SUDAH SIAP, GANTI ISI FUNGSI INI MENJADI FETCH API:

    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    return await response.json();
  */

  const users = JSON.parse(localStorage.getItem("spinyuk_mock_users") || "[]");

  const foundUser = users.find((user) => {
    const identifierMatch =
      user.email.toLowerCase() === payload.identifier.toLowerCase() ||
      user.name.toLowerCase() === payload.identifier.toLowerCase();

    return identifierMatch && user.password === payload.password;
  });

  if (!foundUser) {
    return {
      success: false,
      message: "Email/username atau password salah"
    };
  }

  return {
    success: true,
    message: "Login berhasil",
    user: {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email
    },
    token: "mock-token-" + Date.now()
  };
}

function renderAuthStatus() {
  if (!authStatusText || !authUserNameText || !authUserEmailText) return;

  if (!authUser) {
    authStatusText.textContent = "Belum Login";
    authUserNameText.textContent = "Guest User";
    authUserEmailText.textContent = "Login untuk menggunakan fitur Community Spin.";
    return;
  }

  authStatusText.textContent = "Sudah Login";
  authUserNameText.textContent = authUser.name;
  authUserEmailText.textContent = authUser.email;

  if (communityUserInput) {
    communityUserInput.value = authUser.name;
  }
}

function switchAuthTab(mode) {
  if (mode === "login") {
    loginTabBtn.classList.add("active");
    registerTabBtn.classList.remove("active");

    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
  }

  if (mode === "register") {
    registerTabBtn.classList.add("active");
    loginTabBtn.classList.remove("active");

    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  }
}

async function handleRegister() {
  const name = registerNameInput.value.trim();
  const email = registerEmailInput.value.trim();
  const password = registerPasswordInput.value.trim();

  if (!name || !email || !password) {
    showToast("Register Gagal", "Nama, email, dan password wajib diisi");
    return;
  }

  if (password.length < 6) {
    showToast("Password Lemah", "Password minimal 6 karakter");
    return;
  }

  const result = await authRegister({
    name,
    email,
    password
  });

  if (!result.success) {
    showToast("Register Gagal", result.message);
    return;
  }

  saveAuthUser(result.user, result.token);

  registerNameInput.value = "";
  registerEmailInput.value = "";
  registerPasswordInput.value = "";

  showToast("Register Berhasil", "Akun berhasil dibuat dan pengguna sudah login");
}

async function handleLogin() {
  const identifier = loginIdentifierInput.value.trim();
  const password = loginPasswordInput.value.trim();

  if (!identifier || !password) {
    showToast("Login Gagal", "Email/username dan password wajib diisi");
    return;
  }

  const result = await authLogin({
    identifier,
    password
  });

  if (!result.success) {
    showToast("Login Gagal", result.message);
    return;
  }

  saveAuthUser(result.user, result.token);

  loginIdentifierInput.value = "";
  loginPasswordInput.value = "";

  showToast("Login Berhasil", `Selamat datang, ${result.user.name}`);
}

function handleLogout() {
  clearAuthUser();
  showToast("Logout Berhasil", "Akun berhasil keluar dari aplikasi");
}

function isAuthenticated() {
  return Boolean(authUser);
}

function requireCommunityLogin() {
  if (isAuthenticated()) {
    return true;
  }

  showToast(
    "Login Diperlukan",
    "Silakan login terlebih dahulu untuk menggunakan fitur Community Spin"
  );

  setTimeout(() => {
    showAuthPage();
  }, 900);

  return false;
}

function getProfileName() {
  if (authUser && authUser.name) {
    return authUser.name;
  }

  return localStorage.getItem("spinyuk_profile_name") || "Guest User";
}

function getProfileEmail() {
  if (authUser && authUser.email) {
    return authUser.email;
  }

  return localStorage.getItem("spinyuk_profile_email") || "Belum login";
}

function getProfileInitial(name) {
  const cleanName = String(name || "Guest User").trim();
  return cleanName ? cleanName.charAt(0).toUpperCase() : "G";
}

function renderProfileSettings() {
  const savedPhoto = localStorage.getItem("spinyuk_profile_photo");
  const name = getProfileName();
  const email = getProfileEmail();

  if (profilePreviewName) {
    profilePreviewName.textContent = name;
  }

  if (profilePreviewEmail) {
    profilePreviewEmail.textContent = email;
  }

  if (profileLoginStatus) {
    profileLoginStatus.textContent = authUser ? "Status: Sudah Login" : "Status: Guest";
  }

  if (profileNameInput) {
    profileNameInput.value = name === "Guest User" ? "" : name;
  }

  if (profileEmailInput) {
    profileEmailInput.value = email === "Belum login" ? "" : email;
  }

  if (profileInitialText) {
    profileInitialText.textContent = getProfileInitial(name);
  }

  if (profilePreviewImage && profileInitialText) {
    if (savedPhoto) {
      profilePreviewImage.src = savedPhoto;
      profilePreviewImage.style.display = "block";
      profileInitialText.style.display = "none";
    } else {
      profilePreviewImage.removeAttribute("src");
      profilePreviewImage.style.display = "none";
      profileInitialText.style.display = "block";
    }
  }
}

function chooseProfilePhoto() {
  if (!profilePhotoInput) return;
  profilePhotoInput.click();
}

function handleProfilePhotoChange(event) {
  const file = event.target.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    showToast("File Salah", "Pilih file gambar untuk foto profil");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    localStorage.setItem("spinyuk_profile_photo", reader.result);
    renderProfileSettings();
    showToast("Foto Profil", "Foto profil berhasil diperbarui");
  };

  reader.readAsDataURL(file);
}

function saveProfileSettings() {
  const name = profileNameInput.value.trim();
  const email = profileEmailInput.value.trim();

  if (!name || !email) {
    showToast("Profil Belum Lengkap", "Nama dan email profil wajib diisi");
    return;
  }

  localStorage.setItem("spinyuk_profile_name", name);
  localStorage.setItem("spinyuk_profile_email", email);

  if (authUser) {
    authUser = {
      ...authUser,
      name,
      email
    };

    localStorage.setItem("spinyuk_auth_user", JSON.stringify(authUser));
  }

  if (userName) {
    userName.value = name;
  }

  if (communityUserInput) {
    communityUserInput.value = name;
  }

  renderAuthStatus();
  renderProfileSettings();

  showToast("Profil Disimpan", "Informasi profil berhasil diperbarui");
}

function removeProfilePhoto() {
  localStorage.removeItem("spinyuk_profile_photo");

  if (profilePhotoInput) {
    profilePhotoInput.value = "";
  }

  renderProfileSettings();
  showToast("Foto Dihapus", "Foto profil berhasil dihapus");
}

addBtn.addEventListener("click", addItem);

itemInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addItem();
  }
});

spinBtn.addEventListener("click", spinWheel);

clearBtn.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();

  closeToast();

  items = [];
  resultText.textContent = "Belum ada hasil";

  saveLocalData();
  drawWheel();
  renderItems();
  updateQuickStats();

  showToast("Pilihan Dihapus", "Semua pilihan Quick Spin berhasil dikosongkan");

  setTimeout(() => {
    itemInput.focus();
  }, 120);
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

if (settingErrorSound) {
  settingErrorSound.addEventListener("change", () => {
    localStorage.setItem(
      "spinyuk_error_sound",
      settingErrorSound.checked ? "true" : "false"
    );
  });
}

if (settingMusicVolume) {
  settingMusicVolume.addEventListener("input", () => {
    if (volumeValueText) {
      volumeValueText.textContent = `${settingMusicVolume.value}%`;
    }

    if (backgroundMusic) {
      backgroundMusic.volume = Number(settingMusicVolume.value) / 100;
    }

    localStorage.setItem("spinyuk_music_volume", settingMusicVolume.value);
  });
}

if (settingBackgroundMusic) {
  settingBackgroundMusic.addEventListener("change", () => {
    localStorage.setItem(
      "spinyuk_background_music",
      settingBackgroundMusic.checked ? "true" : "false"
    );

    applyBackgroundMusicSetting();
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
communityCreateBtn.addEventListener("click", createCommunityRoom);
communityJoinBtn.addEventListener("click", joinCommunityRoom);
communityLeaveBtn.addEventListener("click", leaveCommunityRoom);
communityAddOptionBtn.addEventListener("click", addCommunityOption);
communitySpinBtn.addEventListener("click", spinCommunityOption);

communityOptionInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addCommunityOption();
    drawCommunityWheel();
  }
});

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

if (saveSettingsBtn) {
  saveSettingsBtn.addEventListener("click", saveSettingsForm);
}

if (settingMusicVolume) {
  settingMusicVolume.addEventListener("input", () => {
    if (volumeValueText) {
      volumeValueText.textContent = `${settingMusicVolume.value}%`;
    }

    if (backgroundMusic) {
      backgroundMusic.volume = Number(settingMusicVolume.value) / 100;
    }
  });
}

if (resetAllLocalBtn) {
  resetAllLocalBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    resetAllLocalData();
  });
}

if (settingButtonSound) {
  settingButtonSound.addEventListener("change", () => {
    localStorage.setItem(
      "spinyuk_button_sound",
      settingButtonSound.checked ? "true" : "false"
    );
  });
}

if (loginTabBtn) {
  loginTabBtn.addEventListener("click", () => switchAuthTab("login"));
}

if (registerTabBtn) {
  registerTabBtn.addEventListener("click", () => switchAuthTab("register"));
}

if (registerBtn) {
  registerBtn.addEventListener("click", handleRegister);
}

if (loginBtn) {
  loginBtn.addEventListener("click", handleLogin);
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", handleLogout);
}

if (loginPasswordInput) {
  loginPasswordInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  });
}

if (registerPasswordInput) {
  registerPasswordInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleRegister();
    }
  });
}

if (chooseProfilePhotoBtn) {
  chooseProfilePhotoBtn.addEventListener("click", chooseProfilePhoto);
}

if (profilePhotoInput) {
  profilePhotoInput.addEventListener("change", handleProfilePhotoChange);
}

if (saveProfileBtn) {
  saveProfileBtn.addEventListener("click", saveProfileSettings);
}

if (removeProfilePhotoBtn) {
  removeProfilePhotoBtn.addEventListener("click", removeProfilePhoto);
}

function updateActiveMode(mode) {
  const activeModeTitle = document.getElementById("activeModeTitle");
  const activeModeDesc = document.getElementById("activeModeDesc");

  if (!activeModeTitle || !activeModeDesc) return;

  if (mode === "quick") {
    activeModeTitle.textContent = "Quick Spin";
    activeModeDesc.textContent = "Spinner utama untuk memilih satu hasil.";
  }

  if (mode === "group") {
    activeModeTitle.textContent = "Group Spin";
    activeModeDesc.textContent = "Mode untuk membagi nama ke beberapa kelompok.";
  }
  if (mode === "community") {
    activeModeTitle.textContent = "Community Spin";
    activeModeDesc.textContent = "Mode simulasi room bersama untuk beberapa pengguna.";
  }
  if (mode === "about") {
    activeModeTitle.textContent = "Tentang SpinYuk";
    activeModeDesc.textContent = "Informasi aplikasi dan profil kelompok.";
  }
}

function closeAllCards() {
  closeToast();

  if (resetConfirmCard) {
    resetConfirmCard.classList.remove("show");
  }

  if (groupResetConfirmCard) {
    groupResetConfirmCard.classList.remove("show");
  }
}

function openSidebar() {
  appSidebar.classList.add("open");
  sidebarOverlay.classList.add("show");

  if (sidebarToggle) {
    sidebarToggle.classList.add("hide-toggle");
  }
}

function closeSidebar() {
  appSidebar.classList.remove("open");
  sidebarOverlay.classList.remove("show");

  if (sidebarToggle) {
    sidebarToggle.classList.remove("hide-toggle");
  }
}

function showQuickSpinPage() {
  closeAllCards();

  quickSpinPage.style.display = "grid";
  groupSpinPage.classList.remove("show");
  communitySpinPage.classList.remove("show");
  aboutPage.classList.remove("show");
  settingsPage.classList.remove("show");
  authPage.classList.remove("show");

  updateActiveMode("quick");
}

function showAboutPage() {
  closeAllCards();

  quickSpinPage.style.display = "none";
  groupSpinPage.classList.remove("show");
  communitySpinPage.classList.remove("show");
  aboutPage.classList.add("show");
  settingsPage.classList.remove("show");
  authPage.classList.remove("show");

  updateActiveMode("about");
}

function showSettingsPage() {
  closeAllCards();

  quickSpinPage.style.display = "none";
  groupSpinPage.classList.remove("show");
  communitySpinPage.classList.remove("show");
  aboutPage.classList.remove("show");
  settingsPage.classList.add("show");
  authPage.classList.remove("show");

  if (activeModeTitle && activeModeDesc) {
    activeModeTitle.textContent = "Pengaturan";
    activeModeDesc.textContent = "Kelola preferensi dan data lokal aplikasi.";
  }

  loadSettingsForm();
  renderProfileSettings();
}

function showAuthPage() {
  closeAllCards();

  quickSpinPage.style.display = "none";
  groupSpinPage.classList.remove("show");
  communitySpinPage.classList.remove("show");
  aboutPage.classList.remove("show");
  settingsPage.classList.remove("show");
  authPage.classList.add("show");

  if (activeModeTitle && activeModeDesc) {
    activeModeTitle.textContent = "Login";
    activeModeDesc.textContent = "Masuk atau daftar untuk menggunakan fitur Community Spin.";
  }

  renderAuthStatus();
}

function showGroupSpinPage() {
  closeAllCards();

  quickSpinPage.style.display = "none";
  groupSpinPage.classList.add("show");
  communitySpinPage.classList.remove("show");
  aboutPage.classList.remove("show");
  settingsPage.classList.remove("show");
  authPage.classList.remove("show");

  updateActiveMode("group");
  drawGroupWheel();
}

function showCommunitySpinPage() {
  closeAllCards();

  quickSpinPage.style.display = "none";
  groupSpinPage.classList.remove("show");
  communitySpinPage.classList.add("show");
  aboutPage.classList.remove("show");
  settingsPage.classList.remove("show");
  authPage.classList.remove("show");

  updateActiveMode("community");
  renderCommunityRoom();
  drawCommunityWheel();
}

if (sidebarToggle) {
  sidebarToggle.addEventListener("click", openSidebar);
}

if (sidebarClose) {
  sidebarClose.addEventListener("click", closeSidebar);
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener("click", closeSidebar);
}

function playSuccessSound() {
  const soundEnabled =
    localStorage.getItem("spinyuk_sound_effect") !== "false";

  if (!soundEnabled || !successSound) return;

  successSound.currentTime = 0;
  successSound.volume = 0.55;
  successSound.play().catch(() => {});
}

function playErrorSound() {
  const errorEnabled =
    localStorage.getItem("spinyuk_error_sound") !== "false";

  if (!errorEnabled || !errorSound) return;

  errorSound.currentTime = 0;
  errorSound.volume = 0.45;
  errorSound.play().catch(() => {});
}

function playButtonSound() {
  const buttonSoundEnabled =
    localStorage.getItem("spinyuk_button_sound") !== "false";

  if (!buttonSoundEnabled) return;

  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(520, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    760,
    audioContext.currentTime + 0.06
  );

  gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.09
  );

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.09);
}

sidebarLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    sidebarLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");

    const menu = link.dataset.menu;

    if (menu === "quick-spin") {
      showQuickSpinPage();
      closeSidebar();
      return;
    }

    if (menu === "group-spin") {
      showGroupSpinPage();
      closeSidebar();
      return;
    }
    if (menu === "community-spin") {
      showCommunitySpinPage();
      closeSidebar();
      return;
    }
    if (menu === "about-spinyuk") {
      showAboutPage();
      closeSidebar();
      return;
    }
    if (menu === "settings") {
      showSettingsPage();
      closeSidebar();
      return;
    }
    if (menu === "auth") {
      showAuthPage();
      closeSidebar();
      return;
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSidebar();
    closeAllCards();
  }
});

document.addEventListener(
  "click",
  (event) => {
    const clickedButton = event.target.closest("button");

    if (!clickedButton) return;
    if (clickedButton.disabled) return;

    playButtonSound();
  },
  true
);

authUser = getSavedAuthUser();
renderAuthStatus();

loadLocalData();
drawWheel();
renderItems();
renderHistory();
updateQuickStats();
drawGroupWheel();
renderCommunityRoom();