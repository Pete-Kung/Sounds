// === CONFIGURABLE SECTION ===
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

const soundsC = [
  {
    name: "Drum 1",
    file: "JOW_126_Clubbeat1.wav",
    container: "padC-1",
  },
  {
    name: "Drum 2",
    file: "JOW_126_Clubbeat2.wav",
    container: "padC-1",
  },
  {
    name: "Drum 3",
    file: "JOW_126_ClubbeatKickClap1.wav",
    container: "padC-1",
  },
  {
    name: "Drum 4",
    file: "JOW_126_ClubbeatKickClap2.wav",
    container: "padC-1",
  },

  {
    name: "Bass 1",
    file: "JOW_126_G_BasslineAcid3.wav",
    container: "padC-2",
  },
  {
    name: "Bass 2",
    file: "JOW_126_G_BasslineGangster.wav",
    container: "padC-2",
  },
  {
    name: "Bass 3",
    file: "JOW_126_G_BasslineJX.wav",
    container: "padC-2",
  },
  {
    name: "Bass 4",
    file: "JOW_126_G_BasslineRipDong.wav",
    container: "padC-2",
  },

  {
    name: "Pad 1",
    file: "A71_Scrt-01_eLAB_Scratcher.wav",
    container: "padC-3",
  },
  {
    name: "Pad 2",
    file: "A71_Scrt-02_eLAB_Scratcher.wav",
    container: "padC-3",
  },
  {
    name: "Pad 3",
    file: "A71_Scrt-03_eLAB_Scratcher.wav",
    container: "padC-3",
  },
  {
    name: "Pad 4",
    file: "A71_Scrt-04_eLAB_Scratcher.wav",
    container: "padC-3",
  },

  {
    name: "Synth 1",
    file: "ATE2 Synth Loop - 024 - 136 BPM - Gm.wav",
    container: "padC-4",
  },
  {
    name: "Synth 2",
    file: "ATE2 Synth Loop - 025 - 136 BPM - Cm.wav",
    container: "padC-4",
  },
  {
    name: "Synth 3",
    file: "ATE2 Synth Loop - 026 - 136 BPM - Gm.wav",
    container: "padC-4",
  },
  {
    name: "Synth 4",
    file: "ATE2 Synth Loop - 027 - 136 BPM - Gm.wav",
    container: "padC-4",
  },

  { name: "FX 1", file: "US_DTH_FX_Report.wav", container: "padC-5" },
  { name: "FX 2", file: "US_DTH_FX_Republic.wav", container: "padC-5" },
  { name: "FX 3", file: "Fx_130_03.wav", container: "padC-5" },
  { name: "FX 4", file: "Fx_130_04.wav", container: "padC-5" },
];

function createSoundSet({
  sounds,
  padPrefix,
  beatClass,
  categoryClass,
  sliderSelector,
  audioContext,
  bpm = 120,
  btnStopAll,
}) {
  const beatEls = document.querySelectorAll(`.${beatClass}`);
  const mainGainNode = audioContext.createGain();
  mainGainNode.connect(audioContext.destination);

  let beatDuration = 60 / bpm;
  let beatLoopTimeoutId;
  let beatsPerBar = 4;
  let currentBeat = 0;

  let barDuration = beatDuration * beatsPerBar;

  function beatLoop() {
    beatEls.forEach((el, i) => {
      el.classList.toggle("active", i === currentBeat);
    });
    currentBeat = (currentBeat + 1) % beatsPerBar;
    beatLoopTimeoutId = setTimeout(beatLoop, beatDuration * 1000);
  }

  function bpmUpdate(newBpm) {
    console.log("newBpm", newBpm);

    beatDuration = 60 / newBpm;
    barDuration = beatDuration * beatsPerBar;
    document.querySelectorAll(`.${padPrefix}`).forEach((pad) => {
      if (pad.dataset.playing === "true" && pad.source) {
        pad.source.playbackRate.value = newBpm / 120;
      }
    });
    clearTimeout(beatLoopTimeoutId);
    beatLoop();
  }

  const confirmBpm = document.getElementById("confirmBPM");
  const bpmValue = document.getElementById("bpmSlider");

  confirmBpm.addEventListener("click", () => {
    bpmUpdate(parseInt(bpmValue.value));
  });

    document.querySelectorAll(`.${categoryClass}`).forEach((el) => {
      el.addEventListener("click", () => bpmUpdate(parseInt(bpmValue.value)));
    });

  async function loadBuffer(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
  }

  function createPad(sound) {
    const pad = document.createElement("div");
    pad.classList.add(padPrefix);
    pad.innerText = sound.name;
    pad.dataset.playing = "false";
    pad.buffer = null;
    pad.source = null;

    loadBuffer(sound.url).then((buffer) => {
      pad.buffer = buffer;
    });

    const container = document.getElementById(sound.container);

    if (sound.container.endsWith("-5")) {
      pad.addEventListener("mousedown", () => {
        if (pad.dataset.playing !== "true") startFxPad(pad);
      });
      pad.addEventListener("mouseup", () => {
        if (pad.dataset.playing === "true") stopFxPad(pad);
      });
      pad.addEventListener("touchstart", () => {
        if (pad.dataset.playing !== "true") startFxPad(pad);
      });
      pad.addEventListener("touchend", () => {
        if (pad.dataset.playing === "true") stopFxPad(pad);
      });
    } else {
      pad.addEventListener("click", () => toggleLoopPad(pad));
    }

    container.appendChild(pad);
  }

  function startFxPad(pad) {
    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();

    source.buffer = pad.buffer;
    source.loop = false;
    source.connect(gainNode);
    gainNode.connect(mainGainNode);

    pad.source = source;
    pad.gainNode = gainNode;

    gainNode.gain.setValueAtTime(1, audioContext.currentTime);
    source.start(audioContext.currentTime);

    pad.dataset.playing = "true";
    pad.classList.add("playing");

    const stop = () => {
      stopFxPad(pad);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchend", stop);
    };
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchend", stop);
  }

  function stopFxPad(pad) {
    if (pad.source && pad.gainNode) {
      const now = audioContext.currentTime;
      pad.gainNode.gain.linearRampToValueAtTime(0, now + 0.05);
      pad.source.stop(now + 0.05);

      setTimeout(() => {
        pad.source.disconnect();
        pad.gainNode.disconnect();
        pad.source = null;
        pad.gainNode = null;
        pad.dataset.playing = "false";
        pad.classList.remove("playing");
      }, 100);
    }
  }

  function toggleLoopPad(pad) {
    const container = document.getElementById(pad.parentElement.id);
    const currentlyPlaying = container.querySelector(
      `.${padPrefix}[data-playing='true']`
    );

    if (currentlyPlaying && currentlyPlaying !== pad) stopPad(currentlyPlaying);

    if (pad.dataset.playing === "true") {
      stopPad(pad);
    } else {
      queueStartPad(pad);
    }
  }

  function queueStartPad(pad) {
    const container = document.getElementById(pad.parentElement.id);

    console.log(container);

    const currentlyPlayingPad = container.querySelector(
      "[data-playing='true']"
    );
    const containerPads = document.querySelectorAll(".padContainer");
    let currentlyPlayingPad2 = null;

    containerPads.forEach((containerpad) => {
      const padInContainer = containerpad.querySelector(
        `.${padPrefix}[data-playing='true']`
      );
      if (padInContainer) {
        currentlyPlayingPad2 = padInContainer;
      }
    });

    const lockedTime = audioContext.currentTime;
    const syncedStartTime = Math.ceil(lockedTime / barDuration) * barDuration;

    if (currentlyPlayingPad2 == null) {
      // ✅ ไม่มี pad เล่นอยู่ → เริ่มทันทีแบบไม่ต้อง sync
      actuallyQueuePad(pad, false, lockedTime, lockedTime); // sync = false
    } else {
      if (currentlyPlayingPad !== pad) {
        stopPad(currentlyPlayingPad);
        const waitTime =
          (currentlyPlayingPad?.pendingStopTime || lockedTime) - lockedTime;
        setTimeout(() => {
          actuallyQueuePad(pad, true, lockedTime, syncedStartTime);
        }, waitTime * 1000);
      } else {
        actuallyQueuePad(pad, true, lockedTime, syncedStartTime);
      }
    }
  }

  function actuallyQueuePad(
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

  function stopPad(pad) {
    if (pad && pad.source && pad.gainNode) {
      try {
        pad.source.stop();
        pad.source.disconnect();
        pad.gainNode.disconnect();
      } catch (e) {
        console.warn("Error stopping pad", e);
      }
      pad.source = null;
      pad.gainNode = null;
      pad.dataset.playing = "false";
      pad.classList.remove("playing");
    }
  }

  const stopAllButton = document.getElementById(btnStopAll);
  stopAllButton?.addEventListener("click", () => {
    stopAllPads(padPrefix);
  });
  function stopAllPads() {
    document
      .querySelectorAll(`.${padPrefix}[data-playing='true']`)
      .forEach(stopPad);
  }

  function onSliderChange(e) {
    const slider = e.currentTarget;
    const category = slider.getAttribute("data-category");
    const volume = parseFloat(e.detail.value) / 100;

    const container = document.getElementById(category);
    if (container) {
      const pads = container.querySelectorAll(`.${padPrefix}`);
      pads.forEach((pad) => {
        if (pad.dataset.playing === "true" && pad.gainNode) {
          pad.gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        }
      });
    }
  }

  document.querySelectorAll(sliderSelector).forEach((slider) => {
    slider.removeEventListener("slider-change", onSliderChange);
    slider.addEventListener("slider-change", onSliderChange);
  });

  beatLoop();

  sounds.forEach((sound) => createPad(sound));
}

// === USAGE EXAMPLE ===

window.addEventListener("DOMContentLoaded", () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const padB = createSoundSet({
    sounds: soundsB.map((s) => ({ ...s, url: `./sounds/Loop2/${s.file}` })),
    padPrefix: "padB",
    beatClass: "beatB",
    categoryClass: "categoryB",
    sliderSelector: "midi-slider",
    audioContext,
    bpm: 120,
    btnStopAll: "stopAllBtnB",
  });

  const padC = createSoundSet({
    sounds: soundsC.map((s) => ({ ...s, url: `./sounds/Loop3/${s.file}` })),
    padPrefix: "padC",
    beatClass: "beatC",
    categoryClass: "categoryC",
    sliderSelector: "midi-slider",
    audioContext,
    bpm: 120,
    btnStopAll: "stopAllBtnC",
  });
});
