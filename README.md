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
npm run check:android
npm run check:secrets
npm run build:web
```

設計資料と実装状況は [`docs/`](docs/) にあります。

## 画面・部品の追加

- 画面は `src/app/<route>.tsx` に追加します。認証後の主要画面は `AppShell` を使用してください。
- 機能固有の処理は `src/features/<feature>/` に置き、画面からSupabaseを直接呼びません。
- 共通UIは `src/components/ui/`、機能固有UIは各featureの `components/` に追加します。
- 文言は `src/i18n/index.ts`、色・余白・文字サイズは `src/theme/` に集約します。
- Development／Stagingでは `/ui-kit` で共通UI状態を確認できます。Productionでは到達できません。

Supabase CLIとDockerを使用できる環境では、次のコマンドでMigrationとRLS結合テストを実行できます。

```bash
supabase start
npm run test:db
```
