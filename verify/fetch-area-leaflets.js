// ===========================================
// 学習用の検証：トクバイの「庄内地方のチラシ一覧」ページから、チラシのリンクを取り出す
//
// 使い方（ターミナルで、shopping-navi フォルダの中から）:
//   node verify/fetch-area-leaflets.js
//
// 守ること（大事）:
//   ・読み込むのは、下の AREA_URL の1ページだけ。1回だけ実行する（くり返さない）
//   ・結果は、ターミナルに表示するだけ。ファイルに保存しない・公開しない・アプリに組み込まない
//   ・チラシの画像や文章は、取り出さない。取り出すのは「リンク」と「店名・店番号」だけ
//   ・学習・確認のためだけに使う（営利目的には使わない）
//
// テスト用：
//   node verify/fetch-area-leaflets.js --html 手元のHTMLファイル   … ネットにつながず、手元のファイルで試す
// ===========================================

const fs = require("fs");

// 読み込むページ（トクバイ：山形県・庄内地方のチラシ一覧）
const AREA_URL = "https://tokubai.co.jp/prefectures/6/areas/96/leaflet";
const LEAFLET_MARK = "/leaflets/";
const USER_AGENT = "shopping-navi-learning/1.0 (personal study, single request)";

const args = process.argv.slice(2);
const htmlFileIndex = args.indexOf("--html");
const htmlFile = htmlFileIndex >= 0 ? args[htmlFileIndex + 1] : undefined;

// ① ページのHTMLを手に入れる（ふだんは、ネットから1回だけ。テストのときは、手元のファイルから）
async function getHtml() {
  if (htmlFile) {
    console.log("（テスト）手元のファイルを読みます: " + htmlFile + "\n");
    return fs.readFileSync(htmlFile, "utf8");
  }

  console.log("1ページだけ読み込みます: " + AREA_URL + "\n");
  const response = await fetch(AREA_URL, { headers: { "User-Agent": USER_AGENT } });
  if (!response.ok) {
    console.error("ページを読み込めませんでした。状態:", response.status);
    process.exit(1);
  }
  return response.text();
}

// %E3%82... を日本語に戻す。変な文字があっても止まらないようにする
function safeDecode(text) {
  try {
    return decodeURIComponent(text);
  } catch (error) {
    return text;
  }
}

// タグ（<...>）をとって、文字だけにする
function textOnly(html) {
  return html.replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}

// ② HTMLの中から、チラシへのリンク（aタグ）を取り出す
function findLeafletLinks(html) {
  const links = new Map(); // 同じリンクは1つにまとめる（URL → 表示されている文字）
  const anchorPattern = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/g;

  for (const match of html.matchAll(anchorPattern)) {
    const href = match[1].replace(/&amp;/g, "&");
    let url;
    try {
      url = new URL(href, AREA_URL); // 短い書き方（/イオン/...）を、完全なURLにする
    } catch (error) {
      continue;
    }
    if (url.hostname !== "tokubai.co.jp" || !safeDecode(url.pathname).includes(LEAFLET_MARK)) {
      continue;
    }
    const cleanUrl = url.origin + url.pathname; // ?以降（アクセスの印など）は、とる
    if (!links.has(cleanUrl)) {
      links.set(cleanUrl, textOnly(match[2]).slice(0, 30));
    }
  }
  return links;
}

// ③ リンクを、お店ごとにまとめる（/店名/店番号/leaflets/チラシ番号 の形）
function groupByStore(links) {
  const stores = new Map();
  const others = [];
  const pathPattern = /^\/([^/]+)\/(\d+)\/leaflets\/(\d+)/;

  for (const [url, text] of links) {
    const path = safeDecode(new URL(url).pathname);
    const parts = pathPattern.exec(path);
    if (!parts) {
      others.push(safeDecode(url));
      continue;
    }
    const key = parts[1] + "（店番号 " + parts[2] + "）";
    if (!stores.has(key)) stores.set(key, []);
    stores.get(key).push({ leafletId: parts[3], text: text });
  }
  return { stores: stores, others: others };
}

async function main() {
  const html = await getHtml();
  const links = findLeafletLinks(html);
  const grouped = groupByStore(links);

  console.log("チラシのリンク：" + links.size + " 件（重複を除く）");
  console.log("お店の数：" + grouped.stores.size + " 軒\n");

  for (const [store, leaflets] of grouped.stores) {
    console.log("■ " + store + "：" + leaflets.length + " 件");
    leaflets.forEach(function (leaflet) {
      console.log("    チラシ番号 " + leaflet.leafletId + (leaflet.text ? "　「" + leaflet.text + "」" : ""));
    });
  }
  if (grouped.others.length > 0) {
    console.log("\n■ 形が違うリンク：" + grouped.others.length + " 件");
    grouped.others.slice(0, 10).forEach(function (url) { console.log("    " + url); });
  }

  if (links.size === 0) {
    console.log("1件も見つかりませんでした。");
    console.log("チラシの一覧が、ページを開いたあとに、JavaScriptで作られている可能性があります。");
    console.log("その場合は、ブラウザのコンソールで querySelectorAll を使う方法（課題1の方法a）を使ってください。");
  }

  console.log("\n※ 結果は、保存していません。学習用の確認のため、アプリには組み込みません。");
}

main().catch(function (error) {
  console.error("うまくいきませんでした:", error.message);
  process.exit(1);
});
