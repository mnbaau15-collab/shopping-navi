// アイコンの絵（自分で描いた図形）。外部の画像は使わない
// IconSprite に絵をまとめて置いておき、ほかの場所からは <use href="#名前"> で呼び出す

export function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <symbol id="ic-here" viewBox="0 0 64 64">
          <path d="M4 22l16-6 20 6 20-6v36l-20 6-20-6-16 6z" fill="#8fd19e" stroke="#2f7d46" strokeWidth="3" strokeLinejoin="round"/>
          <path d="M20 16v36M40 22v36" stroke="#2f7d46" strokeWidth="2.5"/>
          <path d="M32 44c0 0-11-11-11-20a11 11 0 1 1 22 0c0 9-11 20-11 20z" fill="#e53935" stroke="#ffffff" strokeWidth="2.5"/>
          <circle cx="32" cy="24" r="4.5" fill="#ffffff"/>
        </symbol>
        <symbol id="ic-town" viewBox="0 0 64 64">
          <rect x="6" y="30" width="22" height="26" fill="#fff3d6" stroke="#9a3412" strokeWidth="3"/>
          <path d="M3 32L17 16l14 16z" fill="#e8590c" stroke="#9a3412" strokeWidth="3" strokeLinejoin="round"/>
          <rect x="14" y="40" width="7" height="16" fill="#e8590c"/>
          <rect x="34" y="20" width="24" height="36" fill="#ffe2b0" stroke="#9a3412" strokeWidth="3"/>
          <rect x="39" y="26" width="6" height="6" fill="#bfe3f5"/><rect x="49" y="26" width="6" height="6" fill="#bfe3f5"/>
          <rect x="39" y="37" width="6" height="6" fill="#bfe3f5"/><rect x="49" y="37" width="6" height="6" fill="#bfe3f5"/>
          <rect x="43" y="47" width="8" height="9" fill="#e8590c"/>
          <circle cx="56" cy="12" r="6" fill="#6cbf5c"/>
        </symbol>
        <symbol id="ic-name" viewBox="0 0 64 64">
          <rect x="8" y="26" width="34" height="28" fill="#fff8ee" stroke="#1d4ed8" strokeWidth="3"/>
          <rect x="5" y="14" width="40" height="14" fill="#e8590c"/>
          <rect x="11" y="14" width="7" height="14" fill="#fff8ee"/><rect x="25" y="14" width="7" height="14" fill="#fff8ee"/><rect x="39" y="14" width="6" height="14" fill="#fff8ee"/>
          <rect x="20" y="36" width="10" height="18" fill="#bfe3f5" stroke="#1d4ed8" strokeWidth="2"/>
          <circle cx="44" cy="40" r="12" fill="#ffffff" fillOpacity="0.7" stroke="#1d4ed8" strokeWidth="5"/>
          <line x1="53" y1="49" x2="61" y2="58" stroke="#1d4ed8" strokeWidth="6" strokeLinecap="round"/>
        </symbol>
        <symbol id="ic-flyer" viewBox="0 0 64 64">
          <rect x="8" y="6" width="42" height="52" rx="3" fill="#ffffff" stroke="#9a3412" strokeWidth="3"/>
          <rect x="8" y="6" width="42" height="14" fill="#e53935"/>
          <rect x="14" y="26" width="30" height="4" fill="#e0c9a6"/>
          <circle cx="22" cy="43" r="8" fill="#6cbf5c" stroke="#2f7d46" strokeWidth="2.5"/>
          <circle cx="39" cy="44" r="7" fill="#f6a021" stroke="#b45309" strokeWidth="2.5"/>
          <path d="M44 20l14 6-4 32H44z" fill="#ffe2b0" stroke="#9a3412" strokeWidth="3" strokeLinejoin="round"/>
        </symbol>
        <symbol id="ic-shop-page" viewBox="0 0 64 64">
          <rect x="5" y="9" width="54" height="44" rx="5" fill="#ffffff" stroke="#1d4ed8" strokeWidth="3"/>
          <rect x="5" y="9" width="54" height="11" fill="#bfe3f5" stroke="#1d4ed8" strokeWidth="3"/>
          <rect x="12" y="28" width="22" height="6" fill="#e8590c"/>
          <rect x="12" y="38" width="22" height="9" fill="#ffe2b0" stroke="#9a3412" strokeWidth="2"/>
          <circle cx="46" cy="40" r="9" fill="#e8f6ff" stroke="#1d4ed8" strokeWidth="2.5"/>
          <path d="M37 40h18M46 31c-5 5-5 13 0 18M46 31c5 5 5 13 0 18" fill="none" stroke="#1d4ed8" strokeWidth="2"/>
        </symbol>
        <symbol id="ic-route" viewBox="0 0 64 64">
          <path d="M4 18l16-6 20 6 20-6v34l-20 6-20-6-16 6z" fill="#d9efd0" stroke="#2f7d46" strokeWidth="3" strokeLinejoin="round"/>
          <path d="M10 44c10-2 8-14 18-14s8 8 16 4" fill="none" stroke="#1d4ed8" strokeWidth="3.5" strokeDasharray="5 5" strokeLinecap="round"/>
          <path d="M48 28c0 0-8-8-8-14a8 8 0 1 1 16 0c0 6-8 14-8 14z" fill="#e53935" stroke="#ffffff" strokeWidth="2"/>
          <circle cx="48" cy="14" r="3" fill="#ffffff"/>
          <rect x="10" y="44" width="22" height="9" rx="4" fill="#2f6fd0" stroke="#ffffff" strokeWidth="2"/>
          <circle cx="16" cy="54" r="3.5" fill="#333"/><circle cx="27" cy="54" r="3.5" fill="#333"/>
        </symbol>
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
