# デモアプリケーション

## MediaPipeモデルの設定

デモアプリはMediaPipe FaceLandmarkerモデルを使用します。以下の2つの方法でモデルを設定できます。

### 方法1: CDNから読み込む（デフォルト）

デフォルトでは、Google Cloud StorageのCDNからモデルを読み込みます。

```typescript
modelPath: 'https://storage.googleapis.com/mediapipe-assets/face_landmarker/face_landmarker/float/1/face_landmarker.task'
```

### 方法2: ローカルにモデルを配置する

1. モデルファイルをダウンロード:
   ```bash
   # modelsディレクトリを作成
   mkdir -p demo/models
   
   # モデルファイルをダウンロード
   curl -o demo/models/face_landmarker.task \
     https://storage.googleapis.com/mediapipe-assets/face_landmarker/face_landmarker/float/1/face_landmarker.task
   ```

2. `demo/main.ts`のモデルパスを変更:
   ```typescript
   modelPath: './models/face_landmarker.task'
   ```

## トラブルシューティング

### モデルが読み込めない場合

1. **ネットワーク接続を確認**: CDNからモデルを読み込む場合は、インターネット接続が必要です。

2. **CORSエラーの場合**: ローカルにモデルを配置することを推奨します。

3. **404エラーの場合**: モデルURLが変更されている可能性があります。最新のURLを確認してください。

## モデルのダウンロード

モデルファイルは約9MBです。以下のコマンドでダウンロードできます：

```bash
# Windows (PowerShell)
Invoke-WebRequest -Uri "https://storage.googleapis.com/mediapipe-assets/face_landmarker/face_landmarker/float/1/face_landmarker.task" -OutFile "demo/models/face_landmarker.task"

# Linux/Mac
curl -o demo/models/face_landmarker.task \
  https://storage.googleapis.com/mediapipe-assets/face_landmarker/face_landmarker/float/1/face_landmarker.task
```

