import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MediaPipeモデルのURL（複数の候補を試行）
const MODEL_URLS = [
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float/1/face_landmarker.task',
  'https://storage.googleapis.com/mediapipe-assets/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
  'https://storage.googleapis.com/mediapipe-assets/face_landmarker/face_landmarker/float/1/face_landmarker.task',
];
const MODEL_DIR = path.join(__dirname, '..', 'demo', 'models');
const MODEL_PATH = path.join(MODEL_DIR, 'face_landmarker.task');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(MODEL_DIR)) {
      fs.mkdirSync(MODEL_DIR, { recursive: true });
    }

    if (fs.existsSync(dest)) {
      console.log('モデルファイルは既に存在します:', dest);
      resolve();
      return;
    }

    console.log('モデルファイルをダウンロード中...');
    console.log('URL:', url);
    console.log('保存先:', dest);

    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log('✓ モデルファイルのダウンロードが完了しました');
            console.log('ファイルサイズ:', (fs.statSync(dest).size / 1024 / 1024).toFixed(2), 'MB');
            resolve();
          });
        } else if (response.statusCode === 302 || response.statusCode === 301) {
          file.close();
          fs.unlinkSync(dest);
          const redirectUrl = response.headers.location;
          console.log('リダイレクト:', redirectUrl);
          downloadFile(redirectUrl, dest).then(resolve).catch(reject);
        } else {
          file.close();
          fs.unlinkSync(dest);
          reject(
            new Error(
              `ダウンロードに失敗しました: HTTP ${response.statusCode}`
            )
          );
        }
      })
      .on('error', (err) => {
        file.close();
        if (fs.existsSync(dest)) {
          fs.unlinkSync(dest);
        }
        reject(err);
      });
  });
}

async function tryDownload() {
  for (const url of MODEL_URLS) {
    try {
      console.log(`\n試行中: ${url}`);
      await downloadFile(url, MODEL_PATH);
      console.log('\n✓ 完了！');
      console.log('モデルファイル:', MODEL_PATH);
      console.log('\nデモアプリで使用するには、demo/main.tsのmodelPathを以下に変更してください:');
      console.log("  modelPath: './models/face_landmarker.task'");
      return;
    } catch (error) {
      console.error(`失敗: ${error.message}`);
      if (fs.existsSync(MODEL_PATH)) {
        fs.unlinkSync(MODEL_PATH);
      }
      continue;
    }
  }
  console.error('\nすべてのURLでダウンロードに失敗しました。');
  console.error('手動でダウンロードする場合は、以下のURLを試してください:');
  MODEL_URLS.forEach((url) => console.error(`  - ${url}`));
  process.exit(1);
}

tryDownload();

