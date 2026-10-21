// ===========================================
// 画面を動かすプログラム
// 流れ：表紙 →（現在地／市や町をえらぶ／お店の名前を入れる）→ お店の一覧 → お店のページへ
// お店の情報は data/stores.js の stores を使います
// ===========================================

// 市や町を並べる順番。お店が1軒もない市や町は、ボタンを出しません
const CITY_ORDER = ["酒田市", "三川町", "庄内町", "遊佐町"];

// 「チラシを さがす」ボタンで開くページ（トクバイの、庄内地方のチラシ一覧）
// ※ リンクを開くだけ。このアプリから、トクバイへ自動でアクセスすることはしません
const FLYER_AREA_URL = "https://tokubai.co.jp/prefectures/6/areas/96/leaflet";

// ----- お店を「あいうえお順」に並べる（読みがなで比べる）-----
// Intl.Collator("ja") は、日本語の辞書の順番（あ→い→う…、濁点は「か」のあとに「が」）で比べる道具
const kanaCollator = new Intl.Collator("ja");

function sortByKana(storeList) {
  // もとのリストは変えずに、並べかえたコピーを返す（読みがながなければ店名で比べる）
  return storeList.slice().sort(function (a, b) {
    return kanaCollator.compare((a.kana || a.name).replace(/\s/g, ""), (b.kana || b.name).replace(/\s/g, ""));
  });
}

// ----- 画面（section）を名前で取り出しておく -----
const screens = {
  top: document.getElementById("screen-top"),
  city: document.getElementById("screen-city"),
  name: document.getElementById("screen-name"),
  location: document.getElementById("screen-location"),
  list: document.getElementById("screen-list")
};

// ----- 画面を切りかえる -----
// 指定した画面だけを出し、ほかは隠します
function showScreen(name) {
  Object.keys(screens).forEach(function (key) {
    screens[key].hidden = (key !== name);
  });

  // 探し方ごとの色（緑・オレンジ・青）。お店の一覧は、直前の探し方の色のまま
  if (name === "top") {
    document.body.removeAttribute("data-theme");
  } else if (name !== "list") {
    document.body.setAttribute("data-theme", name);
  }

  // 表紙のときだけ、大きな名前とイラストを出す（CSS が body の is-top を見て切りかえる）
  document.body.classList.toggle("is-top", name === "top");

  // 画面の一番上にもどす
  window.scrollTo(0, 0);

  // 読み上げ（VoiceOverなど）を使う人のために、見出しにカーソルを移す
  const heading = screens[name].querySelector("h2");
  if (heading && heading.hasAttribute("tabindex")) {
    heading.focus();
  }
}

// ----- 「お店が 13 軒 あります」のように、数字だけを大きくして出す -----
// parts：文字（そのまま）と数字（大きくする）を、順にならべたもの
function fillCountMessage(element, parts) {
  element.textContent = "";
  parts.forEach(function (part) {
    if (typeof part === "number") {
      const number = document.createElement("span");
      number.className = "count-number";
      number.textContent = String(part);
      element.appendChild(number);
    } else {
      element.appendChild(document.createTextNode(part));
    }
  });
}

// ----- 市や町ごとのお店の数を数える -----
function countStoresByCity() {
  const counts = {};
  stores.forEach(function (store) {
    counts[store.city] = (counts[store.city] || 0) + 1;
  });
  return counts;
}

// ----- 画面2：市や町のボタンを作って表示する -----
function showCityScreen() {
  const container = document.getElementById("city-buttons");
  container.textContent = ""; // 前に作ったボタンを消す

  const counts = countStoresByCity();

  CITY_ORDER.forEach(function (city) {
    if (!counts[city]) {
      return; // お店がない市や町は、ボタンを作らない
    }
    container.appendChild(createCityButton(city, counts[city]));
  });

  showScreen("city");
}

// 市や町のボタン1つ分を作る
function createCityButton(city, count) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "big-button";

  const icon = document.createElement("span");
  icon.className = "button-icon icon-badge";
  icon.setAttribute("aria-hidden", "true");
  // 表紙の「市や町から さがす」と同じ、家の絵
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 64 64");
  svg.setAttribute("focusable", "false");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", "#ic-town");
  svg.appendChild(use);
  icon.appendChild(svg);

  const text = document.createElement("span");
  text.className = "button-text";

  const label = document.createElement("span");
  label.className = "button-label";
  label.textContent = city;

  const note = document.createElement("span");
  note.className = "button-note";
  fillCountMessage(note, ["お店が ", count, " 軒"]);

  text.appendChild(label);
  text.appendChild(note);
  button.appendChild(icon);
  button.appendChild(text);

  // ボタンを押したら、その市や町のお店の一覧を出す
  button.addEventListener("click", function () {
    showStoreList(city);
  });

  return button;
}

// ----- 画面3：お店のカードを作って表示する -----
function showStoreList(city) {
  document.getElementById("list-title").textContent = city + " の お店";

  // この市や町のお店だけを取り出す
  const cityStores = sortByKana(stores.filter(function (store) {
    return store.city === city;
  }));

  renderStoreCards(document.getElementById("store-list"), cityStores);

  showScreen("list");
}

// お店のリストから、カードを並べて表示する（市や町の一覧と、名前のさがすで共通）
// distances は、お店の id ごとの距離（km）をまとめたもの。現在地検索のときだけ渡します
function renderStoreCards(container, storeList, distances) {
  container.textContent = ""; // 前に作ったカードを消す
  storeList.forEach(function (store) {
    const distanceKm = distances ? distances[store.id] : undefined;
    container.appendChild(createStoreCard(store, distanceKm));
  });
}

// ----- お店の名前でさがす -----

// 文字をそろえる（ひらがな・カタカナ・全角・半角・大文字小文字のちがいを無くす）
function normalizeText(text) {
  return text
    .normalize("NFKC")                 // 全角の英数字・半角カタカナを、ふつうの形にそろえる
    .toLowerCase()                     // 英字を小文字にそろえる
    .replace(/[ァ-ヶ]/g, function (ch) {
      // カタカナを、ひらがなに変える（文字コードを 0x60 ずらすと変わります）
      return String.fromCharCode(ch.charCodeAt(0) - 0x60);
    })
    .replace(/[\s・]/g, "");           // 空白と「・」を取りのぞく
}

// ----- 店名を「単語」に分ける -----
// 文字の種類（カタカナ・ひらがな・漢字・英字）が変わるところで区切る。「・」や空白でも区切る。
// 例：「ザ・ビッグ酒田北店」→「ザ」「ビッグ」「酒田北店」／「スーパーのアオキ三川店」→「スーパー」「アオキ」「三川店」
// 1文字だけの単語（「の」「店」など）は、検索に使わない
function charKind(ch) {
  if (/[ァ-ヶｦ-ﾟ]/.test(ch)) return "katakana";
  if (/[ぁ-ん]/.test(ch)) return "hiragana";
  if (/[一-龥々]/.test(ch)) return "kanji";
  if (/[A-Za-zＡ-Ｚａ-ｚ0-9０-９]/.test(ch)) return "latin";
  return "other";
}

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

// 入力した文字に合うお店を探す
// 店名か読みがなの「頭の文字」、または、店名の中の「単語の頭の文字」が合うものを出す
//   例：「ビッグ」→「ザ・ビッグ酒田北店」（単語「ビッグ」の頭）／「ばりゅ」→ 見つからない（「マックスバリュ」の途中）
// ひらがな・カタカナ・全角・半角は、normalizeText でそろえてから比べる
function matchesStore(store, word) {
  const starts = function (text) { return normalizeText(text).startsWith(word); };
  return starts(store.name) ||
         starts(store.kana || "") ||
         splitNameWords(store.name).some(starts) ||
         splitKanaWords(store.kana).some(starts);
}

function findStoresByName(query) {
  const word = normalizeText(query);
  if (word === "") {
    return [];
  }
  return stores.filter(function (store) {
    return matchesStore(store, word);
  });
}

// 「お店の名前でさがす」画面を出す
function showNameScreen() {
  document.getElementById("name-input").value = "";
  document.getElementById("name-message").textContent = "";
  document.getElementById("name-other-way").hidden = true;
  document.getElementById("name-result-list").textContent = "";
  hideNameSuggestions();
  showScreen("name");
  // 開いたらすぐ入力できるように、入力欄にカーソルを置く
  document.getElementById("name-input").focus();
}

// ----- 入力中の予測表示（1文字入れると、合うお店の名前が下に出る）-----
const MAX_SUGGESTIONS = 8;

function hideNameSuggestions() {
  const box = document.getElementById("name-suggestions");
  box.textContent = "";
  box.hidden = true;
}

function showNameSuggestions() {
  const query = document.getElementById("name-input").value;
  const box = document.getElementById("name-suggestions");
  box.textContent = "";

  if (normalizeText(query) === "") {
    box.hidden = true;
    return;
  }

  const found = sortByKana(findStoresByName(query)).slice(0, MAX_SUGGESTIONS);
  box.hidden = (found.length === 0);

  found.forEach(function (store) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "suggestion-button";
    button.textContent = breakableName(store.name);
    // 選ぶと、そのお店のカードだけを出す
    button.addEventListener("click", function () {
      chooseSuggestedStore(store);
    });
    box.appendChild(button);
  });
}

function chooseSuggestedStore(store) {
  document.getElementById("name-input").value = store.name;
  hideNameSuggestions();
  document.getElementById("name-other-way").hidden = true;
  fillCountMessage(document.getElementById("name-message"), ["お店が ", 1, " 軒 見つかりました。"]);
  renderStoreCards(document.getElementById("name-result-list"), [store]);
}

// 「さがす」ボタンを押したときの動き
function handleNameSearch(event) {
  event.preventDefault(); // 画面が読み込み直されないようにする
  hideNameSuggestions();

  const query = document.getElementById("name-input").value;
  const message = document.getElementById("name-message");
  const otherWay = document.getElementById("name-other-way");
  const resultList = document.getElementById("name-result-list");

  // 何も入っていないとき
  if (normalizeText(query) === "") {
    message.textContent = "お店の名前を 入れてください。";
    otherWay.hidden = true;
    resultList.textContent = "";
    return;
  }

  const found = sortByKana(findStoresByName(query));

  if (found.length === 0) {
    message.textContent = "見つかりませんでした。\nお店の名前の 最初の 文字や、 名前の中の ことばの 最初の 文字を 入れて さがすか、 下の ボタンから さがしてください。";
    otherWay.hidden = false;
  } else {
    fillCountMessage(message, ["お店が ", found.length, " 軒 見つかりました。"]);
    otherWay.hidden = true;
  }
  renderStoreCards(resultList, found);
}

// ----- お店の名前を、自然な場所で折り返せるようにする -----
// 「マックスバリュ」「ヤマザワ」のような、チェーンの名前のあとに、見えない区切り（ゼロ幅スペース U+200B）を入れる。
// 画面にはなにも見えず、はばが足りないときだけ、そこで折り返す。検索には使わない（表示のためだけ）
const NAME_BREAK_PREFIXES = ["マックスバリュ", "ヤマザワ", "ザ・ビッグ", "スーパーの", "スーパー", "こぴあコープ", "Aコープ", "イオン", "ト一屋"];
const NAME_BREAK_OVERRIDES = { "といちやいろは蔵パーク店": "といちや\u200bいろは蔵\u200bパーク店" };

function breakableName(name) {
  if (NAME_BREAK_OVERRIDES[name]) {
    return NAME_BREAK_OVERRIDES[name];
  }
  const prefix = NAME_BREAK_PREFIXES.find(function (p) {
    return name.startsWith(p) && name.length > p.length;
  });
  return prefix ? prefix + "\u200b" + name.slice(prefix.length) : name;
}

// お店のカード1枚分を作る
function createStoreCard(store, distanceKm) {
  const card = document.createElement("article");
  card.className = "store-card";

  // 店名（一番大きく）
  const name = document.createElement("h3");
  name.className = "store-name";
  name.textContent = breakableName(store.name);
  card.appendChild(name);

  // 現在地からの距離（現在地検索のときだけ）
  if (typeof distanceKm === "number") {
    const distance = document.createElement("p");
    distance.className = "store-distance";
    distance.textContent = "ここから " + formatDistance(distanceKm);
    card.appendChild(distance);
  }

  // 市や町
  const city = document.createElement("p");
  city.className = "store-city";
  city.textContent = store.city;
  card.appendChild(city);

  // ボタンは、上から順に「チラシを さがす」「お店のページを見る」「行き方を調べる」

  // 1番目：「チラシを さがす」ボタン
  //   ・そのお店のトクバイのページがあれば、そこへ
  //   ・トクバイに掲載がない（flyerUrl が null）お店は、ボタンの代わりに案内を出す
  //   ・まだ調べていないお店は、庄内地方のページへ
  if (store.flyerUrl === null) {
    card.appendChild(createNoFlyerNotice());
  } else {
    const flyer = getFlyerLink(store);
    card.appendChild(createLinkButton("ic-flyer", "チラシを さがす", flyer.url, flyer.note));
  }

  // 2番目：「お店のページを見る」ボタン（URLが安全なときだけ出す）
  if (isSafeUrl(store.officialUrl)) {
    card.appendChild(createLinkButton("ic-shop-page", "お店の ページを 見る", store.officialUrl,
                                      "お店の ページが 新しく ひらきます"));
  }

  // 3番目：「行き方を調べる」ボタン（場所のデータがあるお店だけ）
  if (hasPosition(store)) {
    card.appendChild(createLinkButton("ic-route", "行き方を 調べる", createRouteUrl(store),
                                      "Googleマップが 新しく ひらきます"));
  }

  return card;
}

// ----- 色つきの絵（index.html の symbol）を、白いふだに入れて作る -----
function createIconBadge(symbolId) {
  const icon = document.createElement("span");
  icon.className = "button-icon icon-badge";
  icon.setAttribute("aria-hidden", "true");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 64 64");
  svg.setAttribute("focusable", "false");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", "#" + symbolId);
  svg.appendChild(use);
  icon.appendChild(svg);
  return icon;
}

// ----- トクバイにチラシがないお店の案内（ボタンではなく、文字だけ）-----
function createNoFlyerNotice() {
  const notice = document.createElement("p");
  notice.className = "flyer-none";

  const icon = createIconBadge("ic-flyer");

  const text = document.createElement("span");
  text.textContent = "こちらでは チラシが 検索されませんでした。 お店の ページを ご確認ください";

  notice.appendChild(icon);
  notice.appendChild(text);
  return notice;
}

// ----- 「チラシを さがす」の行き先を決める -----
// store.flyerUrl は「そのお店のトクバイのページ」（https://tokubai.co.jp/チェーン名/店番号 の形）。
// このページは、チラシが替わっても URL が変わらない。だから、チラシ1枚ごとのURL（/leaflets/番号）は、登録しない
function getFlyerLink(store) {
  if (isTokubaiStoreUrl(store.flyerUrl)) {
    return { url: store.flyerUrl, note: "トクバイの お店の ページが 新しく ひらきます" };
  }
  return { url: FLYER_AREA_URL, note: "トクバイの 庄内地方の ページが 新しく ひらきます" };
}

// 「https://tokubai.co.jp/チェーン名/店番号」の形のURLだけを、OKにする（まちがったデータで、おかしなリンクを作らないため）
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

// 新しいタブで開くリンクを、大きなボタンの見た目で作る（ボタンの下に、説明の一文もつける）
function createLinkButton(symbolId, labelText, url, noteText) {
  const wrapper = document.createElement("div");
  wrapper.className = "link-button-block";

  const link = document.createElement("a");
  link.className = "big-button";
  link.href = url;
  link.target = "_blank";                // 新しいタブで開く
  link.rel = "noopener noreferrer";      // 安全のためのおまじない

  const icon = createIconBadge(symbolId);

  const label = document.createElement("span");
  label.className = "button-label";
  label.textContent = labelText;

  link.appendChild(icon);
  link.appendChild(label);
  wrapper.appendChild(link);

  const note = document.createElement("p");
  note.className = "store-link-note";
  note.textContent = noteText;
  wrapper.appendChild(note);

  return wrapper;
}

// Googleマップの「行き方」を開くURLを作る（APIキーは要りません）
// 出発点は書かないので、Googleマップが現在地を使います
function createRouteUrl(store) {
  return "https://www.google.com/maps/dir/?api=1&destination=" + store.lat + "," + store.lng;
}

// URLが http:// か https:// で始まるものかを調べる
// （まちがったデータが入っていても、おかしなリンクを作らないため）
function isSafeUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch (error) {
    console.error("URLの形が正しくありません:", url, error);
    return false;
  }
}

// ----- いまいる場所からさがす -----

// 2つの場所の、まっすぐな距離（km）を計算する（ハバーサイン公式）
// 地球が丸いことを考えて、緯度・経度から距離を出す計算方法です
function calcDistanceKm(lat1, lng1, lat2, lng2) {
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
function formatDistance(km) {
  // 10m単位に丸める。0m と表示されないよう、最小は 10m にする
  const meters = Math.max(10, Math.round(km * 100) * 10);
  if (meters < 1000) {
    return "約 " + meters + " m";
  }
  // 995m 以上は丸めると 1000m になるので、km の表示にする（「約 1000 m」を避ける）
  return "約 " + km.toFixed(1) + " km";
}

// 緯度と経度が数字で入っているお店かどうか
function hasPosition(store) {
  return typeof store.lat === "number" && typeof store.lng === "number";
}

// 現在地から近い順に、お店を並べる
// 戻り値：{ sorted: 近い順のお店, distances: お店のidごとの距離 }
function sortStoresByDistance(lat, lng) {
  const distances = {};
  const withPosition = stores.filter(hasPosition);

  withPosition.forEach(function (store) {
    distances[store.id] = calcDistanceKm(lat, lng, store.lat, store.lng);
  });

  const sorted = withPosition.slice().sort(function (a, b) {
    return distances[a.id] - distances[b.id];
  });

  return { sorted: sorted, distances: distances };
}

// 「いまいる場所からさがす」画面を出す（説明を出して、ボタンを待つ）
function showLocationScreen() {
  document.getElementById("location-message").textContent = "";
  document.getElementById("location-note").textContent = "";
  document.getElementById("location-other-way").hidden = true;
  document.getElementById("location-result-list").textContent = "";
  document.getElementById("button-use-location").disabled = false;
  showScreen("location");
}

// 画面に出すお知らせを書きかえる
function setLocationMessage(text, showOtherWay) {
  const message = document.getElementById("location-message");
  if (typeof text === "string") {
    message.textContent = text;
  } else {
    fillCountMessage(message, text);   // 数字を含む文
  }
  document.getElementById("location-other-way").hidden = !showOtherWay;
}

// 「現在地を使う」ボタンを押したとき
function handleUseLocation() {
  const button = document.getElementById("button-use-location");

  // 使えない端末のとき
  if (!navigator.geolocation) {
    setLocationMessage("この 機械では 現在地を つかえません。\n下の ボタンから さがしてください。", true);
    return;
  }

  button.disabled = true; // 何度も押されないようにする
  document.getElementById("location-note").textContent = "";
  document.getElementById("location-result-list").textContent = "";
  setLocationMessage("しらべています…", false);

  navigator.geolocation.getCurrentPosition(
    function (position) {
      button.disabled = false;
      showNearbyStores(position.coords.latitude, position.coords.longitude);
    },
    function (error) {
      button.disabled = false;
      console.error("位置情報を取得できませんでした:", error); // くわしいことは console にだけ出す
      if (error.code === 1) {
        // 1 = 許可されなかった
        setLocationMessage("現在地を つかうことが\nゆるされませんでした。\nスマホの 設定で、\n位置情報を 「許可」にして 下さい。\nまたは、\n下の ボタンから\nさがしてください。", true);
      } else if (error.code === 3) {
        // 3 = 時間切れ
        setLocationMessage("現在地を しらべるのに\n時間が かかっています。\nもう一度 ボタンを おすか、\n下の ボタンから\nさがしてください。", true);
      } else {
        setLocationMessage("現在地が わかりませんでした。\n下の ボタンから さがしてください。", true);
      }
    },
    { timeout: 20000, maximumAge: 60000 } // 20秒たっても分からなければ、あきらめる。1分以内に調べた場所は、そのまま使う
  );
}

// 現在地が分かったあと、近い順にお店を出す
// ※ 現在地は、この関数の中で距離を計算するためだけに使い、保存も送信もしません
function showNearbyStores(lat, lng) {
  const result = sortStoresByDistance(lat, lng);
  const resultList = document.getElementById("location-result-list");
  const note = document.getElementById("location-note");

  if (result.sorted.length === 0) {
    setLocationMessage("場所の データが あるお店が まだ ありません。\n下の ボタンから さがしてください。", true);
    return;
  }

  setLocationMessage(["近い順に、 お店が ", result.sorted.length, " 軒 見つかりました。"], false);
  renderStoreCards(resultList, result.sorted, result.distances);

  // 注意書きをつくる
  let noteText = "";

  const missingCount = stores.length - result.sorted.length;
  if (missingCount > 0) {
    noteText += "場所の データが まだない お店（" + missingCount + " 軒）は、 ここには 出ません。\n" +
                "「市や町から」 「お店の名前から」では、 すべての お店を さがせます。";
  }

  const nearestKm = result.distances[result.sorted[0].id];
  if (nearestKm > 30) {
    noteText += (noteText ? "\n" : "") + "いちばん 近い お店でも 30 km より 遠いので、 庄内地域から はなれているようです。";
  }

  note.textContent = noteText.trim();
}

// ----- ボタンを押したときの動きを登録する -----
document.getElementById("button-city").addEventListener("click", showCityScreen);
document.getElementById("button-name").addEventListener("click", showNameScreen);
document.getElementById("button-location").addEventListener("click", showLocationScreen);
document.getElementById("button-use-location").addEventListener("click", handleUseLocation);
document.getElementById("location-to-city").addEventListener("click", showCityScreen);
document.getElementById("location-to-name").addEventListener("click", showNameScreen);
document.getElementById("back-to-top-from-location").addEventListener("click", function () {
  showScreen("top");
});
document.getElementById("name-form").addEventListener("submit", handleNameSearch);
document.getElementById("name-input").addEventListener("input", showNameSuggestions);
document.getElementById("name-to-city").addEventListener("click", showCityScreen);
document.getElementById("back-to-top-from-name").addEventListener("click", function () {
  showScreen("top");
});
document.getElementById("back-to-top-from-city").addEventListener("click", function () {
  showScreen("top");
});
document.getElementById("back-to-city").addEventListener("click", showCityScreen);
document.getElementById("back-to-top-from-list").addEventListener("click", function () {
  showScreen("top");
});
