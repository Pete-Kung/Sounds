
let mode = 'listen';
let currentStream;
let mediaRecorder;
let chunks = [];
let currentRecordingPadIndex = null;
const recordings = {};
const padStates = {}; // เก็บ state การอัดของแต่ละปุ่ม
let currentSource = null; // ตัวแปรสำหรับ audio ที่กำลังเล่นอยู่

const padButtons = Array.from(document.querySelectorAll('.pad-button'));
const micButton = document.getElementById('record-mode');
const listenButton = document.getElementById('listen-mode');

// ปรับสีพื้นหลังให้ตรงกับโหมดเริ่มต้น
listenButton.style.backgroundColor = '#00d8ff';
micButton.style.backgroundColor = '';

micButton.addEventListener('click', () => {
  mode = 'record';
  micButton.style.backgroundColor = '#00d8ff'; // เปลี่ยนสีพื้นหลังเมื่ออยู่ในโหมดอัด
  listenButton.style.backgroundColor = ''; // รีเซ็ตสีพื้นหลังของปุ่มฟังเสียง
});

listenButton.addEventListener('click', () => {
  mode = 'listen';
  listenButton.style.backgroundColor = '#00d8ff'; // เปลี่ยนสีพื้นหลังเมื่ออยู่ในโหมดฟังเสียง
  micButton.style.backgroundColor = ''; // รีเซ็ตสีพื้นหลังของปุ่มอัดเสียง
});

padButtons.forEach((pad, index) => {
  const canvas = pad.querySelector('canvas');
  const originalColor = pad.style.backgroundColor || '#00d8ff';

  pad.addEventListener('click', async () => {
    if (mode === 'record') {
      if (padStates[index]?.recording) {
        // 🟥 กำลังอัดอยู่ → หยุด
        mediaRecorder.stop();
        padStates[index].recording = false;
        pad.style.backgroundColor = originalColor;
      } else {
        try {
          currentStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorder = new MediaRecorder(currentStream);
          chunks = [];
          currentRecordingPadIndex = index;

          mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/webm' });
            const url = URL.createObjectURL(blob);
            recordings[index] = { blob, url };
            drawWaveform(canvas, blob);
            currentStream.getTracks().forEach(track => track.stop());
            alert(`✅ บันทึกเสร็จในปุ่ม Pad #${index + 1}`);
          };

          mediaRecorder.start();
          padStates[index] = { recording: true };
          pad.style.backgroundColor = 'red'; // ขณะกำลังอัด
        } catch (err) {
          console.error(err);
          alert('❌ ไม่สามารถใช้งานไมโครโฟนได้');
        }
      }
    } 
    else if (mode === 'listen') {
  if (recordings[index]) {
    if (currentSource) {
      // หยุดการเล่นเสียงก่อนหน้า
      currentSource.stop();
      currentSource = null;
      pad.style.backgroundColor = originalColor; // เปลี่ยนสีปุ่มกลับเมื่อหยุดเสียง
    } else {
      // เล่นเสียงใหม่
      const audioBuffer = await fetch(recordings[index].url)
        .then(response => response.arrayBuffer())
        .then(data => audioContext.decodeAudioData(data));

      currentSource = audioContext.createBufferSource();
      currentSource.buffer = audioBuffer;
      currentSource.connect(audioContext.destination);
      currentSource.loop = true; // ทำให้เสียงเล่นวนซ้ำ
      currentSource.start(0);
      pad.style.backgroundColor = 'green'; // เปลี่ยนสีปุ่มขณะเล่นเสียง

      currentSource.onended = () => {
        pad.style.backgroundColor = originalColor; // เปลี่ยนสีปุ่มกลับเมื่อเสียงเล่นเสร็จ
        currentSource = null;
      };
    }
  } else {
    alert(`❗ ยังไม่มีเสียงใน Pad #${index + 1}`);
  }
}
  });
});

// ฟังก์ชันการวาด waveform (ไม่เปลี่ยนแปลง)
function drawWaveform(canvas, blob) {
  const ctx = canvas.getContext('2d');
  const reader = new FileReader();

  reader.onloadend = () => {
    const arrayBuffer = reader.result;
    const offlineCtx = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 44100 * 5, 44100); // 5 วินาที
    offlineCtx.decodeAudioData(arrayBuffer, (audioBuffer) => {
      const rawData = audioBuffer.getChannelData(0);
      const samples = canvas.width;
      const blockSize = Math.floor(rawData.length / samples);
      const filteredData = [];

      for (let i = 0; i < samples; i++) {
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(rawData[(i * blockSize) + j]);
        }
        filteredData.push(sum / blockSize);
      }

      // วาด waveform
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ffffff";
      filteredData.forEach((val, i) => {
        const height = val * canvas.height;
        ctx.fillRect(i, canvas.height - height, 1, height);
      });

    }, (err) => {
      console.error('decode error:', err);
    });
  };
  reader.readAsArrayBuffer(blob);
}




