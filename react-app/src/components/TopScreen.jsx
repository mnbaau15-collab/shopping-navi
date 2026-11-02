// 画面1：表紙（3つの探し方のカード）
import { Icon } from "./Icons.jsx";

function SearchCard({ color, icon, title, onClick }) {
  return (
    <button type="button" className={"search-card search-card-" + color} onClick={onClick}>
      <span className="search-card-icon" aria-hidden="true"><Icon name={icon} /></span>
      <span className="search-card-text">
        <span className="search-card-title">{title}</span>
      </span>
      <span className="search-card-arrow" aria-hidden="true">›</span>
    </button>
  );
}

export default function TopScreen({ goTo }) {
  return (
    <section id="screen-top">
      <h2 className="visually-hidden" id="top-title" tabIndex={-1}>どうやって&#8203;さがしますか？</h2>
      <div className="search-cards">
        <SearchCard color="green" icon="ic-here" title="現在地から&#8203;さがす" onClick={function () { goTo("location"); }} />
        <SearchCard color="orange" icon="ic-town" title="市や町から&#8203;さがす" onClick={function () { goTo("city"); }} />
        <SearchCard color="blue" icon="ic-name" title="お店の&#8203;名前で&#8203;さがす" onClick={function () { goTo("name"); }} />
      </div>
    </section>
  );
}
