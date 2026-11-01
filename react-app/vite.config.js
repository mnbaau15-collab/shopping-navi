import { defineConfig } from "vite";

// data/stores.js は、「const stores = [...]」と書いただけのファイル（tools/ の検査や更新の道具も、この形で読む）。
// ファイルは変えずに、React から読むときだけ、最後に「export { stores }」を足す
function exportStores() {
  return {
    name: "export-stores",
    transform(code, id) {
      if (id.split("?")[0].endsWith("/data/stores.js")) {
        return code + "\nexport { stores };";
      }
    }
  };
}

export default defineConfig({
  base: "./",                          // 公開する場所のフォルダ名が何でも動くように、相対パスで書き出す
  plugins: [exportStores()],
  server: { fs: { allow: [".."] } }    // 1つ上のフォルダの data/ css/ images/ を読めるようにする
});
