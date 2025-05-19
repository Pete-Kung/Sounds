 // 🟩 เพิ่มการทำงานเมื่อโหลดเสร็จ
    document.addEventListener("DOMContentLoaded", () => {
      let buttonCount = 0;
      const canvas = document.getElementById("canvasArea");

      // 🟧 โหลดจาก localStorage (ใช้ตอน refresh แล้วโหลด)
      function loadButtons() {
        const savedButtons = JSON.parse(localStorage.getItem("buttons") || "[]");
        canvas.innerHTML = "";
        buttonCount = 0;

        const rect = canvas.getBoundingClientRect();
        savedButtons.forEach(data => {
          let safeLeft = Math.min(data.left, rect.width - 100);
          let safeTop = Math.min(data.top, rect.height - 50);
          safeLeft = Math.max(safeLeft, 0);
          safeTop = Math.max(safeTop, 0);
          createDraggableButton(safeLeft, safeTop, data.label);
        });
      }

      // 🟧 เพิ่มปุ่มใหม่
      document.getElementById("addButton").addEventListener("click", () => {
        createDraggableButton(50, 50);
      });

      // 🟧 ปุ่ม save ที่ใช้บันทึกจริง
      document.getElementById("saveButton").addEventListener("click", () => {
        saveButtons(); // 🟩 บันทึกตอนกดเท่านั้น
      });

      function createDraggableButton(left, top, label) {
        const wrapper = document.createElement("div");
        wrapper.style.position = "absolute";
        wrapper.style.left = left + "px";
        wrapper.style.top = top + "px";

        const btn = document.createElement("button");
        btn.className = "draggable-button";

        if (label) {
          btn.innerText = label;
          const numMatch = label.match(/\d+/);
          if (numMatch) {
            const num = parseInt(numMatch[0]);
            if (num > buttonCount) buttonCount = num;
          }
        } else {
          btn.innerText = "ปุ่ม " + (++buttonCount);
        }

        const closeBtn = document.createElement("span");
        closeBtn.innerText = "❌";
        closeBtn.style.position = "absolute";
        closeBtn.style.top = "-10px";
        closeBtn.style.right = "-10px";
        closeBtn.style.background = "red";
        closeBtn.style.color = "white";
        closeBtn.style.borderRadius = "50%";
        closeBtn.style.padding = "2px 6px";
        closeBtn.style.cursor = "pointer";
        closeBtn.style.fontSize = "12px";

        closeBtn.addEventListener("click", () => {
          wrapper.remove();
        });

        wrapper.appendChild(btn);
        wrapper.appendChild(closeBtn);
        canvas.appendChild(wrapper);

        // 🟧 ฟังก์ชันลาก
        let isDragging = false;
        let offsetX = 0,
            offsetY = 0;

        btn.addEventListener("mousedown", e => {
          isDragging = true;
          offsetX = e.offsetX;
          offsetY = e.offsetY;
        });

        document.addEventListener("mousemove", e => {
          if (!isDragging) return;
          move(e.clientX, e.clientY);
        });

        document.addEventListener("mouseup", () => {
          isDragging = false;
        });

        btn.addEventListener("touchstart", e => {
          isDragging = true;
          const touch = e.touches[0];
          const rect = wrapper.getBoundingClientRect();
          offsetX = touch.clientX - rect.left;
          offsetY = touch.clientY - rect.top;
        });

        canvas.addEventListener("touchmove", e => {
          if (!isDragging) return;
          e.preventDefault();
          const touch = e.touches[0];
          move(touch.clientX, touch.clientY);
        }, { passive: false });

        document.addEventListener("touchend", () => {
          isDragging = false;
        });

        // 🟧 move ปรับขอบเขต + ตรวจชนกัน
     function move(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  let x = clientX - rect.left - offsetX;
  let y = clientY - rect.top - offsetY;

  x = Math.max(0, Math.min(x, rect.width - wrapper.offsetWidth));
  y = Math.max(0, Math.min(y, rect.height - wrapper.offsetHeight));

  // ⛔ ก่อนเปลี่ยนจริง ลองดูว่าชนปุ่มอื่นไหม
  const futureRect = {
    left: x,
    top: y,
    right: x + wrapper.offsetWidth,
    bottom: y + wrapper.offsetHeight,
  };

  const others = Array.from(canvas.children).filter(el => el !== wrapper);
  const isOverlapping = others.some(other => {
    const r2 = other.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const r = {
      left: r2.left - canvasRect.left,
      top: r2.top - canvasRect.top,
      right: r2.right - canvasRect.left,
      bottom: r2.bottom - canvasRect.top,
    };
    return (
      futureRect.left < r.right &&
      futureRect.right > r.left &&
      futureRect.top < r.bottom &&
      futureRect.bottom > r.top
    );
  });

  if (!isOverlapping) {
    // ✅ ไม่ชนใคร → ยอมให้เลื่อน
    wrapper.style.left = x + "px";
    wrapper.style.top = y + "px";
    wrapper.style.border = "";
  } else {
    // ❌ ชน → ไม่ให้เลื่อน
    wrapper.style.border = "2px solid red";
  }
}

      }

      // 🟧 บันทึกทุกปุ่มใน canvas
      function saveButtons() {
        const buttons = Array.from(canvas.querySelectorAll("div")).map(wrapper => {
          const btn = wrapper.querySelector(".draggable-button");
          return {
            left: parseInt(wrapper.style.left),
            top: parseInt(wrapper.style.top),
            label: btn.innerText,
          };
        });
        localStorage.setItem("buttons", JSON.stringify(buttons));
        alert("✅ บันทึกตำแหน่งเรียบร้อยแล้ว!");
      }

      document.getElementById("clearAllButton").addEventListener("click", () => {
        localStorage.removeItem("buttons");
        canvas.innerHTML = "";
        buttonCount = 0;
      });

      loadButtons();
    });