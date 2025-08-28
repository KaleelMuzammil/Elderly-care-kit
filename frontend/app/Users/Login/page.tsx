"use client";

import { useState } from "react";
import NavBar from "../Navbar/page";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      localStorage.setItem("token", data.token);
      window.location.href = "/Users/Vitals";
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="flex items-center justify-center pt-24">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
          {error && <div className="text-red-600 mb-4">{error}</div>}

          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-2 mb-4 border rounded"/>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-2 mb-6 border rounded"/>
          
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Login
          </button>

          {/* Signup link */}
          <p className="text-sm text-center mt-4">
            New here?{" "}
            <a href="/Users/Login/Signup" className="text-blue-600 hover:underline">
              Create an account
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
