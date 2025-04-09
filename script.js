let bpm = 124;
let beatsPerBar = 4;
let beatDuration = 60 / bpm;
let barDuration = beatDuration * beatsPerBar;
const bpmSlider = document.getElementById("bpmSlider");
const bpmValueLabel = document.getElementById("bpmValue");

bpmSlider.addEventListener("input", () => {
  bpm = parseInt(bpmSlider.value);
  bpmValueLabel.textContent = bpm;
  beatDuration = 60 / bpm;
  barDuration = beatDuration * beatsPerBar;

  // Update playbackRate ของ pad ที่กำลังเล่น
  const pads = document.querySelectorAll(".pad");
  pads.forEach(pad => {
    if (pad.dataset.playing === "true" && pad.source) {
      pad.source.playbackRate.value = bpm / 124; // อิงจาก original BPM
    }
  });
});
const sounds = [
  { name: "Drum 1", file: "US_DTH_Drum_124_Bong_STRIPPED.wav", container: "drumContainer" },
  { name: "Drum 2", file: "US_DTH_Drum_124_Block_TOP.wav", container: "drumContainer" },
  { name: "Drum 3", file: "US_DTH_Drum_124_Ca_PERC.wav", container: "drumContainer" },
  { name: "Drum 4", file: "US_DTH_Drum_124_Hotel_FULL.wav", container: "drumContainer" },

  { name: "Bass 1", file: "US_DTH_Bass_124_May_Fm.wav", container: "bassContainer" },
  { name: "Bass 2", file: "US_DTH_Bass_124_Dark_Dm.wav", container: "bassContainer" },
  { name: "Bass 3", file: "US_DTH_Bass_124_Great_Em.wav", container: "bassContainer" },
  { name: "Bass 4", file: "US_DTH_Bass_124_Marriage_Am.wav", container: "bassContainer" },

  { name: "FX 1", file: "US_DTH_FX_Venice.wav", container: "fxContainer" },
  { name: "FX 2", file: "US_DTH_FX_Result.wav", container: "fxContainer" },
  { name: "FX 3", file: "US_DTH_FX_Report.wav", container: "fxContainer" },
  { name: "FX 4", file: "US_DTH_FX_Mode.wav", container: "fxContainer" },

  { name: "Pad 1", file: "US_DTH_Pad_124_Future.wav", container: "padContainer" },
  { name: "Pad 2", file: "US_DTH_Pad_124_Gazzelle.wav", container: "padContainer" },
  { name: "Pad 3", file: "US_DTH_Pad_124_Pray.wav", container: "padContainer" },
  { name: "Pad 4", file: "US_DTH_Pad_124_Remesh.wav", container: "padContainer" },

  { name: "Synth 1", file: "US_DTH_Synth_124_Again.wav", container: "synthContainer" },
  { name: "Synth 2", file: "US_DTH_Synth_124_Agree_G.wav", container: "synthContainer" },
  { name: "Synth 3", file: "US_DTH_Synth_124_Begin.wav", container: "synthContainer" },
  { name: "Synth 4", file: "US_DTH_Synth_124_Brother_Fm.wav", container: "synthContainer" },

];

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Load audio buffer from file
function loadBuffer(url) {
  return fetch(url)
    .then(res => res.arrayBuffer())
    .then(buf => audioContext.decodeAudioData(buf));
}

// Create pad elements and set event listeners for playback
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

// Queue the sound to start at the next available bar
// Queue the sound to start at the next available beat
function queueStartPad(pad) {
  const currentTime = audioContext.currentTime;

  // คำนวณเวลาของจังหวะถัดไปที่จะเริ่ม
  const nextBeatTime = Math.ceil(currentTime / beatDuration) * beatDuration;

  // จัดการแสดงผลที่ beat ปัจจุบันว่าเสียงกำลังจะเริ่ม
  const currentBeat = Math.floor((nextBeatTime % barDuration) / beatDuration);
  beatEls[currentBeat].classList.add("pending"); // แสดงว่าเสียงจะเริ่มที่ beat นี้

  const source = audioContext.createBufferSource();
  source.buffer = pad.buffer;
  source.loop = true;
  source.connect(audioContext.destination);

  // Start the source at the calculated next beat time
  source.start(nextBeatTime);

  pad.source = source;
  pad.dataset.playing = "true";
  pad.classList.add("active");

  // ลบ class "pending" หลังจากเล่น
  setTimeout(() => {
    beatEls[currentBeat].classList.remove("pending");
  }, (nextBeatTime - currentTime) * 1000); // ลบหลังจากเวลาเสียงเล่นไปแล้ว
}


// Stop the pad audio if it's currently playing
function stopPad(pad) {
    console.log(pad);
    if (pad.source) {
      pad.source.stop();
      pad.source.disconnect();
      pad.source = null;
      pad.classList.remove("active");  // ลบ class active เมื่อหยุดเสียง

    }
    pad.dataset.playing = "false";
  }

  

// Initialize all the pads
sounds.forEach(createPad);

const beatEls = document.querySelectorAll(".beat");
let currentBeat = 0;

setInterval(() => {
  beatEls.forEach((el, i) => {
    el.classList.toggle("active", i === currentBeat);
  });

  currentBeat = (currentBeat + 1) % beatsPerBar; // 0 -> 1 -> 2 -> 3 -> 0 -> ...
}, beatDuration * 1000); // หนึ่ง beat กี่มิลลิวินาที
function queueStartPad(pad) {
  const currentTime = audioContext.currentTime;
  const nextBarTime = Math.ceil(currentTime / barDuration) * barDuration;

  const currentBeat = Math.floor((nextBarTime % barDuration) / beatDuration);
  beatEls[currentBeat].classList.add("pending"); // แสดงว่าเสียงจะเริ่มที่ beat นี้

  const source = audioContext.createBufferSource();
  source.buffer = pad.buffer;
  source.loop = true;
  source.connect(audioContext.destination);
  source.start(nextBarTime);

  pad.source = source;
  pad.dataset.playing = "true";
  pad.classList.add("active");

  // ลบ class "pending" หลังจากเล่น
  setTimeout(() => {
    beatEls[currentBeat].classList.remove("pending");
  }, (nextBarTime - currentTime) * 1000);
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

