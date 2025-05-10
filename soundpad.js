
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
    const nextBarTime = audioContext.currentTime; // เล่นทันที ไม่ต้อง sync
    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();

    source.buffer = pad.buffer;
    source.loop = pad.parentElement.id !== "fxContainer"; // fxContainer ไม่ loop

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    pad.source = source;
    pad.gainNode = gainNode;

    gainNode.gain.setValueAtTime(1, nextBarTime);
    source.start(nextBarTime);

    pad.dataset.playing = "true";
    pad.classList.add("active");

    // เผื่อมี pendingStopTime จากครั้งก่อน
    pad.pendingStopTime = null;
    pad._startTime = nextBarTime; // 🕒 เก็บเวลาตอนเริ่ม
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
// สร้าง GainNode หลักที่ใช้รวมเสียงทั้งหมด
const mainGainNode = audioContext.createGain();
mainGainNode.connect(audioContext.destination); // เชื่อมต่อกับ output ของ audioContext
console.log(mainGainNode);

function queueStartPad(pad) {
    const container = document.getElementById(pad.parentElement.id);
    const currentlyPlayingPad = container.querySelector("[data-playing='true']");
    const containerPads = document.querySelectorAll(".padContainer");
    let currentlyPlayingPad2 = null;

    // ตรวจสอบว่าใน containerPads ไหนที่มี pad กำลังเล่น
    containerPads.forEach(containerpad => {
        const padInContainer = containerpad.querySelector(".pad[data-playing='true']");
        if (padInContainer) {
            currentlyPlayingPad2 = padInContainer;
        }
    });

    console.log(currentlyPlayingPad2);

    if (currentlyPlayingPad2 == null) {
        // ✅ ไม่มี pad กำลังเล่น → เล่นทันที
        actuallyQueuePad(pad, false);
    } else {
        if (currentlyPlayingPad !== pad) {
            stopPad(currentlyPlayingPad);

            const waitTime =
                (currentlyPlayingPad?.pendingStopTime || audioContext.currentTime) - audioContext.currentTime;

            setTimeout(() => {
                actuallyQueuePad(pad, true); // เล่นแบบ sync หลัง pad เดิมหยุด
            }, waitTime * 1000);
        } else {
            actuallyQueuePad(pad, true); // คลิกซ้ำ → เล่นต่อ
        }
    }
}

function actuallyQueuePad(pad, sync = true) {
    const currentTime = audioContext.currentTime;

    // คำนวณเวลาเริ่มต้นที่แน่นอน (รอจนกว่าจะถึงจังหวะถัดไป)
    const startTime = sync
        ? Math.ceil(currentTime / barDuration) * barDuration // หาจังหวะถัดไปที่ตรง
        : currentTime;

    const currentBeat = Math.floor((currentTime % barDuration) / beatDuration);

    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();

    source.buffer = pad.buffer;
    source.loop = true;

    source.connect(gainNode);
    gainNode.connect(mainGainNode); // เชื่อมต่อกับ mainGainNode ที่รวมเสียงทั้งหมด

    pad.source = source;
    pad.gainNode = gainNode;

    gainNode.gain.setValueAtTime(1, startTime); // ระดับเสียงที่เวลา startTime
    source.start(startTime); // เริ่มเสียงในช่วงเวลาที่คำนวณไว้

    pad.dataset.playing = "true";
    pad.classList.add("active");

    // คำนวณเวลาที่ pad ถัดไปจะหยุด (สำหรับการเล่นซ้ำ)
    const nextStartTime = Math.ceil(audioContext.currentTime / barDuration) * barDuration;
    pad.pendingStopTime = nextStartTime;

    // ทำให้ beat ปัจจุบันแสดงสถานะ pending (ระหว่างรอ)
    if (sync) {
        beatEls[currentBeat].classList.add("pending");
        setTimeout(() => {
            beatEls[currentBeat].classList.remove("pending");
        }, (nextStartTime - currentTime) * 1000); // ใช้เวลารอที่คำนวณใหม่
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



