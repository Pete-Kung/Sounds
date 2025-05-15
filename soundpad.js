// สร้าง GainNode หลักที่ใช้รวมเสียงทั้งหมด
const mainGainNode = audioContext.createGain();
mainGainNode.connect(audioContext.destination); // เชื่อมต่อกับ output ของ audioContext
function createPad(sound) {
    const pad = document.createElement("div");
    pad.classList.add("pad");
    pad.innerText = sound.name;
    pad.dataset.playing = "false";
    pad.buffer = null;
    pad.source = null;

    loadBuffer(`./sounds/${sound.file}`).then((buffer) => {
        pad.buffer = buffer;
    });

    const container = document.getElementById(sound.container);

    if (sound.container === "fxContainer") {
        // แบบ "กดค้างเพื่อเล่น loop / ปล่อยเพื่อหยุด"
        pad.addEventListener("mousedown", () => {
            if (pad.dataset.playing !== "true") {
                queueStartPadFx(pad);
            }
        });
        pad.addEventListener("mouseup", () => {
            if (pad.dataset.playing === "true") {
                stopPadFx(pad);
            }
        });

        // รองรับมือถือ
        pad.addEventListener("touchstart", () => {
            if (pad.dataset.playing !== "true") {
                queueStartPadFx(pad);
            }
        });
        pad.addEventListener("touchend", () => {
            if (pad.dataset.playing === "true") {
                stopPadFx(pad);
            }
        });
    } else {
        // ปุ่มอื่นใช้ click toggle ปกติ
        pad.addEventListener("click", () => {
            const currentlyPlayingPad = container.querySelector(".pad[data-playing='true']");
            if (currentlyPlayingPad && currentlyPlayingPad !== pad) {
                stopPad(currentlyPlayingPad);
            }

            if (pad.dataset.playing === "true") {
                stopPad(pad);
            } else {
                queueStartPad(pad);
            }
        });
    }

    container.appendChild(pad);
}

sounds.forEach(createPad);

function queueStartPadFx(pad) {
    const nextBarTime = audioContext.currentTime;

    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();

    source.buffer = pad.buffer;
    source.loop = pad.parentElement.id !== "fxContainer"; // ถ้าไม่ใช่ fxContainer ให้ loop

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.connect(mainGainNode);

    pad.source = source;
    pad.gainNode = gainNode;

    gainNode.gain.setValueAtTime(1, nextBarTime);
    source.start(nextBarTime);

    pad.dataset.playing = "true";
    pad.classList.add("active");

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
            pad.classList.remove("active");
        }

        // ลบ event listener หลังใช้
        window.removeEventListener("mouseup", stopPad);
        window.removeEventListener("touchend", stopPad);
    };

    // ⌛ รอจนกว่าผู้ใช้จะปล่อย
    window.addEventListener("mouseup", stopPad);
    window.addEventListener("touchend", stopPad);
}

function stopPadFx(pad) {
    if (pad.source && pad.gainNode) {
        const now = audioContext.currentTime;
        const holdDuration = now - (pad._startTime || now); // 🕒 คำนวณกดค้างนานแค่ไหน

        pad.gainNode.gain.setValueAtTime(pad.gainNode.gain.value, now);
        pad.gainNode.gain.linearRampToValueAtTime(0, now + 0.05); // fade out

        pad.source.stop(now + 0.05);
        pad.pendingStopTime = now + 0.05;
        pad.dataset.playing = "false";
        pad.classList.remove("active");

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
            pad.classList.remove("active");

        }, 100); // cleanup หลังเสียงหยุด
    }
}


function queueStartPad(pad) {
    const container = document.getElementById(pad.parentElement.id);
    const currentlyPlayingPad = container.querySelector("[data-playing='true']");
    const containerPads = document.querySelectorAll(".padContainer");
    let currentlyPlayingPad2 = null;

    containerPads.forEach(containerpad => {
        const padInContainer = containerpad.querySelector(".pad[data-playing='true']");
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
            const waitTime = (currentlyPlayingPad?.pendingStopTime || lockedTime) - lockedTime;
            setTimeout(() => {
                actuallyQueuePad(pad, true, lockedTime, syncedStartTime);
            }, waitTime * 1000);
        } else {
            actuallyQueuePad(pad, true, lockedTime, syncedStartTime);
        }
    }
}



function actuallyQueuePad(pad, sync = true, lockedTime = audioContext.currentTime, startTime = null) {
    const actualStartTime = sync
        ? (startTime ?? Math.ceil(lockedTime / barDuration) * barDuration)
        : lockedTime; // ถ้าไม่ sync → เริ่มทันที

    const currentBeat = Math.floor((lockedTime % barDuration) / beatDuration);

    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();

    console.log(`[PAD START] startTime: ${actualStartTime.toFixed(3)}, now: ${lockedTime.toFixed(3)}, diff: ${(actualStartTime - lockedTime).toFixed(3)}`);

    source.buffer = pad.buffer;
    source.loop = true;

    source.connect(gainNode);
    gainNode.connect(mainGainNode);

    pad.source = source;
    pad.gainNode = gainNode;

    gainNode.gain.setValueAtTime(1, actualStartTime);
    source.start(actualStartTime);

    pad.dataset.playing = "true";
    pad.classList.add("active");

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
    if (pad && pad.source && pad.gainNode) { // Ensure pad is not null/undefined
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
        pad.classList.remove("active");
    } else {
        console.warn("No valid pad to stop", pad);
    }
}

// สร้าง AnalyserNode สำหรับดึงข้อมูลเสียง
const analyser = audioContext.createAnalyser();
mainGainNode.connect(analyser); // เชื่อมต่อกับ mainGainNode เพื่อดึงข้อมูล

analyser.fftSize = 256; // ขนาด FFT
const bufferLength = analyser.frequencyBinCount; // จำนวนข้อมูลที่ได้
const dataArray = new Uint8Array(bufferLength);

const canvas = document.getElementById("waveformCanvas");
const canvasCtx = canvas.getContext("2d");

function draw() {
    analyser.getByteTimeDomainData(dataArray); // รับข้อมูลเสียงจาก AnalyserNode

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height); // ลบภาพเดิม
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "rgb(0, 255, 0)";
    canvasCtx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();

    requestAnimationFrame(draw); // เรียกใช้งาน draw ซ้ำในทุกๆ เฟรม
}

function startWaveAnimation() {
    draw(); // เริ่มการวาดกราฟคลื่นเสียง
}

// เริ่มต้นการแสดงผล
startWaveAnimation();



