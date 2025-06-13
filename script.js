


function savePreset() {
  const presetName = prompt("ตั้งชื่อ Preset:");
  if (!presetName) return;

  const pads = document.querySelectorAll(".pad");
  const preset = [];

  pads.forEach((pad) => {
    if (pad.dataset.playing === "true") {
      preset.push(pad.innerText);
    }
  });

  // ดึง preset เดิมทั้งหมด
  const allPresets = JSON.parse(localStorage.getItem("allPresets") || "{}");

  // เพิ่มหรืออัปเดต preset ใหม่
  allPresets[presetName] = preset;

  // เซฟกลับลง localStorage
  localStorage.setItem("allPresets", JSON.stringify(allPresets));

  alert(`บันทึก Preset "${presetName}" แล้ว!`);
  updatePresetDropdown();
  updateDeletePreset();
}
function updatePresetDropdown() {
  const selector = document.getElementById("presetSelector");
  const select = document.getElementById("exportPresetSelect");
  const allPresets = JSON.parse(localStorage.getItem("allPresets") || "{}");

  // ล้าง option เดิม
  selector.innerHTML = `<option value="">-- เลือก Preset --</option>`;
  select.innerHTML = `<option value="">-- เลือก Preset --</option>`;

  Object.keys(allPresets).forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    selector.appendChild(option);
    select.appendChild(option);
  });
}
function exportSelectedPreset() {
  const selectedName = document.getElementById("exportPresetSelect").value;
  if (!selectedName) {
    alert("กรุณาเลือก Preset ที่จะ Export");
    return;
  }

  const allPresets = JSON.parse(localStorage.getItem("allPresets") || "{}");
  const preset = allPresets[selectedName];

  if (!preset) {
    alert("ไม่พบ Preset ที่เลือก");
    return;
  }

  const blob = new Blob([JSON.stringify({ [selectedName]: preset }, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${selectedName}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
function importPreset(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedData = JSON.parse(e.target.result);

      if (typeof importedData !== "object" || Array.isArray(importedData)) {
        throw new Error("Invalid format");
      }

      const currentPresets = JSON.parse(
        localStorage.getItem("allPresets") || "{}"
      );

      // ตรวจสอบแต่ละ Preset ที่นำเข้า
      Object.entries(importedData).forEach(([name, preset]) => {
        if (!Array.isArray(preset)) {
          throw new Error(`Preset "${name}" format is invalid`);
        }

        // ถ้าชื่อซ้ำ ให้แจ้งเตือน (หรือจะเปลี่ยนชื่ออัตโนมัติ / เขียนทับก็ได้)
        if (currentPresets[name]) {
          const overwrite = confirm(
            `มี Preset ชื่อ "${name}" อยู่แล้ว ต้องการเขียนทับหรือไม่?`
          );
          if (!overwrite) return;
        }

        currentPresets[name] = preset;
      });

      localStorage.setItem("allPresets", JSON.stringify(currentPresets));
      alert("นำเข้า Preset สำเร็จแล้ว!");
      updatePresetDropdown();
      updateDeletePreset();
    } catch (err) {
      alert("ไฟล์ Preset ไม่ถูกต้อง หรืออ่านไม่สำเร็จ");
      console.error(err);
    }
  };

  reader.readAsText(file);
}

function loadPresetFromDropdown() {
  const selector = document.getElementById("presetSelector");
  const selectedName = selector.value;
  if (!selectedName) {
    alert("กรุณาเลือก Preset ก่อน");
    return;
  }

  const allPresets = JSON.parse(localStorage.getItem("allPresets") || "{}");
  const preset = allPresets[selectedName];

  if (!preset) {
    alert("ไม่พบ Preset นี้");
    return;
  }

  document.querySelectorAll(".pad").forEach((pad) => {
    if (preset.includes(pad.innerText)) {
      if (pad.dataset.playing !== "true") {
        queueStartPad(pad);
      }
    } else {
      if (pad.dataset.playing === "true") {
        stopPad(pad);
      }
    }
  });
}
document
  .getElementById("loadPresetBtn")
  .addEventListener("click", loadPresetFromDropdown);

function clearPreset() {
  localStorage.removeItem("allPresets"); // ลบ preset ที่เคยเซฟไว้
  alert("ล้าง Preset สำเร็จแล้ว!");
  updatePresetDropdown();
  updateDeletePreset();
}
function updateDeletePreset() {
  const presets = JSON.parse(localStorage.getItem("allPresets") || "{}");

  const selectors = [
    document.getElementById("presetSelector"),
    document.getElementById("deletePresetSelector"),
  ];

  selectors.forEach((selector) => {
    if (!selector) return;

    selector.innerHTML = '<option value="">-- เลือก Preset --</option>';
    Object.keys(presets).forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      selector.appendChild(option);
    });
  });
}
function deleteSelectedPreset() {
  const selector = document.getElementById("deletePresetSelector");
  const selectedName = selector.value;
  const allPresets = JSON.parse(localStorage.getItem("allPresets") || "{}");
  if (!selectedName) {
    alert("กรุณาเลือก Preset ที่จะลบ");
    return;
  }
  if (!allPresets[selectedName]) {
    alert("ไม่พบ Preset นี้");
    return;
  }

  if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ Preset "${selectedName}"?`)) {
    return;
  }

  delete allPresets[selectedName]; // ลบออกจาก object
  localStorage.setItem("allPresets", JSON.stringify(allPresets)); // บันทึกกลับ

  alert(`ลบ Preset "${selectedName}" แล้วเรียบร้อย`);

  updateDeletePreset(); // อัปเดต dropdown ใหม่
  updatePresetDropdown();
}

function changeTemplate(el, key) {
  // Reset ปุ่มทั้งหมด
  document.querySelectorAll(".template-btn").forEach((btn) => {
    btn.style.backgroundColor = "#2d3748";
    btn.style.border = "1px solid #4a5568";
  });

  // Active ปุ่มที่กด
  el.style.backgroundColor = "#4a5568";
  el.style.border = "1px solid #63b3ed";

  // ซ่อนทุก container
  document.querySelectorAll(".pads-container").forEach((c) => {
    c.style.display = "none";
  });

  // แสดงเฉพาะ container ที่ตรงกับ key
  const selectedId =
    key === "A"
      ? "padsContainer"
      : key === "B"
        ? "padsContainerB"
        : key === "C"
          ? "padsContainerC"
          : key === "D"
            ? "padsContainerD"
            : "padsContainerE"; // เพิ่มตรงนี้
  const selectedContainer = document.getElementById(selectedId);
  if (selectedContainer) {
    selectedContainer.style.display = "flex";
    // ✅ Fix: Force redraw หรือ resize สำหรับ midi-encoder
    requestAnimationFrame(() => {
      selectedContainer.querySelectorAll("midi-encoder").forEach((encoder) => {
        if (typeof encoder.resize === "function") {
          encoder.resize();
        }
      });
    });
  }

  console.log("Template ที่เลือก:", key);
  updateSelectPreset(key);
  const bpmSelect = document.getElementById("confirmBPM");
  bpmSelect.dataset.tab = key;
}



window.addEventListener("load", updatePresetDropdown());
window.addEventListener("DOMContentLoaded", updateDeletePreset());

