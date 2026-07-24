# expo-app-starter

Expo・React Native・TypeScriptでAndroid／Webアプリを作り始めるための共通スターターです。

## 必要な環境

- Node.js 22以上24未満
- npm
- Android StudioまたはWebブラウザ

## セットアップ

```bash
npm install
cp .env.example .env.local
npm start
```

`.env.local` には環境ごとのSupabase URLと公開Anon Keyを設定します。Service Role Keyなどの秘密鍵はフロントエンドへ置かないでください。

## 品質確認

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build:web
```

設計資料と実装状況は [`docs/`](docs/) にあります。
