/**
 * Cross-app auth handoff — teacher_page → quiz_page (POC, dev/demo only)
 *
 * ⚠️ SECURITY CAVEAT (อ่านก่อนใช้):
 *   - POC นี้ส่ง email/name ของผู้ใช้เป็น **plaintext** ผ่าน query string
 *   - URL อาจถูกบันทึกใน browser history, server access log, referrer header
 *   - ใช้ได้เฉพาะ dev/demo เพื่อแก้ UX ครูที่ต้องล็อกอินซ้ำตอนข้ามแอป
 *   - **ห้าม** เอาขึ้น production ตามนี้
 *   - Production จริงควรใช้ SSO (OAuth/OIDC), shared cookie ใต้โดเมนเดียวกัน,
 *     หรือ signed short-lived JWT (ฝั่งรับ verify ลายเซ็น+อายุ token)
 */

import { BRAND } from "@/config/brand";

/**
 * สร้าง URL ของ quiz_page พร้อมแนบ token (email) + name + flag from=teacher
 * ฝั่ง quiz_page จะ consume ค่านี้ตอน mount แล้วล้าง query string ออก
 *
 * ถ้าไม่มี email ใน localStorage (เคสไม่ปกติ) — คืน URL พื้นฐานไม่ใส่ query
 */
export function buildQuizAppUrl(): string {
  const base = BRAND.quizAppUrl;

  let email: string | null = null;
  let name: string | null = null;
  try {
    email = localStorage.getItem("userEmail");
    name = localStorage.getItem("userName");
  } catch {
    // localStorage อาจไม่พร้อมใช้ (privacy mode) — fallback เป็น URL พื้นฐาน
    return base;
  }

  if (!email) return base;

  const params = new URLSearchParams();
  params.set("token", email);
  if (name) params.set("name", name);
  params.set("from", "teacher");

  // ใช้ separator ที่ถูกต้องเผื่อ base มี query เดิม (ตอนนี้ไม่มี แต่กันไว้)
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}${params.toString()}`;
}
