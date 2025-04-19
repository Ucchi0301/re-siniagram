"use client";

import Link from "next/link";

export default function WelcomePage() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-[#e0f2fe] via-white to-[#fef9c3] text-gray-800 text-center font-sans">
      {/* === 背景の光 === */}
      <div className="absolute w-[500px] h-[500px] bg-pink-100 opacity-20 rounded-full blur-[120px] top-[-150px] left-[-100px] z-0 animate-pulse" />
      <div className="absolute w-[400px] h-[400px] bg-blue-100 opacity-20 rounded-full blur-[100px] bottom-[-120px] right-[-80px] z-0 animate-pulse" />

      {/* === 控えめに浮かぶ吹き出したち === */}
      <div className="absolute top-[12%] left-[10%] bg-white/50 text-gray-600 px-4 py-2 text-sm rounded-xl shadow-sm border border-white/30 backdrop-blur-sm opacity-0 animate-softfade animation-delay-[0s] z-10">
        「これどこの写真だっけ？」
      </div>

      <div className="absolute top-[20%] right-[8%] bg-white/50 text-gray-600 px-4 py-2 text-sm rounded-xl shadow-sm border border-white/30 backdrop-blur-sm opacity-0 animate-softfade animation-delay-[3s] z-10">
        「そういえばこんなこともあったね！」
      </div>

      <div className="absolute bottom-[22%] left-[14%] bg-white/50 text-gray-600 px-4 py-2 text-sm rounded-xl shadow-sm border border-white/30 backdrop-blur-sm opacity-0 animate-softfade animation-delay-[6s] z-10">
        「この時のおじいちゃんイケメン！」
      </div>

      {/* === 中央コンテンツ === */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 pt-[18vh] pb-[18vh]">
        <h1 className="text-5xl sm:text-6xl font-black leading-tight tracking-tight mb-4 drop-shadow-xl">
          PokaPoka
        </h1>
        <p className="text-base sm:text-lg font-normal leading-relaxed text-gray-600 max-w-md mb-10 drop-shadow-sm">
          写真で家族をつなげる。
          <br />
          やさしい想い出が、世代を超えて広がるアプリです。
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/signin">
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-3 px-10 rounded-full shadow-md animate-glow transition-all duration-300">
              はじめての方へ
            </button>
          </Link>
          <Link href="/login">
            <button className="w-full sm:w-auto bg-white text-blue-700 text-lg font-semibold py-3 px-10 rounded-full border border-blue-300 shadow animate-pulse-smooth hover:bg-blue-50 transition-all duration-300">
              ログイン
            </button>
          </Link>
        </div>
      </div>

      {/* === フッター === */}
      <div className="absolute bottom-3 text-[12px] text-gray-400 tracking-widest z-10 w-full text-center">
        © 2025 PokaPoka – "家族全員" でつながれるアプリ
      </div>

      {/* === アニメーション定義 === */}
      <style jsx>{`
        @keyframes softfade {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          10% {
            opacity: 1;
            transform: translateY(0);
          }
          90% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(10px);
          }
        }

        .animate-softfade {
          animation: softfade 15s ease-in-out infinite;
        }

        @keyframes glow {
          0% {
            box-shadow: 0 0 0px rgba(96, 165, 250, 0.4);
          }
          50% {
            box-shadow: 0 0 15px rgba(96, 165, 250, 0.7);
          }
          100% {
            box-shadow: 0 0 0px rgba(96, 165, 250, 0.4);
          }
        }

        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }

        @keyframes pulseSmooth {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.03);
          }
        }

        .animate-pulse-smooth {
          animation: pulseSmooth 4s ease-in-out infinite;
        }

        .animation-delay-\[0s\] {
          animation-delay: 0s;
        }

        .animation-delay-\[3s\] {
          animation-delay: 3s;
        }

        .animation-delay-\[6s\] {
          animation-delay: 6s;
        }
      `}</style>
    </main>
  );
}
