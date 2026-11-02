# React版の説明（はじめての人向け）

講師に説明できるようになるための教材です。上から順に読み、最後の「質問と答え」を、何も見ないで答えられるようにしましょう。

---

## 1. まず、ひとことで

**React は、画面を「部品」に分けて作るための道具です。**

もとのアプリとの違いは、次の1点に集約できます。

| | もとのアプリ（`js/app.js`） | React版 |
|---|---|---|
| 画面の変え方 | 「この文字を書きかえて」「このボタンを隠して」と**手順を1つずつ命令する** | 「いまの状態なら、画面はこうなる」と**完成形を書く**。書きかえはReactがやる |

料理にたとえると、もとのアプリは「野菜を切って、炒めて、皿に盛って」と毎回手順を指示します。React は「この注文ならこの料理」というメニュー表を渡すと、残りを調理場がやってくれるイメージです。

**説明するときの一文：**
「もとのアプリは画面を直接書きかえていましたが、React版では『状態』を変えると、それに合わせて画面が自動で変わるようにしました。」

---

## 2. 覚える言葉は6つ

### ① コンポーネント（部品）
画面の一部分を作る関数です。名前は大文字で始めます。

```jsx
export default function BackToTopButton({ onClick }) {
  return (
    <button type="button" className="big-button sub-button" onClick={onClick}>
      …
    </button>
  );
}
```

同じボタンを何度も書かずに、`<BackToTopButton />` と書くだけで使えます。

### ② JSX（ジェイエスエックス）
JavaScriptの中にHTMLのように書ける書き方です。ブラウザは直接読めないので、Viteが普通のJavaScriptに変換します。

HTMLと少し違うところがあります。

| HTML | JSX | 理由 |
|---|---|---|
| `class="…"` | `className="…"` | `class` はJavaScriptで別の意味があるため |
| `<br>` | `<br />` | 閉じる印が必ず必要 |
| `tabindex="-1"` | `tabIndex={-1}` | 名前の書き方が決まっている |
| 文字 | `{city + " の お店"}` | `{ }` の中にはJavaScriptを書ける |

### ③ props（プロップス）
**親の部品から子の部品へ渡す値**です。関数の引数と同じです。

```jsx
<StoreCard store={store} distanceKm={1.2} />     // 渡す側

function StoreCard({ store, distanceKm }) { … }  // 受け取る側
```

### ④ state（ステート）と `useState`
**部品が覚えておく値**です。これが React の中心です。

```jsx
const [screen, setScreen] = useState("top");
```

- `screen`：いまの値
- `setScreen`：値を変える関数
- `"top"`：最初の値

`setScreen("city")` を呼ぶと、**React が部品をもう一度実行して、画面を新しくします。**
普通の変数を書きかえても、画面は変わりません。ここが一番の違いです。

### ⑤ `useEffect`（ユーズエフェクト）
**画面を出したあとにやる仕事**を書く場所です。「描くこと」以外の仕事に使います。

```jsx
useEffect(function () {
  inputRef.current.focus();   // 入力欄にカーソルを置く
}, []);
```

最後の `[ ]` は「いつ動かすか」です。

| 書き方 | 動くとき | このアプリでの例 |
|---|---|---|
| `[]` | 部品が出たときに1回 | `NameScreen` のカーソル |
| `[screen]` | `screen` が変わるたび | `App` の色の切りかえ |

`return` で関数を返すと、**部品が消えるときの片づけ**になります（`LocationScreen` で使っています）。

### ⑥ `useRef`（ユーズレフ）
**覚えておくけれど、変わっても画面を描き直さない値**です。2つの使い方をしています。

- 画面の部品そのものを指す（`inputRef`：入力欄）
- 裏で数えるだけの値（`requestIdRef`：現在地を調べた回数）

**state と ref の見分け方：** 画面に関係する値は state、関係しない値は ref です。

---

## 3. ファイルの地図

```
react-app/
├── index.html          空の入れ物（<div id="root">）だけのページ
├── package.json        使う部品の一覧と、コマンドの一覧
├── package-lock.json   部品の正確なバージョンの記録（自動で作られる）
├── vite.config.js      変換の設定
├── tests/
│   └── store-utils.test.js   検索や距離の計算のテスト
└── src/
    ├── main.jsx        出発点。App を #root に入れる
    ├── App.jsx         全体。いまの画面を覚えて、その画面だけ出す
    ├── lib/
    │   └── store-utils.js    検索・並び順・距離の計算（画面に触らない）
    └── components/     画面の部品
        ├── TopScreen.jsx        表紙
        ├── CityScreen.jsx       市や町をえらぶ
        ├── ListScreen.jsx       お店の一覧
        ├── NameScreen.jsx       名前でさがす
        ├── LocationScreen.jsx   現在地からさがす
        ├── StoreCards.jsx       カードを並べる
        ├── StoreCard.jsx        カード1枚
        ├── BackToTopButton.jsx  もどるボタン
        └── Icons.jsx            アイコンの絵
```

部品の親子関係は、次のとおりです。

```
App
├── TopScreen
├── CityScreen ── BackToTopButton
├── ListScreen ── StoreCards ── StoreCard
├── NameScreen ── StoreCards ── StoreCard
└── LocationScreen ── StoreCards ── StoreCard
```

`StoreCards` を3つの画面で共通に使っています。これが部品に分ける利点です。

---

## 4. ファイルごとの説明

### `index.html`
ほぼ空です。中身は `<div id="root"></div>` と、`main.jsx` を読み込む1行だけです。画面の中身はすべてReactが作ります。

### `src/main.jsx`
出発点です。3つのことだけをします。

1. `App` を読み込む
2. CSSを読み込む
3. `App` を `#root` の中に出す

`StrictMode` は、開発中に間違いを見つけやすくする仕組みです。公開版の動きには影響しません。

### `src/App.jsx`（一番大事）
「いまどの画面か」を覚えています。

```jsx
const [screen, setScreen] = useState("top");
```

そして、その画面の部品だけを出します。

```jsx
{screen === "top" ? <TopScreen goTo={setScreen} /> : null}
{screen === "city" ? <CityScreen goTo={setScreen} onChooseCity={chooseCity} /> : null}
```

`? :` は「もし〜なら、これ。違えば、これ」という書き方です。`null` は「何も出さない」です。

もとのアプリは全部の画面をHTMLに置いて、`hidden` で隠していました。React版は**出す画面だけを作ります。** 画面を離れると部品が消え、中の state も消えます。そのため、「画面を開くたびに入力欄を空にする」処理が不要になりました。

`useEffect` が2つあります。

- 1つ目：`body` に色の印（`data-theme`）と表紙の印（`is-top`）を付けます。`body` は React の外にあるので、ここで書きかえます。
- 2つ目：画面が変わったら一番上にもどし、読み上げのために見出しへカーソルを移します。

### `src/lib/store-utils.js`
検索、並び順、距離の計算、リンクを作る関数を集めています。**画面に触りません。** 同じ入力なら同じ答えを返すので、画面なしでテストできます。もとの `app.js` の考え方をほぼそのまま使っています。

### `src/components/TopScreen.jsx`
3つのカードを出します。同じ形なので、中で `SearchCard` という小さな部品にしています。

### `src/components/CityScreen.jsx`
市や町のボタンを `map` で作ります。

```jsx
{cities.map(function (city) {
  return <button key={city} …>…</button>;
})}
```

`map` は「リストの1つずつを、画面の部品に変える」関数です。`key` は Reactが1つずつを見分けるための名札で、**リストを出すときに必要**です。

### `src/components/ListScreen.jsx`
`city` を props で受け取り、その市や町のお店をあいうえお順に出します。

### `src/components/NameScreen.jsx`
state が3つあります。

| state | 意味 |
|---|---|
| `query` | 入力欄の文字 |
| `showSuggestions` | 予測を出すか |
| `result` | さがした結果 |

入力欄は `value={query}` と `onChange` でつないでいます。文字を打つ → `setQuery` → 画面が描き直される、という流れです。この形を「制御されたコンポーネント」と呼びます。

予測のリストは state にしていません。`query` から毎回計算できるからです。**計算で出せる値は state にしない**のが React の基本です。

### `src/components/LocationScreen.jsx`（2番目に大事）
`status` という state で「いまどの段階か」を持ちます。

```
idle（まだ）→ searching（しらべ中）→ found（見つかった）
                                   → denied / timeout / unknown（うまくいかない）
```

メッセージもボタンの状態も、`status` から決まります。

**古い結果を無視する仕組み**もここにあります。現在地を調べるには最大20秒かかります。その途中で画面を移ると、古い結果があとから届きます。

1. 調べるたびに番号を1つ進めて、`myRequestId` に控える
2. 結果が届いたら、控えた番号といまの番号を比べる
3. 違えば、その結果は捨てる
4. 画面から出るときも番号を進める（`useEffect` の片づけ）

### `src/components/StoreCards.jsx`、`StoreCard.jsx`
`StoreCards` はカードを並べ、`StoreCard` は1枚を作ります。3つの場合分けがあります。

- `flyerUrl` が `null`：チラシのボタンの代わりに案内を出す
- URLが安全なとき：お店のページのボタンを出す
- 位置があるとき：行き方のボタンを出す

JSXの `{ }` に入れた文字は、Reactが自動で安全な文字として扱います。データにHTMLのような文字が入っていても、プログラムとして動きません。

### `src/components/Icons.jsx`
アイコンの絵です。`IconSprite` に絵をまとめて置き、`<use href="#ic-town">` で呼び出します。

### `vite.config.js`
Viteの設定です。3つのことをしています。

- `base: "./"`：どのフォルダに置いても動くようにする（`/react/` に置くために必要）
- `exportStores`：`data/stores.js` を読むときだけ、最後に `export { stores }` を足す
- `server.fs.allow`：1つ上のフォルダのファイルを読めるようにする

### `package.json`
使う部品と、コマンドの一覧です。

| コマンド | すること |
|---|---|
| `npm run dev` | 開発用に動かす。保存すると画面がすぐ変わる |
| `npm run build` | 公開用に変換して `dist/` に出す |
| `npm run preview` | `dist/` の中身を手元で確認する |
| `npm test` | テストを動かす |

### `.github/workflows/deploy-pages.yml`
公開の設定です。`main` にコードが入ると、次の順で動きます。

1. 部品を入れる（`npm ci`）
2. テストする（失敗したらここで止まる）
3. 変換する（`npm run build`）
4. もとのアプリを `/` に、React版を `/react/` に置く
5. GitHub Pagesに公開する

---

## 5. ボタンを押すと何が起きるか（通して追う）

「市や町からさがす」を押したときの流れです。**これを言えると、理解が伝わります。**

1. `TopScreen` のボタンの `onClick` が動き、`goTo("city")` が呼ばれる
2. `goTo` の正体は、`App` から渡された `setScreen`。`screen` が `"city"` になる
3. state が変わったので、Reactが `App` をもう一度実行する
4. `screen === "city"` が正しくなり、`CityScreen` が出る。`TopScreen` は消える
5. Reactは前の画面との違いだけを、実際の画面に反映する
6. `useEffect` が動き、色を変えて、一番上にもどす

---

## 6. 質問と答え

**Q. なぜReactにしたのですか。**
講師の宿題で、Reactの経験を積むためです。機能は同じで、作り方だけを変えました。

**Q. Reactの利点は何ですか。**
画面を部品に分けて使い回せることと、状態を変えるだけで画面が変わるので、手順の書き忘れが減ることです。もとの `app.js` には「前の結果を消す」処理が多くありましたが、React版では不要になりました。

**Q. 欠点はありますか。**
ファイルが増え、変換の手間が増えます。読み込むプログラムも大きくなります（約250KB）。このくらいの小さなアプリなら、もとの形でも十分だと思います。

**Q. state と props の違いは何ですか。**
state は部品が自分で持つ値で、props は親から渡される値です。state は自分で変えられますが、props は変えられません。

**Q. 普通の変数ではだめなのですか。**
普通の変数を変えても、Reactは気づかないので、画面が描き直されません。

**Q. `useEffect` は何に使いましたか。**
入力欄へのカーソル移動、`body` の色の切りかえ、画面から出るときの片づけです。

**Q. `key` は何のためですか。**
リストの1つずつをReactが見分けるためです。お店は `store.id` を使っています。

**Q. Viteは何をしていますか。**
JSXを普通のJavaScriptに変換し、公開用に1つにまとめます。ファイル名に中身から作った印を付けるので、中身が変わると名前も変わり、スマホが古いファイルを使い続ける問題も起きにくくなります。

**Q. データはどこにありますか。**
`data/stores.js` です。もとのアプリと同じファイルを読みます。2か所に持つと、片方だけ古くなるからです。毎月の更新の仕組みも、そのまま使えます。

**Q. なぜ公開URLを分けたのですか。**
提出するアプリを壊さずに公開するためです。もとのアプリは `/`、React版は `/react/` にあります。

**Q. 同じ動きだと、どう確かめましたか。**
もとのアプリとReact版を、Chromeで同じ38の操作で動かし、スマホ幅とタブレット幅の両方で画面の画像を比べて、すべて一致しました。検索と距離の計算は `npm test` でテストしています。実際のスマホでの確認は、公開後に自分で行いました。※ 確認が終わるまで、この最後の文は言わないこと。

**Q. Claude Codeが書いたコードですよね。自分で分かっていますか。**
正直に「Claude Codeで作り、説明を読んで動きを追いました」と答えて構いません。そのあと、5章の流れを自分の言葉で説明しましょう。

**Q. 分からないことを聞かれたら。**
「そこはまだ理解できていないので、調べます」と答えましょう。推測で答えるより信頼されます。

---

## 7. 手を動かす練習（壊しても大丈夫）

読むだけより、変えてみるほうが身につきます。`react-app` フォルダで `npm run dev` を実行し、ブラウザを開いたまま試します。終わったら `git restore .` で元に戻せます（`react-app` の中で実行すると、その中の変更だけが戻ります）。

1. **文字を変える：** `TopScreen.jsx` の「現在地からさがす」を変えて保存する。→ すぐ画面が変わる
2. **最初の画面を変える：** `App.jsx` の `useState("top")` を `useState("city")` にする。→ 最初から市や町の画面が出る
3. **props を変える：** `TopScreen.jsx` の `color="green"` を `color="blue"` にする。→ カードの色が変わる
4. **`key` を消す：** `CityScreen.jsx` の `key={city}` を消して、ブラウザのConsoleを見る。→ 警告が出る

---

## 8. 自分で確認するチェック

何も見ないで言えたら、チェックを付けましょう。

- [ ] Reactとは何かを、ひとことで言える
- [ ] もとのアプリとの違いを言える
- [ ] コンポーネント・JSX・props・state を説明できる
- [ ] `useEffect` と `useRef` の使いどころを、例で言える
- [ ] ボタンを押してから画面が変わるまでを追える（5章）
- [ ] 古い結果を無視する仕組みを説明できる
- [ ] `npm run dev` と `npm run build` の違いを言える
- [ ] 公開までの流れを言える
