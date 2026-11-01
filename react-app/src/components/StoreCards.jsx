// お店のカードを並べて出す（市や町の一覧・名前でさがす・現在地で共通）
import StoreCard from "./StoreCard.jsx";

// distances は、お店の id ごとの距離（km）。現在地検索のときだけ渡す
export default function StoreCards({ id, storeList, distances }) {
  return (
    <div className="store-list" id={id}>
      {storeList.map(function (store) {
        return <StoreCard key={store.id} store={store} distanceKm={distances ? distances[store.id] : undefined} />;
      })}
    </div>
  );
}
