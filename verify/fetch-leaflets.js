// ===========================================
// 課題1：トクバイの店舗ページから、チラシのURLを取り出す
//
// 使い方（ターミナルで、shopping-navi フォルダの中から）:
//   node verify/fetch-leaflets.js
//
// 守ること:
//   ・読み込むのは、下の STORE_URL の1ページだけ。1回だけ実行する
//   ・くり返し実行したり、ほかのページへ広げたりしない（相手のサーバーに負担をかけない）
//   ・取り出した結果は学習用。shopping-navi のアプリには組み込まない
// ===========================================

// 読み込むページ（イオン酒田南店）
const STORE_URL = "https://tokubai.co.jp/イオン/12598";

// チラシのURLかどうかを見分ける目印
const LEAFLET_MARK = "/leaflets/";

async function main() {
  // ① ページのHTMLを、1回だけ取りに行く
  //    User-Agent は「だれがアクセスしているか」の名札。ブラウザのふりはせず、正直に書く
  const response = await fetch(STORE_URL, {
    headers: { "User-Agent": "shopping-navi-learning/1.0 (personal study, single request)" }
  });

  if (!response.ok) {
    console.error("ページを読み込めませんでした。状態:", response.status);
    process.exit(1);
  }

  const html = await response.text();

  // ② HTMLの中から、リンク先（href="..."）を全部取り出す
  const hrefs = [...html.matchAll(/href=["']([^"']+)["']/g)].map(function (match) {
    return match[1].replace(/&amp;/g, "&"); // HTMLの書き方（&amp;）を、ふつうの & に戻す
  });

  // ③ 短い書き方（/イオン/12598/... など）を、https:// から始まる完全なURLにそろえる
  const fullUrls = [];
  hrefs.forEach(function (href) {
    try {
      fullUrls.push(new URL(href, STORE_URL).href);
    } catch (error) {
      // URLとして読めないものは、とばす
    }
  });

  // ④ チラシのURLだけを残して、重複をなくす
  const leafletUrls = [...new Set(fullUrls.filter(function (url) {
    return safeDecode(url).includes(LEAFLET_MARK);
  }))];

  // ⑤ 結果を表示する（読みやすいように、日本語に戻して表示）
  console.log(leafletUrls.length + " 件見つかりました");
  leafletUrls.forEach(function (url) {
    console.log(safeDecode(url));
  });

  if (leafletUrls.length === 0) {
    console.log("");
    console.log("1件も見つかりませんでした。");
    console.log("チラシのリンクが、ページを開いたあとにJavaScriptで作られている可能性があります。");
    console.log("その場合は、ブラウザのコンソールで querySelectorAll を使う方法（方法a）を使ってください。");
  }
}

// %E3%82... を日本語に戻す。変な文字があっても止まらないようにする
function safeDecode(text) {
  try {
    return decodeURIComponent(text);
  } catch (error) {
    return text;
  }
}

main().catch(function (error) {
  console.error("うまくいきませんでした:", error.message);
  process.exit(1);
});
