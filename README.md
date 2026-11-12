# Polimill Portable（行政ナレッジポータル デモ）

役員会で「行政ナレッジポータル／スポンサー事業」の試行を検討するために作った、動くイメージです。
自治体職員が、制度・自治体事例・企業のサービスを **探す → 比べる → 庁内資料の下書きにする** までを1つの流れで体験できます。

> 掲載している記事・自治体・企業・数値はすべてサンプルです。実在のものではありません。

## 見どころ

| 画面 | 何を見せるか |
|---|---|
| トップ | 課題から探す検索（Ctrl+K でどこからでも開く）、テーマ12分類、特集、新着（種類で絞り込み） |
| 記事 | 出典の種類ラベル（公的資料／自治体事例／編集部／PR）、あてはまる条件（人口規模・費用・個人情報・体制） |
| 比較トレイ | 記事を「比較に追加」すると画面下に積まれ、最大4件を並べて比べられる |
| 比べて下書きを作る | 条件を表で並べ、出典つきの論点表の下書きを作る（デモ：生成AIではなく記事から組み立てた文例） |
| PR記事と資料請求 | 「PR・企業名」を明示。資料請求は提供先・項目・目的を示して同意してから（デモでは送信しない） |
| 広告と編集の方針 | 掲載料で順位・推薦・AIの回答を変えない、などのルール |

上部の「Talk から開いています」の帯は、QommonsAI Talk の任意の入口から来た想定です。

## 技術

Next.js 16（App Router・静的書き出し）／React 19／TypeScript／Tailwind CSS v4／Motion（アニメーション）／lucide-react。
フォントは Zen Maru Gothic（見出し、Polimill コーポレートサイトと同じ）と BIZ UDPGothic（本文）。デザインの約束事は [DESIGN.md](DESIGN.md)。

```bash
npm install
npm run dev     # http://localhost:3001
npm run build   # out/ に静的サイトを書き出す
```

## 公開（GitHub Pages）

`main` に push すると `.github/workflows/pages.yml` がビルドして GitHub Pages に公開します。
初回だけ、リポジトリの Settings → Pages → Build and deployment の Source を「GitHub Actions」にしてください。
公開URL: https://gottyan6116.github.io/polimill-portable/

## 画像

- Polimill・QommonsAI のロゴと製品画像：polimill.jp から取得した自社素材
- 記事のサムネイルとバナー：コードで描いた生成画像（`src/components/Art.tsx`、`Banners.tsx`）。外部の写真は使っていない
