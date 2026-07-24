# GitHub・リリース

GitHub運用、配布方法、変更履歴を記録します。

## 記録する内容

- ブランチ・PR運用
- バージョン方針
- リリース手順
- 変更履歴
- テンプレートのコピー方法
- コピー後に変更する項目
- 公開前チェック
- 既知の問題

## ブランチ・PR

- 機能変更は短命なブランチで行い、Pull Requestを経由してmainへ統合する
- PRではFormatter、ESLint、型検査、テスト、Android設定、秘密情報検査、Webビルドを成功させる
- Migrationと設計変更は対応する実装・テストと同じPRへ含める

## バージョン

V1公開までは `0.x.y` とし、互換性を壊す変更はminor、修正はpatchを上げる。V1完成時に `1.0.0` とする。

## コピーして利用する手順

1. リポジトリをコピーし、`package.json`、`app.json`の名前・slug・scheme・アイコンを変更する
2. `.env.example`から環境別の設定を作り、Development／Staging／ProductionのSupabaseを設定する
3. Migrationを各Supabase環境へ適用する
4. `npm ci` と全品質ゲートを実行する
5. Android／Webで新規登録からログアウトまで手動確認する

## 公開前チェック

- `.env.local`、秘密鍵、実データが追跡されていない
- SupabaseのSite URLとRedirect URLにWeb URLとアプリschemeを登録した
- RLSが有効で、別ユーザーのプロフィールへアクセスできない
- AndroidとWebの狭幅・広幅で主要経路を確認した
- 利用規約・プライバシーポリシーの実URLをコピー先で設定した

## 既知の制約

- V1の動作保証はAndroidとWebのみ
- アカウント削除、プロフィール画像、SNSログイン、完全な英訳はV2以降
