# かんたん お買い物ナビ

庄内地域（酒田市・三川町・庄内町・遊佐町）の高齢者向けに、近くのスーパーなどを探して、お店のページと行き方（Googleマップ）に案内するWebアプリです。

- 探し方：現在地／市や町／お店の名前
- 技術：HTML・CSS・素のJavaScript（サーバーなし）
- お店のデータ：`data/stores.js`（22軒。URLと位置は、人が確認して登録）

## 動かし方

```
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000` を開きます。（現在地は、HTTPSまたはlocalhostでのみ使えます）

## フォルダ

| 場所 | 内容 |
|---|---|
| `index.html` `css/` `js/` `data/` `images/` | アプリ本体 |
| `verify/` | 課題用の検証（アプリには組み込まない） |
| `docs/explanation.md` | 説明メモ |
| `CLAUDE.md` | 開発方針 |

`verify/route-check.html` を動かすには、`verify/config.example.js` を `verify/config.js` にコピーして、自分のAPIキーを書いてください（`config.js` はGitHubに上がりません）。
