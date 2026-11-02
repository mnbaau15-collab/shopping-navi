// アイコンの絵（自分で描いた1色のマーク）。外部の画像は使わない。色は、置いた場所の CSS の color で決まる
// IconSprite に絵をまとめて置いておき、ほかの場所からは <use href="#名前"> で呼び出す

export function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <symbol id="ic-here" viewBox="0 0 64 64"><path fillRule="evenodd" d="M32 4C20.400 4 11 13.400 11 25c0 15.700 21 35 21 35s21-19.300 21-35C53 13.400 43.600 4 32 4zm0 29a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" fill="currentColor"/></symbol>
        <symbol id="ic-town" viewBox="0 0 64 64"><path d="M4 58V30L20 16l16 14v28H25V44H15v14zM40 58V10h20v48zm5-41v6h4v-6zm7 0v6h4v-6zm-7 11v6h4v-6zm7 0v6h4v-6zm-7 11v6h4v-6zm7 0v6h4v-6z" fill="currentColor" fillRule="evenodd"/></symbol>
        <symbol id="ic-name" viewBox="0 0 64 64"><path fillRule="evenodd" d="M27 5a22 22 0 1 0 13.300 39.500L53.400 57.600a4.500 4.500 0 0 0 6.400-6.400L46.700 38.100A22 22 0 0 0 27 5zm0 8a14 14 0 1 1 0 28 14 14 0 0 1 0-28z" fill="currentColor"/></symbol>
        <symbol id="ic-flyer" viewBox="0 0 64 64"><path fillRule="evenodd" d="M12 4h28l14 14v42H12zm26 4v12h12zM19 26v5h26v-5zm0 10v5h26v-5zm0 10v5h17v-5z" fill="currentColor"/></symbol>
        <symbol id="ic-shop-page" viewBox="0 0 64 64"><path fillRule="evenodd" d="M10 6h44l6 18a8 8 0 0 1-8 8v26H12V32a8 8 0 0 1-8-8zM20 38v20h12V38zm18 0v12h9V38z" fill="currentColor"/></symbol>
        <symbol id="ic-route" viewBox="0 0 64 64"><path fillRule="evenodd" d="M45 3a14 14 0 0 0-14 14c0 9.5 14 21 14 21s14-11.5 14-21A14 14 0 0 0 45 3zm0 19.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" fill="currentColor"/><path d="M13 53C30 53 25 40 45 40" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/><circle cx="13" cy="53" r="8" fill="currentColor"/><circle cx="13" cy="53" r="3.2" fill="#ffffff"/></symbol>
      </defs>
    </svg>
  );
}

// 絵だけを出す部品
export function Icon({ name }) {
  return (
    <svg viewBox="0 0 64 64" focusable="false">
      <use href={"#" + name} />
    </svg>
  );
}

// 絵を、白いふだに入れて出す部品
export function IconBadge({ name }) {
  return (
    <span className="button-icon icon-badge" aria-hidden="true">
      <Icon name={name} />
    </span>
  );
}
