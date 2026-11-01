// お店をさがす・並べる・リンクを作るための関数。画面には触らない（だから、画面なしでテストできる）

// 市や町を並べる順番。お店が1軒もない市や町は、ボタンを出さない
export const CITY_ORDER = ["酒田市", "三川町", "庄内町", "遊佐町"];

// 「チラシを さがす」ボタンで開くページ（トクバイの、庄内地方のチラシ一覧）
// ※ リンクを開くだけ。このアプリから、トクバイへ自動でアクセスすることはしない
const FLYER_AREA_URL = "https://tokubai.co.jp/prefectures/6/areas/96/leaflet";

// ----- あいうえお順に並べる（読みがなで比べる）-----
const kanaCollator = new Intl.Collator("ja");

export function sortByKana(storeList) {
  // もとのリストは変えずに、並べかえたコピーを返す（読みがながなければ店名で比べる）
  return storeList.slice().sort(function (a, b) {
    return kanaCollator.compare((a.kana || a.name).replace(/\s/g, ""), (b.kana || b.name).replace(/\s/g, ""));
  });
}

// 市や町ごとのお店の数を数える
export function countStoresByCity(storeList) {
  const counts = {};
  storeList.forEach(function (store) {
    counts[store.city] = (counts[store.city] || 0) + 1;
  });
  return counts;
}

// ----- お店の名前でさがす -----

// 文字をそろえる（ひらがな・カタカナ・全角・半角・大文字小文字のちがいを無くす）
export function normalizeText(text) {
  return text
    .normalize("NFKC")                 // 全角の英数字・半角カタカナを、ふつうの形にそろえる
    .toLowerCase()                     // 英字を小文字にそろえる
    .replace(/[ァ-ヶ]/g, function (ch) {
      // カタカナを、ひらがなに変える（文字コードを 0x60 ずらすと変わる）
      return String.fromCharCode(ch.charCodeAt(0) - 0x60);
    })
    .replace(/[\s・]/g, "");           // 空白と「・」を取りのぞく
}

// 文字の種類を調べる
function charKind(ch) {
  if (/[ァ-ヶｦ-ﾟ]/.test(ch)) return "katakana";
  if (/[ぁ-ん]/.test(ch)) return "hiragana";
  if (/[一-龥々]/.test(ch)) return "kanji";
  if (/[A-Za-zＡ-Ｚａ-ｚ0-9０-９]/.test(ch)) return "latin";
  return "other";
}

// 店名を「単語」に分ける（文字の種類が変わるところ、「・」や空白で区切る。1文字の単語は使わない）
// 例：「ザ・ビッグ酒田北店」→「ビッグ」「酒田北店」／「スーパーのアオキ三川店」→「スーパー」「アオキ」「三川店」
function splitNameWords(name) {
  const words = [];
  let current = "";
  let currentKind = "";
  Array.from(name).forEach(function (ch) {
    const kind = charKind(ch);
    // 「ー」（のばす棒）は、前の文字の仲間として、つなげる
    const isLongMark = (ch === "ー" || ch === "ｰ");
    if (kind === "other" && !isLongMark) {
      if (current !== "") words.push(current);
      current = "";
      currentKind = "";
      return;
    }
    if (!isLongMark && currentKind !== "" && kind !== currentKind) {
      words.push(current);
      current = "";
    }
    current += ch;
    if (!isLongMark) currentKind = kind;
  });
  if (current !== "") words.push(current);
  return words.filter(function (w) { return w.length >= 2; });
}

// 読みがなは、単語の区切りが「スペース」で書いてある（data/stores.js）
function splitKanaWords(kana) {
  return (kana || "").split(/\s+/).filter(function (w) { return w.length >= 2; });
}

// 店名か読みがなの「頭の文字」、または、店名の中の「単語の頭の文字」が合うかを調べる
function matchesStore(store, word) {
  const starts = function (text) { return normalizeText(text).startsWith(word); };
  return starts(store.name) ||
         starts(store.kana || "") ||
         splitNameWords(store.name).some(starts) ||
         splitKanaWords(store.kana).some(starts);
}

export function findStoresByName(storeList, query) {
  const word = normalizeText(query);
  if (word === "") {
    return [];
  }
  return storeList.filter(function (store) {
    return matchesStore(store, word);
  });
}

// ----- お店の名前を、自然な場所で折り返せるようにする -----
// チェーンの名前のあとに、見えない区切り（ゼロ幅スペース U+200B）を入れる。表示のためだけで、検索には使わない
const NAME_BREAK_PREFIXES = ["マックスバリュ", "ヤマザワ", "ザ・ビッグ", "スーパーの", "スーパー", "こぴあコープ", "Aコープ", "イオン", "ト一屋"];
const NAME_BREAK_OVERRIDES = { "といちやいろは蔵パーク店": "といちや​いろは蔵​パーク店" };

export function breakableName(name) {
  if (NAME_BREAK_OVERRIDES[name]) {
    return NAME_BREAK_OVERRIDES[name];
  }
  const prefix = NAME_BREAK_PREFIXES.find(function (p) {
    return name.startsWith(p) && name.length > p.length;
  });
  return prefix ? prefix + "​" + name.slice(prefix.length) : name;
}

// ----- リンク -----

// 「https://tokubai.co.jp/チェーン名/店番号」の形のURLだけを、OKにする
function isTokubaiStoreUrl(url) {
  if (typeof url !== "string") {
    return false;
  }
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" &&
           parsed.hostname === "tokubai.co.jp" &&
           /^\/(?!prefectures|areas|leaflets|search)[^/]+\/\d+\/?$/.test(decodeURIComponent(parsed.pathname));
  } catch (error) {
    return false;
  }
}

// 「チラシを さがす」の行き先：お店のトクバイのページ。登録がなければ、庄内地方のページ
export function getFlyerUrl(store) {
  return isTokubaiStoreUrl(store.flyerUrl) ? store.flyerUrl : FLYER_AREA_URL;
}

// URLが http:// か https:// で始まるものかを調べる（まちがったデータで、おかしなリンクを作らないため）
export function isSafeUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch (error) {
    console.error("URLの形が正しくありません:", url, error);
    return false;
  }
}

// Googleマップの「行き方」を開くURLを作る（出発点は書かないので、Googleマップが現在地を使う）
export function createRouteUrl(store) {
  return "https://www.google.com/maps/dir/?api=1&destination=" + store.lat + "," + store.lng;
}

// ----- 現在地からの距離 -----

// 2つの場所の、まっすぐな距離（km）を計算する（ハバーサイン公式）
export function calcDistanceKm(lat1, lng1, lat2, lng2) {
  const earthRadiusKm = 6371;
  const toRadian = function (degree) {
    return degree * Math.PI / 180;
  };
  const dLat = toRadian(lat2 - lat1);
  const dLng = toRadian(lng2 - lng1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadian(lat1)) * Math.cos(toRadian(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// 距離を、読みやすい文字にする（例：「約 1.2 km」「約 430 m」）
export function formatDistance(km) {
  // 10m単位に丸める。0m と表示されないよう、最小は 10m にする
  const meters = Math.max(10, Math.round(km * 100) * 10);
  if (meters < 1000) {
    return "約 " + meters + " m";
  }
  return "約 " + km.toFixed(1) + " km";
}

// 緯度と経度が数字で入っているお店かどうか
export function hasPosition(store) {
  return typeof store.lat === "number" && typeof store.lng === "number";
}

// 現在地から近い順に、お店を並べる。戻り値：{ sorted: 近い順のお店, distances: お店のidごとの距離 }
export function sortStoresByDistance(storeList, lat, lng) {
  const distances = {};
  const withPosition = storeList.filter(hasPosition);

  withPosition.forEach(function (store) {
    distances[store.id] = calcDistanceKm(lat, lng, store.lat, store.lng);
  });

  const sorted = withPosition.slice().sort(function (a, b) {
    return distances[a.id] - distances[b.id];
  });

  return { sorted: sorted, distances: distances };
}
