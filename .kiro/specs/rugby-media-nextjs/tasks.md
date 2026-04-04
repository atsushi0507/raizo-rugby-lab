# 実装計画：rugby-media-nextjs

## 概要

既存の React（Vite）製ラグビーメディアサイトを Next.js（App Router）+ Tailwind CSS に移行し、いいね機能・人気ラベル・ソート機能・SNS 導線などの Phase 1 MVP 機能を追加する。実装は Server Components ファーストで進め、インタラクティブな部分のみ Client Component とする。

## タスク

- [x] 1. Next.js プロジェクトのセットアップと基盤構築
  - `next.config.ts`、`tsconfig.json`、`tailwind.config.ts` を Next.js App Router 用に設定する
  - `app/layout.tsx` にルートレイアウト（`<html>`、`<body>`、Header、Footer）を実装する
  - `app/not-found.tsx` に 404 ページを実装する
  - Vitest + fast-check のテスト環境を `vitest.config.ts` で設定する
  - _Requirements: 1.1, 1.2, 1.4, 1.5_

- [x] 2. 型定義と MDXLoader の実装
  - [x] 2.1 `lib/mdx.ts` に `ArticleFrontmatter`、`PositionFrontmatter`、`GalleryFrontmatter` の型定義と、`getAllArticles()`、`getArticleById()`、`getAllPositions()`、`getAllGallery()` 関数を実装する
    - `gray-matter` でフロントマターをパースし、必須フィールドの欠落・型不正時はファイルパスと不正フィールド名を含むエラーをスローする
    - `data/articles/`、`data/positions/`、`data/gallery/` 配下の `.mdx` ファイルを `fs.readdirSync` で自動検出する
    - _Requirements: 2.1, 2.2, 2.3, 2.5_

  - [x] 2.2 Property 1 のプロパティテストを実装する
    - **Property 1: MDX ファイル自動検出**
    - **Validates: Requirements 2.1, 2.2**

  - [x] 2.3 Property 2 のプロパティテストを実装する
    - **Property 2: フロントマターのラウンドトリップ**
    - **Validates: Requirements 2.3, 2.6**

  - [x] 2.4 Property 3 のプロパティテストを実装する
    - **Property 3: 無効フロントマターのエラー検出**
    - **Validates: Requirements 2.5**

- [x] 3. MDX カスタムコンポーネントの実装
  - [x] 3.1 `components/mdx/Conversation.tsx` を実装する（`items` プロパティで会話ブロックをレンダリング）
    - _Requirements: 2.4_
  - [x] 3.2 `components/mdx/Structure.tsx` を実装する（`situation`/`decision`/`result` と各画像をレンダリング）
    - _Requirements: 2.4, 8.1_
  - [x] 3.3 `components/mdx/Video.tsx` を実装する（`url` プロパティで動画を埋め込み）
    - _Requirements: 2.4, 8.1_
  - [x] 3.4 `components/mdx/CharacterCard.tsx` を実装する（ポジションキャラクター表示）
    - _Requirements: 2.4_

- [x] 4. Firebase いいね機能の実装
  - [x] 4.1 `lib/firebase.ts` に Firebase 初期化コードを実装する
    - Firestore クライアントを初期化し、環境変数から設定を読み込む
    - _Requirements: 3.7_

  - [x] 4.2 `lib/likes.ts` に `getLikeCounts(ids)`、`toggleLike(articleId)` 関数を実装する
    - 楽観的 UI 更新、書き込み失敗時のロールバック、3 秒タイムアウトでオフライン扱いを実装する
    - _Requirements: 3.3, 3.4, 3.7, 3.8_

  - [x] 4.3 `components/LikeButton.tsx` を Client Component として実装する
    - `initialCount`・`initialLiked` を props で受け取り、localStorage の `liked_articles` キーでいいね状態を管理する
    - いいね済み時はハートアイコンをフィル表示、オフライン時は disabled にする
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.8_

  - [x] 4.4 Property 4 のプロパティテストを実装する
    - **Property 4: いいねのラウンドトリップ**
    - **Validates: Requirements 3.3, 3.4**

  - [x] 4.5 Property 5 のプロパティテストを実装する
    - **Property 5: localStorage からのいいね状態復元**
    - **Validates: Requirements 3.6**

- [x] 5. チェックポイント — ここまでのテストがすべて通ることを確認する
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. ArticleCard と人気ラベルの実装
  - [x] 6.1 `components/ArticleCard.tsx` を Server Component として実装する
    - `getPopularityLabel(likeCount)` 関数を実装し、いいね数に応じて「注目」（10〜29）または「人気」（30以上）ラベルを表示する
    - カテゴリラベルと視覚的に区別できるスタイルを適用する
    - `LikeButton` を子コンポーネントとして組み込む
    - _Requirements: 3.1, 4.1, 4.2, 4.3, 4.4_

  - [x] 6.2 Property 6 のプロパティテストを実装する
    - **Property 6: いいね数に応じた PopularityLabel**
    - **Validates: Requirements 4.1, 4.2, 4.3**

- [x] 7. SortControl と ArticleListClient の実装
  - [x] 7.1 `lib/sort.ts`（または `components/ArticleListClient.tsx` 内）に `sortArticles(articles, order, likeCounts)` 関数を実装する
    - `level`：初級(0)→中級(1)→上級(2)、`popular`：いいね数降順、`newest`：date 降順
    - _Requirements: 5.3, 5.4, 5.5_

  - [x] 7.2 Property 7 のプロパティテストを実装する
    - **Property 7: ソート順の正確性**
    - **Validates: Requirements 5.3, 5.4, 5.5**

  - [x] 7.3 Property 8 のプロパティテストを実装する
    - **Property 8: ソート変更時のフィルター維持**
    - **Validates: Requirements 5.7**

  - [x] 7.4 `components/SortControl.tsx` を Client Component として実装する（レベル順・人気順・新着順の 3 択、デフォルトはレベル順）
    - _Requirements: 5.2, 5.6_

  - [x] 7.5 `components/ArticleListClient.tsx` を Client Component として実装する
    - `SortControl` と既存のカテゴリ・タグ・ポジションフィルターを統合し、ソート変更時にフィルター状態を維持する
    - _Requirements: 5.1, 5.2, 5.6, 5.7_

- [x] 8. Header の実装（ロゴ画像化）
  - [x] 8.1 `components/Header.tsx` を Client Component として実装する
    - `next/image` で Unsplash のロゴ画像を表示し、`onError` ハンドラでフォールバックテキスト「Rugby Insight」に切り替える
    - Instagram アイコンリンクに `target="_blank"` と `rel="noopener noreferrer"` を付与する
    - モバイルメニューの開閉状態を管理する
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 9.1_

  - [ ]* 8.2 Property 13 のプロパティテストを実装する
    - **Property 13: Instagram リンクの属性**
    - **Validates: Requirements 9.4**

- [x] 9. ホームページの実装
  - [x] 9.1 `app/page.tsx` を Server Component として実装する
    - `getAllArticles()` で取得した記事を公開日降順でソートし、上位 3 件を ArticleCard で表示する
    - ヒーローセクション、カテゴリナビゲーション、Instagram CTA セクションを実装する
    - Instagram CTA リンクに `target="_blank"` と `rel="noopener noreferrer"` を付与する
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 9.2, 9.4_

  - [ ]* 9.2 Property 9 のプロパティテストを実装する
    - **Property 9: ホームページの最新 3 記事表示**
    - **Validates: Requirements 7.2**

  - [ ]* 9.3 Property 10 のプロパティテストを実装する（ArticleCard のリンク先）
    - **Property 10: ArticleCard のリンク先**
    - **Validates: Requirements 7.5, 8.5**

- [x] 10. 記事一覧ページの実装
  - [x] 10.1 `app/articles/page.tsx` を Server Component として実装する
    - `getAllArticles()` と `getLikeCounts()` を呼び出し、`ArticleListClient` に渡す
    - _Requirements: 1.1, 5.1_

- [x] 11. 記事詳細ページの実装
  - [x] 11.1 `app/articles/[id]/page.tsx` を Server Component として実装する
    - `getArticleById(id)` で記事を取得し、存在しない場合は `notFound()` を呼び出す
    - `next-mdx-remote` または `@next/mdx` で MDX 本文をレンダリングし、カスタムコンポーネントを渡す
    - カテゴリ・レベル・読了時間・公開日・タグを表示する
    - `LikeButton` を組み込む
    - 関連記事を最大 2 件表示する
    - 記事末尾に Instagram リンクを追加する
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 9.3, 9.4_

  - [ ]* 11.2 Property 11 のプロパティテストを実装する
    - **Property 11: ArticleDetail のメタ情報表示**
    - **Validates: Requirements 8.2**

  - [ ]* 11.3 Property 12 のプロパティテストを実装する
    - **Property 12: 関連記事の最大件数**
    - **Validates: Requirements 8.4**

- [x] 12. その他ページの実装
  - [x] 12.1 `app/rules/page.tsx` を実装する（既存の Rules コンポーネントを移植）
    - _Requirements: 1.1_
  - [x] 12.2 `app/positions/page.tsx` を実装する（`getAllPositions()` でデータ取得）
    - _Requirements: 1.1_
  - [x] 12.3 `app/gallery/page.tsx` を実装する（`getAllGallery()` でデータ取得）
    - _Requirements: 1.1_
  - [x] 12.4 `app/about/page.tsx` と `app/terms/page.tsx` を実装する
    - _Requirements: 1.1_

- [x] 13. `components/Footer.tsx` の実装
  - Server Component として実装し、Instagram リンクに `target="_blank"` と `rel="noopener noreferrer"` を付与する
  - _Requirements: 9.4_

- [x] 14. 最終チェックポイント — すべてのテストが通ることを確認する
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- `*` が付いたタスクはオプションであり、MVP を優先する場合はスキップ可能
- 各タスクは対応する要件番号を参照しており、トレーサビリティを確保している
- プロパティテストは `// Feature: rugby-media-nextjs, Property {N}: {property_text}` 形式のコメントを付与する
- 各プロパティテストは最低 100 回のイテレーションを実行する（`{ numRuns: 100 }`）
- Firebase の設定値は環境変数（`.env.local`）で管理し、コードにハードコードしない
