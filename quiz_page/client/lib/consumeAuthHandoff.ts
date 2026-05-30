/**
 * Cross-app auth handoff — รับ token จาก teacher_page (POC, dev/demo only)
 *
 * ⚠️ SECURITY CAVEAT (อ่านก่อนใช้):
 *   - POC นี้รับ email plaintext จาก query string (?token=...&from=teacher) แล้ว
 *     ตั้ง localStorage `isAuthenticated=true` โดย **ไม่ verify** อะไรเลย
 *   - ใครก็ตามที่สร้าง URL พร้อม token=any@email ก็ "ล็อกอิน" เป็นคนนั้นได้
 *   - ใช้ได้เฉพาะ dev/demo เพื่อให้ครูไม่ต้องล็อกอินซ้ำตอนข้ามจาก teacher_page
 *   - **ห้าม** เอาขึ้น production ตามนี้
 *   - Production จริงควร verify signed JWT, ตรวจอายุ token, ตรวจ origin ที่ส่งมา
 *     หรือ migrate ไป SSO/shared subdomain cookie
 *
 * พฤติกรรม:
 *   1) ถ้าเจอ ?token=...&from=teacher ใน URL → ตั้ง localStorage แล้ว clean URL
 *   2) ถ้าไม่เจอ — ไม่ทำอะไร (ไม่ touch state เดิม)
 *   3) เรียกซ้ำได้ปลอดภัย (idempotent — ครั้งที่ 2 ไม่มี query แล้ว ก็ no-op)
 */
export function consumeAuthHandoff(): void {
  if (typeof window === "undefined") return;

  try {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const from = params.get("from");

    // ยอมรับเฉพาะ handoff จาก teacher_page (กันสับสนกับ query อื่น)
    if (!token || from !== "teacher") return;

    const email = decodeURIComponent(token);
    const nameRaw = params.get("name");
    const name = nameRaw ? decodeURIComponent(nameRaw) : null;

    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", email);
    if (name) localStorage.setItem("userName", name);

    // ล้าง query string ออกจาก URL (กัน token อยู่ใน address bar/history)
    // ใช้ replaceState เพื่อไม่ push history entry ใหม่
    params.delete("token");
    params.delete("name");
    params.delete("from");
    const remaining = params.toString();
    const cleanUrl =
      window.location.pathname + (remaining ? `?${remaining}` : "") + window.location.hash;
    window.history.replaceState({}, "", cleanUrl);

    // eslint-disable-next-line no-console
    console.info("[auth-handoff] consumed token from teacher_page (POC dev-only)");
  } catch {
    // ไม่ throw — handoff ล้มเหลวก็แค่ผู้ใช้ต้องล็อกอินเอง (พฤติกรรมเดิม)
  }
}
