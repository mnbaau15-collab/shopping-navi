// 画面2：市や町をえらぶ
import { stores } from "../../../data/stores.js";
import { CITY_ORDER, countStoresByCity } from "../lib/store-utils.js";
import { IconBadge } from "./Icons.jsx";
import BackToTopButton from "./BackToTopButton.jsx";

export default function CityScreen({ goTo, onChooseCity }) {
  const counts = countStoresByCity(stores);
  // お店がない市や町は、ボタンを作らない
  const cities = CITY_ORDER.filter(function (city) { return counts[city]; });

  return (
    <section id="screen-city">
      <h2 className="section-title" id="city-title" tabIndex={-1}>どの市・町ですか？</h2>

      <div className="search-buttons" id="city-buttons">
        {cities.map(function (city) {
          return (
            <button type="button" className="big-button" key={city} onClick={function () { onChooseCity(city); }}>
              <IconBadge name="ic-town" />
              <span className="button-text">
                <span className="button-label">{city}</span>
                <span className="button-note">お店が <span className="count-number">{counts[city]}</span> 軒</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="nav-buttons">
        <BackToTopButton onClick={function () { goTo("top"); }} />
      </div>
    </section>
  );
}
