# AI 職涯與課程導航

繁體中文的本地互動 MVP。用約兩分鐘的問卷整理學習方向，再依明確規則從已核對的種子課挑選起步課程。推薦不呼叫 LLM 或外部 API。

這是學習方向參考，不是報名系統，也不保證就業。

## 線上網站

https://jerryaspx.github.io/ai-course-navigator/

GitHub Pages 從 `gh-pages` 分支的**根目錄**提供已建置的單頁應用（`index.html` 與 `assets/`），不是 Vite 原始碼。`vite.config.ts` 的 `base` 已設為 `/ai-course-navigator/`，請保持這個前綴，否則靜態資源會 404。

## 本地啟動

```bash
npm install
npm run dev
```

終端機會印出本機網址（通常是 `http://localhost:5173/ai-course-navigator/`）。

## 建置

```bash
npm run build
npm run preview
```

`npm run build` 會先做 TypeScript 檢查，再把網站輸出到 `dist/`。

## 資料與推薦邊界

- 可進入推薦的課只來自 `data/seed-courses.json`，而且必須同時是 `status=active`，課程網址並以 `https://www.uuu.com.tw/` 開頭。
- `status=pending_review`，或沒有上述官網網址的種子課，不會進入推薦。
- `data/ai-catalog.json` 的 112 筆目錄只供範圍統計與待審核提示。這些骨架尚未逐筆核對狀態、先備與內容，因此不進入推薦。
- 時數、費用、先備等欄位若原始資料是空值或「待確認」，介面維持顯示「待確認」，不補造數字。
- 名單只寫進目前瀏覽器的 `localStorage`，沒有後端、也不會送出。

## 不報名、不保證就業

頁面只產生學習方向與課程連結參考。它不代為報名、不收費、不承諾錄取或就業。開課狀態與條件請以官方課程頁的最新內容為準。

## 放到 Google Sites

把這個網址交給 Sites，不要嵌原始碼倉庫：

https://jerryaspx.github.io/ai-course-navigator/

**連結（建議）：**

1. 在 Google Sites 編輯器選擇插入 → 按鈕，或插入一段文字。
2. 連結貼上上面的網址。
3. 發佈網站。學員點下去會在新分頁開啟導航。

**嵌入：**

1. 插入 → 嵌入 → 依網址。
2. 貼上同一個網址。
3. 若 Sites 顯示無法嵌入，是因為 GitHub Pages 不允許被其他網站用框架載入。改用上一節的按鈕或文字連結即可。

## 開啟 GitHub Pages（只需一次）

這個倉庫不用 GitHub Actions 重建。`main` 保留原始碼，也保留已建置的 `dist/`。公開網站來自 `gh-pages`：該分支根目錄已經是 `dist/` 的內容（`index.html`、`assets/`），另加一個空的 `.nojekyll`，避免 GitHub Pages 用 Jekyll 處理 Vite 產物。

建立 Pages 站台與設定 homepage 都需要儲存庫管理員權限。若網址仍是 GitHub 的 Site not found，請用管理員帳號做一次：

1. 打開 [Settings → Pages](https://github.com/JerryASPX/ai-course-navigator/settings/pages)。
2. Build and deployment 的 Source 選 **Deploy from a branch**。
3. Branch 選 **gh-pages**，資料夾選 **/ (root)**，按 Save。
4. 在儲存庫首頁右側 About（齒輪）的 Website 填上 `https://jerryaspx.github.io/ai-course-navigator/`。

存檔後約一分鐘再開線上網址，應看到「AI 職涯與課程導航」，而不是 GitHub 的 Site not found。

## 之後更新網站（手動）


```bash
npm run build
git add -A
git commit -m "Update site build"
git push origin main

git fetch origin gh-pages
git worktree add /tmp/gh-pages-pub gh-pages
find /tmp/gh-pages-pub -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -a dist/. /tmp/gh-pages-pub/
touch /tmp/gh-pages-pub/.nojekyll
git -C /tmp/gh-pages-pub add -A
git -C /tmp/gh-pages-pub commit -m "Publish dist to GitHub Pages"
git -C /tmp/gh-pages-pub push origin gh-pages
git worktree remove /tmp/gh-pages-pub
```

## 版本控管

`.gitignore` 只排除 `node_modules/` 與本機雜檔。`dist/` **有**進版控：靜態 `gh-pages` 直接使用這份建置結果，而不是在 Actions 裡重跑 `npm run build`。若之後改成 Actions 發佈，才可以把 `dist/` 加入 `.gitignore`。
