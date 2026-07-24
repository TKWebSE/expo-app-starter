# 実装記録

設計に基づく実装内容と、実装中に判明した事項を記録します。

## 記録する内容

- 実装順序
- 実装済み項目
- 技術上の判断
- 設計との差分
- 動作確認結果
- Finance Appでの試用結果
- スターターへ戻す改善
- 残作業

## 2026-07-24：実装開始

### 実装順序

1. Expo・TypeScript・Expo Routerの起動基盤
2. Formatter・ESLint・型検査・Vitest・GitHub Actions
3. 認証とプロフィールの入力スキーマ
4. Supabase接続、Repository境界、`profiles` Migration
5. 認証画面と認証状態によるルーティング
6. 設定・プロフィール画面、共通フィードバック

### 実装済み

- Expo SDK 57、React Native、TypeScript、Expo Routerの初期設定
- Android・Web共通の最小画面とWeb用404画面
- テーマトークンと薄いボタンラッパー
- Development・Staging・Production用の環境変数検証
- パスワード、表示名のZodスキーマと境界値テスト
- Supabase Auth・Profile Repositoryの境界
- `profiles` テーブル、RLS、更新日時、自動作成トリガー
- PR・main用の自動品質ゲート

### 技術上の判断

- Expoの現行安定版であるSDK 57系から開始した
- 新規登録時はメールアドレスの `@` より前を初期表示名にする
- クライアントから初期表示名をメタデータとして渡し、DBトリガーでもメールアドレスから補完する
- V1にはProfile Repositoryの削除APIとRLSのDELETEポリシーを作らない
- UIラッパーはReact Native標準部品から薄く開始し、実利用で不足したAPIだけを増やす

### 確認結果

- Formatter：成功
- ESLint：成功
- TypeScript型検査：成功
- 単体・Migration契約テスト：21件成功
- Web静的ビルド：成功

### 残作業

- 認証画面と認証状態のStore・Hook
- スプラッシュ、メール確認、パスワード再設定
- レスポンシブなホーム・設定・プロフィール画面
- Snackbar、ダイアログ、ローディング、空状態、エラー状態
- テーマ永続化と多言語化の土台
- Supabase CLIによるDB・RLS結合テスト
- Android実機とWeb幅別の手動確認
