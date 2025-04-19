'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('http://localhost:8000/api/signup/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    })

    const data = await res.json()

    if (res.ok) {
      // 🎉 トークン保存
      localStorage.setItem('access', data.access)
      localStorage.setItem('refresh', data.refresh)

      // 🔁 /home へ移動
      router.push('/home')
    } else {
      alert('登録に失敗しました')
      console.log(data)
    }
  }

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">サインアップ</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 border rounded"
        />
        <input
          type="text"
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-3 border rounded"
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
          登録
        </button>
      </form>
    </main>
  )
}
