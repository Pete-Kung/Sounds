# Tone.js Clip Loop Pad 开发完整指南

**Complete Development Guide for Tone.js Clip Loop Pad**

---

## 1. 基础：多个 Loop 的同步播放 / Basic: Synchronized Playback of Multiple Loops

### 1.1 核心实现原理 / Core Implementation Principle

Tone.js 使用 **Transport** 作为全局时钟源，所有音频事件基于此时间轴同步。
**Tone.js uses the Transport as the global clock source for synchronized audio events.**

javascript

复制

```
// 初始化音频上下文 / Initialize Audio Context  
await Tone.start(); // 必须用户交互后调用 / Must be called after user interaction  

// 创建多个 Loop 播放器 / Create Multiple Loop Players  
const drumLoop = new Tone.Player("drum.wav").toDestination();  
const bassLoop = new Tone.Player("bass.wav").toDestination();  

// 启用循环并同步到 Transport / Enable Looping and Sync to Transport  
drumLoop.loop = true;  
bassLoop.loop = true;  
drumLoop.sync().start(0); // 从 Transport 时间轴起点开始 / Start from Transport's beginning  
bassLoop.sync().start(0);  

// 设置全局 BPM / Set Global BPM  
Tone.Transport.bpm.value = 120;  

// 启动 Transport / Start Transport  
document.getElementById("start-btn").addEventListener("click", async () => {  
  await Tone.start();  
  Tone.Transport.start();  
});
```

### 1.2 关键技术点 / Key Technical Points

* `sync()` 方法将播放器绑定到 Transport 时间轴
  **`sync()` binds players to the Transport timeline.**
* `start(0)` 中的 `0` 表示立即开始（在 Transport 时间轴上）
  **`start(0)` starts playback immediately on the Transport timeline.**

---

## 2. 动态控制 Loop 的开关 / Dynamic Loop Toggling

### 2.1 交互式控制实现 / Interactive Control Implementation

javascript

复制

```
// 状态管理对象 / State Management Object  
const loopStates = {  
  drum: false,  
  bass: false  
};  

// 量化开关函数 / Quantized Toggle Function  
function toggleLoop(loopName) {  
  const loop = loopName === "drum" ? drumLoop : bassLoop;  

  if (loopStates[loopName]) {  
    // 在下一个 1/4 拍停止 / Stop at next quarter note  
    const stopTime = Tone.Transport.nextSubdivision("4n");  
    loop.stop(stopTime);  
    loopStates[loopName] = false;  
  } else {  
    // 在下一个 1/16 拍启动 / Start at next 16th note  
    const startTime = Tone.Transport.nextSubdivision("16n");  
    loop.start(startTime);  
    loopStates[loopName] = true;  
  }  
}  

// 绑定 UI 按钮 / Bind UI Buttons  
document.getElementById("drum-btn").addEventListener("click", () => toggleLoop("drum"));  
document.getElementById("bass-btn").addEventListener("click", () => toggleLoop("bass"));
```

---

## 3. 变速（BPM 变化） / Tempo Control (BPM Changes)

### 3.1 BPM 动态调整 / Dynamic BPM Adjustment

javascript

复制

```
// BPM 范围限制 / BPM Range Constraints  
const MIN_BPM = 40, MAX_BPM = 240;  

// 滑块控制 / Slider Control  
const bpmSlider = document.getElementById("bpm-slider");  
bpmSlider.min = MIN_BPM;  
bpmSlider.max = MAX_BPM;  
bpmSlider.value = Tone.Transport.bpm.value;  

bpmSlider.addEventListener("input", (e) => {  
  // 平滑过渡（0.5秒内完成变化） / Smooth transition (over 0.5 seconds)  
  Tone.Transport.bpm.rampTo(parseInt(e.target.value), 0.5);  
});  

// Tap Tempo 功能实现 / Tap Tempo Implementation  
let tapTimes = [];  
document.getElementById("tap-btn").addEventListener("click", () => {  
  const now = Tone.now();  
  tapTimes.push(now);  
  if (tapTimes.length > 2) tapTimes.shift();  

  if (tapTimes.length === 2) {  
    const interval = tapTimes[1] - tapTimes[0];  
    const newBpm = Math.round(60 / interval);  
    Tone.Transport.bpm.rampTo(Math.min(MAX_BPM, Math.max(MIN_BPM, newBpm)), 0.2);  
  }  
});
```

---

## 4. 自动量化（Quantization） / Automatic Quantization

### 4.1 实现思路 / Implementation Approach

1. 计算当前 Transport 位置 / Calculate current Transport position
2. 确定最近的量化点（如 1/4 拍） / Find the nearest quantization point (e.g., quarter note)
3. 调度音频在量化点触发 / Schedule audio to trigger at the quantization point

### 4.2 完整示例 / Complete Example

javascript

复制

```
function quantizedTrigger(loop, subdivision = "4n") {  
  const nextBeat = Tone.Transport.nextSubdivision(subdivision);  
  loop.start(nextBeat);  
  return nextBeat - Tone.Transport.seconds; // 返回剩余时间 / Return remaining time  
}  

// 使用示例 / Usage Example  
document.getElementById("quantize-btn").addEventListener("click", () => {  
  const timeRemaining = quantizedTrigger(drumLoop, "8n");  
  console.log(`将在 ${timeRemaining.toFixed(2)} 秒后触发`);  
});
```

### 4.3 可变拍速（Swing & Humanize） / Variable Timing (Swing & Humanization)

javascript

复制

```
// Swing 设置（0-1） / Swing Setting (0-1)  
Tone.Transport.swing = 0.6; // 60% 的摇摆强度 / 60% swing intensity  

// 人性化随机偏移 / Humanization with Random Offset  
function humanizedStart(loop) {  
  const baseTime = Tone.Transport.nextSubdivision("8n");  
  const randomOffset = Math.random() * 0.03 - 0.015; // ±15ms 随机偏移 / ±15ms random offset  
  loop.start(baseTime + randomOffset);  
}
```

---

## 5. 音效控制（Filter, Delay, Reverb, Gate） / Effects Control

### 5.1 初始化音效 / Initialize Effects

javascript

复制

```
// 创建效果器实例 / Create Effect Instances  
const filter = new Tone.Filter(800, "lowpass").toDestination();  
const delay = new Tone.PingPongDelay({  
  delayTime: "8n",  
  feedback: 0.4  
}).toDestination();  
const reverb = new Tone.Reverb(2.5).toDestination();  
const gate = new Tone.Gate(-30, 0.1, 0.3).toDestination();  

// 初始化湿信号为 0（默认关闭） / Initialize wet signal to 0 (disabled by default)  
filter.wet.value = 0;  
delay.wet.value = 0;
```

### 5.2 让 Loop 通过音效处理 / Route Loops Through Effects

javascript

复制

```
// 连接 Drum Loop 到所有效果器 / Connect Drum Loop to All Effects  
drumLoop.chain(filter, delay, reverb, gate, Tone.Destination);  

// 连接 Bass Loop 仅到滤波器 / Connect Bass Loop Only to Filter  
bassLoop.connect(filter);
```

### 5.3 按钮控制音效开关 / Button Toggle for Effects

javascript

复制

```
document.getElementById("filter-toggle").addEventListener("click", () => {  
  filter.wet.value = filter.wet.value > 0 ? 0 : 1; // 切换滤波器 / Toggle filter  
});  

document.getElementById("delay-toggle").addEventListener("click", () => {  
  delay.wet.value = delay.wet.value > 0 ? 0 : 0.4; // 设置 40% 混合度 / Set 40% mix  
});
```

### 5.4 滑块调整效果强度 / Slider Control for Effect Parameters

html

复制

```
<!-- HTML 控件 / HTML Controls -->
<input type="range" id="filter-freq" min="20" max="20000" value="800">  
<input type="range" id="delay-feedback" min="0" max="1" step="0.1" value="0.4">
```

运行 HTML

javascript

复制

```
// 滤波器频率控制 / Filter Frequency Control  
document.getElementById("filter-freq").addEventListener("input", (e) => {  
  filter.frequency.value = e.target.value;  
});  

// 延迟反馈控制 / Delay Feedback Control  
document.getElementById("delay-feedback").addEventListener("input", (e) => {  
  delay.feedback.value = parseFloat(e.target.value);  
});
```

---

## 6. Tone.js 效果处理详解 / Tone.js Effects Deep Dive

### 6.1 常见音效列表 / Common Effects List

| 效果 / Effect               | 类名 / Class             | 关键参数 / Key Parameters            |
| ----------------------------- | -------------------------- | -------------------------------------- |
| 低通滤波器 / Lowpass Filter | `Tone.Filter`        | `frequency`, `Q`, `type` |
| 乒乓延迟 / PingPong Delay   | `Tone.PingPongDelay` | `delayTime`, `feedback`      |
| 混响 / Reverb               | `Tone.Reverb`        | `decay`, `preDelay`          |
| 噪声门 / Noise Gate         | `Tone.Gate`          | `threshold`, `attack`        |

### 6.2 创建和使用效果示例 / Effect Creation Example

javascript

复制

```
// 创建失真效果 / Create Distortion Effect  
const distortion = new Tone.Distortion({  
  distortion: 0.4, // 失真强度（0-1） / Distortion intensity (0-1)  
  oversample: "4x" // 过采样模式 / Oversampling mode  
}).toDestination();  

// 连接麦克风输入到失真效果 / Connect Mic Input to Distortion  
const mic = new Tone.UserMedia().connect(distortion);  
mic.open(); // 请求麦克风权限 / Request microphone access
```

### 6.3 参数控制示例 / Parameter Control Example

javascript

复制

```
// 实时调整混响衰减时间 / Real-time Reverb Decay Adjustment  
document.getElementById("reverb-decay").addEventListener("input", (e) => {  
  reverb.decay = parseFloat(e.target.value);  
});
```

### 6.4 动态开关效果 / Dynamic Effect Toggling

javascript

复制

```
// 按钮切换混响效果 / Button to Toggle Reverb  
let isReverbOn = false;  
document.getElementById("reverb-btn").addEventListener("click", () => {  
  isReverbOn = !isReverbOn;  
  reverb.wet.value = isReverbOn ? 0.6 : 0;  
  this.style.backgroundColor = isReverbOn ? "#4CAF50" : "#f44336";  
});
```

---

## 7. 多个 Loop 共享效果 / Shared Effects Across Multiple Loops

### 7.1 使用效果总线 / Using Effect Bus

javascript

复制

```
// 创建全局混响总线 / Create Global Reverb Bus  
const globalReverb = new Tone.Reverb(3).toDestination();  

// 所有 Loop 连接到混响总线 / Connect All Loops to Reverb Bus  
drumLoop.connect(globalReverb);  
bassLoop.connect(globalReverb);  
synthLoop.connect(globalReverb);  

// 独立控制干湿比 / Independent Dry/Wet Control  
const reverbSend = new Tone.Gain(0.5);  
drumLoop.chain(reverbSend, globalReverb);
```

---

## 8. 官方示例参考 / Official Examples

### 8.1 推荐示例 / Recommended Demos

1. [Loop 播放器](https://tonejs.github.io/examples/loopPlayer)
   ​**关键功能**​: 可视化波形、动态 BPM 调整
   ​**Key Features**​: Visual waveform, dynamic BPM control
2. [效果链](https://tonejs.github.io/examples/effects)
   ​**关键功能**​: 串联 6 种效果、实时参数映射
   ​**Key Features**​: 6-effect chain, real-time parameter mapping
3. [步进音序器](https://tonejs.github.io/examples/stepSequencer)
   ​**关键功能**​: 16-step 编程、概率触发
   ​**Key Features**​: 16-step programming, probabilistic triggers
   4**官方示例（在线 Demo）![🔗](https://lh7-rt.googleusercontent.com/docsz/AD_4nXeVWrK_Me9zhqT_KSOT9h4Kk-6FOAFTj3EAMephMrIyi5VBGEHpAlPd7898P5xH8Wl_dTYWfO8nn5-46iCVREkDTwjxbW8U2UXAw31cxNzfjtxsobPRRntzo4zRPfF8QAcB0lof?key=4vIXEOC2URBqKALpl0K0iko7) [Tone.js Examples](https://tonejs.github.io/examples/)**

---

## ****Tone.js Clip Loop Pad 开发指南检查与完善说明****

### **1. 核心功能覆盖检查**

#### **1.1 多个 Loop 同步播放**

* ​**现状**​：提供 Transport 同步和 `sync()` 方法，代码示例完整。
* ​**改进点**​：
  * 补充 **音频预加载** 示例，避免播放延迟：
    javascript
    
    复制
    
    ```
    // 预加载所有音频文件
    const preload = async () => {
      await Tone.Player.loadBuffers({
        drum: "drum.wav",
        bass: "bass.wav"
      });
      console.log("所有音频加载完成");
    };
    preload();
    ```
  * 明确 **用户交互后初始化** 的必要性：
    javascript
    
    复制
    
    ```
    document.getElementById("start-btn").addEventListener("click", async () => {
      await Tone.start(); // 必须用户点击后调用
      Tone.Transport.start();
    });
    ```

#### **1.2 动态控制 Loop 开关**

* ​**现状**​：状态管理和量化触发逻辑完整。
* ​**改进点**​：
  * 增加 ​**防抖处理**​，避免快速点击导致状态冲突：
    javascript
    
    复制
    
    ```
    let isProcessing = false;
    function toggleLoop(loopName) {
      if (isProcessing) return;
      isProcessing = true;
      // ...原有逻辑
      setTimeout(() => isProcessing = false, 50);
    }
    ```
  * 补充 **UI 状态反馈** 的完整实现：
    javascript
    
    复制
    
    ```
    function updateUI(loopName) {
      const btn = document.getElementById(`${loopName}-btn`);
      btn.classList.toggle("active", loopStates[loopName]);
      btn.style.backgroundColor = loopStates[loopName] ? "#4CAF50" : "#f44336";
    }
    ```

---

### **2. 进阶功能优化**

#### **2.1 BPM 调整**

* ​**现状**​：支持滑块和 Tap Tempo，代码正确。
* ​**改进点**​：
  * 添加 ​**BPM 显示实时更新**​：
    javascript
    
    复制
    
    ```
    Tone.Transport.bpm.signal.value = 120; // 初始值
    Tone.Transport.bpm.signal.addEventListener("change", (value) => {
      document.getElementById("bpm-display").textContent = value.toFixed(0);
    });
    ```
  * 限制 ​**BPM 输入范围**​，防止无效值：
    javascript
    
    复制
    
    ```
    bpmSlider.addEventListener("input", (e) => {
      let value = Math.min(MAX_BPM, Math.max(MIN_BPM, e.target.value));
      e.target.value = value;
    });
    ```

#### **2.2 自动量化**

* ​**现状**​：量化触发逻辑清晰。
* ​**改进点**​：
  * 支持 ​**多种量化精度**​（如 1/4、1/8、1/16 拍）：
    javascript
    
    复制
    
    ```
    const quantizeOptions = ["4n", "8n", "16n"];
    function setQuantization(subdivision) {
      currentSubdivision = subdivision;
    }
    ```
  * 添加 ​**量化点视觉反馈**​（如倒计时动画）：
    javascript
    
    复制
    
    ```
    function animateQuantization(timeRemaining) {
      const progressBar = document.getElementById("quantize-progress");
      progressBar.style.transition = `width ${timeRemaining}s linear`;
      progressBar.style.width = "100%";
      setTimeout(() => progressBar.style.width = "0%", 10);
    }
    ```

---

### **3. 音效处理增强**

#### **3.1 音效参数扩展**

* ​**现状**​：基础参数（频率、反馈、衰减）已覆盖。
* ​**改进点**​：
  * 添加 **滤波器类型切换** 示例：
    javascript
    
    复制
    
    ```
    function setFilterType(type) {
      filter.type = type; // "lowpass", "highpass", "bandpass"
    }
    ```
  * 支持 ​**延迟时间动态调整**​（基于 BPM）：
    javascript
    
    复制
    
    ```
    function updateDelayTime() {
      const beatDuration = Tone.Time("4n").toSeconds(); // 根据当前BPM计算一拍时长
      delay.delayTime.value = beatDuration * 2; // 设置为两拍延迟
    }
    Tone.Transport.bpm.signal.addEventListener("change", updateDelayTime);
    ```

#### **3.2 效果链配置**

* ​**现状**​：支持多 Loop 共享效果。
* ​**改进点**​：
  * 实现 ​**独立音效发送量控制**​：
    javascript
    
    复制
    
    ```
    const reverbSend = {
      drum: new Tone.Gain(0.5).connect(reverb),
      bass: new Tone.Gain(0.3).connect(reverb)
    };
    drumLoop.connect(reverbSend.drum);
    bassLoop.connect(reverbSend.bass);
    
    // 通过滑块调整发送量
    document.getElementById("drum-reverb").addEventListener("input", (e) => {
      reverbSend.drum.gain.value = e.target.value;
    });
    ```

---

### **4. 性能与兼容性**

#### **4.1 性能优化**

* ​**现状**​：未涉及性能相关内容。
* ​**改进点**​：
  * 建议 ​**Web Worker 预处理**​：
    javascript
    
    复制
    
    ```
    // 在 Worker 中预加载音频
    const worker = new Worker("audioWorker.js");
    worker.postMessage({ command: "preload", urls: ["drum.wav", "bass.wav"] });
    ```
  * 提供 **内存管理** 指导：
    javascript
    
    复制
    
    ```
    function cleanup() {
      drumLoop.dispose();
      filter.dispose();
      Tone.Transport.cancel();
    }
    ```

#### **4.2 跨浏览器兼容**

* ​**现状**​：未提及浏览器差异。
* ​**改进点**​：
  * 处理 ​**Safari 兼容性**​：
    javascript
    
    复制
    
    ```
    // Safari 需要特殊处理用户手势
    document.body.addEventListener("touchstart", async () => {
      await Tone.start();
    }, { once: true });
    ```
  * 建议使用 ​**Web Audio API 的自动播放策略检测**​：
    javascript
    
    复制
    
    ```
    if (Tone.context.state !== "running") {
      alert("请点击页面任意处以启用音频");
    }
    ```

