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
  unsupported: "この\u200b機械では\u200b現在地を\u200bつかえません。\n他の\u200b方法で\u200bさがして\u200b下さい。",
  denied: "現在地を\u200bつかうことが\nゆるされませんでした。\nスマホの\u200b設定で、\n位置情報を\u200b「許可」にして\u200b下さい。\nまたは\u200b他の\u200b方法で\u200bさがして\u200b下さい。",
  timeout: "現在地を\u200bしらべるのに\n時間が\u200bかかっています。\nもう一度\u200bボタンを\u200bおすか、\n他の\u200b方法で\u200bさがして\u200b下さい。",
  unknown: "現在地が\u200bわかりませんでした。\n他の\u200b方法で\u200bさがして\u200b下さい。",
  noData: "場所の\u200bデータが\u200bあるお店が\u200bまだ\u200bありません。\n下の\u200bボタンから\u200bさがしてください。"
};

// 注意書きをつくる
function createNote(nearby) {
  const lines = [];
  const missingCount = stores.length - nearby.sorted.length;
  if (missingCount > 0) {
    lines.push("場所の\u200bデータが\u200bまだない\u200bお店（" + missingCount + "軒）は、\u200bここには\u200b出ません。\n" +
               "「市や町から」\u200b「お店の名前から」では、\u200bすべての\u200bお店を\u200bさがせます。");
  }
  if (nearby.distances[nearby.sorted[0].id] > 30) {
    lines.push("いちばん\u200b近い\u200bお店でも\u200b30km\u200bより\u200b遠いので、\u200b庄内地域から\u200bはなれているようです。");
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
      <h2 className="section-title" id="location-title" tabIndex={-1}>現在地から&#8203;さがす</h2>

      {/* 現在地を使う前に、目的を説明する */}
      <p className="location-explain">
        現在地を&#8203;使って&#8203;近いお店を&#8203;さがします。<br />
        現在地は&#8203;保存も&#8203;送信も&#8203;しません。
      </p>

      <button type="button" className="big-button" id="button-use-location" disabled={status === "searching"} onClick={handleUseLocation}>
        <IconBadge name="ic-here" />
        <span className="button-label">現在地から&#8203;さがす</span>
      </button>

      <p id="location-message" className="search-message" role="status" aria-live="polite">
        {status === "searching" ? "しらべています…" : null}
        {showOtherWay ? PROBLEM_MESSAGES[status] : null}
        {status === "found" ? <>近い順に、&#8203;お店が<span className="count-number">{nearby.sorted.length}</span>軒&#8203;見つかりました。</> : null}
      </p>

      {showOtherWay ? (
        <div className="nav-buttons" id="location-other-way">
          <button type="button" className="big-button" onClick={function () { goTo("city"); }}>
            <IconBadge name="ic-town" />
            <span className="button-label">市や町から&#8203;さがす</span>
          </button>
          <button type="button" className="big-button" onClick={function () { goTo("name"); }}>
            <IconBadge name="ic-name" />
            <span className="button-label">お店の名前で&#8203;さがす</span>
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
