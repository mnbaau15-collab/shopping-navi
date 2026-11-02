// お店の名前でさがす画面
import { useEffect, useRef, useState } from "react";
import { stores } from "../../../data/stores.js";
import { breakableName, findStoresByName, normalizeText, sortByKana } from "../lib/store-utils.js";
import { IconBadge } from "./Icons.jsx";
import StoreCards from "./StoreCards.jsx";
import BackToTopButton from "./BackToTopButton.jsx";

const MAX_SUGGESTIONS = 8;

export default function NameScreen({ goTo }) {
  const [query, setQuery] = useState("");                     // 入力欄の文字
  const [showSuggestions, setShowSuggestions] = useState(false); // 予測を出すか
  // さがした結果。null＝まだ／empty＝何も入っていない／それ以外は、見つかったお店のリスト
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);

  // 開いたらすぐ入力できるように、入力欄にカーソルを置く
  useEffect(function () {
    inputRef.current.focus();
  }, []);

  // 入力した文字に合うお店（入力のたびに計算しなおす）
  const suggestions = showSuggestions ? sortByKana(findStoresByName(stores, query)).slice(0, MAX_SUGGESTIONS) : [];

  function handleInput(event) {
    setQuery(event.target.value);
    setShowSuggestions(true);
    setResult(null); // 文字を入れなおしたら、前にさがした結果は消す
  }

  // 「さがす」ボタンを押したときの動き
  function handleSubmit(event) {
    event.preventDefault(); // 画面が読み込み直されないようにする
    setShowSuggestions(false);
    if (normalizeText(query) === "") {
      setResult("empty");
    } else {
      setResult(sortByKana(findStoresByName(stores, query)));
    }
  }

  // 予測を選ぶと、そのお店のカードだけを出す
  function chooseSuggestion(store) {
    setQuery(store.name);
    setShowSuggestions(false);
    setResult([store]);
  }

  const notFound = Array.isArray(result) && result.length === 0;
  const found = Array.isArray(result) ? result : [];
  // 「さがす」ボタンは、文字が入っていて、候補も結果も出ていないときだけ出す
  const showSubmit = normalizeText(query) !== "" && suggestions.length === 0 && found.length === 0;

  return (
    <section id="screen-name">
      <h2 className="section-title" id="name-title" tabIndex={-1}>お店の名前で&#8203;さがす</h2>

      <form id="name-form" className="search-form" onSubmit={handleSubmit}>
        <label htmlFor="name-input" className="form-label">名前の&#8203;最初の&#8203;文字を&#8203;入れてください。<br />ひらがな・カタカナで&#8203;さがせます。</label>
        <input type="text" id="name-input" className="text-input" autoComplete="off" enterKeyHint="search"
               ref={inputRef} value={query} onChange={handleInput} />
        {suggestions.length > 0 ? (
          <div id="name-suggestions" className="suggestions">
            {suggestions.map(function (store) {
              return (
                <button type="button" className="suggestion-button" key={store.id} onClick={function () { chooseSuggestion(store); }}>
                  {breakableName(store.name)}
                </button>
              );
            })}
          </div>
        ) : null}
        {showSubmit ? (
          <button type="submit" className="big-button" id="name-submit">
            <IconBadge name="ic-name" />
            <span className="button-label">さがす</span>
          </button>
        ) : null}
      </form>

      <p id="name-message" className="search-message" role="status" aria-live="polite">
        {result === "empty" ? "お店の名前を\u200b入れてください。" : null}
        {notFound ? "見つかりませんでした。\n文字を\u200bかえて\u200bもう一度\u200bどうぞ。" : null}
        {found.length > 0 ? <>お店が<span className="count-number">{found.length}</span>軒&#8203;見つかりました。</> : null}
      </p>

      <StoreCards id="name-result-list" storeList={found} />

      <div className="nav-buttons">
        <BackToTopButton onClick={function () { goTo("top"); }} />
      </div>
    </section>
  );
}
