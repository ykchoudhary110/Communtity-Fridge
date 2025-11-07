// src/pages/Signup.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signUp, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    // create user
    const { data, error } = await signUp({ email, password });
    if (error) {
      setBusy(false);
      alert("Signup error: " + error.message);
      return;
    }

    // attempt sign in immediately (works if your Supabase allows immediate session)
    const { error: loginError } = await signIn({ email, password });
    setBusy(false);

    if (loginError) {
      // if sign in fails (e.g., email confirm required), navigate to login page with message
      alert("Signed up — please confirm your email (if required) and then log in.");
      navigate("/login");
      return;
    }

    // successful sign in -> go to home
    navigate("/");
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h2 className="text-2xl font-semibold mb-4">Create an account</h2>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <label className="block">
          <div className="text-sm font-medium">Email</div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="mt-1 w-full border rounded p-2"
            placeholder="you@example.com"
          />
        </label>

        <label className="block">
          <div className="text-sm font-medium">Password</div>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            className="mt-1 w-full border rounded p-2"
            placeholder="Choose a password"
          />
        </label>

        <div className="flex gap-2">
          <button type="submit" disabled={busy} className="px-4 py-2 bg-blue-600 text-white rounded">
            {busy ? "Creating…" : "Sign up"}
          </button>
          <Link to="/login" className="px-4 py-2 border rounded">Have an account? Log in</Link>
        </div>
      </form>
    </div>
  );
}
