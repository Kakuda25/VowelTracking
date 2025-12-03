# GitHubへのアップロード方法

このドキュメントでは、VowelTrackingプロジェクトをGitHubにアップロードする方法を説明します。

## 前提条件

- Gitがインストールされていること
- GitHubアカウントを持っていること
- GitHub CLI (`gh`) がインストールされていること（推奨）

## 初回アップロード

### リモートリポジトリの確認

まず、既にリモートが設定されているか確認します：

```bash
git remote -v
```

既に`origin`が設定されている場合は、以下のコマンドでURLを変更できます：

```bash
git remote set-url origin https://github.com/kakuda25/VowelTracking.git
```

### 方法1: リモートが未設定の場合

```bash
# リモートを追加
git remote add origin https://github.com/kakuda25/VowelTracking.git
git branch -M main
git push -u origin main
```

### 方法2: 既にリモートが設定されている場合

```bash
# リモートURLを確認
git remote -v

# 必要に応じてURLを変更
git remote set-url origin https://github.com/kakuda25/VowelTracking.git

# ブランチ名を確認・変更
git branch -M main

# プッシュ
git push -u origin main
```

### 方法3: GitHub CLIで新規作成

```bash
# リポジトリを作成してプッシュ
gh repo create VowelTracking --public --source=. --remote=origin --push
```

**注意**: 既に`origin`が設定されている場合は、`--remote=origin`オプションを外すか、別の名前を使用してください。

### 方法4: 手動でGitHubに作成

1. GitHubで新しいリポジトリを作成
2. 以下のコマンドを実行：

```bash
# リモートが未設定の場合
git remote add origin https://github.com/kakuda25/VowelTracking.git

# 既にリモートが設定されている場合
git remote set-url origin https://github.com/kakuda25/VowelTracking.git

# プッシュ
git branch -M main
git push -u origin main
```

## 通常の更新手順

### 変更をコミットしてプッシュ

```bash
# 変更をステージング
git add .

# コミット
git commit -m "コミットメッセージ"

# プッシュ
git push
```

### ブランチを作成してプッシュ

```bash
# 新しいブランチを作成
git checkout -b feature/新機能名

# 変更をコミット
git add .
git commit -m "新機能を追加"

# ブランチをプッシュ
git push -u origin feature/新機能名
```

## Gitに含めないファイル

以下のファイル・ディレクトリは`.gitignore`で除外されています：

- `node_modules/` - NPM依存関係
- `dist/` - ビルド成果物
- `demo/models/` - MediaPipeモデルファイル（大きいため）
- `.env` - 環境変数
- ログファイル
- IDE設定ファイル

### モデルファイルについて

MediaPipeモデルファイル（`demo/models/face_landmarker.task`）は約3.58MBと大きいため、Gitに含めていません。

モデルファイルが必要な場合は、以下のコマンドでダウンロードできます：

```bash
npm run download-model
```

または、リポジトリのREADMEにダウンロード手順を記載してください。

## コミットメッセージのベストプラクティス

### 良いコミットメッセージの例

```
feat: 母音検出機能を追加
fix: カメラ初期化エラーを修正
docs: READMEを更新
refactor: VowelDetectorのロジックを改善
test: ユニットテストを追加
```

### コミットメッセージの形式

- `feat:` - 新機能
- `fix:` - バグ修正
- `docs:` - ドキュメント変更
- `style:` - コードスタイル変更（フォーマットなど）
- `refactor:` - リファクタリング
- `test:` - テスト追加・修正
- `chore:` - ビルドプロセスやツールの変更

## リリースの作成

### タグを作成してプッシュ

```bash
# バージョンタグを作成
git tag -a v0.1.0 -m "リリース v0.1.0"

# タグをプッシュ
git push origin v0.1.0
```

### GitHub CLIでリリースを作成

```bash
gh release create v0.1.0 --title "v0.1.0" --notes "初回リリース"
```

## トラブルシューティング

### プッシュが拒否される場合

```bash
# リモートの変更を取得
git pull origin main

# コンフリクトを解決後、再度プッシュ
git push
```

### 大きなファイルを誤ってコミットした場合

```bash
# Git履歴からファイルを削除
git rm --cached demo/models/face_landmarker.task

# .gitignoreに追加されていることを確認
# コミット
git commit -m "chore: モデルファイルをGitから除外"
git push
```

### リモートリポジトリのURLを確認

```bash
git remote -v
```

### リモートリポジトリのURLを変更

```bash
# 現在のURLを確認
git remote -v

# URLを変更
git remote set-url origin https://github.com/kakuda25/VowelTracking.git

# 変更を確認
git remote -v
```

### リモートリポジトリを削除して再追加

```bash
# 既存のリモートを削除
git remote remove origin

# 新しいリモートを追加
git remote add origin https://github.com/kakuda25/VowelTracking.git

# 確認
git remote -v
```

## セキュリティに関する注意事項

### コミット前に確認すべきこと

- [ ] APIキーやパスワードがコードに含まれていないか
- [ ] `.env`ファイルがコミットされていないか
- [ ] 個人情報が含まれていないか
- [ ] 機密情報が含まれていないか

### 誤って機密情報をコミットした場合

1. GitHubのSecret Scanningを有効化
2. 機密情報を変更（APIキーを再生成など）
3. Git履歴から削除（必要に応じて）

## 参考リンク

- [Git公式ドキュメント](https://git-scm.com/doc)
- [GitHub CLIドキュメント](https://cli.github.com/manual/)
- [GitHub公式ドキュメント](https://docs.github.com/)

