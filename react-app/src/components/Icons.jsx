// アイコンの絵（自分で描いた図形）。外部の画像は使わない
// IconSprite に絵をまとめて置いておき、ほかの場所からは <use href="#名前"> で呼び出す

export function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="g-paper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff"/><stop offset="1" stopColor="#ece6d8"/></linearGradient>
        <linearGradient id="g-red" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ef4a3f"/><stop offset="1" stopColor="#b3180f"/></linearGradient>
        <radialGradient id="g-tomato" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stopColor="#ff8a70"/><stop offset="0.5" stopColor="#e2281c"/><stop offset="1" stopColor="#8f0f0a"/></radialGradient>
        <radialGradient id="g-cabbage" cx="0.35" cy="0.3" r="0.85"><stop offset="0" stopColor="#d9f2a6"/><stop offset="0.55" stopColor="#79b63f"/><stop offset="1" stopColor="#37701f"/></radialGradient>
        <radialGradient id="g-orange" cx="0.35" cy="0.3" r="0.85"><stop offset="0" stopColor="#ffd98a"/><stop offset="0.55" stopColor="#f59a1c"/><stop offset="1" stopColor="#b85c06"/></radialGradient>
        <linearGradient id="g-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fcdf5"/><stop offset="1" stopColor="#e6f5fd"/></linearGradient>
        <linearGradient id="g-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff4dd"/><stop offset="1" stopColor="#dcc69d"/></linearGradient>
        <linearGradient id="g-sign" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2f8f4e"/><stop offset="1" stopColor="#14592b"/></linearGradient>
        <linearGradient id="g-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e8f7ff"/><stop offset="0.5" stopColor="#83bfe0"/><stop offset="1" stopColor="#2f6f96"/></linearGradient>
        <linearGradient id="g-shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000000" stopOpacity="0"/><stop offset="1" stopColor="#000000" stopOpacity="0.28"/></linearGradient>
        <linearGradient id="g-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c9c4b8"/><stop offset="1" stopColor="#8f8a7e"/></linearGradient>
        <linearGradient id="g-map" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#eef6dd"/><stop offset="1" stopColor="#bfdca6"/></linearGradient>
        <linearGradient id="g-water" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#bfe6f8"/><stop offset="1" stopColor="#6eb7dd"/></linearGradient>
        <radialGradient id="g-pin" cx="0.36" cy="0.26" r="0.85"><stop offset="0" stopColor="#ff8f85"/><stop offset="0.45" stopColor="#e3261d"/><stop offset="1" stopColor="#8a0d08"/></radialGradient>
        <radialGradient id="g-pin-center" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stopColor="#ffffff"/><stop offset="1" stopColor="#d5d5d5"/></radialGradient>
        <radialGradient id="g-shadow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#000000" stopOpacity="0.5"/><stop offset="1" stopColor="#000000" stopOpacity="0"/></radialGradient>
        <linearGradient id="g-roof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e8703a"/><stop offset="1" stopColor="#9c3410"/></linearGradient>
        <linearGradient id="g-roof-blue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5f8fc9"/><stop offset="1" stopColor="#2c507f"/></linearGradient>
        <radialGradient id="g-tree" cx="0.38" cy="0.3" r="0.8"><stop offset="0" stopColor="#a6dc78"/><stop offset="0.6" stopColor="#4f9a38"/><stop offset="1" stopColor="#26601f"/></radialGradient>
        <linearGradient id="g-metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f4f6f8"/><stop offset="0.5" stopColor="#8f9aa6"/><stop offset="1" stopColor="#3f4954"/></linearGradient>
        <linearGradient id="g-wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#b57a3f"/><stop offset="1" stopColor="#6b4016"/></linearGradient>
        <radialGradient id="g-lens" cx="0.35" cy="0.3" r="0.85"><stop offset="0" stopColor="#ffffff" stopOpacity="0.75"/><stop offset="0.7" stopColor="#cfeaf8" stopOpacity="0.45"/><stop offset="1" stopColor="#7fbbdc" stopOpacity="0.55"/></radialGradient>
        <linearGradient id="g-car" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6aa8ef"/><stop offset="1" stopColor="#1c4fa8"/></linearGradient>
        <symbol id="ic-here" viewBox="0 0 64 64">
        <path d="M3 25l18-8 21 7 19-8v32l-19 8-21-7-18 8z" fill="url(#g-map)" stroke="#6f8f5a" strokeWidth="1.2" strokeLinejoin="round"/>
        <path d="M42 24l19-8v13l-19 7z" fill="url(#g-water)"/>
        <path d="M3 41l18-6 21 7 19-8" fill="none" stroke="#ffffff" strokeWidth="3.5"/>
        <path d="M3 41l18-6 21 7 19-8" fill="none" stroke="#f3c66b" strokeWidth="1.6"/>
        <path d="M21 17v40M42 24v40" fill="none" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="1.6"/>
        <ellipse cx="32" cy="47" rx="11" ry="3.6" fill="url(#g-shadow)"/><path d="M32 47C32 47 16 30 16 19a16 16 0 1 1 32 0c0 11-16 28-16 28z" fill="url(#g-pin)" stroke="#6e0a06" strokeWidth="0.8"/><circle cx="32" cy="19" r="6.4" fill="url(#g-pin-center)" stroke="#8a0d08" strokeWidth="0.6"/><ellipse cx="25" cy="11" rx="3.6" ry="2.4" fill="#ffffff" fillOpacity="0.45"/>
        </symbol>
        <symbol id="ic-town" viewBox="0 0 64 64">
        <ellipse cx="32" cy="58" rx="29" ry="4" fill="url(#g-shadow)"/>
        <circle cx="54" cy="36" r="8" fill="url(#g-tree)"/>
        <rect x="52.7" y="43" width="2.6" height="14" fill="url(#g-wood)"/>
        <rect x="31" y="16" width="20" height="41" fill="url(#g-wall)" stroke="#9a8560" strokeWidth="0.8"/>
        <path d="M31 16h20v3H31z" fill="url(#g-roof-blue)"/>
        <rect x="34.5" y="22" width="5.5" height="6" fill="url(#g-glass)" stroke="#54442c" strokeWidth="0.6"/><rect x="42.5" y="22" width="5.5" height="6" fill="url(#g-glass)" stroke="#54442c" strokeWidth="0.6"/>
        <rect x="34.5" y="32" width="5.5" height="6" fill="url(#g-glass)" stroke="#54442c" strokeWidth="0.6"/><rect x="42.5" y="32" width="5.5" height="6" fill="url(#g-glass)" stroke="#54442c" strokeWidth="0.6"/>
        <rect x="37.5" y="45" width="7.5" height="12" fill="url(#g-glass)" stroke="#54442c" strokeWidth="0.7"/>
        <rect x="6" y="33" width="24" height="24" fill="url(#g-wall)" stroke="#9a8560" strokeWidth="0.8"/>
        <path d="M2 34L18 18l16 16z" fill="url(#g-roof)" stroke="#6f2409" strokeWidth="0.8" strokeLinejoin="round"/>
        <path d="M6 34h24v2.5H6z" fill="#000000" fillOpacity="0.2"/>
        <rect x="10" y="39" width="7" height="7" fill="url(#g-glass)" stroke="#54442c" strokeWidth="0.7"/><path d="M13.5 39v7M10 42.5h7" stroke="#54442c" strokeWidth="0.5"/>
        <rect x="20" y="42" width="7" height="15" fill="url(#g-wood)" stroke="#54381a" strokeWidth="0.6"/><circle cx="25.5" cy="50" r="0.8" fill="#f5d36b"/>
        </symbol>
        <symbol id="ic-name" viewBox="0 0 64 64">
        <ellipse cx="30" cy="58" rx="27" ry="4" fill="url(#g-shadow)"/>
        <rect x="6" y="20" width="40" height="37" fill="url(#g-wall)" stroke="#9a8560" strokeWidth="0.8"/>
        <rect x="4" y="6" width="44" height="11" rx="1" fill="url(#g-sign)" stroke="#0e431f" strokeWidth="0.7"/>
        <rect x="10" y="9.8" width="32" height="3.2" rx="1" fill="#ffffff"/>
        <path d="M4 17h44l2 7H2z" fill="#ffffff" stroke="#9a2a20" strokeWidth="0.6"/>
        <path d="M4 17h8l-2 7H2zM20 17h8v7h-9zM36 17h8l2 7h-9z" fill="url(#g-red)"/>
        <rect x="10" y="29" width="14" height="28" fill="url(#g-glass)" stroke="#54442c" strokeWidth="1"/>
        <path d="M12 44l9-13h2l-10 15z" fill="#ffffff" fillOpacity="0.5"/>
        <path d="M51 49l10 10" stroke="#3a220f" strokeWidth="7.5" strokeLinecap="round"/>
        <path d="M51 49l10 10" stroke="#8f5a26" strokeWidth="5.5" strokeLinecap="round"/>
        <circle cx="41" cy="39" r="14" fill="url(#g-lens)" stroke="url(#g-metal)" strokeWidth="4.5"/>
        <circle cx="41" cy="39" r="11.7" fill="none" stroke="#3f4954" strokeWidth="0.6"/>
        <path d="M33 34c1.5-3.5 4-5.5 8-6" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round"/>
        </symbol>
        <symbol id="ic-flyer" viewBox="0 0 64 64">
        <ellipse cx="32" cy="58" rx="24" ry="4" fill="url(#g-shadow)"/>
        <rect x="14" y="5" width="40" height="52" rx="1.5" transform="rotate(6 34 31)" fill="#d9d2c2" stroke="#a79f8d" strokeWidth="0.7"/>
        <rect x="9" y="4" width="42" height="53" rx="1.5" fill="url(#g-paper)" stroke="#a79f8d" strokeWidth="0.8"/>
        <rect x="9" y="4" width="42" height="13" fill="url(#g-red)"/>
        <rect x="14" y="8" width="20" height="2.4" fill="#ffffff"/><rect x="14" y="12" width="13" height="2" fill="#ffd7cf"/>
        <path d="M43 7l1.6 3.4 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" fill="#ffe14d" stroke="#c98a00" strokeWidth="0.5"/>
        <circle cx="20" cy="29" r="8" fill="url(#g-tomato)"/>
        <path d="M20 21.5l1.6 2.6 2.8-.6-1.5 2.3-2.9.4-2.9-.4-1.5-2.3 2.8.6z" fill="#3f8a2a"/>
        <ellipse cx="17.5" cy="26.5" rx="2" ry="1.3" fill="#ffffff" fillOpacity="0.6"/>
        <circle cx="39" cy="29" r="8" fill="url(#g-cabbage)"/>
        <path d="M39 21c-3 3-4 9-1 16M39 21c3 3 5 8 3 15M32 28c3 2 8 2 13 0" fill="none" stroke="#2f6a1b" strokeOpacity="0.55" strokeWidth="0.8"/>
        <circle cx="20" cy="46" r="7" fill="url(#g-orange)"/>
        <ellipse cx="18" cy="43.5" rx="1.7" ry="1.1" fill="#ffffff" fillOpacity="0.6"/>
        <rect x="31" y="41" width="16" height="5" rx="1" fill="#d91e14"/>
        <rect x="31" y="48" width="16" height="2.4" fill="#b8ad97"/><rect x="31" y="52" width="11" height="2.2" fill="#b8ad97"/>
        <path d="M51 57V47L41 57z" fill="#c9c1ae"/><path d="M51 47L41 57H51z" fill="url(#g-shade)"/>
        </symbol>
        <symbol id="ic-shop-page" viewBox="0 0 64 64">
        <rect x="2" y="3" width="60" height="58" rx="4" fill="url(#g-sky)"/>
        <rect x="2" y="50" width="60" height="11" rx="2" fill="url(#g-ground)"/>
        <rect x="7" y="13" width="50" height="39" fill="url(#g-wall)" stroke="#a68f66" strokeWidth="0.7"/>
        <rect x="5" y="8" width="54" height="10" rx="1" fill="url(#g-sign)" stroke="#0e431f" strokeWidth="0.7"/>
        <rect x="14" y="11.5" width="36" height="3" rx="1" fill="#ffffff"/>
        <path d="M5 18h54l3 9H2z" fill="#ffffff" stroke="#9a2a20" strokeWidth="0.6"/>
        <path d="M5 18h9l-3 9H2zM23 18h9v9H20zM41 18h9l3 9H42z" fill="url(#g-red)"/>
        <path d="M2 27h60v2H2z" fill="#000000" fillOpacity="0.22"/>
        <rect x="10" y="30" width="16" height="17" fill="url(#g-glass)" stroke="#54442c" strokeWidth="1"/>
        <path d="M12 44l9-12h3l-9 12z" fill="#ffffff" fillOpacity="0.5"/>
        <rect x="38" y="30" width="16" height="17" fill="url(#g-glass)" stroke="#54442c" strokeWidth="1"/>
        <path d="M40 44l9-12h3l-9 12z" fill="#ffffff" fillOpacity="0.5"/>
        <rect x="27.5" y="30" width="9" height="22" fill="url(#g-glass)" stroke="#54442c" strokeWidth="1"/>
        <rect x="33.5" y="39" width="1.4" height="5" rx="0.6" fill="#54442c"/>
        <rect x="10" y="47" width="16" height="6" fill="#8a5a2b" stroke="#54381a" strokeWidth="0.6"/>
        <circle cx="13.5" cy="46.5" r="2.5" fill="url(#g-tomato)"/><circle cx="18" cy="46.5" r="2.5" fill="url(#g-orange)"/><circle cx="22.5" cy="46.5" r="2.5" fill="url(#g-cabbage)"/>
        <rect x="38" y="47" width="16" height="6" fill="#8a5a2b" stroke="#54381a" strokeWidth="0.6"/>
        <circle cx="41.5" cy="46.5" r="2.5" fill="url(#g-orange)"/><circle cx="46" cy="46.5" r="2.5" fill="url(#g-cabbage)"/><circle cx="50.5" cy="46.5" r="2.5" fill="url(#g-tomato)"/>
        </symbol>
        <symbol id="ic-route" viewBox="0 0 64 64">
        <path d="M3 13l18-7 21 7 19-7v42l-19 7-21-7-18 7z" fill="url(#g-map)" stroke="#6f8f5a" strokeWidth="1.2" strokeLinejoin="round"/>
        <path d="M42 13l19-7v13l-19 6z" fill="url(#g-water)"/>
        <path d="M21 6v42M42 13v42" fill="none" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="1.6"/>
        <path d="M13 47c10-1 7-15 17-16s9 3 16-3" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round"/>
        <path d="M13 47c10-1 7-15 17-16s9 3 16-3" fill="none" stroke="#1d6fe0" strokeWidth="3.4" strokeLinecap="round"/>
        <ellipse cx="46" cy="30" rx="7" ry="2.4" fill="url(#g-shadow)"/><path d="M46 30C46 30 36 20 36 13a10 10 0 1 1 20 0c0 7-10 17-10 17z" fill="url(#g-pin)" stroke="#6e0a06" strokeWidth="0.8"/><circle cx="46" cy="13" r="4" fill="url(#g-pin-center)" stroke="#8a0d08" strokeWidth="0.6"/><ellipse cx="41.5" cy="8" rx="2.2" ry="1.5" fill="#ffffff" fillOpacity="0.45"/>
        <ellipse cx="17" cy="59" rx="15" ry="3" fill="url(#g-shadow)"/>
        <path d="M3 54v-5c0-2 1.500-3 3-3l5-6c1-1 2-1.500 3.500-1.500h7c1.500 0 2.500.5 3.500 1.500l5 6c1.500 0 3 1 3 3v5c0 1-.8 2-2 2H5c-1.200 0-2-1-2-2z" fill="url(#g-car)" stroke="#123a80" strokeWidth="0.8"/>
        <path d="M12 46l3.500-4.500c.4-.5.900-.7 1.500-.7h1.500V46zM21 46v-5.200h1.200c.6 0 1.100.2 1.500.7l3.300 4.500z" fill="url(#g-glass)"/>
        <circle cx="10" cy="56" r="4" fill="#222222"/><circle cx="10" cy="56" r="1.800" fill="#c8c8c8"/>
        <circle cx="26" cy="56" r="4" fill="#222222"/><circle cx="26" cy="56" r="1.800" fill="#c8c8c8"/>
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
