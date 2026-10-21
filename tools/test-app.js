// ===========================================
// アプリ（index.html と js/app.js）の自動テスト
//
// ブラウザの代わりに、「ニセの画面」（簡単な部品のまがいもの）を使って、
// 画面の切り替え・検索・近い順・ボタンの出し分けが、思ったとおり動くかを確かめる。
//
// 使い方（shopping-navi フォルダの中から）:
//   node tools/test-app.js
// ===========================================

const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");

// ---- ニセの画面部品 ----
function createElement(tag) {
  return {
    tag: tag, children: [], listeners: {}, attrs: {}, hidden: false, disabled: false,
    _text: "", value: "", className: "", href: "", target: "", rel: "",
    appendChild: function (child) { this.children.push(child); return child; },
    setAttribute: function (key, value) { this.attrs[key] = value; },
    hasAttribute: function (key) { return key in this.attrs; },
    addEventListener: function (type, fn) { this.listeners[type] = fn; },
    focus: function () {},
    querySelector: function () { return this.h2 || null; },
    set textContent(value) { this._text = value; if (value === "") this.children = []; },
    get textContent() { return this._text; }
  };
}

// index.html の中の id を全部、ニセの部品として用意する（hidden が付いているものは、最初から隠す）
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const elements = {};
[...html.matchAll(/id="([^"]+)"/g)].forEach(function (m) { elements[m[1]] = createElement("x"); });
Object.keys(elements).forEach(function (id) {
  const tagText = html.match(new RegExp('id="' + id + '"[^>]*>'))[0];
  if (/hidden/.test(tagText)) elements[id].hidden = true;
  elements[id].h2 = Object.assign(createElement("h2"), { attrs: { tabindex: "-1" } });
});

const bodyClasses = new Set(["is-top"]);
const fakeDocument = {
  body: { themes: [], setAttribute: function (k, v) { this.theme = v; }, removeAttribute: function () { this.theme = null; }, classList: { toggle: function (name, on) { on ? bodyClasses.add(name) : bodyClasses.delete(name); } } },
  getElementById: function (id) {
    if (!elements[id]) throw new Error("index.html に id がありません: " + id);
    return elements[id];
  },
  createElement: createElement,
  createTextNode: function (t) { return { text: t }; },
  createElementNS: function (ns, tag) { return createElement(tag); }
};

// stores.js と app.js を読み込んで動かす
function run(geolocation) {
  const code = fs.readFileSync(path.join(root, "data", "stores.js"), "utf8") + "\n" +
               fs.readFileSync(path.join(root, "js", "app.js"), "utf8") +
               "\nreturn { createStoreCard: createStoreCard };";
  return new Function("document", "window", "navigator", code)(fakeDocument, { scrollTo: function () {} }, { geolocation: geolocation });
}

let allOk = true;
function check(name, condition) {
  console.log((condition ? "OK  " : "NG  ") + name);
  if (!condition) allOk = false;
}
const linkBlocks = function (card) { return card.children.filter(function (c) { return c.className === "link-button-block"; }); };

const api = run({ getCurrentPosition: function (success) { success({ coords: { latitude: 38.9115, longitude: 139.8413 } }); } });

// ---- 市や町 ----
elements["button-city"].listeners.click();
check("市町ボタン4つ（酒田・三川・庄内・遊佐。鶴岡は対象外）", elements["city-buttons"].children.length === 4);
elements["city-buttons"].children[0].listeners.click();
check("酒田市13枚", elements["store-list"].children.length === 13);
const namesOf = function (list) { return list.children.map(function (card) { return card.children[0]._text.replace(/\u200b/g, ""); }); };   // 表示用の見えない区切りは、とって比べる
const kanaOrder = new Intl.Collator("ja");
const sakataNames = namesOf(elements["store-list"]);
check("酒田市の一覧は あいうえお順（先頭：イオン酒田南店、最後：ヤマザワ東大町店）", sakataNames[0] === "イオン酒田南店" && sakataNames[12] === "ヤマザワ東大町店");
check("一覧画面だけ表示", elements["screen-list"].hidden === false && elements["screen-city"].hidden === true);
check("一覧では表紙用の大きな名前は出さない", !bodyClasses.has("is-top"));
elements["back-to-top-from-list"].listeners.click();
check("表紙に戻ると大きな名前が出る", bodyClasses.has("is-top"));
check("表紙へ戻る", elements["screen-top"].hidden === false && elements["screen-list"].hidden === true);

// ---- 店名 ----
elements["button-name"].listeners.click();
function search(query) {
  elements["name-input"].value = query;
  elements["name-form"].listeners.submit({ preventDefault: function () {} });
}
search("まっくすばりゅ");
check("まっくすばりゅ→4件", elements["name-result-list"].children.length === 4 && elements["name-other-way"].hidden === true);
check("店名検索の結果も 読みがなの あいうえお順（あまるめ → ひがしいずみ → ひらた → ゆざ）", namesOf(elements["name-result-list"]).join("|") === "マックスバリュ余目店|マックスバリュ東泉店|マックスバリュ平田店|マックスバリュゆざエルパ店");
const hitCount = function (q) { search(q); return elements["name-result-list"].children.length; };
const hitNames = function (q) { search(q); return elements["name-result-list"].children.map(function (c) { return c.children[0]._text.replace(/\u200b/g, ""); }); };
check("店名の頭：「ばりゅ」（「マックスバリュ」の途中）は見つからない", hitCount("ばりゅ") === 0 && elements["name-message"]._text.includes("見つかりませんでした"));
check("頭の文字：「やまざわ」→4件、「ヤマ」→4件、「ﾔﾏ」（半角）→4件", hitCount("やまざわ") === 4 && hitCount("ヤマ") === 4 && hitCount("ﾔﾏ") === 4);
check("頭の文字：「いおん」→2件、「すーぱー」→2件、「えーこーぷ」→3件", hitCount("いおん") === 2 && hitCount("すーぱー") === 2 && hitCount("えーこーぷ") === 3);
check("単語の頭：「ビッグ」「びっぐ」→ザ・ビッグ酒田北店", hitNames("ビッグ").join() === "ザ・ビッグ酒田北店" && hitNames("びっぐ").join() === "ザ・ビッグ酒田北店");
check("単語の頭：「アオキ」「あおき」→スーパーアオキ・スーパーのアオキ三川店", hitCount("アオキ") === 2 && hitCount("あおき") === 2);
check("単語の頭：「酒田」→3件（イオン酒田南・ザ・ビッグ酒田北・こぴあコープ酒田）", hitCount("酒田") === 3);
check("単語の頭：「余目」「あまるめ」→3件", hitCount("余目") === 3 && hitCount("あまるめ") === 3);
check("単語の頭：「ゆざ」→2件（ゆざエルパ店・Aコープ遊佐店）、「エルパ」→1件、「コープ」→4件", hitCount("ゆざ") === 2 && hitCount("エルパ") === 1 && hitCount("コープ") === 4);
check("単語の途中の文字は見つからない：「ッグ」「るぱ」「ざわ」", hitCount("ッグ") === 0 && hitCount("るぱ") === 0 && hitCount("ざわ") === 0);
search("まっくすばりゅ");
search("ほげ");
check("ほげ→0件・別の探し方ボタン表示", elements["name-result-list"].children.length === 0 && elements["name-other-way"].hidden === false);
search("   ");
check("空→お願い表示", elements["name-message"]._text.includes("入れてください"));

// ---- 現在地 ----
elements["button-location"].listeners.click();
elements["button-use-location"].listeners.click();
const cards = elements["location-result-list"].children;
check("現在地→22件・近い順", cards.length === 22);
// 「ここから 約 430 m」「ここから 約 1.3 km」を、km の数字にもどす
const distanceText = function (card) {
  const text = card.children[1]._text;
  const number = parseFloat(text.replace(/[^0-9.]/g, ""));
  return text.includes("km") ? number : number / 1000;
};
const distancesInOrder = cards.map(distanceText);
check("現在地の結果は、あいうえお順ではなく、近い順のまま", distancesInOrder.every(function (d, i) { return i === 0 || distancesInOrder[i - 1] <= d; }));
check("カードに距離が出る", cards[0].children[1].className === "store-distance");
check("行き方ボタン（いちばん下）のURLに緯度経度", linkBlocks(cards[0]).pop().children[0].href.startsWith("https://www.google.com/maps/dir/?api=1&destination=38."));

// ---- 全店のカード ----
elements["button-city"].listeners.click();
elements["city-buttons"].children[2].listeners.click(); // 庄内町
const noticeCount = function (c) { return c.children.filter(function (x) { return x.className === "flyer-none"; }).length; };
check("庄内町の全カードに チラシ（ボタンか案内）・お店のページ・行き方 の3つ", elements["store-list"].children.every(function (c) { return linkBlocks(c).length + noticeCount(c) === 3; }));
check("「くわしく見る」は出さない", elements["store-list"].children.every(function (c) { return !c.children.some(function (x) { return x.className === "store-detail"; }); }));

// ---- 位置のないお店（データを足したときの備え）----
const noPosition = api.createStoreCard({ id: "x", name: "テスト", city: "庄内町", officialUrl: "https://example.com/" });
check("位置なしのお店は 行き方ボタン無し（チラシとお店のページは出る）", linkBlocks(noPosition).length === 2);
const labelOf = function (block) {
  return block.children[0].children[1].children.map(function (c) { return c._text !== undefined ? c._text : c.text; }).join("");
};
const order = linkBlocks(api.createStoreCard({ id: "o", name: "順番", city: "酒田市", officialUrl: "https://example.com/", lat: 38.9, lng: 139.8 })).map(labelOf);
check("ボタンの順番：チラシ → お店のページ → 行き方", order.join("|") === "チラシを さがす|お店の ページを 見る|行き方を 調べる");

// ---- チラシボタン・お店のページボタン ----
const sample = api.createStoreCard({ id: "y", name: "テスト", city: "酒田市", officialUrl: "https://example.com/", lat: 38.9, lng: 139.8 });
const flyer = linkBlocks(sample)[0].children[0];
check("チラシボタンの行き先がトクバイ庄内", flyer.href === "https://tokubai.co.jp/prefectures/6/areas/96/leaflet");
check("チラシボタンは新しいタブ・noopener", flyer.target === "_blank" && flyer.rel === "noopener noreferrer");
const shopPage = linkBlocks(sample)[1].children[0];
check("お店のページボタンの行き先が公式ページ", shopPage.href === "https://example.com/" && shopPage.target === "_blank");
// ---- お店ごとのチラシ（flyerUrl）----
const FLYER_AREA = "https://tokubai.co.jp/prefectures/6/areas/96/leaflet";
const flyerOf = function (store) { return linkBlocks(api.createStoreCard(store))[0].children[0].href; };
const base = { id: "f", name: "チラシ", city: "酒田市", officialUrl: "https://example.com/", lat: 38.9, lng: 139.8 };
check("flyerUrl があれば、そのお店のトクバイのページへ", flyerOf(Object.assign({}, base, { flyerUrl: "https://tokubai.co.jp/イオン/12598" })) === "https://tokubai.co.jp/イオン/12598");
check("flyerUrl がなければ、庄内地方のページへ", flyerOf(base) === FLYER_AREA);
check("チラシ1枚ごとのURLは、使わずに庄内地方のページへ", flyerOf(Object.assign({}, base, { flyerUrl: "https://tokubai.co.jp/イオン/12598/leaflets/106885647" })) === FLYER_AREA);
check("トクバイ以外のURLは、使わずに庄内地方のページへ", flyerOf(Object.assign({}, base, { flyerUrl: "https://example.com/イオン/12598" })) === FLYER_AREA);
check("http のURLは、使わずに庄内地方のページへ", flyerOf(Object.assign({}, base, { flyerUrl: "http://tokubai.co.jp/イオン/12598" })) === FLYER_AREA);
check("エリアのページのURL（/prefectures/6）は、お店のページとして使わない", flyerOf(Object.assign({}, base, { flyerUrl: "https://tokubai.co.jp/prefectures/6" })) === FLYER_AREA);
check("変な文字のURLでも、止まらずに庄内地方のページへ", flyerOf(Object.assign({}, base, { flyerUrl: "%%%" })) === FLYER_AREA);
const none = api.createStoreCard(Object.assign({}, base, { flyerUrl: null }));
const noneNotice = none.children.find(function (c) { return c.className === "flyer-none"; });
check("flyerUrl が null のお店は、チラシボタンの代わりに「こちらでは チラシが 検索されませんでした…」", !!noneNotice && noneNotice.children[1]._text === "こちらでは チラシが 検索\nできませんでした。\nページを ご確認ください。" && linkBlocks(none).length === 2);
check("案内は、1番目（市や町の次）の位置に出る", none.children.findIndex(function (c) { return c.className === "flyer-none"; }) < none.children.findIndex(function (c) { return c.className === "link-button-block"; }));

// ---- 本物のデータ ----
const allStores = new Function(fs.readFileSync(path.join(root, "data", "stores.js"), "utf8") + "\nreturn stores;")();
check("全22軒の flyerUrl が決まっている（URL か null）", allStores.length === 22 && allStores.every(function (s) { return s.flyerUrl === null || typeof s.flyerUrl === "string"; }));
const nullIds = allStores.filter(function (s) { return s.flyerUrl === null; }).map(function (s) { return s.id; }).sort().join(",");
check("トクバイに掲載なしの8軒（ト一屋2店・スーパーアオキ・週末びっくり市・いろは蔵パーク・Aコープ余目・Aコープ遊佐・グリーンストア）", nullIds === "sakata-002,sakata-003,sakata-005,sakata-006,sakata-010,shonai-001,yuza-001,yuza-004");
check("トクバイのお店のページを登録しているのは14軒", allStores.filter(function (s) { return typeof s.flyerUrl === "string"; }).length === 14);
check("flyerUrl のURLは、すべて https://tokubai.co.jp/チェーン名/店番号 の形", allStores.filter(function (s) { return typeof s.flyerUrl === "string"; }).every(function (s) {
  const u = new URL(s.flyerUrl);
  return u.protocol === "https:" && u.hostname === "tokubai.co.jp" && /^\/(?!prefectures|areas|leaflets|search)[^/]+\/\d+\/?$/.test(decodeURIComponent(u.pathname));
}));
check("イオン酒田南店は、トクバイの店舗ページ（店番号 12598）", allStores.find(function (s) { return s.id === "sakata-001"; }).flyerUrl === "https://tokubai.co.jp/イオン/12598");
check("同じ店番号のURLが重複していない", new Set(allStores.filter(function (s) { return s.flyerUrl; }).map(function (s) { return s.flyerUrl.replace("Aコープ", "A"); })).size === allStores.filter(function (s) { return s.flyerUrl; }).length);

const noUrl = api.createStoreCard({ id: "z", name: "URLなし", city: "酒田市", officialUrl: "javascript:alert(1)", lat: 38.9, lng: 139.8 });
check("URLが安全でないお店は、お店のページボタンを出さない", linkBlocks(noUrl).length === 2);

console.log(allOk ? "ALL OK" : "FAILED");
process.exit(allOk ? 0 : 1);
