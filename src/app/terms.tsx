import { LegalDocument, LegalSection } from '@/components/legal/LegalDocument';

export default function TermsScreen() {
  return (
    <LegalDocument title="利用規約" updatedAt="2026年7月24日">
      <LegalSection title="1. 適用">
        本規約は、本アプリの利用条件を定めるものです。利用者は、本規約に同意したうえで本アプリを利用します。
      </LegalSection>
      <LegalSection title="2. アカウント">
        利用者は、正確な情報を登録し、認証情報を自己の責任で安全に管理してください。アカウントを第三者に譲渡または貸与することはできません。
      </LegalSection>
      <LegalSection title="3. 禁止事項">
        法令または公序良俗に反する行為、不正アクセス、他者へのなりすまし、サービスの運営を妨害する行為、第三者の権利を侵害する行為を禁止します。
      </LegalSection>
      <LegalSection title="4. 知的財産権">
        本アプリに含まれる文章、画像、プログラムその他のコンテンツに関する権利は、運営者または正当な権利者に帰属します。
      </LegalSection>
      <LegalSection title="5. サービスの変更・停止">
        運営者は、保守、障害、法令対応その他の合理的な理由がある場合、本アプリの内容を変更し、または提供を一時停止・終了することがあります。
      </LegalSection>
      <LegalSection title="6. 免責・責任の制限">
        運営者は、本アプリの完全性、正確性、継続性を保証しません。法令で認められる範囲で、利用により生じた間接的または特別な損害について責任を負いません。
      </LegalSection>
      <LegalSection title="7. 規約の変更">
        必要に応じて本規約を変更することがあります。重要な変更は、本アプリ内など適切な方法で通知します。
      </LegalSection>
      <LegalSection title="8. 準拠法・管轄">
        本規約は日本法に準拠します。紛争が生じた場合の合意管轄裁判所は、公開前に運営者の所在地に応じて定めます。
      </LegalSection>
      <LegalSection title="9. お問い合わせ">
        お問い合わせ先は、公開前に運営者の連絡先を記載します。
      </LegalSection>
    </LegalDocument>
  );
}
