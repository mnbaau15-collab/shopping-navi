// ===========================================
// 店舗データ（data/stores.js）の「自動チェック」プログラム
//
// 考え方：
//   データの書き換えは、人が確認してから行う。
//   このプログラムは「確認が必要なところを見つけて、知らせる」ところまでを自動にする。
//   （お店のページの中身は読み取らない。リンクが開けるかだけを見る）
//
// ※ トクバイへの自動アクセスは、しない（flyerUrl は、形の検査だけ。開けるかは、人が verify/flyer-urls.html で確認する）
//
// 使い方（shopping-navi フォルダの中から）:
//   node tools/check-stores.js                  … データの形だけを調べる（ネットにつながない）
//   node tools/check-stores.js --links          … 加えて、各お店のURLが開けるかを、1軒1回だけ調べる
//   node tools/check-stores.js --links --report report.md   … 結果を文章のファイルにも書く
//   --file 別のファイル                          … 調べるデータのファイルを変える（テスト用）
// ===========================================

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
function valueOf(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

const checkLinks = args.includes("--links");
const dataFile = valueOf("--file") || path.join(__dirname, "..", "data", "stores.js");
const reportFile = valueOf("--report");

// ---- 決まりごと ----
const CITIES = ["酒田市", "三川町", "庄内町", "遊佐町"];
const AREA = { latMin: 38.5, latMax: 39.2, lngMin: 139.5, lngMax: 140.1 }; // 庄内地域のだいたいの範囲
const OLD_DAYS = 180;          // 確認日がこれより古いデータは「再確認」をすすめる
const LINK_TIMEOUT_MS = 10000; // 1軒あたりの待ち時間
const LINK_INTERVAL_MS = 1500; // 相手のサーバーに負担をかけないよう、1軒ごとに間をあける
const USER_AGENT = "shopping-navi-link-check/1.0 (personal study; one request per URL)";

// ---- data/stores.js を読み込む（中身は「const stores = [...]」なので、関数にして取り出す）----
function loadStores(file) {
  const code = fs.readFileSync(file, "utf8");
  return new Function(code + "\nreturn stores;")();
}

// ---- ① データの形を調べる（ネットにはつながない）----
function checkData(stores) {
  const errors = [];   // 直さないといけないもの
  const warnings = []; // 気をつけたいもの

  const ids = new Set();
  const positions = new Map();

  stores.forEach(function (store) {
    const label = (store.id || "(idなし)") + " " + (store.name || "(店名なし)");

    ["id", "name", "kana", "city", "officialUrl"].forEach(function (key) {
      if (!store[key] || typeof store[key] !== "string") {
        errors.push(label + "：「" + key + "」がありません");
      }
    });

    if (store.id) {
      if (ids.has(store.id)) errors.push(label + "：idが重複しています");
      ids.add(store.id);
    }
    if (store.city && !CITIES.includes(store.city)) {
      errors.push(label + "：市や町の名前が正しくありません（" + store.city + "）");
    }
    if (store.kana && !/^[ぁ-んー]+( [ぁ-んー]+)*$/.test(store.kana)) {
      errors.push(label + "：読みがなは、ひらがなだけで書き、単語の区切りは、スペース1つにしてください（" + store.kana + "）");
    }
    if (store.officialUrl && !/^https?:\/\//.test(store.officialUrl)) {
      errors.push(label + "：URLが http:// か https:// で始まっていません");
    }
    if (store.officialUrl && /^http:\/\//.test(store.officialUrl)) {
      warnings.push(label + "：URLが http:// です（https:// のほうが安全です）");
    }

    // チラシ用のURL（そのお店のトクバイのページ）。null は「トクバイに掲載がない」という意味で、正しい書き方
    if (store.flyerUrl !== undefined && store.flyerUrl !== null && typeof store.flyerUrl !== "string") {
      errors.push(label + "：flyerUrl は、URLの文字か null にしてください");
    }
    if (store.flyerUrl) {
      let path = "";
      try {
        const parsed = new URL(store.flyerUrl);
        path = decodeURIComponent(parsed.pathname);
        if (parsed.hostname !== "tokubai.co.jp" || parsed.protocol !== "https:") {
          errors.push(label + "：flyerUrl が https://tokubai.co.jp/ から始まっていません");
        }
      } catch (error) {
        errors.push(label + "：flyerUrl のURLの形が正しくありません");
      }
      if (path.includes("/leaflets/")) {
        errors.push(label + "：flyerUrl が、チラシ1枚ごとのURLです。お店のページ（/チェーン名/店番号）にしてください（チラシが替わると古くなるため）");
      } else if (path && !/^\/(?!prefectures|areas|leaflets|search)[^/]+\/\d+\/?$/.test(path)) {
        warnings.push(label + "：flyerUrl の形が、/チェーン名/店番号 と違います（" + path + "）");
      }
    }

    // 位置（緯度・経度）
    if (typeof store.lat !== "number" || typeof store.lng !== "number") {
      warnings.push(label + "：位置（緯度・経度）がありません");
    } else {
      const inArea = store.lat > AREA.latMin && store.lat < AREA.latMax &&
                     store.lng > AREA.lngMin && store.lng < AREA.lngMax;
      if (!inArea) errors.push(label + "：位置が庄内地域の範囲の外です（入力ミスかもしれません）");
      const key = store.lat + "," + store.lng;
      if (positions.has(key)) warnings.push(label + "：" + positions.get(key) + " と位置が全く同じです（貼り間違いかもしれません）");
      positions.set(key, label);
    }

    // 確認日
    if (store.updatedAt) {
      const days = (Date.now() - new Date(store.updatedAt).getTime()) / 86400000;
      if (Number.isNaN(days)) {
        errors.push(label + "：確認日（updatedAt）の形が正しくありません");
      } else if (days > OLD_DAYS) {
        warnings.push(label + "：最後に確認してから " + Math.floor(days) + " 日たっています。再確認をおすすめします");
      }
    }
  });

  const withFlyer = stores.filter(function (s) { return typeof s.flyerUrl === "string" && s.flyerUrl !== ""; }).length;
  const noFlyer = stores.filter(function (s) { return s.flyerUrl === null; }).length;
  const unchecked = stores.length - withFlyer - noFlyer;
  if (unchecked > 0) {
    warnings.push("トクバイのチラシ用URLを、まだ調べていないお店が " + unchecked + " 軒あります（庄内地方のページが開きます）");
  }

  const noDate = stores.filter(function (s) { return !s.updatedAt; }).length;
  if (noDate > 0) warnings.push("確認日（updatedAt）が書かれていないお店が " + noDate + " 軒あります");

  return { errors: errors, warnings: warnings };
}

// ---- ② URLが開けるかを調べる（1軒1回だけ。ページの中身は読まない）----
function sleep(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

async function checkOneLink(store) {
  const controller = new AbortController();
  const timer = setTimeout(function () { controller.abort(); }, LINK_TIMEOUT_MS);
  try {
    const response = await fetch(store.officialUrl, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT }
    });
    await response.body.cancel(); // ページの中身は読まずに、ここでやめる

    const status = response.status;
    if (status >= 200 && status < 300) {
      if (stripUrl(response.url) !== stripUrl(store.officialUrl)) {
        return { level: "warn", text: "別のURLに移されています（移転の可能性）→ " + response.url };
      }
      return { level: "ok", text: "開けました（" + status + "）" };
    }
    if (status === 404 || status === 410) {
      return { level: "ng", text: "ページが見つかりません（" + status + "）" };
    }
    return { level: "warn", text: "状態が " + status + " でした。自分のブラウザで確認してください" };
  } catch (error) {
    if (error.name === "AbortError") {
      return { level: "warn", text: "時間内に応答がありませんでした" };
    }
    const cause = error.cause && (error.cause.code || error.cause.message);
    return { level: "ng", text: "開けませんでした（" + (cause || error.message) + "）" };
  } finally {
    clearTimeout(timer);
  }
}

// URLを比べやすくする（最後の「/」と、#以降をとる）
function stripUrl(url) {
  return url.split("#")[0].replace(/\/$/, "");
}

async function checkAllLinks(stores) {
  const results = [];
  for (let i = 0; i < stores.length; i++) {
    const result = await checkOneLink(stores[i]);
    results.push({ store: stores[i], result: result });
    console.log("  [" + (i + 1) + "/" + stores.length + "] " + stores[i].name + "：" + result.text);
    if (i < stores.length - 1) await sleep(LINK_INTERVAL_MS);
  }
  return results;
}

// ---- 実行 ----
async function main() {
  const stores = loadStores(dataFile);
  console.log("店舗データ " + stores.length + " 軒を調べます（" + dataFile + "）\n");

  const data = checkData(stores);
  console.log("■ データの形：エラー " + data.errors.length + " 件、注意 " + data.warnings.length + " 件");
  data.errors.forEach(function (line) { console.log("  ✕ " + line); });
  data.warnings.forEach(function (line) { console.log("  △ " + line); });

  let linkResults = [];
  if (checkLinks) {
    console.log("\n■ URLの確認（1軒1回・" + LINK_INTERVAL_MS / 1000 + "秒ずつ間をあけます）");
    linkResults = await checkAllLinks(stores);
  } else {
    console.log("\n（URLの確認は、--links をつけたときだけ行います）");
  }

  const linkNg = linkResults.filter(function (r) { return r.result.level === "ng"; });
  const linkWarn = linkResults.filter(function (r) { return r.result.level === "warn"; });
  const hasProblem = data.errors.length > 0 || linkNg.length > 0;

  console.log("\n■ まとめ");
  console.log("  データのエラー：" + data.errors.length + " 件／注意：" + data.warnings.length + " 件");
  if (checkLinks) {
    console.log("  URLが開けない：" + linkNg.length + " 件／確認が必要：" + linkWarn.length + " 件");
  }
  console.log(hasProblem ? "  → 直す必要があるものがあります" : "  → 直す必要があるものは、見つかりませんでした");

  // 文章のファイル（GitHubのIssueなどに使う）
  if (reportFile) {
    const lines = ["# 店舗データの確認結果", ""];
    lines.push("データのエラー " + data.errors.length + " 件／注意 " + data.warnings.length + " 件", "");
    data.errors.forEach(function (l) { lines.push("- ✕ " + l); });
    data.warnings.forEach(function (l) { lines.push("- △ " + l); });
    if (checkLinks) {
      lines.push("", "## URLの確認", "");
      linkResults.forEach(function (r) {
        if (r.result.level !== "ok") {
          lines.push("- " + (r.result.level === "ng" ? "✕" : "△") + " " + r.store.id + " " + r.store.name + "：" + r.result.text);
        }
      });
    }
    lines.push("", "※ データの書き換えは、人が確認してから行ってください。このプログラムは、自動では書き換えません。");
    fs.writeFileSync(reportFile, lines.join("\n") + "\n");
    console.log("  結果を " + reportFile + " に書きました");
  }

  process.exit(hasProblem ? 1 : 0);
}

main().catch(function (error) {
  console.error("うまくいきませんでした:", error.message);
  process.exit(2);
});
