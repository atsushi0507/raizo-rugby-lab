# 要件ドキュメント

## はじめに

本ドキュメントは、既存の React（Vite）製ラグビーメディアサイトを Next.js（App Router）+ Tailwind CSS に移行し、Phase 1 MVP として新機能を追加するプロジェクトの要件を定義する。

対象サイトは中級者向けのラグビー観戦体験深化メディアであり、Instagram からの流入を主な集客経路とする。コンテンツは MDX ファイルで管理し、将来的な機能拡張（検索・分析・コミュニティ・収益化）を見据えた構造とする。

---

## 用語集

- **Site**: ラグビーメディアサイト全体
- **Article**: 解説または分析カテゴリに属するコンテンツ単位（MDX ファイル 1 件 = 記事 1 件）
- **ArticleCard**: 記事一覧ページおよびホームページで表示される記事のカード UI コンポーネント
- **ArticleDetail**: 記事詳細ページコンポーネント
- **LikeButton**: ハートマーク＋いいね数を表示するインタラクティブコンポーネント
- **LikeStore**: Firebase Firestore 上でいいね数を管理するデータストア
- **LocalStorage**: ブラウザの localStorage。いいね済み記事の管理に使用する
- **MDXLoader**: `data/articles/`、`data/positions/`、`data/gallery/` 配下の MDX ファイルを自動検出・パースするモジュール
- **ContentFrontmatter**: MDX ファイルの YAML フロントマターで定義されるメタデータ
- **SortOrder**: 記事一覧のソート順（レベル順・人気順・新着順）
- **Level**: 記事に付与される難易度ラベル（初級・中級・上級）
- **PopularityLabel**: いいね数に応じて表示されるラベル（「注目」または「人気」）
- **Header**: サイト上部のナビゲーションコンポーネント
- **AppRouter**: Next.js App Router によるルーティング機構

---

## 要件

### 要件 1：Next.js App Router への移行

**ユーザーストーリー：** 開発者として、既存の React（Vite）アプリを Next.js（App Router）に移行したい。そうすることで、SSG/SSR による SEO 改善と将来的な機能拡張の基盤を得られる。

#### 受け入れ基準

1. THE Site SHALL provide all existing pages (`/`、`/articles`、`/articles/[id]`、`/rules`、`/positions`、`/gallery`、`/about`、`/terms`) using Next.js App Router file-based routing.
2. THE AppRouter SHALL render each page as a Server Component by default, and use Client Components only where interactivity is required.
3. WHEN a user navigates between pages, THE Site SHALL perform client-side navigation without full page reload.
4. THE Site SHALL be built with TypeScript and Tailwind CSS, maintaining the existing visual design.
5. IF a requested URL does not match any route, THEN THE Site SHALL display a 404 Not Found page.

---

### 要件 2：MDX によるコンテンツ管理

**ユーザーストーリー：** コンテンツ管理者として、1 コンテンツ 1 MDX ファイルで記事・ポジション・ギャラリーを管理したい。そうすることで、コードを変更せずにコンテンツを追加・編集できる。

#### 受け入れ基準

1. THE MDXLoader SHALL automatically detect all `.mdx` files in `data/articles/`, `data/positions/`, and `data/gallery/` directories at build time.
2. WHEN a `.mdx` file is added to any of the above directories, THE Site SHALL include it in the corresponding list page without any code changes.
3. THE MDXLoader SHALL parse the YAML frontmatter of each MDX file and expose it as typed `ContentFrontmatter` metadata.
4. THE ArticleDetail SHALL render the MDX body content including custom components (`<Conversation>`, `<Structure>`, `<Video>`, `<CharacterCard>`).
5. IF a MDX file contains invalid frontmatter, THEN THE MDXLoader SHALL throw a descriptive build-time error identifying the file path and the invalid field.
6. FOR ALL valid MDX files, parsing the frontmatter then serializing then parsing again SHALL produce an equivalent object (round-trip property).

---

### 要件 3：いいね機能

**ユーザーストーリー：** 読者として、気に入った記事にいいねをしたい。そうすることで、良いコンテンツを評価し、人気記事を把握できる。

#### 受け入れ基準

1. THE ArticleCard SHALL display a heart icon and the current like count fetched from LikeStore.
2. THE ArticleDetail SHALL display a heart icon and the current like count fetched from LikeStore.
3. WHEN a user taps the LikeButton on an article that has not been liked, THE LikeButton SHALL increment the like count in LikeStore by 1 and record the article ID in LocalStorage under the key `liked_articles`.
4. WHEN a user taps the LikeButton on an article that has already been liked, THE LikeButton SHALL decrement the like count in LikeStore by 1 and remove the article ID from LocalStorage.
5. WHILE the LikeButton is in a liked state, THE LikeButton SHALL display the heart icon in a filled/highlighted style to indicate the liked state.
6. WHEN the page loads, THE LikeButton SHALL read LocalStorage to restore the liked state for each article without requiring a server round-trip.
7. THE LikeStore SHALL use Firebase Firestore as the backend for persisting like counts.
8. IF the LikeStore is unreachable, THEN THE LikeButton SHALL display the last known like count and disable further interaction until connectivity is restored.

---

### 要件 4：人気ラベル表示

**ユーザーストーリー：** 読者として、人気記事を一目で識別したい。そうすることで、多くの人が評価したコンテンツを優先的に読める。

#### 受け入れ基準

1. WHEN an article's like count is greater than or equal to 10 and less than 30, THE ArticleCard SHALL display a「注目」PopularityLabel.
2. WHEN an article's like count is greater than or equal to 30, THE ArticleCard SHALL display a「人気」PopularityLabel.
3. WHEN an article's like count is less than 10, THE ArticleCard SHALL not display any PopularityLabel.
4. THE PopularityLabel SHALL be visually distinct from the category label (解説/分析) to avoid confusion.

---

### 要件 5：記事一覧のソート機能

**ユーザーストーリー：** 読者として、記事一覧を自分の目的に合った順序で並べ替えたい。そうすることで、自分のレベルや興味に合った記事を素早く見つけられる。

#### 受け入れ基準

1. THE Article SHALL have a `level` field in its frontmatter with one of three values: `初級`、`中級`、`上級`.
2. THE ArticleList SHALL provide a sort control with three options: レベル順（初級→中級→上級）、人気順（いいね数の多い順）、新着順（公開日の新しい順）.
3. WHEN the sort order is set to レベル順, THE ArticleList SHALL display articles ordered `初級` first, then `中級`, then `上級`.
4. WHEN the sort order is set to 人気順, THE ArticleList SHALL display articles ordered by descending like count.
5. WHEN the sort order is set to 新着順, THE ArticleList SHALL display articles ordered by descending publication date.
6. THE ArticleList SHALL default to レベル順 on initial page load.
7. WHEN a sort option is selected, THE ArticleList SHALL apply the sort while preserving any active category/tag/position filters.

---

### 要件 6：Header ロゴの画像化

**ユーザーストーリー：** サイト運営者として、Header のロゴを絵文字からブランド画像に置き換えたい。そうすることで、サイトのブランドイメージを向上させられる。

#### 受け入れ基準

1. THE Header SHALL display an image as the logo instead of the rugby ball emoji（🏉）.
2. THE Header SHALL load the logo image from an external URL (Unsplash) in the initial implementation.
3. WHEN the logo image fails to load, THE Header SHALL display a fallback text「Rugby Insight」.
4. THE Header logo image SHALL have an appropriate `alt` attribute for accessibility.

---

### 要件 7：ホームページ

**ユーザーストーリー：** Instagram から流入した読者として、サイトの価値を即座に理解し、コンテンツへ誘導されたい。そうすることで、継続的に訪問するモチベーションが生まれる。

#### 受け入れ基準

1. THE Home SHALL display a hero section with a headline, a short concept description, and a call-to-action link to `/articles`.
2. THE Home SHALL display the 3 most recently published articles as ArticleCards.
3. THE Home SHALL display a category navigation section with links to 解説記事、分析記事、ポジション解説、ギャラリー.
4. THE Home SHALL display an Instagram call-to-action section with a link to the official Instagram account.
5. WHEN an ArticleCard on the Home page is clicked, THE Site SHALL navigate to the corresponding ArticleDetail page.

---

### 要件 8：記事詳細ページ

**ユーザーストーリー：** 読者として、記事の内容を構造的に理解したい。そうすることで、試合観戦時に実際に活用できる知識を得られる。

#### 受け入れ基準

1. THE ArticleDetail SHALL render the article content in the following structure: 導入（問い）→ 会話形式解説 → 構造解説（状況/判断/結果）→ 観戦ポイント → 動画（存在する場合）.
2. THE ArticleDetail SHALL display the article's category, level, read time, publication date, and tags.
3. THE ArticleDetail SHALL display the LikeButton with the current like count.
4. THE ArticleDetail SHALL display up to 2 related articles at the bottom of the page.
5. WHEN a related article is clicked, THE Site SHALL navigate to that article's detail page.
6. IF the article ID in the URL does not match any article, THEN THE ArticleDetail SHALL display a「記事が見つかりません」message with a link back to `/articles`.

---

### 要件 9：SNS 導線

**ユーザーストーリー：** サイト運営者として、読者を Instagram アカウントへ誘導したい。そうすることで、SNS フォロワーを増やし、コンテンツの拡散を促進できる。

#### 受け入れ基準

1. THE Header SHALL display an Instagram icon link that opens the official Instagram account in a new tab.
2. THE Home SHALL display an Instagram CTA section with a follow button linking to the official Instagram account.
3. THE ArticleDetail SHALL display a share prompt or Instagram link at the end of the article content.
4. WHEN an Instagram link is clicked, THE Site SHALL open the link in a new browser tab with `rel="noopener noreferrer"`.
