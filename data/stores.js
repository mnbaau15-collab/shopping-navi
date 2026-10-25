// ===========================================
// お店の情報をまとめた名簿ファイル
// 1軒分の情報は { ... } で囲み、軒と軒の間は , （カンマ）で区切ります
// 項目：id（お店の番号）、name（店名）、kana（読みがな。ひらがなで書き、単語の区切りにスペースを入れる）、city（市町）、officialUrl（公式ホームページ）
// lat（緯度）、lng（経度）は、Googleマップで調べた数字です。まだ調べていないお店は書かなくても動きます（位置がない店は、現在地検索と「行き方」ボタンに出ません）
// address（住所）、tel（電話番号）、hours（営業時間）、closed（定休日）は、お店の公式ページに書かれていたとおりに登録します
//   書かれていない項目は、書きません（「定休日なし」とは限らないため）。updatedAt は、公式ページを見た日です
// flyerUrl は「そのお店のトクバイのページ」です（https://tokubai.co.jp/チェーン名/店番号）
//   ・URL を書く … 「チラシを さがす」で、そのお店のトクバイのページが開く
//   ・null と書く … トクバイに掲載がないお店。ボタンの代わりに「トクバイに チラシが ありません」と出る
//   ・書かない … まだ調べていないお店。庄内地方のページが開く
//   チラシ1枚ごとのURL（/leaflets/番号）は、すぐ古くなるので、書きません
// ※ URLは、人が目で確認して手作業で登録します（自動で集めません）
// ===========================================
const stores = [
  // ---------- 酒田市 ----------
  {
    id: "sakata-001",
    name: "イオン酒田南店",
    kana: "いおん さかた みなみてん",
    city: "酒田市",
    lat: 38.89208991165729,
    lng: 139.85265263558202,
    address: "山形県酒田市あきほ町120-1",
    tel: "0234-21-1400",
    hours: "食品 8:00〜22:00／食品以外 9:00〜22:00（一部の売場・専門店は営業時間が異なります）",
    updatedAt: "2026-10-20",
    flyerUrl: "https://tokubai.co.jp/イオン/12598",
    officialUrl: "https://aeontohoku.co.jp/stores/sakataminami?utm_source=sns&utm_medium=gbp&utm_campaign=year-round"
  },
  {
    id: "sakata-002",
    name: "ト一屋みずほ通り店",
    kana: "といちや みずほ どおりてん",
    city: "酒田市",
    lat: 38.9025119107743,
    lng: 139.85140536100081,
    flyerUrl: null,
    officialUrl: "http://www.toichiya.co.jp/shop/mizuhodori.html"
  },
  {
    id: "sakata-003",
    name: "ト一屋駅東店",
    kana: "といちや えきひがしてん",
    city: "酒田市",
    lat: 38.92336092827425,
    lng: 139.84748000702987,
    flyerUrl: null,
    officialUrl: "http://www.toichiya.co.jp/shop/ekihigashi.html"
  },
  {
    id: "sakata-004",
    name: "こぴあコープ酒田",
    kana: "こぴあ こーぷ さかた",
    city: "酒田市",
    lat: 38.93456103265411,
    lng: 139.8462071551572,
    flyerUrl: "https://tokubai.co.jp/生活協同組合共立社/13044",
    officialUrl: "https://www.yamagata.coop/center/shop/store.php?shop=191#gsc.tab=0"
  },
  {
    id: "sakata-005",
    name: "スーパーアオキ",
    kana: "すーぱー あおき",
    city: "酒田市",
    lat: 38.91764149914794,
    lng: 139.85885822209008,
    address: "山形県酒田市日の出町一丁目1番地の8",
    tel: "0234-43-0103",
    hours: "9:00-22:00",
    updatedAt: "2026-10-25",
    flyerUrl: null,
    officialUrl: "https://kusuri-aoki-shop-info.com/result?searchword=&page=1&size=15&cityId=27&districtId=322&closeTime=0&openTime=0&listTags="
  },
  {
    id: "sakata-006",
    name: "週末びっくり市",
    kana: "しゅうまつ びっくり いち", // ※読みがなは要確認
    city: "酒田市",
    lat: 38.88922746190737,
    lng: 139.85278933743416,
    address: "山形県天童市万代1番2号",
    tel: "023-654-1245",
    updatedAt: "2026-10-25",
    flyerUrl: null,
    officialUrl: "https://nogawa-bikkuriichi.com/shop/94"
  },
  {
    id: "sakata-007",
    name: "マックスバリュ平田店",
    kana: "まっくすばりゅ ひらたてん",
    city: "酒田市",
    lat: 38.89110863019073,
    lng: 139.9158540171951,
    address: "山形県酒田市砂越字粕町73-1",
    tel: "0234-52-2506",
    hours: "8:00〜22:00",
    updatedAt: "2026-10-20",
    flyerUrl: "https://tokubai.co.jp/マックスバリュ/14740",
    officialUrl: "https://aeontohoku.co.jp/stores/hirata"
  },
  {
    id: "sakata-008",
    name: "マックスバリュ東泉店",
    kana: "まっくすばりゅ ひがしいずみてん",
    city: "酒田市",
    lat: 38.930519,
    lng: 139.850723,
    address: "山形県酒田市東泉町4丁目1-15",
    tel: "0234-23-5704",
    hours: "24時間営業",
    updatedAt: "2026-10-20",
    flyerUrl: "https://tokubai.co.jp/マックスバリュ/14739",
    officialUrl: "https://aeontohoku.co.jp/stores/higashiizumi"
  },
  {
    id: "sakata-009",
    name: "ザ・ビッグ酒田北店",
    kana: "ざ びっぐ さかた きたてん",
    city: "酒田市",
    lat: 38.93526695399784,
    lng: 139.84847874735036,
    address: "山形県酒田市泉町214",
    tel: "0234-33-0033",
    hours: "7:00〜21:00",
    updatedAt: "2026-10-20",
    flyerUrl: "https://tokubai.co.jp/ザ・ビッグ/14738",
    officialUrl: "https://aeontohoku.co.jp/stores/sakatakita"
  },
  {
    id: "sakata-010",
    name: "といちやいろは蔵パーク店",
    kana: "といちや いろは ぐら ぱーくてん",
    city: "酒田市",
    lat: 38.91059623670809,
    lng: 139.83995610396858,
    flyerUrl: null,
    officialUrl: "http://www.toichiya.co.jp/shop/irohagura.html"
  },
  {
    id: "sakata-011",
    name: "ヤマザワ東大町店",
    kana: "やまざわ ひがしおおまちてん",
    city: "酒田市",
    lat: 38.90504182740294,
    lng: 139.86300587650882,
    address: "山形県酒田市東大町3-36-3",
    tel: "0234-24-7001",
    hours: "9:30～21:00（日曜日は9:00開店）",
    updatedAt: "2026-10-25",
    flyerUrl: "https://tokubai.co.jp/ヤマザワ/875",
    officialUrl: "https://yamazawa.co.jp/shop/084.html"
  },
  {
    id: "sakata-012",
    name: "ヤマザワ山居町店",
    kana: "やまざわ さんきょちょうてん", // ※読みがなは要確認
    city: "酒田市",
    lat: 38.9092475368918,
    lng: 139.83513234234286,
    address: "山形県酒田市山居町2-5-5",
    tel: "0234-21-2211",
    hours: "9:30～21:00（日曜日は9:00開店）",
    updatedAt: "2026-10-25",
    flyerUrl: "https://tokubai.co.jp/ヤマザワ/896",
    officialUrl: "https://yamazawa.co.jp/shop/042.html"
  },
  {
    id: "sakata-013",
    name: "ヤマザワ旭新町店",
    kana: "やまざわ あさひしんまちてん", // ※読みがなは要確認
    city: "酒田市",
    lat: 38.923154021521796,
    lng: 139.85195244434757,
    address: "山形県酒田市旭新町16-1",
    tel: "0234-23-2288",
    hours: "9:30～21:00（日曜日は9:00開店）",
    updatedAt: "2026-10-25",
    flyerUrl: "https://tokubai.co.jp/ヤマザワ/903",
    officialUrl: "https://yamazawa.co.jp/shop/068.html"
  },

  // ---------- 遊佐町 ----------
  {
    id: "yuza-001",
    name: "グリーンストア",
    kana: "ぐりーん すとあ",
    city: "遊佐町",
    lat: 39.016147378974104,
    lng: 139.90906624832007,
    flyerUrl: null,
    officialUrl: "https://sakata.mypl.net/shop/00000360414/"
  },
  {
    id: "yuza-002",
    name: "マックスバリュゆざエルパ店",
    kana: "まっくすばりゅ ゆざ えるぱてん",
    city: "遊佐町",
    lat: 39.01039501198555,
    lng: 139.9085604246009,
    address: "山形県飽海郡遊佐町小原田字沼田12",
    tel: "0234-71-2110",
    hours: "8:00〜22:00",
    updatedAt: "2026-10-20",
    flyerUrl: "https://tokubai.co.jp/マックスバリュ/14737",
    officialUrl: "https://aeontohoku.co.jp/stores/yuzaerupa"
  },
  {
    id: "yuza-003",
    name: "Aコープ吹浦店",
    kana: "えー こーぷ ふくらてん",
    city: "遊佐町",
    lat: 39.071103571528546,
    lng: 139.8796535744857,
    address: "山形県飽海郡遊佐町吹浦字苗代37",
    tel: "0234-77-2438",
    hours: "10:00～18:30",
    updatedAt: "2026-10-25",
    flyerUrl: "https://tokubai.co.jp/Aコープ/22778",
    officialUrl: "https://www.acoop-east-t.jp/store/list/store_64.html"
  },
  {
    id: "yuza-004",
    name: "Aコープ遊佐店",
    kana: "えー こーぷ ゆざてん",
    city: "遊佐町",
    lat: 39.01366370454031,
    lng: 139.9071073797518,
    address: "山形県飽海郡遊佐町遊佐字広表6-1",
    tel: "0234-72-3001",
    hours: "9:30～20:00 (冬季11～3月は19:00閉店)",
    updatedAt: "2026-10-25",
    flyerUrl: null,
    officialUrl: "https://www.acoop-east-t.jp/store/list/store_63.html"
  },

  // ---------- 庄内町 ----------
  {
    id: "shonai-001",
    name: "Aコープ余目",
    kana: "えー こーぷ あまるめ",
    city: "庄内町",
    lat: 38.84789046909989,
    lng: 139.9060530556504,
    tel: "0234-45-1508",
    hours: "【月〜水・金〜土】9:30〜19:00 【日】9:00〜19:00 【毎週木曜日定休日】",
    updatedAt: "2026-10-25",
    flyerUrl: null,
    officialUrl: "https://www.ja-amarume.or.jp/03_01.html"
  },
  {
    id: "shonai-002",
    name: "マックスバリュ余目店",
    kana: "まっくすばりゅ あまるめてん",
    city: "庄内町",
    lat: 38.844380493138864,
    lng: 139.89863442592022,
    address: "山形県東田川郡庄内町余目字滑石57-1",
    tel: "0234-45-1265",
    hours: "8:00〜23:30",
    updatedAt: "2026-10-20",
    flyerUrl: "https://tokubai.co.jp/マックスバリュ/14745",
    officialUrl: "https://aeontohoku.co.jp/stores/amarume"
  },
  {
    id: "shonai-003",
    name: "ヤマザワ余目店",
    kana: "やまざわ あまるめてん",
    city: "庄内町",
    lat: 38.845784890038864,
    lng: 139.8976583571397,
    address: "山形県東田川郡庄内町余目字滑石38-1",
    tel: "0234-42-2211",
    hours: "9:30～21:00（日曜日は9:00開店）",
    updatedAt: "2026-10-25",
    flyerUrl: "https://tokubai.co.jp/ヤマザワ/867",
    officialUrl: "https://yamazawa.co.jp/shop/067.html"
  },

  // ---------- 三川町 ----------
  {
    id: "mikawa-001",
    name: "イオン三川店",
    kana: "いおん みかわてん",
    city: "三川町",
    lat: 38.81607713173052,
    lng: 139.83431160446654,
    flyerUrl: "https://tokubai.co.jp/イオン/12600",
    officialUrl: "https://www.aeon.jp/sc/mikawa/"
  },
  {
    id: "mikawa-002",
    name: "スーパーのアオキ三川店",
    kana: "すーぱーの あおき みかわてん",
    city: "三川町",
    lat: 38.81848924214233,
    lng: 139.83625813319517,
    address: "山形県東田川郡三川町大字猪子字大堰端349番地1",
    tel: "0235-26-0581",
    hours: "9:00-22:00",
    updatedAt: "2026-10-25",
    flyerUrl: "https://tokubai.co.jp/スーパーのアオキ/306152",
    officialUrl: "https://kusuri-aoki-shop-info.com/result?storeCode=1227"
  }
];
