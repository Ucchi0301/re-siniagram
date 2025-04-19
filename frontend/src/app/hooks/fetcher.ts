export const fetcher = async (url: string): Promise<any> => {
  const token = localStorage.getItem("access"); // 🔑 トークン読み込み
  console.log(token);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`, // トークンを Authorization ヘッダーにセット
    },
  });

  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
};