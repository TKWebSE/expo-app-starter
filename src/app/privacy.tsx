import { LegalDocument, LegalSection } from '@/components/legal/LegalDocument';

export default function PrivacyScreen() {
  return (
    <LegalDocument title="プライバシーポリシー" updatedAt="2026年7月24日">
      <LegalSection title="1. 取得する情報">
        メールアドレス、表示名などのアカウント情報、認証・設定・利用状況に関する情報、端末やブラウザの基本情報、障害調査に必要なログを取得することがあります。
      </LegalSection>
      <LegalSection title="2. 利用目的">
        本人確認、アカウントとプロフィールの提供、設定の保存、サポート、不正利用の防止、品質改善、法令上必要な対応のために利用します。
      </LegalSection>
      <LegalSection title="3. 外部サービス">
        認証およびデータ保存にはSupabaseを利用します。委託先には必要な範囲で情報を取り扱わせ、適切な管理を求めます。
      </LegalSection>
      <LegalSection title="4. 第三者提供">
        本人の同意がある場合、法令に基づく場合、人の生命・身体・財産の保護に必要な場合を除き、個人情報を第三者へ提供しません。
      </LegalSection>
      <LegalSection title="5. 保存期間と削除">
        利用目的に必要な期間、または法令上必要な期間に限って情報を保存します。アカウント削除後は、法令やバックアップ運用上必要な期間を除き、順次削除します。
      </LegalSection>
      <LegalSection title="6. 安全管理">
        アクセス制御、通信の暗号化、権限管理など、情報の漏えい、滅失または毀損を防ぐための合理的な安全管理措置を講じます。
      </LegalSection>
      <LegalSection title="7. 利用者の権利">
        利用者は、法令に基づき自身の情報の開示、訂正、削除、利用停止を請求できます。表示名の変更やアカウント削除はアプリの設定画面から行えます。
      </LegalSection>
      <LegalSection title="8. 未成年者の利用">
        未成年者は、必要に応じて保護者など法定代理人の同意を得たうえで利用してください。
      </LegalSection>
      <LegalSection title="9. ポリシーの変更">
        法令やサービス内容の変更に応じて本ポリシーを改定することがあります。重要な変更は適切な方法で通知します。
      </LegalSection>
      <LegalSection title="10. お問い合わせ">
        個人情報に関するお問い合わせ先は、公開前に運営者の連絡先を記載します。
      </LegalSection>
    </LegalDocument>
  );
}
