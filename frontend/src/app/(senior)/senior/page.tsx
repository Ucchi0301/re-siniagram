"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";

type ImageData = {
  image: string;
};

const API_BASE = "http://localhost:8000";

const fetcher = async (url: string): Promise<ImageData> => {
  const res = await fetch(url, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
};

export default function ViewerPage() {
  const API_URL = `${API_BASE}/api/post/random`;

  const { data, error, mutate, isLoading } = useSWR(API_URL, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  });

  const [history, setHistory] = useState<string[]>([]);
  const [index, setIndex] = useState<number>(-1);

  // 📵 ズーム・ピンチ・テキスト選択防止
  useEffect(() => {
    const touchHandler = (event: TouchEvent) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    };
    document.addEventListener("touchstart", touchHandler, { passive: false });

    // ✨ テキスト選択禁止
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("touchstart", touchHandler);
      document.body.style.userSelect = "";
    };
  }, []);

  useEffect(() => {
    if (data?.image && index === -1) {
      const fullUrl = `${API_BASE}${data.image}`;
      setHistory([fullUrl]);
      setIndex(0);
    }
  }, [data]);

  const loadNext = async () => {
    // すでに履歴に次があるなら、それを表示するだけ
    if (index + 1 < history.length) {
      setIndex(index + 1);
      return;
    }
  
    // なければ新しい画像をfetchして履歴に追加
    const updated = await mutate();
    if (updated?.image) {
      const fullUrl = `${API_BASE}${updated.image}`;
      const newHistory = [...history.slice(0, index + 1), fullUrl];
      setHistory(newHistory);
      setIndex(newHistory.length - 1);
    }
  };

  const loadPrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const currentImage = history[index];

  return (
    <main className="flex flex-col h-full w-full bg-white touch-none select-none">
      {/* 上80% */}
      <div className="flex items-center justify-center flex-grow bg-gray-100 p-2">
        {error && <div className="text-red-500">エラーが発生しました</div>}
        {isLoading && index === -1 ? (
          <div className="text-gray-400">画像を読み込んでいます...</div>
        ) : currentImage ? (
          <RotatableImage src={currentImage} />
        ) : (
          <div className="text-gray-400">画像がありません</div>
        )}
      </div>

      {/* 下20% */}
      <div className="h-[20%] flex items-center justify-between bg-white border-t px-4">
        <button
          onClick={loadPrev}
          disabled={index <= 0}
          className="w-1/2 h-full text-8xl font-bold bg-green-600 text-white disabled:opacity-0 transition-all active:scale-70 active:shadow-inner"
        >
          前
        </button>
        <button
          onClick={loadNext}
          className="w-1/2 h-full text-8xl font-bold bg-red-500 text-white transition-all duration-300 active:scale-70 active:shadow-inner"
        >
          次
        </button>
      </div>
    </main>
  );
}

function RotatableImage({ src }: { src: string }) {
  const [isLandscape, setIsLandscape] = useState<boolean | null>(null);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <img
        src={src}
        alt="画像"
        onLoad={(e) => {
          const img = e.currentTarget;
          const landscape = img.naturalWidth > img.naturalHeight;
          setIsLandscape(landscape);
        }}
        className={`transition-transform duration-300 absolute object-contain
          ${isLandscape
            ? "rotate-90 w-[100vh] h-auto max-w-none max-h-none"
            : "w-full h-auto max-w-full max-h-full"
          }`}
        style={{
          transformOrigin: "center",
        }}
      />
    </div>
  );
}
