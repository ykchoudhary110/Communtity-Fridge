// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    const { error } = await signIn({ email, password });
    setBusy(false);
    if (error) {
      alert("Login error: " + error.message);
    } else {
      navigate("/");
    }
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h2 className="text-2xl font-semibold mb-4">Log in</h2>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <label className="block">
          <div className="text-sm font-medium">Email</div>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="mt-1 w-full border rounded p-2" />
        </label>

        <label className="block">
          <div className="text-sm font-medium">Password</div>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="mt-1 w-full border rounded p-2" />
        </label>

        <div className="flex gap-2">
          <button type="submit" disabled={busy} className="px-4 py-2 bg-green-600 text-white rounded">
            {busy ? "Logging in…" : "Log in"}
          </button>
          <Link to="/signup" className="px-4 py-2 border rounded">Create account</Link>
        </div>
      </form>
    </div>
  );
}
