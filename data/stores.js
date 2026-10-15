// ===========================================
// お店の情報をまとめた名簿ファイル
// 1軒分の情報は { ... } で囲み、軒と軒の間は , （カンマ）で区切ります
// 項目：id（お店の番号）、name（店名）、kana（読みがな。ひらがなで書く）、city（市町）、officialUrl（公式ホームページ）
// lat（緯度）、lng（経度）は、Googleマップで調べた数字です。まだ調べていないお店は書かなくても動きます（位置がない店は、現在地検索と「行き方」ボタンに出ません）
// ※ URLは、人が目で確認して手作業で登録します（自動で集めません）
// ===========================================
const stores = [
  // ---------- 酒田市 ----------
  {
    id: "sakata-001",
    name: "イオン酒田南店",
    kana: "いおんさかたみなみてん",
    city: "酒田市",
    lat: 38.89208991165729,
    lng: 139.85265263558202,
    officialUrl: "https://aeontohoku.co.jp/stores/sakataminami?utm_source=sns&utm_medium=gbp&utm_campaign=year-round"
  },
  {
    id: "sakata-002",
    name: "ト一屋みずほ通り店",
    kana: "といちやみずほどおりてん",
    city: "酒田市",
    lat: 38.9025119107743,
    lng: 139.85140536100081,
    officialUrl: "http://www.toichiya.co.jp/shop/mizuhodori.html"
  },
  {
    id: "sakata-003",
    name: "ト一屋駅東店",
    kana: "といちやえきひがしてん",
    city: "酒田市",
    lat: 38.92336092827425,
    lng: 139.84748000702987,
    officialUrl: "http://www.toichiya.co.jp/shop/ekihigashi.html"
  },
  {
    id: "sakata-004",
    name: "こぴあコープ酒田",
    kana: "こぴあこーぷさかた",
    city: "酒田市",
    lat: 38.93456103265411,
    lng: 139.8462071551572,
    officialUrl: "https://www.yamagata.coop/center/shop/store.php?shop=191#gsc.tab=0"
  },
  {
    id: "sakata-005",
    name: "スーパーアオキ",
    kana: "すーぱーあおき",
    city: "酒田市",
    lat: 38.91764149914794,
    lng: 139.85885822209008,
    officialUrl: "https://kusuri-aoki-shop-info.com/result?searchword=&page=1&size=15&cityId=27&districtId=322&closeTime=0&openTime=0&listTags="
  },
  {
    id: "sakata-006",
    name: "週末びっくり市",
    kana: "しゅうまつびっくりいち", // ※読みがなは要確認
    city: "酒田市",
    lat: 38.88922746190737,
    lng: 139.85278933743416,
    officialUrl: "https://nogawa-bikkuriichi.com/shop/94"
  },
  {
    id: "sakata-007",
    name: "マックスバリュ平田店",
    kana: "まっくすばりゅひらたてん",
    city: "酒田市",
    lat: 38.89110863019073,
    lng: 139.9158540171951,
    officialUrl: "https://aeontohoku.co.jp/stores/hirata"
  },
  {
    id: "sakata-008",
    name: "マックスバリュ東泉店",
    kana: "まっくすばりゅひがしいずみてん",
    city: "酒田市",
    lat: 38.930519,
    lng: 139.850723,
    officialUrl: "https://aeontohoku.co.jp/stores/higashiizumi"
  },
  {
    id: "sakata-009",
    name: "ザ・ビッグ酒田北店",
    kana: "ざびっぐさかたきたてん",
    city: "酒田市",
    lat: 38.93526695399784,
    lng: 139.84847874735036,
    officialUrl: "https://aeontohoku.co.jp/stores/sakatakita"
  },
  {
    id: "sakata-010",
    name: "といちやいろは蔵パーク店",
    kana: "といちやいろはぐらぱーくてん",
    city: "酒田市",
    lat: 38.91059623670809,
    lng: 139.83995610396858,
    officialUrl: "http://www.toichiya.co.jp/shop/irohagura.html"
  },
  {
    id: "sakata-011",
    name: "ヤマザワ東大町店",
    kana: "やまざわひがしおおまちてん",
    city: "酒田市",
    lat: 38.90504182740294,
    lng: 139.86300587650882,
    officialUrl: "https://yamazawa.co.jp/shop/084.html"
  },
  {
    id: "sakata-012",
    name: "ヤマザワ山居町店",
    kana: "やまざわさんきょちょうてん", // ※読みがなは要確認
    city: "酒田市",
    lat: 38.9092475368918,
    lng: 139.83513234234286,
    officialUrl: "https://yamazawa.co.jp/shop/042.html"
  },
  {
    id: "sakata-013",
    name: "ヤマザワ旭新町店",
    kana: "やまざわあさひしんまちてん", // ※読みがなは要確認
    city: "酒田市",
    lat: 38.923154021521796,
    lng: 139.85195244434757,
    officialUrl: "https://yamazawa.co.jp/shop/068.html"
  },

  // ---------- 遊佐町 ----------
  {
    id: "yuza-001",
    name: "グリーンストア",
    kana: "ぐりーんすとあ",
    city: "遊佐町",
    lat: 39.016147378974104,
    lng: 139.90906624832007,
    officialUrl: "https://sakata.mypl.net/shop/00000360414/"
  },
  {
    id: "yuza-002",
    name: "マックスバリュゆざエルパ店",
    kana: "まっくすばりゅゆざえるぱてん",
    city: "遊佐町",
    lat: 39.01039501198555,
    lng: 139.9085604246009,
    officialUrl: "https://aeontohoku.co.jp/stores/yuzaerupa"
  },
  {
    id: "yuza-003",
    name: "Aコープ吹浦店",
    kana: "えーこーぷふくらてん",
    city: "遊佐町",
    lat: 39.071103571528546,
    lng: 139.8796535744857,
    officialUrl: "https://www.acoop-east-t.jp/store/list/store_64.html"
  },
  {
    id: "yuza-004",
    name: "Aコープ遊佐店",
    kana: "えーこーぷゆざてん",
    city: "遊佐町",
    lat: 39.01366370454031,
    lng: 139.9071073797518,
    officialUrl: "https://www.acoop-east-t.jp/store/list/store_63.html"
  },

  // ---------- 庄内町 ----------
  {
    id: "shonai-001",
    name: "Aコープ余目",
    kana: "えーこーぷあまるめ",
    city: "庄内町",
    lat: 38.84789046909989,
    lng: 139.9060530556504,
    officialUrl: "https://www.ja-amarume.or.jp/03_01.html"
  },
  {
    id: "shonai-002",
    name: "マックスバリュ余目店",
    kana: "まっくすばりゅあまるめてん",
    city: "庄内町",
    lat: 38.844380493138864,
    lng: 139.89863442592022,
    officialUrl: "https://aeontohoku.co.jp/stores/amarume"
  },
  {
    id: "shonai-003",
    name: "ヤマザワ余目店",
    kana: "やまざわあまるめてん",
    city: "庄内町",
    lat: 38.845784890038864,
    lng: 139.8976583571397,
    officialUrl: "https://yamazawa.co.jp/shop/067.html"
  },

  // ---------- 三川町 ----------
  {
    id: "mikawa-001",
    name: "イオン三川店",
    kana: "いおんみかわてん",
    city: "三川町",
    lat: 38.81607713173052,
    lng: 139.83431160446654,
    officialUrl: "https://www.aeon.jp/sc/mikawa/"
  },
  {
    id: "mikawa-002",
    name: "スーパーのアオキ三川店",
    kana: "すーぱーのあおきみかわてん",
    city: "三川町",
    lat: 38.81848924214233,
    lng: 139.83625813319517,
    officialUrl: "https://kusuri-aoki-shop-info.com/result?storeCode=1227"
  }
];
