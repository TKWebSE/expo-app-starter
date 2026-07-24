const ja = {
  appName: 'Expo App Starter',
  home: 'ホーム',
  settings: '設定',
  retry: '再試行',
  loadingFailed: '読み込みに失敗しました',
} as const;

export type MessageKey = keyof typeof ja;

// V1は日本語のみ。画面から文言取得方法を分離し、翻訳追加時の境界を固定する。
export function t(key: MessageKey): string {
  return ja[key];
}
