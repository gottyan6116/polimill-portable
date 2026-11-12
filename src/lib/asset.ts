// GitHub Pages では basePath 配下に置かれるため、public の画像はこの関数でパスを作る
export const asset = (p: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${p}`;
