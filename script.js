let bpm = 120;
let beatsPerBar = 4;
let beatDuration = 60 / bpm;
let barDuration = beatDuration * beatsPerBar;
let currentBeat = 0;
const beatEls = document.querySelectorAll(".beat");
const bpmSlider = document.getElementById("bpmSlider");
const bpmValueLabel = document.getElementById("bpmValue");
const confirmButton = document.getElementById("confirmBPM");

let beatLoopTimeoutId;

function beatLoop() {
  beatEls.forEach((el, i) => {
    el.classList.toggle("active", i === currentBeat);
  });
  currentBeat = (currentBeat + 1) % beatsPerBar;

  beatLoopTimeoutId = setTimeout(beatLoop, beatDuration * 1000); // อัปเดตตาม bpm
}

function updateBPM() {
  const getBpm = document.getElementById("confirmBPM");
  const tabSelect = getBpm.dataset.tab;
  console.log("tab", tabSelect);

  let newBpm = parseInt(bpmSlider.value);
  console.log("Input BPM:", newBpm);

  // ถ้าไม่ใช่ตัวเลข ให้ใช้ค่าเริ่มต้น 120
  if (isNaN(newBpm)) {
    newBpm = 120;
  }

  // บีบค่าให้อยู่ในช่วง 60 - 200
  newBpm = Math.max(60, Math.min(200, newBpm));

  // ตั้งค่า bpmSlider ให้แสดงค่าที่แก้ไขแล้ว
  bpmSlider.value = newBpm;

  bpm = newBpm;
  bpmValueLabel.textContent = bpm;
  beatDuration = 60 / bpm;
  barDuration = beatDuration * beatsPerBar;

  if (tabSelect == "A") {
    const pads = document.querySelectorAll(".pad");
    pads.forEach((pad) => {
      if (pad.dataset.playing === "true" && pad.source) {
        pad.source.playbackRate.value = bpm / 120;
      }
    });
    beatLoop();

    clearTimeout(beatLoopTimeoutId);
  } else if (tabSelect == "B") {
    // bpmUpdateB(bpm);
  } else if (tabSelect == "C") {
  } else {
  }


}

confirmButton.addEventListener("click", updateBPM);

// เริ่ม loop ตอนแรก
beatLoop();

// ฟังก์ชันเพื่อปรับเสียงหมวดหมู่
// ฟังก์ชันปรับ volume
function updateVolume(e) {
  const category = e.target.dataset.category;
  const volume = parseFloat(e.target.value);

  const container = document.getElementById(category);
  const pads = container.querySelectorAll(".pad");

  pads.forEach((pad) => {
    if (pad.dataset.playing === "true" && pad.gainNode) {
      pad.gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    }
  });
}
// ผูก event ให้ sliders แค่ครั้งเดียวหลังจากโหลดหน้า
document.querySelectorAll(".volumeSlider").forEach((slider) => {
  slider.addEventListener("input", updateVolume);
});

// slieder.js
function onSliderChange(e) {
  const slider = e.currentTarget; // ดึง element จาก event นี้ชัวร์สุด
  const sliderId = slider.getAttribute("data-id") || "unknown";
  const label = slider.getAttribute("label") || "Slider";
  const category = slider.getAttribute("data-category");
  const volume = parseFloat(e.detail.value) / 100;

  console.log(`[${sliderId}] ${label} changed:`, volume);

  // === Update volume container ===
  if (category) {
    const container = document.getElementById(category);
    if (container) {
      const pads = container.querySelectorAll(".pad");

      pads.forEach((pad) => {
        if (pad.dataset.playing === "true" && pad.gainNode) {
          pad.gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        }
      });
    }
  }
}

// === ผูก event แค่ครั้งเดียว ไม่ซ้ำ ===
const sliders = document.querySelectorAll("midi-slider");
sliders.forEach((slider) => {
  slider.removeEventListener("slider-change", onSliderChange);
  slider.addEventListener("slider-change", onSliderChange);
});

//  decode.js
const decodeSlider = document.querySelectorAll("midi-encoder");
decodeSlider.forEach((slider) => {
  slider.removeEventListener("encoder-change", onSliderChange);
  slider.addEventListener("encoder-change", onSliderChange);
});

// เมื่อผู้ใช้พิมพ์ค่า BPM ใหม่
// เมื่อคลิกที่ category
document.querySelectorAll(".category").forEach((category) => {
  category.addEventListener("click", updateBPM);
});
const sounds = [
  {
    name: "Drum 1",
    file: "US_DTH_Drum_124_Bong_STRIPPED.wav",
    container: "drumContainer",
  },
  {
    name: "Drum 2",
    file: "US_DTH_Drum_124_Block_TOP.wav",
    container: "drumContainer",
  },
  {
    name: "Drum 3",
    file: "US_DTH_Drum_124_Bull_FULL.wav",
    container: "drumContainer",
  },
  {
    name: "Drum 4",
    file: "US_DTH_Drum_124_Hotel_FULL.wav",
    container: "drumContainer",
  },

  {
    name: "Bass 1",
    file: "US_DTH_Bass_124_May_Fm.wav",
    container: "bassContainer",
  },
  {
    name: "Bass 2",
    file: "US_DTH_Bass_124_Dark_Dm.wav",
    container: "bassContainer",
  },
  {
    name: "Bass 3",
    file: "US_DTH_Bass_124_Great_Em.wav",
    container: "bassContainer",
  },
  {
    name: "Bass 4",
    file: "US_DTH_Bass_124_Marriage_Am.wav",
    container: "bassContainer",
  },

  { name: "FX 1", file: "US_DTH_FX_Venice.wav", container: "fxContainer" },
  { name: "FX 2", file: "US_DTH_FX_Result.wav", container: "fxContainer" },
  { name: "FX 3", file: "US_DTH_FX_USA.wav", container: "fxContainer" },
  { name: "FX 4", file: "US_DTH_FX_National.wav", container: "fxContainer" },

  {
    name: "Pad 1",
    file: "US_DTH_Pad_124_Future.wav",
    container: "padContainer",
  },
  {
    name: "Pad 2",
    file: "US_DTH_Pad_124_Gazzelle.wav",
    container: "padContainer",
  },
  { name: "Pad 3", file: "US_DTH_Pad_124_Pray.wav", container: "padContainer" },
  {
    name: "Pad 4",
    file: "US_DTH_Pad_124_Remesh.wav",
    container: "padContainer",
  },

  {
    name: "Synth 1",
    file: "US_DTH_Synth_124_Again.wav",
    container: "synthContainer",
  },
  {
    name: "Synth 2",
    file: "US_DTH_Synth_124_Agree_G.wav",
    container: "synthContainer",
  },
  {
    name: "Synth 3",
    file: "US_DTH_Synth_124_Begin.wav",
    container: "synthContainer",
  },
  {
    name: "Synth 4",
    file: "US_DTH_Synth_124_Brother_Fm.wav",
    container: "synthContainer",
  },
];


const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Load audio buffer from file
function loadBuffer(url) {
  return fetch(url)
    .then((res) => res.arrayBuffer())
    .then((buf) => audioContext.decodeAudioData(buf));
}
function loadBufferB(url) {
  return fetch(url)
    .then((res) => res.arrayBuffer())
    .then((buf) => audioContext.decodeAudioData(buf));
}

// Initialize all the pads

function stopAllPads() {
  const pads = document.querySelectorAll(".pad");
  pads.forEach((pad) => {
    if (pad.dataset.playing === "true") {
      stopPad(pad);
    }
  });
}
document.getElementById("stopAllBtn").addEventListener("click", stopAllPads);

// function toggleMuteGroup(containerId) {
//   const container = document.getElementById(containerId);
//   const pads = container.querySelectorAll(".pad");

//   pads.forEach(pad => {
//     if (pad.gainNode) {
//       const isMuted = pad.dataset.muted === "true";
//       pad.gainNode.gain.setValueAtTime(isMuted ? 1 : 0, audioContext.currentTime);
//       pad.dataset.muted = isMuted ? "false" : "true";
//       pad.classList.toggle("muted", !isMuted);
//     }
//   });
// }
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
      : "padsContainerD";
  const selectedContainer = document.getElementById(selectedId);
  if (selectedContainer) {
    selectedContainer.style.display = "flex";
  }

  console.log("Template ที่เลือก:", key);

  const bpmSelect = document.getElementById("confirmBPM");
  bpmSelect.dataset.tab = key;
}

// ค่าเริ่มต้น: Template A
window.addEventListener("DOMContentLoaded", () => {
  const defaultBtn = document.querySelector('.template-btn[data-key="A"]');
  if (defaultBtn) changeTemplate(defaultBtn, "A");
});

// PitchShift ได้ค่ามาแล้วเอาไปใช้ต่อ
// function addPitchShiftEncoder() {
//   const container = document.querySelector('div[style*="flex; gap"]');

//   const encoder = document.createElement('midi-encoder');
//   encoder.setAttribute('label', 'Pitch-Shift');
//   encoder.setAttribute('colour', '#e67e22');
//   encoder.setAttribute('data-category', 'pitchShiftContainer');
//   encoder.setAttribute('init', '0');

//   // 🟢 เพิ่ม event listener สำหรับ pitch-shift
//   encoder.addEventListener('input', (e) => {
//     const value = e.target.value;

//     // 👉 เพิ่ม logic การเปลี่ยน pitch ที่นี่
//     console.log('Pitch Shift value:', value);

//     // ตัวอย่างการเชื่อมกับ Web Audio:
//     // pitchShiftNode.pitch = value;
//   });

//   container.appendChild(encoder);
// }

window.addEventListener("load", updatePresetDropdown());
window.addEventListener("DOMContentLoaded", updateDeletePreset());
