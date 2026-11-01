// 現在地から さがす画面
// ※ 現在地は、距離を計算するためだけに使い、保存も送信もしない
import { useEffect, useRef, useState } from "react";
import { stores } from "../../../data/stores.js";
import { sortStoresByDistance } from "../lib/store-utils.js";
import { IconBadge } from "./Icons.jsx";
import StoreCards from "./StoreCards.jsx";
import BackToTopButton from "./BackToTopButton.jsx";

// うまくいかなかったときの知らせ（status ごと）
const PROBLEM_MESSAGES = {
  unsupported: "この 機械では 現在地を つかえません。\n他の 方法で さがして 下さい。",
  denied: "現在地を つかうことが\nゆるされませんでした。\nスマホの 設定で、\n位置情報を 「許可」にして 下さい。\nまたは 他の 方法で さがして 下さい。",
  timeout: "現在地を しらべるのに\n時間が かかっています。\nもう一度 ボタンを おすか、\n他の 方法で さがして 下さい。",
  unknown: "現在地が わかりませんでした。\n他の 方法で さがして 下さい。",
  noData: "場所の データが あるお店が まだ ありません。\n下の ボタンから さがしてください。"
};

// 注意書きをつくる
function createNote(nearby) {
  const lines = [];
  const missingCount = stores.length - nearby.sorted.length;
  if (missingCount > 0) {
    lines.push("場所の データが まだない お店（" + missingCount + " 軒）は、 ここには 出ません。\n" +
               "「市や町から」 「お店の名前から」では、 すべての お店を さがせます。");
  }
  if (nearby.distances[nearby.sorted[0].id] > 30) {
    lines.push("いちばん 近い お店でも 30 km より 遠いので、 庄内地域から はなれているようです。");
  }
  return lines.join("\n");
}

export default function LocationScreen({ goTo }) {
  // 状態。idle＝まだ／searching＝しらべ中／found＝見つかった／それ以外は PROBLEM_MESSAGES の名前
  const [status, setStatus] = useState("idle");
  const [nearby, setNearby] = useState(null);     // 近い順のお店と距離
  // 現在地を調べた回数の番号。古い調べの結果が、あとから届いたときに、見分けるために使う
  const requestIdRef = useRef(0);

  // この画面から出るときは、番号を進めて、あとから届く古い結果を無効にする
  useEffect(function () {
    return function () {
      requestIdRef.current += 1;
    };
  }, []);

  function handleUseLocation() {
    if (!navigator.geolocation) {
      setStatus("unsupported");
      return;
    }

    requestIdRef.current += 1;
    const myRequestId = requestIdRef.current; // この調べの番号

    setStatus("searching");
    setNearby(null);

    navigator.geolocation.getCurrentPosition(
      function (position) {
        if (myRequestId !== requestIdRef.current) return; // 古い調べの結果は、使わない
        const result = sortStoresByDistance(stores, position.coords.latitude, position.coords.longitude);
        if (result.sorted.length === 0) {
          setStatus("noData");
        } else {
          setNearby(result);
          setStatus("found");
        }
      },
      function (error) {
        if (myRequestId !== requestIdRef.current) return; // 古い調べの結果は、使わない
        console.error("位置情報を取得できませんでした:", error); // くわしいことは console にだけ出す
        if (error.code === 1) {
          setStatus("denied");       // 1 = 許可されなかった
        } else if (error.code === 3) {
          setStatus("timeout");      // 3 = 時間切れ
        } else {
          setStatus("unknown");
        }
      },
      { timeout: 20000, maximumAge: 60000 } // 20秒たっても分からなければ、あきらめる。1分以内に調べた場所は、そのまま使う
    );
  }

  const showOtherWay = status in PROBLEM_MESSAGES;

  return (
    <section id="screen-location">
      <h2 className="section-title" id="location-title" tabIndex={-1}>現在地から さがす</h2>

      {/* 現在地を使う前に、目的を説明する */}
      <p className="location-explain">
        現在地を 使って 近いお店を さがします。<br />
        現在地は 保存も 送信も しません。
      </p>

      <button type="button" className="big-button" id="button-use-location" disabled={status === "searching"} onClick={handleUseLocation}>
        <IconBadge name="ic-here" />
        <span className="button-label">現在地から さがす</span>
      </button>

      <p id="location-message" className="search-message" role="status" aria-live="polite">
        {status === "searching" ? "しらべています…" : null}
        {showOtherWay ? PROBLEM_MESSAGES[status] : null}
        {status === "found" ? <>近い順に、 お店が <span className="count-number">{nearby.sorted.length}</span> 軒 見つかりました。</> : null}
      </p>

      {showOtherWay ? (
        <div className="nav-buttons" id="location-other-way">
          <button type="button" className="big-button" onClick={function () { goTo("city"); }}>
            <IconBadge name="ic-town" />
            <span className="button-label">市や町から さがす</span>
          </button>
          <button type="button" className="big-button" onClick={function () { goTo("name"); }}>
            <IconBadge name="ic-name" />
            <span className="button-label">お店の名前で さがす</span>
          </button>
        </div>
      ) : null}

      <StoreCards id="location-result-list" storeList={nearby ? nearby.sorted : []} distances={nearby ? nearby.distances : undefined} />

      <p id="location-note" className="location-note">{nearby ? createNote(nearby) : ""}</p>

      <div className="nav-buttons">
        <BackToTopButton onClick={function () { goTo("top"); }} />
      </div>
    </section>
  );
}
