import { type Article, KIND_LABEL, formatDate, themeOf } from "./content";

// デモ用の「下書き」。実際の生成AIではなく、選んだ記事の中身から論点表を組み立てる。
// PR は職員が自分で選んだときだけ入り、企業提供と明示する。
export function buildDraft(items: Article[]) {
  if (items.length === 0) return { title: "", blocks: [] as { h: string; lines: string[] }[], refs: [] as string[] };
  const theme = themeOf(items[0].theme).name;
  const refs = items.map((a, i) => `[${i + 1}] ${a.source}（${KIND_LABEL[a.kind]}、${formatDate(a.updated)}更新）`);
  const tag = (i: number) => `[${i + 1}]`;
  const blocks = [
    {
      h: "1. 検討の目的",
      lines: [`${theme}について、他の自治体の取り組みと国の考え方を参考に、当市での進め方を検討する。`],
    },
    {
      h: "2. 参考にした情報",
      lines: items.map((a, i) => `${a.kind === "pr" ? "【企業提供】" : ""}${a.title} ${tag(i)}`),
    },
    {
      h: "3. 条件の比べ方",
      lines: items.map((a, i) => `${tag(i)} 人口規模：${a.conditions.population}／費用：${a.conditions.cost}／個人情報：${a.conditions.personalData}／体制：${a.conditions.staffing}`),
    },
    {
      h: "4. 論点",
      lines: [
        "当市の人口規模と体制で、同じ進め方ができるか",
        items.some((a) => a.conditions.personalData !== "扱わない") ? "個人情報を扱う範囲と、閲覧できる人の決め方" : "個人情報は扱わない前提でよいか",
        "費用を既存予算で賄えるか、新たな予算要求が要るか",
        items.some((a) => a.kind === "pr") ? "企業提供の情報は、他社の同種サービスとも比べたうえで判断する" : "必要に応じて民間サービスも比べる",
      ],
    },
    {
      h: "5. 次に確かめること",
      lines: ["出典の原文で、数字と条件を確かめる", "関係課（情報政策・財政）に、論点の見立てを相談する"],
    },
  ];
  return { title: `${theme}に関する検討メモ（下書き）`, blocks, refs };
}
