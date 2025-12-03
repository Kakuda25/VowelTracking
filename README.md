# VowelTracking

MediaPipe Tasks Vision (FaceLandmarker) を使用した母音判定モジュール。閉口、あ、い、う、え、おをリアルタイムで判定します。

## プロジェクト概要

### 要件
- MediaPipe Tasks-vision (FaceLandmarker) を使用した母音判定モジュール
- 閉口、あ、い、う、え、おを判定
- React、Vue、VanillaJSなどのモダンWEBアプリで簡単に実装できる状態で制作

### プロジェクト構成
```
VowelTracking/
├── module/              # コアモジュール（配布用）
│   ├── core/           # 母音検知ロジック
│   ├── utils/          # ユーティリティ関数
│   ├── config/         # 設定・定数
│   ├── types/          # TypeScript型定義
│   └── index.ts        # エントリーポイント
├── demo/               # デモアプリケーション（Vanilla JS）
│   ├── index.html
│   ├── style.css
│   └── main.js
├── dist/               # ビルド成果物
│   ├── index.js        # ESM版
│   ├── index.umd.js    # UMD版（CDN用）
│   └── index.d.ts      # 型定義
├── tests/              # テストコード
└── order/              # プロジェクト管理用ドキュメント
```

## 技術スタック

### コア技術
- **TypeScript 5.3+**: 型安全性の確保
- **MediaPipe Tasks Vision**: FaceLandmarker API使用
- **Vite**: ビルドツール（高速、TypeScriptネイティブ対応）
- **Vitest**: テストフレームワーク

### 配布形式
1. **ESM形式**: モダンバンドラー向け（Vite/Webpack）
2. **UMD形式**: CDN経由での直接利用
3. **TypeScript型定義ファイル**: TypeScriptプロジェクトでの型補完

## セットアップ

### 必要な環境
- Node.js 18.0以上
- npm または yarn

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動（デモ用）
npm run dev

# ビルド
npm run build

# テスト実行
npm test
```

## 使用方法

### 基本的な使用例

```typescript
import { VowelTracker } from './module';

const tracker = new VowelTracker({
  modelPath: './models/',
  onVowelDetected: (vowel) => {
    console.log(`検出: ${vowel}`); 
    // 'closed' | 'a' | 'i' | 'u' | 'e' | 'o'
  }
});

// 初期化
await tracker.initialize();

// ビデオ要素から開始
const videoElement = document.querySelector('video');
tracker.start(videoElement);

// 停止
tracker.stop();
```

### CDN経由での使用

```html
<script src="https://cdn.example.com/vowel-tracking.umd.js"></script>
<script>
  const tracker = new VowelTracker.VowelTracker({
    modelPath: './models/',
    onVowelDetected: (vowel) => {
      console.log(vowel);
    }
  });
  
  await tracker.initialize();
  tracker.start(videoElement);
</script>
```

## 機能

- **リアルタイム母音検知**: カメラ映像からリアルタイムで母音を検出
- **6状態判定**: 閉口、あ、い、う、え、おの6つの状態を判定
- **高精度**: MediaPipe Tasks VisionのFaceLandmarkerを使用
- **軽量**: WebAssemblyベースで高速動作
- **型安全**: TypeScript型定義付き

## 開発ガイドライン

### コーディング規則

- **コメント**: 可読性を考慮しコードリーディングの補助になるコメントを記述。コードから明らかなもの、作業内容、TODOのようなコメントはしない
- **未使用コード**: 使用されていないコードは積極的に削除
- **問題管理**: 小さな問題も放置せず、発見次第マークダウン形式で記録
- **バグ調査**: バグを見つけたら原因の可能性があるものをすべて調査しマークダウン形式で記録
- **コード品質**: 動くコードを書くだけでなく、品質・保守性・安全性を常に意識
- **DRY原則**: 重複を避け、単一の信頼できる情報源を維持
- **一貫性**: プロジェクト全体で一貫したコーディングスタイルを維持
- **可読性**: 適切な命名規則、適切な関数分割、不要なコメントアウトコードの削除、意味のあるコメントの追加

### プロジェクト進行規則

修正前は必ず計画を作成しステップごとに実装を行う。

## テスト

```bash
# 全テスト実行
npm test

# ウォッチモード
npm run test:watch

# カバレッジ確認
npm run test:coverage
```

## ビルド

```bash
# プロダクションビルド
npm run build

# ビルド成果物は dist/ に出力されます
# - index.js (ESM形式)
# - index.umd.js (UMD形式)
# - index.d.ts (型定義)
```

## 開発

### 開発サーバー起動

```bash
# デモアプリケーションの開発サーバー
npm run dev
```

### プロジェクト構造

- `module/`: コアモジュールのソースコード
- `demo/`: デモアプリケーション（Vanilla JS）
- `tests/`: テストコード
- `dist/`: ビルド成果物（gitignoreに含める）

## ライセンス

[ライセンス情報を記載]

## コントリビューション

[コントリビューションガイドラインを記載]

## 参考資料

- [MediaPipe Tasks Vision](https://developers.google.com/mediapipe/solutions/vision/face_landmarker)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)

