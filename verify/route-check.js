// ===========================================
// 課題2：住所2つと移動手段から、経路を表示する（Google Maps Embed API）
//
// しくみ：
//   Embed API は「地図を表示する専用のURL」を用意してくれている。
//   そのURLに、キー・出発地・目的地・移動手段を付けて、iframe（ページの中の小窓）で開くと、
//   Googleマップの経路が小窓の中に表示される。
// ===========================================

const EMBED_BASE_URL = "https://www.google.com/maps/embed/v1/directions";

// 経路を表示するためのURLを作る
// encodeURIComponent は、日本語や空白を、URLに使える形（%E3...）に変える命令
function buildEmbedUrl(apiKey, origin, destination, mode) {
  return EMBED_BASE_URL +
    "?key=" + encodeURIComponent(apiKey) +
    "&origin=" + encodeURIComponent(origin) +
    "&destination=" + encodeURIComponent(destination) +
    "&mode=" + encodeURIComponent(mode) +
    "&language=ja";
}

// 画面に経路の地図（iframe）を出す
function showRoute(url) {
  const mapArea = document.getElementById("map-area");
  mapArea.textContent = ""; // 前の地図を消す

  const frame = document.createElement("iframe");
  frame.src = url;
  frame.width = "100%";
  frame.height = "450";
  frame.style.border = "0";
  frame.setAttribute("loading", "lazy");
  frame.setAttribute("allowfullscreen", "");
  // キーの「HTTPリファラー制限」が働くように、どのページから呼んだかを伝える設定
  frame.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
  frame.title = "経路の地図";

  mapArea.appendChild(frame);
}

// 「経路を見る」ボタンを押したときの動き
function handleSubmit(event) {
  event.preventDefault(); // 画面が読み込み直されないようにする

  const message = document.getElementById("message");
  const origin = document.getElementById("origin").value.trim();
  const destination = document.getElementById("destination").value.trim();
  const mode = document.getElementById("mode").value;

  // キーがまだ貼られていないとき
  if (GOOGLE_MAPS_API_KEY === "ここにAPIキーを貼る" || GOOGLE_MAPS_API_KEY === "") {
    message.textContent = "config.js に、APIキーを貼り付けてください。";
    return;
  }

  // 住所が空のとき
  if (origin === "" || destination === "") {
    message.textContent = "出発地と目的地の住所を、入れてください。";
    return;
  }

  message.textContent = "";
  showRoute(buildEmbedUrl(GOOGLE_MAPS_API_KEY, origin, destination, mode));
}

document.getElementById("route-form").addEventListener("submit", handleSubmit);
