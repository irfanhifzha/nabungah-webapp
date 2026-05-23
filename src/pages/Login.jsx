import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const ensureUserDoc = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        name: "",
        createdAt: new Date(),
      });
    }
  };

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Email dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = result.user;

      await ensureUserDoc(user);

      localStorage.setItem("token", user.accessToken);

      navigate("/");
    } catch (err) {
      console.error(err);

      if (err.code === "auth/user-not-found") {
        setError("User tidak ditemukan");
      } else if (err.code === "auth/wrong-password") {
        setError("Password salah");
      } else {
        setError("Login gagal, coba lagi");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center p-4">

      <div className="w-full max-w-sm bg-white rounded-[28px] border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-6 flex flex-col gap-5">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black">
            Welcome Back
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Login to continue
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded-xl">
            {error}
          </div>
        )}

        {/* EMAIL */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">
            Email
          </label>

          <input
            className="border border-gray-200 rounded-xl p-3 outline-none focus:border-black"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">
            Password
          </label>

          <input
            className="border border-gray-200 rounded-xl p-3 outline-none focus:border-black"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-black text-white rounded-xl p-3 font-semibold hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? "Loading..." : "Login"}
        </button>

      </div>

    </div>
  );
}