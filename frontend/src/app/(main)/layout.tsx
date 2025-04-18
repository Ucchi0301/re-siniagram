// ログイン後のメインレイアウト
import Footer from "@/components/layouts/footer/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-[80px] relative">
      {children}
      <div className="fixed bottom-0 w-screen h-[80px] z-50 bg-white border-t border-gray-200 shadow-md">
        <Footer />
      </div>
    </div>
  )
}
