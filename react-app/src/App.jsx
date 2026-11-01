// アプリ全体。「いまどの画面か」を覚えて、その画面の部品だけを出す
import { useEffect, useRef, useState } from "react";
import { IconSprite } from "./components/Icons.jsx";
import TopScreen from "./components/TopScreen.jsx";
import CityScreen from "./components/CityScreen.jsx";
import ListScreen from "./components/ListScreen.jsx";
import NameScreen from "./components/NameScreen.jsx";
import LocationScreen from "./components/LocationScreen.jsx";
import coverImage from "../../images/cover.jpg";

// 画面ごとの色（緑・オレンジ・青）。お店の一覧は、市や町の画面と同じ色
const THEMES = { city: "city", list: "city", name: "name", location: "location" };

export default function App() {
  const [screen, setScreen] = useState("top");   // いまの画面
  const [city, setCity] = useState(null);        // えらんだ市や町
  const mainRef = useRef(null);
  const previousScreenRef = useRef(screen);

  // 色と表紙の切りかえは、body の印を CSS が見て行う
  useEffect(function () {
    if (THEMES[screen]) {
      document.body.setAttribute("data-theme", THEMES[screen]);
    } else {
      document.body.removeAttribute("data-theme");
    }
    document.body.classList.toggle("is-top", screen === "top");
  }, [screen]);

  // 画面が変わったら、一番上にもどす。読み上げを使う人のために、見出しにカーソルを移す
  // （名前の画面は、入力欄にカーソルを置くので、NameScreen に任せる）
  useEffect(function () {
    if (previousScreenRef.current === screen) {
      return; // 最初に開いたときは、何もしない
    }
    previousScreenRef.current = screen;
    window.scrollTo(0, 0);
    if (screen !== "name") {
      mainRef.current.querySelector("h2").focus();
    }
  }, [screen]);

  function chooseCity(chosenCity) {
    setCity(chosenCity);
    setScreen("list");
  }

  return (
    <>
      <IconSprite />

      {/* 画面の上の部分。表紙のときは、画像の中に同じ文字があるので、見えなくする（読み上げ用には残す） */}
      <header className="site-header">
        <div className="header-inner">
          <h1 className="app-title"><span className="title-sub">かんたん</span><br />お買い物<br />ナビ</h1>
          <button type="button" className="header-home-button" onClick={function () { setScreen("top"); }}>
            <span aria-hidden="true">⬅</span> 最初の 画面に もどる
          </button>
          <p className="app-lead">近くのお店を、<br />かんたんに さがせます。</p>
        </div>
      </header>

      <div className="hero">
        <img src={coverImage} width="1024" height="796"
             alt="かんたん お買い物ナビ。近くのスーパーや、チラシを、かんたんに探せます。スーパーの前で、笑顔の家族が、買い物に来ています。" />
      </div>

      <main className="top-main" ref={mainRef}>
        {screen === "top" ? <TopScreen goTo={setScreen} /> : null}
        {screen === "city" ? <CityScreen goTo={setScreen} onChooseCity={chooseCity} /> : null}
        {screen === "list" ? <ListScreen city={city} goTo={setScreen} /> : null}
        {screen === "name" ? <NameScreen goTo={setScreen} /> : null}
        {screen === "location" ? <LocationScreen goTo={setScreen} /> : null}
      </main>

      <footer className="site-footer">
        <p>対象地域：酒田市・三川町・庄内町・遊佐町</p>
      </footer>
    </>
  );
}
