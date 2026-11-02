// お店のカード1枚分
import { IconBadge } from "./Icons.jsx";
import { breakableName, createRouteUrl, formatDistance, getFlyerUrl, hasPosition, isSafeUrl } from "../lib/store-utils.js";

// 新しいタブで開くリンクを、大きなボタンの見た目で出す
function LinkButton({ icon, label, url, note }) {
  return (
    <div className="link-button-block">
      <a className={"big-button " + icon.replace("ic-", "link-")} href={url} target="_blank" rel="noopener noreferrer">
        <IconBadge name={icon} />
        <span className="button-label">
          {/* 「チラシ」「お店」「行き方」だけ、大きな太い文字にする */}
          {label.split(/(チラシ|お店|行き方)/).map(function (part, index) {
            if (part === "チラシ" || part === "お店" || part === "行き方") {
              return <span className="key-word" key={index}>{part}</span>;
            }
            return part;
          })}
        </span>
        {/* 右はしの丸い矢印（押せるボタンだと分かるように） */}
        <span className="link-arrow" aria-hidden="true">›</span>
      </a>
      {/* ボタンの下の説明は、店ごとの特別な説明があるときだけ出す */}
      {note ? <p className="store-link-note">{note}</p> : null}
    </div>
  );
}

// トクバイにチラシがないお店の案内（ボタンではなく、文字だけ）
function NoFlyerNotice() {
  return (
    <p className="flyer-none">
      <IconBadge name="ic-flyer" />
      <span>{"こちらでは\u200bチラシが\u200b検索できませんでした。\nお店の\u200bページを\u200bご確認ください。"}</span>
    </p>
  );
}

// distanceKm は、現在地検索のときだけ渡す
export default function StoreCard({ store, distanceKm }) {
  return (
    <article className="store-card">
      <h3 className="store-name">{breakableName(store.name)}</h3>

      {typeof distanceKm === "number" ? (
        <p className="store-distance">{"ここから" + formatDistance(distanceKm)}</p>
      ) : null}

      <p className="store-city">{store.city}</p>

      {/* flyerUrl が null のお店は、トクバイに掲載がない。ボタンの代わりに案内を出す */}
      {store.flyerUrl === null ? (
        <NoFlyerNotice />
      ) : (
        <LinkButton icon="ic-flyer" label="チラシを&#8203;さがす" url={getFlyerUrl(store)} />
      )}

      {isSafeUrl(store.officialUrl) ? (
        <LinkButton icon="ic-shop-page" label="お店の&#8203;ページを&#8203;見る" url={store.officialUrl} note={store.officialNote} />
      ) : null}

      {hasPosition(store) ? (
        <LinkButton icon="ic-route" label="行き方を&#8203;調べる" url={createRouteUrl(store)} />
      ) : null}
    </article>
  );
}
