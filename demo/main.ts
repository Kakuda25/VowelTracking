import { VowelTracker } from '../module/index';

const video = document.getElementById('video') as HTMLVideoElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn') as HTMLButtonElement;
const stopBtn = document.getElementById('stopBtn') as HTMLButtonElement;
const vowelResult = document.getElementById('vowelResult') as HTMLDivElement;
const status = document.getElementById('status') as HTMLSpanElement;
const debugInfo = document.getElementById('debugInfo') as HTMLDivElement;
const debugContent = document.getElementById('debugContent') as HTMLDivElement;

let tracker: VowelTracker | null = null;
let isInitialized = false;

const vowelLabels: Record<string, string> = {
  closed: '閉口',
  a: 'あ',
  i: 'い',
  u: 'う',
  e: 'え',
  o: 'お',
};

async function initializeTracker(): Promise<void> {
  if (isInitialized) {
    return;
  }

  try {
    status.textContent = '初期化中...';
    tracker = new VowelTracker({
      modelPath: './models/face_landmarker.task',
      onVowelDetected: (vowel) => {
        vowelResult.textContent = vowelLabels[vowel] || vowel;
        vowelResult.classList.add('active');
        setTimeout(() => {
          vowelResult.classList.remove('active');
        }, 200);
      },
      confidenceThreshold: 0.5,
      detectionInterval: 100,
      debug: true,
    });

    await tracker.initialize();
    await tracker.startCamera(video);

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    isInitialized = true;
    status.textContent = '準備完了';
    startBtn.disabled = false;
  } catch (error) {
    const err = error as Error;
    console.error('初期化エラー:', err);
    status.textContent = `エラー: ${err.message}`;
    alert(`初期化に失敗しました: ${err.message}`);
  }
}

function startDetection(): void {
  if (!isInitialized || !tracker) {
    return;
  }

  try {
    tracker.start(video);
    startBtn.disabled = true;
    stopBtn.disabled = false;
    status.textContent = '検出中';
    debugInfo.style.display = 'block';

    updateDebugInfo();
  } catch (error) {
    const err = error as Error;
    console.error('検出開始エラー:', err);
    status.textContent = `エラー: ${err.message}`;
  }
}

function stopDetection(): void {
  if (!tracker) {
    return;
  }

  tracker.stop();
  startBtn.disabled = false;
  stopBtn.disabled = true;
  status.textContent = '停止中';
  vowelResult.textContent = '-';
  debugInfo.style.display = 'none';
}

function updateDebugInfo(): void {
  if (!tracker) {
    return;
  }

  const info = tracker.getDebugInfo();
  if (info) {
    debugContent.innerHTML = `<pre>${JSON.stringify(info, null, 2)}</pre>`;
  }

  requestAnimationFrame(updateDebugInfo);
}

startBtn.addEventListener('click', startDetection);
stopBtn.addEventListener('click', stopDetection);

window.addEventListener('beforeunload', () => {
  if (tracker) {
    tracker.dispose();
  }
});

initializeTracker().catch((error) => {
  const err = error as Error;
  console.error('初期化エラー:', err);
  status.textContent = `エラー: ${err.message}`;
});

