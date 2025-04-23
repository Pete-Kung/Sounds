let bpm = 124;
let beatsPerBar = 4;
let beatDuration = 60 / bpm;
let barDuration = beatDuration * beatsPerBar  ;
let currentBeat = 0;
const bpmSlider = document.getElementById("bpmSlider");
const bpmValueLabel = document.getElementById("bpmValue");
const beatEls = document.querySelectorAll(".beat");

// ฟังก์ชันอัปเดต BPM และ playbackRate
function updateBPM() {
  bpm = parseInt(bpmSlider.value) || 124; // fallback ถ้าค่าไม่ valid
  bpmValueLabel.textContent = bpm;
  beatDuration = 60 / bpm;
  barDuration = beatDuration * beatsPerBar;

  const pads = document.querySelectorAll(".pad");
  pads.forEach(pad => {
    if (pad.dataset.playing === "true" && pad.source) {
      pad.source.playbackRate.value = bpm / 124;
    }
  });
}

// เมื่อผู้ใช้พิมพ์ค่า BPM ใหม่
bpmSlider.addEventListener("input", updateBPM);

// เมื่อคลิกที่ category
document.querySelectorAll(".category").forEach(category => {
  category.addEventListener("click", updateBPM);
});


const sounds = [
  { name: "Drum 1", file: "US_DTH_Drum_124_Bong_STRIPPED.wav", container: "drumContainer" },
  { name: "Drum 2", file: "US_DTH_Drum_124_Block_TOP.wav", container: "drumContainer" },
  { name: "Drum 3", file: "US_DTH_Drum_124_Bull_FULL.wav", container: "drumContainer" },
  { name: "Drum 4", file: "US_DTH_Drum_124_Hotel_FULL.wav", container: "drumContainer" },
  { name: "Drum 5", file: "US_DTH_Drum_124_Bell_STRIPPED.wav", container: "drumContainer" },
  { name: "Drum 6", file: "US_DTH_Drum_124_Road_FULL.wav", container: "drumContainer" },

  { name: "Bass 1", file: "US_DTH_Bass_124_May_Fm.wav", container: "bassContainer" },
  { name: "Bass 2", file: "US_DTH_Bass_124_Dark_Dm.wav", container: "bassContainer" },
  { name: "Bass 3", file: "US_DTH_Bass_124_Great_Em.wav", container: "bassContainer" },
  { name: "Bass 4", file: "US_DTH_Bass_124_Marriage_Am.wav", container: "bassContainer" },
  { name: "Bass 5", file: "US_DTH_Bass_124_Meeting_Fm.wav", container: "bassContainer" },
  { name: "Bass 6", file: "US_DTH_Bass_124_sixty_Gm.wav", container: "bassContainer" },

  { name: "FX 1", file: "US_DTH_FX_Venice.wav", container: "fxContainer" },
  { name: "FX 2", file: "US_DTH_FX_Result.wav", container: "fxContainer" },
  { name: "FX 3", file: "US_DTH_FX_Report.wav", container: "fxContainer" },
  { name: "FX 4", file: "US_DTH_FX_National.wav", container: "fxContainer" },
  { name: "FX 5", file: "US_DTH_FX_Near.wav", container: "fxContainer" },
  { name: "FX 6", file: "US_DTH_FX_Republic.wav", container: "fxContainer" },

  { name: "Pad 1", file: "US_DTH_Pad_124_Future.wav", container: "padContainer" },
  { name: "Pad 2", file: "US_DTH_Pad_124_Gazzelle.wav", container: "padContainer" },
  { name: "Pad 3", file: "US_DTH_Pad_124_Pray.wav", container: "padContainer" },
  { name: "Pad 4", file: "US_DTH_Pad_124_Remesh.wav", container: "padContainer" },
  { name: "Pad 5", file: "US_DTH_Pad_124_Sound_Em.wav", container: "padContainer" },
  { name: "Pad 6", file: "US_DTH_Pad_124_Cold_Cm.wav", container: "padContainer" },

  { name: "Synth 1", file: "US_DTH_Synth_124_Again.wav", container: "synthContainer" },
  { name: "Synth 2", file: "US_DTH_Synth_124_Agree_G.wav", container: "synthContainer" },
  { name: "Synth 3", file: "US_DTH_Synth_124_Begin.wav", container: "synthContainer" },
  { name: "Synth 4", file: "US_DTH_Synth_124_Brother_Fm.wav", container: "synthContainer" },
  { name: "Synth 5", file: "US_DTH_Synth_124_Large_Cm.wav", container: "synthContainer" },
  { name: "Synth 6", file: "US_DTH_Synth_124_Machine_Em.wav", container: "synthContainer" },


];
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
// Load audio buffer from file
function loadBuffer(url) {
  return fetch(url)
    .then(res => res.arrayBuffer())
    .then(buf => audioContext.decodeAudioData(buf));
}
function createPad(sound) {
  const pad = document.createElement("div");
  pad.classList.add("pad");
  pad.innerText = sound.name;
  pad.dataset.playing = "false";
  pad.buffer = null;
  pad.source = null;
  loadBuffer(`./sounds/${sound.file}`).then(buffer => {
    pad.buffer = buffer;
  });
  pad.addEventListener("click", () => {
    const container = document.getElementById(sound.container);
    const currentlyPlayingPad = container.querySelector(".pad[data-playing='true']");
    if (currentlyPlayingPad && currentlyPlayingPad !== pad) {
      stopPad(currentlyPlayingPad);  // หยุดเสียงเก่าที่กำลังเล่นอยู่
    }
    // รอให้เสียงใหม่เริ่มเล่นที่จังหวะถัดไป
    if (pad.dataset.playing === "true") {
      stopPad(pad);  // หยุดเสียงเดิมถ้าเล่นอยู่
    } else {
      queueStartPad(pad); // Wait for the beat to sync before starting
      // เริ่มเสียงใหม่ที่จังหวะถัดไป
      //queueStartPadAtNextBeat(pad); 
    }
  });
  // ฟังก์ชันเพื่อเริ่มเสียงใหม่ที่จังหวะถัดไ
  document.getElementById(sound.container).appendChild(pad);
}
function stopPad(pad) {
  if (pad.source && pad.gainNode) {
    const stopTime = Math.ceil(audioContext.currentTime / barDuration) * barDuration;
    pad.gainNode.gain.setValueAtTime(pad.gainNode.gain.value, audioContext.currentTime);
    pad.gainNode.gain.linearRampToValueAtTime(0, stopTime);
    pad.source.stop(stopTime);
    pad.pendingStopTime = stopTime; // 👈 เก็บเวลาไว้
    pad.dataset.playing = "false";
    setTimeout(() => {
      pad.source.disconnect();
      pad.gainNode.disconnect();
      pad.source = null;
      pad.gainNode = null;
      pad.pendingStopTime = null; // clear
      pad.classList.remove("active");
    }, (stopTime - audioContext.currentTime) * 1000 + 50);
  }
}
// Initialize all the pads
sounds.forEach(createPad);
setInterval(() => {
  beatEls.forEach((el, i) => {
    el.classList.toggle("active", i === currentBeat);
  });
  currentBeat = (currentBeat + 1) % beatsPerBar; // 0 -> 1 -> 2 -> 3 -> 0 -> ...
}, beatDuration * 1000); // หนึ่ง beat กี่มิลลิวินาที

function queueStartPad(pad) {
  const container = document.getElementById(pad.parentElement.id);
  const currentlyPlayingPad = container.querySelector(".pad[data-playing='true']");

  if (currentlyPlayingPad && currentlyPlayingPad !== pad) {
    stopPad(currentlyPlayingPad);
    // รอจนกว่า pad เดิมจะหยุดก่อนค่อยเริ่มใหม่
    const waitTime = (currentlyPlayingPad.pendingStopTime || audioContext.currentTime) - audioContext.currentTime;

    setTimeout(() => {
      actuallyQueuePad(pad);
    }, waitTime * 1000);
  } else {
    actuallyQueuePad(pad);
  }
}

function actuallyQueuePad(pad) {
  const nextBarTime = Math.ceil(audioContext.currentTime / barDuration) * barDuration;
  const currentBeat = Math.floor((nextBarTime % barDuration) / beatDuration);

  const source = audioContext.createBufferSource();
  const gainNode = audioContext.createGain();

  source.buffer = pad.buffer;
  source.loop = true;
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);
  pad.source = source;
  pad.gainNode = gainNode;
  gainNode.gain.setValueAtTime(1, nextBarTime);
  source.start(nextBarTime);
  pad.dataset.playing = "true";
  pad.classList.add("active");
  // optional: บอกผู้ใช้ว่ากำลังจะเริ่ม
  beatEls[currentBeat].classList.add("pending");
  setTimeout(() => {
    beatEls[currentBeat].classList.remove("pending");
  }, (nextBarTime - audioContext.currentTime) * 1000);
}
function stopAllPads() {
  const pads = document.querySelectorAll(".pad");

  pads.forEach(pad => {
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

  pads.forEach(pad => {
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
  const allPresets = JSON.parse(localStorage.getItem("allPresets") || "{}");

  // ล้าง option เดิม
  selector.innerHTML = `<option value="">-- เลือก Preset --</option>`;

  Object.keys(allPresets).forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    selector.appendChild(option);
  });
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

  document.querySelectorAll(".pad").forEach(pad => {
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
document.getElementById("loadPresetBtn").addEventListener("click", loadPresetFromDropdown);

function clearPreset() {
  localStorage.removeItem("allPresets"); // ลบ preset ที่เคยเซฟไว้
  alert("ล้าง Preset สำเร็จแล้ว!");
  updatePresetDropdown()
  updateDeletePreset()
}
function updateDeletePreset() {
  const presets = JSON.parse(localStorage.getItem("allPresets") || "{}");

  const selectors = [
    document.getElementById("presetSelector"),
    document.getElementById("deletePresetSelector")
  ];

  selectors.forEach(selector => {
    if (!selector) return;

    selector.innerHTML = '<option value="">-- เลือก Preset --</option>';
    Object.keys(presets).forEach(name => {
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
}
window.addEventListener("load", updatePresetDropdown());
window.addEventListener("DOMContentLoaded", updateDeletePreset());





