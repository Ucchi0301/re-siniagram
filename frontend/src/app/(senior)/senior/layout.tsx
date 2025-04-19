// Auth関連のレイアウト
export default function SeniorLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="h-svh w-screen flex items-center justify-center bg-gray-50">
        {children}
      </div>
    )
  }
  