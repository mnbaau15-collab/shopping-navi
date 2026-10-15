// ===========================================
// 画面を動かすプログラム
// 流れ：表紙 →（現在地／市や町をえらぶ／お店の名前を入れる）→ お店の一覧 → お店のページへ
// お店の情報は data/stores.js の stores を使います
// ===========================================

// 市や町を並べる順番。お店が1軒もない市や町は、ボタンを出しません
// （鶴岡市のお店を stores.js に足すと、自動でボタンが出ます）
const CITY_ORDER = ["酒田市", "鶴岡市", "三川町", "庄内町", "遊佐町"];

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
  icon.className = "button-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "📍";

  const text = document.createElement("span");
  text.className = "button-text";

  const label = document.createElement("span");
  label.className = "button-label";
  label.textContent = city;

  const note = document.createElement("span");
  note.className = "button-note";
  note.textContent = "お店が " + count + " 件 あります";

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
  const cityStores = stores.filter(function (store) {
    return store.city === city;
  });

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

// 入力した文字に合うお店を探す（店名か読みがなの、一部が合えばOK）
function findStoresByName(query) {
  const word = normalizeText(query);
  if (word === "") {
    return [];
  }
  return stores.filter(function (store) {
    return normalizeText(store.name).includes(word) ||
           normalizeText(store.kana || "").includes(word);
  });
}

// 「お店の名前でさがす」画面を出す
function showNameScreen() {
  document.getElementById("name-input").value = "";
  document.getElementById("name-message").textContent = "";
  document.getElementById("name-other-way").hidden = true;
  document.getElementById("name-result-list").textContent = "";
  showScreen("name");
}

// 「さがす」ボタンを押したときの動き
function handleNameSearch(event) {
  event.preventDefault(); // 画面が読み込み直されないようにする

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

  const found = findStoresByName(query);

  if (found.length === 0) {
    message.textContent = "見つかりませんでした。ほかの言葉で さがすか、下のボタンから さがしてください。";
    otherWay.hidden = false;
  } else {
    message.textContent = "お店が " + found.length + " 件 見つかりました。";
    otherWay.hidden = true;
  }
  renderStoreCards(resultList, found);
}

// お店のカード1枚分を作る
function createStoreCard(store, distanceKm) {
  const card = document.createElement("article");
  card.className = "store-card";

  // 店名（一番大きく）
  const name = document.createElement("h3");
  name.className = "store-name";
  name.textContent = store.name;
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

  // 「行き方を調べる」ボタン（場所のデータがあるお店だけ）
  if (hasPosition(store)) {
    card.appendChild(createLinkButton("🗺", "行き方を調べる", createRouteUrl(store),
                                      "地図（Googleマップ）が 新しく ひらきます"));
  }

  // 「お店のページを見る」ボタン（URLが安全なときだけ出す）
  if (isSafeUrl(store.officialUrl)) {
    card.appendChild(createLinkButton("🌐", "お店のページを見る", store.officialUrl,
                                      "お店のページが 新しく ひらきます"));
  }

  return card;
}

// 新しいタブで開くリンクを、大きなボタンの見た目で作る（ボタンの下に、説明の一文もつける）
function createLinkButton(iconText, labelText, url, noteText) {
  const wrapper = document.createElement("div");
  wrapper.className = "link-button-block";

  const link = document.createElement("a");
  link.className = "big-button";
  link.href = url;
  link.target = "_blank";                // 新しいタブで開く
  link.rel = "noopener noreferrer";      // 安全のためのおまじない

  const icon = document.createElement("span");
  icon.className = "button-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = iconText;

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
  document.getElementById("location-message").textContent = text;
  document.getElementById("location-other-way").hidden = !showOtherWay;
}

// 「現在地を使う」ボタンを押したとき
function handleUseLocation() {
  const button = document.getElementById("button-use-location");

  // 使えない端末のとき
  if (!navigator.geolocation) {
    setLocationMessage("この機械では 現在地を つかえません。下のボタンから さがしてください。", true);
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
        setLocationMessage("現在地を つかうことが ゆるされませんでした。下のボタンから さがしてください。", true);
      } else {
        setLocationMessage("現在地が わかりませんでした。下のボタンから さがしてください。", true);
      }
    },
    { timeout: 15000 } // 15秒たっても分からなければ、あきらめる
  );
}

// 現在地が分かったあと、近い順にお店を出す
// ※ 現在地は、この関数の中で距離を計算するためだけに使い、保存も送信もしません
function showNearbyStores(lat, lng) {
  const result = sortStoresByDistance(lat, lng);
  const resultList = document.getElementById("location-result-list");
  const note = document.getElementById("location-note");

  if (result.sorted.length === 0) {
    setLocationMessage("場所の データが あるお店が まだ ありません。下のボタンから さがしてください。", true);
    return;
  }

  setLocationMessage("近い順に、お店が " + result.sorted.length + " 件 見つかりました。", false);
  renderStoreCards(resultList, result.sorted, result.distances);

  // 注意書きをつくる
  let noteText = "距離は、地図の上の まっすぐな長さです。道のりとは ちがいます。";

  const missingCount = stores.length - result.sorted.length;
  if (missingCount > 0) {
    noteText += " 場所の データが まだない お店（" + missingCount + " 件）は、ここには 出ません。" +
                "「市や町から」「お店の名前から」では、すべてのお店を さがせます。";
  }

  const nearestKm = result.distances[result.sorted[0].id];
  if (nearestKm > 30) {
    noteText += " いちばん近いお店でも 30 km より 遠いので、庄内地域から はなれているようです。";
  }

  note.textContent = noteText;
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
