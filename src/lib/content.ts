// デモ用のサンプルデータ。実在の自治体・企業・統計ではない。

export type Kind = "public" | "case" | "editorial" | "training" | "template" | "pr";

export const KIND_LABEL: Record<Kind, string> = {
  public: "公的資料",
  case: "自治体事例",
  editorial: "編集部の解説",
  training: "研修",
  template: "テンプレート",
  pr: "PR・企業提供",
};

export type ThemeSlug =
  | "bousai"
  | "dx"
  | "kosodate"
  | "fukushi"
  | "kenko"
  | "kanko"
  | "sangyo"
  | "machi"
  | "kankyo"
  | "zaisei"
  | "jinji"
  | "koho";

export type Theme = { slug: ThemeSlug; name: string; short: string; desc: string };

export const THEMES: Theme[] = [
  { slug: "bousai", name: "防災・危機管理", short: "防災", desc: "避難所運営、情報伝達、備蓄、訓練" },
  { slug: "dx", name: "DX・業務改善", short: "DX", desc: "窓口・申請のデジタル化、生成AI、業務の見直し" },
  { slug: "kosodate", name: "子育て・教育", short: "子育て", desc: "保育、学童、子育て支援、学校との連携" },
  { slug: "fukushi", name: "福祉・介護", short: "福祉", desc: "地域包括ケア、見守り、重層的支援" },
  { slug: "kenko", name: "健康・医療", short: "健康", desc: "健診、データヘルス、地域医療" },
  { slug: "kanko", name: "観光・地域振興", short: "観光", desc: "誘客、関係人口、ふるさと納税" },
  { slug: "sangyo", name: "産業・雇用", short: "産業", desc: "中小企業支援、創業、担い手確保" },
  { slug: "machi", name: "まちづくり・交通", short: "まちづくり", desc: "公共交通、空き家、公共施設" },
  { slug: "kankyo", name: "環境・脱炭素", short: "環境", desc: "ごみ減量、省エネ、再エネ導入" },
  { slug: "zaisei", name: "財政・契約", short: "財政", desc: "予算編成、調達、補助金の活用" },
  { slug: "jinji", name: "人事・働き方", short: "人事", desc: "採用、人材育成、職員の働き方" },
  { slug: "koho", name: "広報・住民参加", short: "広報", desc: "広報誌、SNS、パブリックコメント" },
];

export type Conditions = {
  population: string; // 想定する人口規模
  cost: string; // 費用感
  personalData: string; // 個人情報の扱い
  staffing: string; // 必要な体制
};

export type Article = {
  id: string;
  kind: Kind;
  theme: ThemeSlug;
  title: string;
  lead: string;
  updated: string; // YYYY-MM-DD
  minutes: number;
  tags: string[];
  source: string; // 出典の表示名（サンプル）
  conditions: Conditions;
  sections: { h: string; p: string[] }[];
  company?: string; // PR のときの企業名（架空）
  featured?: boolean;
};

const BASE_COND: Conditions = {
  population: "人口5万〜30万人",
  cost: "既存予算の範囲",
  personalData: "扱わない",
  staffing: "担当1〜2名",
};

export const ARTICLES: Article[] = [
  {
    id: "hinanjo-uketsuke-guide",
    kind: "public",
    theme: "bousai",
    title: "避難所の受付を早く、正確にするための国の考え方",
    lead: "避難者名簿の作り方、要配慮者の把握、受付の動線について、国の指針で示されている考え方を要点だけまとめた。",
    updated: "2026-11-05",
    minutes: 6,
    tags: ["避難所運営", "要配慮者", "名簿"],
    source: "（サンプル）避難所運営に関する国の指針",
    conditions: { ...BASE_COND, population: "規模を問わない", personalData: "避難者名簿で扱う" },
    featured: true,
    sections: [
      {
        h: "受付で決めておくこと",
        p: [
          "受付で集める項目は、安否の確認と支援の手配に要るものだけに絞る。世帯の人数、要配慮者の有無、連絡先が基本になる。",
          "紙と電子のどちらで受け付けても、あとで名簿を1つにまとめられるよう、項目と書き方を先にそろえておく。",
        ],
      },
      {
        h: "要配慮者の把握",
        p: [
          "高齢者、障害のある人、乳幼児のいる世帯、外国人などは、受付の時点で分かるように欄を分ける。",
          "避難行動要支援者名簿と照らし合わせる担当を、受付とは別に決めておく。",
        ],
      },
      {
        h: "個人情報の扱い",
        p: ["名簿は支援のために使う範囲を明示し、閲覧できる人を決めておく。訓練でも本番と同じルールで扱う。"],
      },
    ],
  },
  {
    id: "a-city-hinanjo-qr",
    kind: "case",
    theme: "bousai",
    title: "人口8万人のA市、避難所の受付をQRコードにして待ち時間を短くした",
    lead: "紙の受付票をやめ、事前登録したQRコードを読み取る形に変えた。訓練での受付の待ち時間と、名簿の入力の手間がどう変わったかを紹介する。",
    updated: "2026-11-02",
    minutes: 8,
    tags: ["避難所運営", "QRコード", "訓練"],
    source: "（サンプル）A市 防災訓練の報告",
    conditions: { population: "人口8万人", cost: "年間数十万円（サンプル）", personalData: "事前登録で扱う", staffing: "防災担当2名＋各避難所の職員" },
    featured: true,
    sections: [
      {
        h: "変えたこと",
        p: [
          "住民が事前にスマートフォンで世帯情報を登録し、避難所ではQRコードを読み取るだけで受付が終わるようにした。",
          "スマートフォンを持たない人には、従来どおり紙の受付票を用意し、あとで職員が入力する。",
        ],
      },
      {
        h: "訓練で分かったこと",
        p: [
          "事前登録した世帯は受付がすぐ終わり、名簿の入力も不要になった。一方、登録率が低い地区では効果が小さかった。",
          "登録の呼びかけを自治会の回覧と合わせて行ったことが、登録を増やすうえで効いた。",
        ],
      },
      {
        h: "他の自治体が取り入れるときの注意",
        p: ["事前登録の項目と、避難行動要支援者名簿の項目をそろえておかないと、照合の手間が残る。"],
      },
    ],
  },
  {
    id: "pr-uketsuke-system",
    kind: "pr",
    theme: "bousai",
    company: "ミライ受付株式会社（架空）",
    title: "避難所受付システム「さっと受付」：紙と電子の名簿を1つにまとめる",
    lead: "紙の受付票を撮影して読み取り、QR受付の名簿と合わせて1つの名簿にする仕組み。導入の流れと費用の目安を企業が説明する。",
    updated: "2026-10-28",
    minutes: 4,
    tags: ["避難所運営", "名簿", "OCR"],
    source: "ミライ受付株式会社（架空）提供",
    conditions: { population: "人口3万人以上", cost: "初期費用＋月額（要問い合わせ）", personalData: "避難者名簿で扱う", staffing: "防災担当1名" },
    sections: [
      { h: "できること", p: ["紙の受付票を読み取り、QR受付の名簿と同じ形式にそろえる。", "避難所ごとの受付人数を本部で確かめられる。"] },
      { h: "導入の流れ", p: ["試用（1か月）→ 訓練での利用 → 本導入、の順で進める。"] },
    ],
  },
  {
    id: "seisei-ai-guideline",
    kind: "editorial",
    theme: "dx",
    title: "生成AIの庁内ルール、まず決めるべき5つの項目",
    lead: "使ってよい業務、入力してはいけない情報、出力の確かめ方など、運用を始める前に決めておく項目を編集部が整理した。",
    updated: "2026-11-08",
    minutes: 7,
    tags: ["生成AI", "ガイドライン", "情報セキュリティ"],
    source: "編集部（各自治体の公開資料をもとに作成・サンプル）",
    conditions: { ...BASE_COND, population: "規模を問わない" },
    featured: true,
    sections: [
      {
        h: "決める項目",
        p: [
          "使ってよい業務と使わない業務、入力してはいけない情報（個人情報・非公開情報）、出力を職員が確かめる手順、記録の残し方、相談窓口の5つ。",
        ],
      },
      { h: "よくあるつまずき", p: ["ルールを細かく決めすぎて使われなくなる例が多い。最初は短いルールで始め、使い方の事例を集めて見直す。"] },
    ],
  },
  {
    id: "b-town-shinsei-dx",
    kind: "case",
    theme: "dx",
    title: "人口2万人のB町、よく使う申請10種類をオンラインにして窓口の混雑を減らした",
    lead: "利用の多い申請から順にオンライン化し、窓口では書き方の相談に時間を使えるようにした。",
    updated: "2026-10-30",
    minutes: 6,
    tags: ["窓口", "オンライン申請", "業務改善"],
    source: "（サンプル）B町 業務改善の報告",
    conditions: { population: "人口2万人", cost: "既存システムの範囲", personalData: "申請で扱う", staffing: "DX担当1名＋各課の担当" },
    sections: [
      { h: "進め方", p: ["窓口の記録から件数の多い申請を選び、10種類から始めた。", "各課の担当と一緒に、様式の項目を減らしてから電子化した。"] },
      { h: "結果", p: ["窓口の待ち時間が短くなり、職員は書き方の相談に時間を使えるようになった（町の報告・サンプル）。"] },
    ],
  },
  {
    id: "pr-chat-madoguchi",
    kind: "pr",
    theme: "dx",
    company: "サンプル行政テック株式会社（架空）",
    title: "住民からの問い合わせを夜間も受ける、自治体向けチャット窓口",
    lead: "よくある質問への回答と、職員への引き継ぎを組み合わせたチャット窓口。設定の手間と運用体制を企業が説明する。",
    updated: "2026-10-21",
    minutes: 4,
    tags: ["窓口", "チャット", "問い合わせ"],
    source: "サンプル行政テック株式会社（架空）提供",
    conditions: { population: "人口5万人以上", cost: "月額（要問い合わせ）", personalData: "問い合わせ内容で扱う", staffing: "各課1名" },
    sections: [{ h: "できること", p: ["よくある質問に答え、答えられない内容は担当課に引き継ぐ。"] }],
  },
  {
    id: "hoikusho-shinsei",
    kind: "public",
    theme: "kosodate",
    title: "保育所の入所申請、オンライン化で国が示している手順",
    lead: "保育の必要性の認定と入所申請をオンラインで受けるときの、国の手順と様式の考え方をまとめた。",
    updated: "2026-10-25",
    minutes: 5,
    tags: ["保育", "オンライン申請"],
    source: "（サンプル）子ども・子育て支援に関する国の通知",
    conditions: { ...BASE_COND, personalData: "申請で扱う" },
    sections: [{ h: "要点", p: ["添付書類の電子提出を認める範囲と、原本の確認が必要な場合の扱いが示されている。"] }],
  },
  {
    id: "c-city-gakudo",
    kind: "case",
    theme: "kosodate",
    title: "人口15万人のC市、学童の空き状況をウェブで公開して問い合わせを減らした",
    lead: "学童ごとの空き状況を週1回更新して公開し、電話での問い合わせを減らした。",
    updated: "2026-10-18",
    minutes: 5,
    tags: ["学童", "情報公開"],
    source: "（サンプル）C市 子育て支援課の報告",
    conditions: { population: "人口15万人", cost: "既存予算の範囲", personalData: "扱わない", staffing: "担当1名" },
    sections: [{ h: "取り組み", p: ["各学童から空き人数を集め、週1回ウェブで更新している。"] }],
  },
  {
    id: "mimamori-training",
    kind: "training",
    theme: "fukushi",
    title: "見守りネットワークをつくる：新任担当者のための研修（90分）",
    lead: "地域包括支援センター、民生委員、事業者と見守りの役割を分けるときの考え方を学ぶ研修教材。",
    updated: "2026-10-15",
    minutes: 90,
    tags: ["見守り", "地域包括ケア", "研修"],
    source: "編集部 研修教材（サンプル）",
    conditions: { ...BASE_COND, staffing: "研修の受講のみ" },
    sections: [{ h: "研修の内容", p: ["役割分担の考え方、情報共有のルール、事業者との協定の結び方を扱う。"] }],
  },
  {
    id: "kanko-kankeijinko",
    kind: "editorial",
    theme: "kanko",
    title: "関係人口の施策、効果をどう測るか",
    lead: "訪問回数や関わり方の段階など、関係人口の施策で使われる指標の選び方を編集部が整理した。",
    updated: "2026-10-12",
    minutes: 6,
    tags: ["関係人口", "指標", "評価"],
    source: "編集部（サンプル）",
    conditions: BASE_COND,
    featured: true,
    sections: [{ h: "指標の選び方", p: ["人数だけでなく、関わりの深さの段階を決めて数えると、施策の効果を比べやすい。"] }],
  },
  {
    id: "d-town-akiya",
    kind: "case",
    theme: "machi",
    title: "人口1万人のD町、空き家の相談窓口を不動産団体と一緒に開いた",
    lead: "所有者からの相談を町と不動産団体が一緒に受け、売却や賃貸につなげた。",
    updated: "2026-10-08",
    minutes: 5,
    tags: ["空き家", "官民連携"],
    source: "（サンプル）D町 まちづくり課の報告",
    conditions: { population: "人口1万人", cost: "相談会の開催費用", personalData: "相談で扱う", staffing: "担当1名＋団体" },
    sections: [{ h: "取り組み", p: ["月1回の相談会を開き、所有者の希望に応じて団体の会員につないだ。"] }],
  },
  {
    id: "gomi-genryo-template",
    kind: "template",
    theme: "kankyo",
    title: "ごみ減量の住民説明会：説明資料と質疑の想定（テンプレート）",
    lead: "分別ルールの変更を住民に説明するときの資料の構成と、よく出る質問への答え方のひな形。",
    updated: "2026-10-05",
    minutes: 3,
    tags: ["ごみ減量", "説明会", "テンプレート"],
    source: "編集部 テンプレート（サンプル）",
    conditions: BASE_COND,
    sections: [{ h: "構成", p: ["変更の理由 → 変わること → 始まる日 → 問い合わせ先、の順にする。"] }],
  },
  {
    id: "pr-ene-mieruka",
    kind: "pr",
    theme: "kankyo",
    company: "サンプルエナジー株式会社（架空）",
    title: "公共施設の電気の使い方を見える化して、省エネの手を打つ",
    lead: "施設ごとの電気の使い方をグラフで比べ、省エネの優先順位を決める仕組みを企業が説明する。",
    updated: "2026-09-30",
    minutes: 4,
    tags: ["省エネ", "公共施設"],
    source: "サンプルエナジー株式会社（架空）提供",
    conditions: { population: "規模を問わない", cost: "施設数に応じた月額（要問い合わせ）", personalData: "扱わない", staffing: "施設管理担当1名" },
    sections: [{ h: "できること", p: ["施設ごと・時間帯ごとの使用量を比べ、効果の大きい対策から並べる。"] }],
  },
  {
    id: "yosan-hensei-ai",
    kind: "editorial",
    theme: "zaisei",
    title: "予算要求の資料づくりで、生成AIに任せてよいこと・任せないこと",
    lead: "過去の資料の要約や論点の洗い出しは任せ、数字の確定と判断は職員が持つ。役割の分け方を整理した。",
    updated: "2026-09-26",
    minutes: 5,
    tags: ["予算編成", "生成AI"],
    source: "編集部（サンプル）",
    conditions: BASE_COND,
    sections: [{ h: "任せてよいこと", p: ["前年度資料の要約、論点の洗い出し、説明文のたたき台。数字と判断は職員が確かめる。"] }],
  },
  {
    id: "saiyo-shokuin",
    kind: "case",
    theme: "jinji",
    title: "人口6万人のE市、技術職の採用説明会を土日にオンラインで開いた",
    lead: "平日に参加しにくい社会人向けに、土日のオンライン説明会を開き、応募者の層を広げた。",
    updated: "2026-09-20",
    minutes: 5,
    tags: ["採用", "技術職", "オンライン"],
    source: "（サンプル）E市 人事課の報告",
    conditions: { population: "人口6万人", cost: "既存予算の範囲", personalData: "応募情報で扱う", staffing: "人事担当2名＋現場職員" },
    sections: [{ h: "取り組み", p: ["現場の職員が仕事の中身を話す時間を長くとった。"] }],
  },
  {
    id: "pubcom-tsuika",
    kind: "public",
    theme: "koho",
    title: "パブリックコメントの意見を整理するときの国の手引き",
    lead: "寄せられた意見のまとめ方と、考え方を公表するときの書き方について、国の手引きの要点をまとめた。",
    updated: "2026-09-15",
    minutes: 5,
    tags: ["パブリックコメント", "住民参加"],
    source: "（サンプル）意見公募手続に関する国の手引き",
    conditions: BASE_COND,
    sections: [{ h: "要点", p: ["同じ趣旨の意見はまとめてよいが、意見の要旨と考え方は対応が分かるように示す。"] }],
  },
  {
    id: "pr-koho-sns",
    kind: "pr",
    theme: "koho",
    company: "サンプル広報ラボ株式会社（架空）",
    title: "自治体SNSの投稿計画と効果の振り返りを、1つの画面で",
    lead: "投稿の予定づくりと、反応の振り返りをまとめて行う仕組みを企業が説明する。",
    updated: "2026-09-10",
    minutes: 4,
    tags: ["SNS", "広報"],
    source: "サンプル広報ラボ株式会社（架空）提供",
    conditions: { population: "規模を問わない", cost: "月額（要問い合わせ）", personalData: "扱わない", staffing: "広報担当1名" },
    sections: [{ h: "できること", p: ["投稿の予定を課ごとに集め、反応を月ごとに振り返る。"] }],
  },
  {
    id: "g-city-sougyou",
    kind: "case",
    theme: "sangyo",
    title: "人口20万人のG市、創業相談の窓口を商工団体・金融機関と一本化した",
    lead: "市・商工団体・金融機関でばらばらだった創業相談の入口を1つにし、相談の記録を共有して引き継ぎの手間を減らした。",
    updated: "2026-09-08",
    minutes: 6,
    tags: ["創業支援", "官民連携", "中小企業"],
    source: "（サンプル）G市 産業振興課の報告",
    conditions: { population: "人口20万人", cost: "既存予算の範囲", personalData: "相談記録で扱う", staffing: "担当2名＋連携機関" },
    featured: true,
    sections: [{ h: "取り組み", p: ["相談の受付票を3者で共通にし、本人の同意を得て記録を共有した。"] }],
  },
  {
    id: "kenshin-juushin",
    kind: "case",
    theme: "kenko",
    title: "人口12万人のF市、特定健診の受診の案内を対象者ごとに変えた",
    lead: "前年度の受診状況に合わせて案内の文面と時期を変え、受診の申し込みを増やした。",
    updated: "2026-09-05",
    minutes: 6,
    tags: ["特定健診", "受診勧奨"],
    source: "（サンプル）F市 健康推進課の報告",
    conditions: { population: "人口12万人", cost: "通知の印刷・郵送費", personalData: "受診状況で扱う", staffing: "保健師2名" },
    sections: [{ h: "取り組み", p: ["初めての人、毎年受ける人、数年受けていない人で案内の文面を分けた。"] }],
  },
];

export type Seminar = {
  id: string;
  date: string; // YYYY-MM-DD
  time: string;
  title: string;
  theme: ThemeSlug;
  format: "オンライン" | "会場" | "オンライン＋会場";
  host: string;
  sponsor?: string; // 協賛（架空）
};

export const SEMINARS: Seminar[] = [
  { id: "s1", date: "2026-12-03", time: "15:00〜16:00", title: "避難所の受付訓練を始めるための準備", theme: "bousai", format: "オンライン", host: "編集部" },
  { id: "s2", date: "2026-12-10", time: "14:00〜15:30", title: "生成AIの庁内ルールを短く始める", theme: "dx", format: "オンライン", host: "編集部" },
  { id: "s3", date: "2026-12-17", time: "13:30〜15:00", title: "公共施設の省エネ、効果の大きい順に手を打つ", theme: "kankyo", format: "オンライン＋会場", host: "編集部", sponsor: "サンプルエナジー株式会社（架空）" },
  { id: "s4", date: "2027-01-21", time: "15:00〜16:00", title: "関係人口の施策、指標の選び方", theme: "kanko", format: "オンライン", host: "編集部" },
];

export const TRENDING = ["避難所運営", "生成AI", "オンライン申請", "空き家", "特定健診", "パブリックコメント", "省エネ"];

export function themeOf(slug: ThemeSlug) {
  return THEMES.find((t) => t.slug === slug)!;
}

export function articleById(id: string) {
  return ARTICLES.find((a) => a.id === id);
}

// 並び順は更新日の新しい順。PR を上位に固定しない。
export function byUpdated(list: Article[]) {
  return [...list].sort((a, b) => (a.updated < b.updated ? 1 : -1));
}

export function formatDate(d: string) {
  const [y, m, day] = d.split("-");
  return `${y}年${Number(m)}月${Number(day)}日`;
}
