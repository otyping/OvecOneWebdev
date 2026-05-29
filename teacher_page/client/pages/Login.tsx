import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookOpen } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Store email in localStorage if "Remember me" is checked
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    }
    // Store simple auth state (in production, this would validate against backend)
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", email);
    navigate("/dashboard/lesson-plan");
  };

  const handleForgotPassword = () => {
    setShowForgotModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex">
      {/* Left side - Hero section */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-start p-12 relative bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden">
        {/* Background image with low opacity */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2Fa061ccedc21643e89c15d64ceb68a9d5%2F9ef5f147337044a3a4a9ed41a7ad468d')`,
          }}
        />
        {/* Light gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent" />
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-primary text-primary-foreground p-3 rounded-full">
              <BookOpen className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">OVEC One</h1>
          </div>
          <h2 className="mb-6 text-4xl font-bold text-foreground">
            AI Buddy for Teachers.
          </h2>
          <p className="mb-8 max-w-md text-lg text-muted-foreground">
            ช่วยสร้างสรรค์แผนการสอน สร้างกิจกรรม สื่อการสอนวิดีโอและเพลง แบบฝึกหัด ครบ จบ พร้อมใช้งานได้ทันที
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 sm:px-8 sm:py-16">
        <div className="w-full max-w-sm">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="bg-primary text-primary-foreground p-2 rounded-full">
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">OVEC One</h1>
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-2">ยินดีต้อนรับ</h2>
          <p className="text-muted-foreground mb-8">
            ลงชื่อเข้าใช้บัญชีของคุณเพื่อดำเนินการต่อ
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                อีเมลหรือรหัสประจำตัว
              </label>
              <Input
                id="email"
                type="text"
                placeholder="your@email.com หรือ รหัส"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-full h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                รหัสผ่าน
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-full h-11"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  จำฉันไว้
                </label>
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-primary hover:text-accent font-medium transition-colors"
              >
                ลืมรหัสผ่าน?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-full font-semibold text-base"
            >
              ลงชื่อเข้าใช้
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              ยังไม่มีบัญชี?{" "}
              <Link
                to="/register"
                className="text-secondary hover:text-secondary/80 font-medium transition-colors underline"
              >
                ลงทะเบียนที่นี่
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Dialog open={showForgotModal} onOpenChange={setShowForgotModal}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>ตั้งค่ารหัสผ่านใหม่</DialogTitle>
            <DialogDescription>
              ส่งคำแนะนำในการตั้งค่ารหัสผ่านใหม่แล้ว
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-foreground">
              รหัสผ่านของคุณได้รับการตั้งค่าใหม่เป็นวันเกิดของคุณในรูปแบบ{" "}
              <span className="font-semibold">MMDD</span> (ตัวอย่างเช่น:
              0525 สำหรับ 25 พฤษภาคม)
            </p>
            <div className="bg-muted p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-2">ตัวอย่าง:</p>
              <p className="text-foreground font-mono">
                วันเกิด: 25 พฤษภาคม → รหัสผ่าน: 0525
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              คุณสามารถเปลี่ยนรหัสผ่านนี้หลังจากเข้าสู่ระบบ โปรดตรวจสอบอีเมลของคุณเพื่อดูรายละเอียดเพิ่มเติม
            </p>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowForgotModal(false)}
              className="rounded-full"
            >
              ปิด
            </Button>
            <Button
              onClick={() => setShowForgotModal(false)}
              className="rounded-full"
            >
              เข้าใจแล้ว
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
