// 画面3：えらんだ市や町のお店の一覧
import { stores } from "../../../data/stores.js";
import { sortByKana } from "../lib/store-utils.js";
import { IconBadge } from "./Icons.jsx";
import StoreCards from "./StoreCards.jsx";

export default function ListScreen({ city, goTo }) {
  const cityStores = sortByKana(stores.filter(function (store) { return store.city === city; }));

  return (
    <section id="screen-list">
      <h2 className="section-title" id="list-title" tabIndex={-1}>{city + " の お店"}</h2>

      <StoreCards id="store-list" storeList={cityStores} />

      <div className="nav-buttons">
        <button type="button" className="big-button sub-button" onClick={function () { goTo("city"); }}>
          <span className="button-icon" aria-hidden="true">⬅</span>
          <span className="button-label">市や町を えらびなおす</span>
        </button>
        <button type="button" className="big-button sub-button" onClick={function () { goTo("top"); }}>
          <IconBadge name="ic-town" />
          <span className="button-label">最初の画面にもどる</span>
        </button>
      </div>
    </section>
  );
}
