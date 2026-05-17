/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "motion/react";
import { LogIn, Mail, Lock } from "lucide-react";
import { auth, db } from "../lib/firebase";
import { handleFirestoreError, OperationType } from "../lib/firestoreUtils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      let userDoc;
      try {
        userDoc = await getDoc(doc(db, "users", user.uid));
      } catch (err: any) {
        handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
        return;
      }

      if (!userDoc.exists()) {
        setError("Akun belum terdaftar. Silakan mendaftar terlebih dahulu.");
        await auth.signOut();
        setLoading(false);
        return;
      }
      navigate("/");
    } catch (err: any) {
      console.error("Google Login Error:", err);
      if (err.message?.includes('offline')) {
        setError("Firestore tidak terhubung (offline). Pastikan Anda sudah membuat database Firestore di Firebase Console dan mengaktifkan 'Native Mode'.");
      } else {
        setError(`Gagal masuk dengan Google: ${err.code || err.message}`);
      }
      setLoading(false);
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err: any) {
      if (err.code === "auth/operation-not-allowed") {
        setError("Login manual belum diaktifkan di Firebase Console. Silakan aktifkan 'Email/Password' di Sign-in Methods.");
      } else {
        setError("Email atau password salah.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neon-purple flex items-center justify-center p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md brutalist-card p-10 bg-white"
      >
        <div className="flex items-center space-x-3 mb-8">
           <div className="w-12 h-12 bg-black text-white flex items-center justify-center border-4 border-black font-bold">
            <LogIn size={28} />
          </div>
          <h1 className="text-4xl font-display font-bold">MASUK</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-3 border-red-500 text-red-700 font-bold text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleManualLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="font-bold text-sm block">EMAIL ADDRESS</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                required
                className="w-full brutalist-input pl-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-sm block">PASSWORD</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                required
                className="w-full brutalist-input pl-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full brutalist-button bg-black text-white hover:bg-neon-blue"
          >
            {loading ? "MEMPROSES..." : "MASUK"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-black"></div>
          </div>
          <div className="relative flex justify-center text-xs font-bold uppercase">
            <span className="bg-white px-2">Atau gunakan</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full brutalist-button bg-white text-black hover:bg-gray-50 flex items-center justify-center gap-3"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          <span className="font-bold">GOOGLE LOGIN</span>
        </button>

        <p className="text-center font-bold mt-8">
          Belum punya akun?{" "}
          <Link to="/register" className="text-neon-purple hover:underline underline-offset-4">Daftar sekarang</Link>
        </p>
      </motion.div>
    </div>
  );
}
