import { translations, type TranslationKey } from "./translations";
import { useLanguage } from "./LanguageProvider";

/**
 * hook สำหรับแปลข้อความตามภาษาปัจจุบัน
 *   const t = useT();
 *   <h1>{t("login.welcome")}</h1>
 * ถ้าไม่พบคีย์ จะคืนคีย์นั้นกลับ (กันจอว่าง)
 */
export function useT() {
  const { lang } = useLanguage();
  return (key: TranslationKey): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] ?? entry.th ?? key;
  };
}
