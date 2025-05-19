document.addEventListener("DOMContentLoaded", () => {
  let buttonCount = 0;
  const canvas = document.getElementById("canvasArea");

  function loadButtons() {
    const savedButtons = JSON.parse(localStorage.getItem("buttons") || "[]");
    canvas.innerHTML = ""; // ล้างปุ่มเดิม
    buttonCount = 0; // รีเซ็ตตัวนับปุ่ม

    const rect = canvas.getBoundingClientRect();
    savedButtons.forEach(data => {
      let safeLeft = Math.min(data.left, rect.width - 100);
      let safeTop = Math.min(data.top, rect.height - 50);
      safeLeft = Math.max(safeLeft, 0);
      safeTop = Math.max(safeTop, 0);
      createDraggableButton(safeLeft, safeTop, data.label);
    });
  }

  document.getElementById("addButton").addEventListener("click", () => {
    createDraggableButton(50, 50);
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
      // อัปเดต buttonCount ถ้า label มีหมายเลขใหญ่กว่าเดิม
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
      saveButtons();
    });

    wrapper.appendChild(btn);
    wrapper.appendChild(closeBtn);
    canvas.appendChild(wrapper);

    // ลากได้
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
      if (isDragging) {
        isDragging = false;
        saveButtons();
      }
    });

    btn.addEventListener("touchstart", e => {
      isDragging = true;
      const touch = e.touches[0];
      const rect = wrapper.getBoundingClientRect();
      offsetX = touch.clientX - rect.left;
      offsetY = touch.clientY - rect.top;
    });

    // ปรับเปลี่ยน event touchmove จาก document -> canvas และเพิ่ม preventDefault เพื่อป้องกัน scroll
    canvas.addEventListener(
      "touchmove",
      e => {
        if (!isDragging) return;
        e.preventDefault();
        const touch = e.touches[0];
        move(touch.clientX, touch.clientY);
      },
      { passive: false }
    );

    document.addEventListener("touchend", () => {
      if (isDragging) {
        isDragging = false;
        saveButtons();
      }
    });

    function move(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      let x = clientX - rect.left - offsetX;
      let y = clientY - rect.top - offsetY;

      x = Math.max(0, Math.min(x, rect.width - wrapper.offsetWidth));
      y = Math.max(0, Math.min(y, rect.height - wrapper.offsetHeight));

      wrapper.style.left = x + "px";
      wrapper.style.top = y + "px";
    }

    saveButtons();
  }

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
  }

  document.getElementById("clearAllButton").addEventListener("click", () => {
    localStorage.removeItem("buttons");
    canvas.innerHTML = "";
    buttonCount = 0;
  });

  // โหลดปุ่มและปรับให้ไม่ล้นจอ
  loadButtons();

  // ปรับตำแหน่งใหม่เมื่อเปลี่ยนขนาดหน้าจอ
  window.addEventListener("resize", () => {
    loadButtons();
  });
});
