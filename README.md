## 簡介

以React建置的動物醫院官網，設有會員系統可以註冊及登入。\
登入後可以進行預約及進入會員中心編輯個人資料。\
管理者則可進入後台修改班表及查詢使用者資料。

## 功能

串接firebase建立登入系統，可使用email註冊及使用google帳戶登入。\
以react-router-dom做前端路由功能。\
以react-slick做首頁的banner輪播功能。\
練習使用SWR串接API。\
管理者後台練習使用Tailwind CSS編寫。\
使用moment.js處理時間相關程式碼。

## 環境設置

firebase@ 10.13.0\
react-router-dom@ 6.26.1\
react-slick@ 0.30.2\
slick-carousel@ 1.8.1\
sass@ 1.71.1\
swr@ 2.2.5\
moment@ 2.30.1\
tailwindcss@ 3.4.11

## 正式網站

https://my-vet-web.web.app/ \
佈署於firebase hosting\
使用admin001@gmail.com登入可至後台編輯班表及查詢使用者資料，\
密碼為admin001

## 開始使用

clone專案至本地。\
於終端機移至專案資料夾輸入:
```
npm install
```
於根目錄建立.env.local\
註冊firebase並將firebase環境變數寫入
```
VITE_APP_FIREBASE_API_KEY= xxxxxxxxxx
VITE_APP_FIREBASE_AUTH_DOMAIN= my-vet-web.firebaseapp.com
VITE_APP_FIREBASE_PROJECT_ID= my-vet-web
VITE_APP_FIREBASE_STOREAGE_BUCKET= my-vet-web.appspot.com
VITE_APP_FIREBASE_MESSAGING_SENDER_ID= xxxxxxxxxx
VITE_APP_FIREBASE_APP_ID= xxxxxxxxxx
VITE_APP_FIREBASE_MEASUREMENT_ID= xxxxxxxxxx
```
及The CAT API KEY https://thecatapi.com/?source=post_page-----4c0299380bf5--------------------------------
```
VITE_APP_CAT_API_KEY= xxxxxxxxxx
```
啟用伺服器
```
npm run dev
```
打開瀏覽器進入到以下網址
```
http://localhost:5173
```
若欲停止使用請輸入
```
Ctrl + C
```
