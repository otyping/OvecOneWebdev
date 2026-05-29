import Layout from "@/components/Layout";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-brand-red hover:text-red-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับไปหน้าแรก
        </button>

        <div className="max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
          <p className="text-gray-600 mb-6">{description}</p>
          <p className="text-sm text-gray-500">
            หน้านี้พร้อมสำหรับการพัฒนา บอกให้เราทราบว่าคุณต้องการเพิ่มฟีเจอร์อะไรที่นี่!
          </p>
        </div>
      </div>
    </Layout>
  );
}
