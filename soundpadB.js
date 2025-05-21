const soundsB = [
  {
    name: "Drum 1",
    file: "Drum_130_01.wav",
    container: "padB-1",
  },
  {
    name: "Drum 2",
    file: "Drum_130_02.wav",
    container: "padB-1",
  },
  {
    name: "Drum 3",
    file: "Drum_130_03.wav",
    container: "padB-1",
  },
  {
    name: "Drum 4",
    file: "Drum_130_04.wav",
    container: "padB-1",
  },

  {
    name: "Bass 1",
    file: "Bass_130_01.wav",
    container: "padB-2",
  },
  {
    name: "Bass 2",
    file: "Bass_130_02.wav",
    container: "padB-2",
  },
  {
    name: "Bass 3",
    file: "Bass_130_03.wav",
    container: "padB-2",
  },
  {
    name: "Bass 4",
    file: "Bass_130_04.wav",
    container: "padB-2",
  },

  {
    name: "Pad 1",
    file: "Pad_130_01.wav",
    container: "padB-3",
  },
  {
    name: "Pad 2",
    file: "Pad_130_02.wav",
    container: "padB-3",
  },
  { name: "Pad 3", file: "Pad_130_03.wav", container: "padB-3" },
  {
    name: "Pad 4",
    file: "Pad_130_04.wav",
    container: "padB-3",
  },

  {
    name: "Synth 1",
    file: "Synth_130_01.wav",
    container: "padB-4",
  },
  {
    name: "Synth 2",
    file: "Synth_130_02.wav",
    container: "padB-4",
  },
  {
    name: "Synth 3",
    file: "Synth_130_03.wav",
    container: "padB-4",
  },
  {
    name: "Synth 4",
    file: "Synth_130_04.wav",
    container: "padB-4",
  },

  { name: "FX 1", file: "Fx_130_01.wav", container: "padB-5" },
  { name: "FX 2", file: "Fx_130_02.wav", container: "padB-5" },
  { name: "FX 3", file: "Fx_130_03.wav", container: "padB-5" },
  { name: "FX 4", file: "Fx_130_04.wav", container: "padB-5" },
];

const beatElsB = document.querySelectorAll(".beatB");
let beatDurationB = 60 / bpm;
let beatLoopTimeoutIdB;
let beatsPerBarB = 4;
let currentBeatB = 0;

function beatLoopB() {
  beatElsB.forEach((el, i) => {
    el.classList.toggle("active", i === currentBeatB);
  });
  currentBeatB = (currentBeatB + 1) % beatsPerBarB;

  beatLoopTimeoutIdB = setTimeout(beatLoopB, beatDurationB * 1000); // อัปเดตตาม bpm
}

beatLoopB();

function bpmUpdateB(bpm) {
  const pads = document.querySelectorAll(".padB");

  beatDurationB = 60 / bpm;
  pads.forEach((pad) => {
    if (pad.dataset.playing === "true" && pad.source) {
      pad.source.playbackRate.value = bpm / 120;
    }
  });
  clearTimeout(beatLoopTimeoutIdB);
  beatLoopB();
}

document.querySelectorAll(".categoryB").forEach((category) => {
  category.addEventListener("click", updateBPM);
});

const mainGainNodeB = audioContext.createGain();
mainGainNodeB.connect(audioContext.destination);

async function loadBufferB(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return await audioContext.decodeAudioData(arrayBuffer);
}

function createPadB(sound) {
  const pad = document.createElement("div");
  pad.classList.add("padB");
  pad.innerText = sound.name;
  pad.dataset.playing = "false";
  pad.buffer = null;
  pad.source = null;

  loadBufferB(`./sounds/Loop2/${sound.file}`).then((buffer) => {
    pad.buffer = buffer;
  });

  const container = document.getElementById(sound.container);

  if (sound.container === "padB-5") {
    // แบบ "กดค้างเพื่อเล่น loop / ปล่อยเพื่อหยุด"
    pad.addEventListener("mousedown", () => {
      if (pad.dataset.playing !== "true") {
        queueStartPadBFx(pad);
      }
    });
    pad.addEventListener("mouseup", () => {
      if (pad.dataset.playing === "true") {
        stopPadBFx(pad);
      }
    });

    // รองรับมือถือ
    pad.addEventListener("touchstart", () => {
      if (pad.dataset.playing !== "true") {
        queueStartPadBFx(pad);
      }
    });
    pad.addEventListener("touchend", () => {
      if (pad.dataset.playing === "true") {
        stopPadBFx(pad);
      }
    });
  } else {
    // ปุ่มอื่นใช้ click toggle ปกติ
    pad.addEventListener("click", () => {
      const currentlyPlayingPad = container.querySelector(
        ".padB[data-playing='true']"
      );
      if (currentlyPlayingPad && currentlyPlayingPad !== pad) {
        stopPadB(currentlyPlayingPad);
      }

      if (pad.dataset.playing === "true") {
        stopPadB(pad);
      } else {
        queueStartPadB(pad);
      }
    });
  }

  container.appendChild(pad);
}

function queueStartPadBFx(pad) {
  const nextBarTime = audioContext.currentTime;

  const source = audioContext.createBufferSource();
  const gainNode = audioContext.createGain();

  source.buffer = pad.buffer;
  source.loop = pad.parentElement.id !== "padB-5"; // ถ้าไม่ใช่ fxContainer ให้ loop

  source.connect(gainNode);
  gainNode.connect(audioContext.destination);
  gainNode.connect(mainGainNode);

  pad.source = source;
  pad.gainNode = gainNode;

  gainNode.gain.setValueAtTime(1, nextBarTime);
  source.start(nextBarTime);

  pad.dataset.playing = "true";
  pad.classList.add("playing");

  pad.pendingStopTime = null;
  pad._startTime = nextBarTime;

  // 📌 เพิ่ม event สำหรับ "ปล่อยมือ"
  const stopPad = () => {
    if (pad.dataset.playing === "true") {
      try {
        pad.source.stop();
      } catch (e) {
        console.warn("already stopped");
      }

      pad.dataset.playing = "false";
      pad.classList.remove("playing");
    }

    // ลบ event listener หลังใช้
    window.removeEventListener("mouseup", stopPad);
    window.removeEventListener("touchend", stopPad);
  };

  // ⌛ รอจนกว่าผู้ใช้จะปล่อย
  window.addEventListener("mouseup", stopPad);
  window.addEventListener("touchend", stopPad);
}

function stopPadBFx(pad) {
  if (pad.source && pad.gainNode) {
    const now = audioContext.currentTime;
    const holdDuration = now - (pad._startTime || now); // 🕒 คำนวณกดค้างนานแค่ไหน

    pad.gainNode.gain.setValueAtTime(pad.gainNode.gain.value, now);
    pad.gainNode.gain.linearRampToValueAtTime(0, now + 0.05); // fade out

    pad.source.stop(now + 0.05);
    pad.pendingStopTime = now + 0.05;
    pad.dataset.playing = "false";
    pad.classList.remove("playing");

    setTimeout(() => {
      try {
        pad.source?.disconnect?.();
        pad.gainNode?.disconnect?.();
      } catch (e) {
        console.warn("disconnect error", e);
      }
      pad.source = null;
      pad.gainNode = null;
      pad.pendingStopTime = null;
      pad._startTime = null;
      pad.classList.remove("playing");
    }, 100); // cleanup หลังเสียงหยุด
  }
}

function queueStartPadB(pad) {
  const container = document.getElementById(pad.parentElement.id);
  const currentlyPlayingPad = container.querySelector("[data-playing='true']");
  const containerPads = document.querySelectorAll(".padContainer");
  let currentlyPlayingPad2 = null;

  containerPads.forEach((containerpad) => {
    const padInContainer = containerpad.querySelector(
      ".padB[data-playing='true']"
    );
    if (padInContainer) {
      currentlyPlayingPad2 = padInContainer;
    }
  });

  const lockedTime = audioContext.currentTime;
  const syncedStartTime = Math.ceil(lockedTime / barDuration) * barDuration;

  if (currentlyPlayingPad2 == null) {
    // ✅ ไม่มี pad เล่นอยู่ → เริ่มทันทีแบบไม่ต้อง sync
    actuallyQueuePadB(pad, false, lockedTime, lockedTime); // sync = false
  } else {
    if (currentlyPlayingPad !== pad) {
      stopPadB(currentlyPlayingPad);
      const waitTime =
        (currentlyPlayingPad?.pendingStopTime || lockedTime) - lockedTime;
      setTimeout(() => {
        actuallyQueuePadB(pad, true, lockedTime, syncedStartTime);
      }, waitTime * 1000);
    } else {
      actuallyQueuePadB(pad, true, lockedTime, syncedStartTime);
    }
  }
}

function actuallyQueuePadB(
  pad,
  sync = true,
  lockedTime = audioContext.currentTime,
  startTime = null
) {
  const actualStartTime = sync
    ? startTime ?? Math.ceil(lockedTime / barDuration) * barDuration
    : lockedTime; // ถ้าไม่ sync → เริ่มทันที

  const currentBeat = Math.floor((lockedTime % barDuration) / beatDuration);

  const source = audioContext.createBufferSource();
  const gainNode = audioContext.createGain();

  console.log(
    `[PAD START] startTime: ${actualStartTime.toFixed(
      3
    )}, now: ${lockedTime.toFixed(3)}, diff: ${(
      actualStartTime - lockedTime
    ).toFixed(3)}`
  );

  source.buffer = pad.buffer;
  source.loop = true;

  source.connect(gainNode);
  gainNode.connect(mainGainNode);

  pad.source = source;
  pad.gainNode = gainNode;

  gainNode.gain.setValueAtTime(1, actualStartTime);
  source.start(actualStartTime);

  pad.dataset.playing = "true";
  pad.classList.add("playing");

  const nextStartTime = Math.ceil(lockedTime / barDuration) * barDuration;
  pad.pendingStopTime = nextStartTime;

  if (sync) {
    beatEls[currentBeat].classList.add("pending");
    setTimeout(() => {
      beatEls[currentBeat].classList.remove("pending");
    }, (nextStartTime - lockedTime) * 1000);
  }
}

function stopPadB(pad) {
  if (pad && pad.source && pad.gainNode) {
    // Ensure pad is not null/undefined
    try {
      pad.source.stop(); // ⬅️ หยุดทันที
      pad.source.disconnect?.();
      pad.gainNode.disconnect?.();
    } catch (e) {
      console.warn("Error while stopping/disconnecting:", e);
    }

    pad.source = null;
    pad.gainNode = null;
    pad.pendingStopTime = null;

    pad.dataset.playing = "false";
    pad.classList.remove("playing");
  } else {
    console.warn("No valid pad to stop", pad);
  }
}
function stopAllPadsB() {
  const pads = document.querySelectorAll(".padB");
  pads.forEach((pad) => {
    if (pad.dataset.playing === "true") {
      stopPadB(pad);
    }
  });
}

function onSliderChangeB(e) {
  const slider = e.currentTarget; // ดึง element จาก event นี้ชัวร์สุด
  const sliderId = slider.getAttribute("data-id") || "unknown";
  const label = slider.getAttribute("label") || "Slider";
  const category = slider.getAttribute("data-category");
  const volume = parseFloat(e.detail.value) / 100;

  console.log(`[${sliderId}] ${label} changed padB:`, volume);

  // === Update volume container ===
  if (category) {
    const container = document.getElementById(category);

    if (container) {
      const pads = container.querySelectorAll(".padB");

      pads.forEach((pad) => {
        if (pad.dataset.playing === "true" && pad.gainNode) {
          pad.gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        }
      });
    }
  }
}

// === ผูก event แค่ครั้งเดียว ไม่ซ้ำ ===
const slidersB = document.querySelectorAll("midi-slider");
slidersB.forEach((slider) => {
  slider.removeEventListener("slider-change", onSliderChangeB);
  slider.addEventListener("slider-change", onSliderChangeB);
});

// เรียกสร้าง pad ทั้งหมด
soundsB.forEach((sound) => createPadB(sound));
