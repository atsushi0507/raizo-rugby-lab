# Rugby Insight

ラグビーの観戦体験を深めるメディアサイト。解説・分析コンテンツを通じて、中級者がより深くラグビーを楽しめることを目指しています。

## 技術スタック

- [Next.js](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)（いいね数管理）
- [MDX](https://mdxjs.com/)（コンテンツ管理）
- TypeScript

---

## ローカル開発

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` をルートに作成し、Firebase の設定を記述します。

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Firebase コンソール → プロジェクト設定 → マイアプリ から取得できます。

### 3. 開発サーバーの起動

```bash
npm run dev
```

`http://localhost:3000` で確認できます。

---

## コンテンツの追加・更新

コンテンツはすべて `data/` ディレクトリ内の MDX ファイルで管理しています。ファイルを追加するだけでサイトに反映されます。

### 記事を追加する（`data/articles/`）

`data/articles/` に `.mdx` ファイルを作成します。ファイル名は任意です。

```mdx
---
id: "unique-id"           # 一意のID（URLに使用）
title: "記事タイトル"
category: "解説"           # "解説" または "分析"
tags: ["タグ1", "タグ2"]
thumbnail: "https://..."  # サムネイル画像URL
excerpt: "記事の概要文"
date: "2026-04-01"        # ISO 8601形式
readTime: "5分"
level: "中級"              # "初級" / "中級" / "上級"
team: "日本代表"           # 任意
position: "スクラムハーフ" # 任意
season: "2026"            # 任意
videoUrl: "https://..."   # 任意
---

## 導入

記事本文をここに書きます。

<Conversation
  items={[
    { speaker: "初心者くん", avatar: "🤔", message: "質問文" },
    { speaker: "コーチ", avatar: "👨‍🏫", message: "回答文" }
  ]}
/>

<Structure
  situation="状況説明"
  decision="判断の説明"
  result="結果の説明"
/>

<Video url={frontmatter.videoUrl} />
```

### ポジションを追加する（`data/positions/`）

```mdx
---
id: "unique-id"
number: "10"              # 背番号
name: "スタンドオフ"
nameEn: "Stand-off"
category: "バックス"       # "フォワード" または "バックス"
description: "ポジションの説明"
role:
  - "役割1"
  - "役割2"
requiredSkills:
  - "スキル1"
icon: "/images/positions/so/icon.png"
character: "/images/positions/so/character.png"
---

本文をここに書きます。
```

### ギャラリーを追加する（`data/gallery/`）

```mdx
---
id: "unique-id"
title: "ギャラリータイトル"
description: "説明文"
coverImage: "https://..."
match: "試合名"
date: "2026-04-01"
photoCount: 12
---
```

---

## Vercel へのデプロイ

### 初回セットアップ

1. [Vercel](https://vercel.com/) にログインし、このリポジトリをインポート
2. Framework Preset は **Next.js** が自動検出されます
3. **Environment Variables** に `.env.local` と同じキー・値を設定
4. **Deploy** をクリック

### 継続的デプロイ

`main` ブランチへの push が自動的に本番デプロイされます。

記事の追加・更新も MDX ファイルをコミット・push するだけで反映されます。

```bash
# 記事を追加したら
git add data/articles/new-article.mdx
git commit -m "feat: 新記事「タイトル」を追加"
git push origin main
```

### Vercel の環境変数設定

Vercel ダッシュボード → プロジェクト → Settings → Environment Variables から設定します。

| 変数名 | 説明 |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API キー |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth ドメイン |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase プロジェクト ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage バケット |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID |

---

## テスト

```bash
npm run test
```

プロパティベーステスト（fast-check）を含む全テストが実行されます。

---

## ディレクトリ構成

```
app/              # Next.js App Router ページ
components/       # 共通コンポーネント
  mdx/            # MDX カスタムコンポーネント
data/             # コンテンツ（MDX ファイル）
  articles/       # 記事
  positions/      # ポジション解説
  gallery/        # ギャラリー
lib/              # ユーティリティ（MDX読み込み、Firebase、ソート）
```
