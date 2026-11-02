// 検索・並び順・距離の計算のテスト（画面は使わない）
// 使い方（react-app フォルダの中で）: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  countStoresByCity, createRouteUrl, findStoresByName, formatDistance, getFlyerUrl,
  isSafeUrl, sortByKana, sortStoresByDistance
} from "../src/lib/store-utils.js";

// data/stores.js は「const stores = [...]」の形なので、関数にして取り出す
const code = readFileSync(new URL("../../data/stores.js", import.meta.url), "utf8");
const stores = new Function(code + "\nreturn stores;")();
const names = function (list) { return list.map(function (s) { return s.name; }); };
const hits = function (query) { return names(findStoresByName(stores, query)); };

test("市や町ごとの軒数", function () {
  assert.deepEqual(countStoresByCity(stores), { "酒田市": 13, "遊佐町": 4, "庄内町": 3, "三川町": 2 });
});

test("あいうえお順に並ぶ", function () {
  const sakata = names(sortByKana(stores.filter(function (s) { return s.city === "酒田市"; })));
  assert.equal(sakata[0], "イオン酒田南店");
  assert.equal(sakata[12], "ヤマザワ東大町店");
});

test("ひらがな・カタカナ・半角のちがいを吸収する", function () {
  assert.equal(hits("やまざわ").length, 4);
  assert.equal(hits("ヤマ").length, 4);
  assert.equal(hits("ﾔﾏ").length, 4);
});

test("単語の頭で見つかり、単語の途中では見つからない", function () {
  assert.deepEqual(hits("ビッグ"), ["ザ・ビッグ酒田北店"]);
  assert.equal(hits("アオキ").length, 2);
  assert.equal(hits("酒田").length, 3);
  assert.equal(hits("ばりゅ").length, 0);
  assert.equal(hits("ざわ").length, 0);
});

test("近い順に並ぶ（位置のないお店は出さない）", function () {
  const result = sortStoresByDistance(stores, 38.9115, 139.8413);
  assert.equal(result.sorted.length, 22);
  const distances = result.sorted.map(function (s) { return result.distances[s.id]; });
  assert.ok(distances.every(function (d, i) { return i === 0 || distances[i - 1] <= d; }));
  assert.equal(sortStoresByDistance([{ id: "x", name: "位置なし" }], 38, 139).sorted.length, 0);
});

test("距離の書き方", function () {
  assert.equal(formatDistance(0), "約10m");
  assert.equal(formatDistance(0.43), "約430m");
  assert.equal(formatDistance(1.25), "約1.3km");
});

test("リンクの安全確認", function () {
  assert.equal(isSafeUrl("https://example.com/"), true);
  assert.equal(isSafeUrl("javascript:alert(1)"), false);
  assert.equal(getFlyerUrl({ flyerUrl: "https://tokubai.co.jp/イオン/12598" }), "https://tokubai.co.jp/イオン/12598");
  assert.match(getFlyerUrl({ flyerUrl: "https://example.com/" }), /areas\/96/);   // まちがった形は、庄内地方のページへ
  assert.equal(getFlyerUrl({ flyerUrl: "http://www.toichiya.co.jp/sale.html" }), "http://www.toichiya.co.jp/sale.html");
  assert.equal(createRouteUrl({ lat: 38.9, lng: 139.8 }), "https://www.google.com/maps/dir/?api=1&destination=38.9,139.8");
});
