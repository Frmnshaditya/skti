/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  sendEmailVerification,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { motion } from "motion/react";
import { UserPlus, Mail, Lock, User as UserIcon, ShieldCheck } from "lucide-react";
import { auth, db } from "../lib/firebase";
import { useAuth } from "../lib/AuthContext";
import { handleFirestoreError, OperationType } from "../lib/firestoreUtils";

export default function RegisterPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"mahasiswa" | "dosen">("mahasiswa");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to home if user already has a profile
    if (user && profile) {
      navigate("/");
    }
  }, [user, profile, navigate]);

  const handleManualRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role,
        emailVerifiedAt: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      await sendEmailVerification(user);
      navigate("/verify-email");
    } catch (err: any) {
      if (err.code === "auth/operation-not-allowed") {
        setError("Registrasi manual belum diaktifkan di Firebase Console.");
      } else {
        setError(err.message || "Gagal melakukan registrasi.");
      }
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
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
      
      if (userDoc.exists()) {
        setError("Akun Google ini sudah terdaftar. Silakan login.");
        setLoading(false);
        return;
      }

      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName || "User SAKTI",
          email: user.email,
          role: role,
          emailVerifiedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } catch (err: any) {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
      }

      navigate("/");
    } catch (err: any) {
      console.error("Google Register Error:", err);
      if (err.message?.includes('offline')) {
        setError("Firestore tidak terhubung (offline). Pastikan Anda sudah membuat database Firestore di Firebase Console dan mengaktifkan 'Native Mode'.");
      } else {
        setError(`Gagal mendaftar dengan Google: ${err.code || err.message}`);
      }
      setLoading(false);
    }
  };

  const handlePickRole = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName || "User SAKTI",
          email: user.email,
          role: role,
          emailVerifiedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } catch (err: any) {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
      }
      navigate("/");
    } catch (err: any) {
      console.error("Save Role Error:", err);
      if (err.message?.includes('offline')) {
        setError("Firestore tidak terhubung (offline). Pastikan database Firestore Anda sudah aktif.");
      } else {
        setError("Gagal menyimpan profil.");
      }
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neon-blue p-6">
        <div className="w-24 h-24 border-[12px] border-black border-t-white rounded-full animate-spin mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
        <h1 className="text-3xl font-display font-bold uppercase">Memuat SAKTI...</h1>
      </div>
    );
  }

  // If user is logged in and has profile, we wait for the useEffect redirect
  if (user && profile) {
    return null;
  }

  if (user && !profile) {
    return (
      <div className="min-h-screen bg-neon-blue flex items-center justify-center p-6">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-md brutalist-card p-10 bg-white"
        >
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center border-4 border-black font-bold">
              <UserPlus size={28} />
            </div>
            <h1 className="text-4xl font-display font-bold uppercase">Role Anda</h1>
          </div>

          <p className="font-medium mb-6">Halo <strong>{user.displayName || user.email}</strong>, silakan pilih peran Anda untuk melanjutkan ke sistem.</p>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-3 border-red-500 text-red-700 font-bold text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("mahasiswa")}
                className={`py-3 border-3 border-black font-bold ${role === "mahasiswa" ? "bg-neon-yellow shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-white"}`}
              >
                MAHASISWA
              </button>
              <button
                type="button"
                onClick={() => setRole("dosen")}
                className={`py-3 border-3 border-black font-bold ${role === "dosen" ? "bg-neon-purple text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-white"}`}
              >
                DOSEN
              </button>
            </div>

            <button
              onClick={handlePickRole}
              disabled={loading}
              className="w-full brutalist-button bg-black text-white hover:bg-neon-green hover:text-black"
            >
              {loading ? "MENYIMPAN..." : "SIMPAN DAN LANJUTKAN"}
            </button>
            
            <button
              onClick={() => auth.signOut()}
              className="w-full text-sm font-bold underline text-center"
            >
              Gunakan akun lain
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neon-blue flex items-center justify-center p-6">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-2xl brutalist-card p-10 bg-white"
      >
        <div className="flex items-center space-x-3 mb-8">
           <div className="w-12 h-12 bg-black text-white flex items-center justify-center border-4 border-black font-bold">
            <UserPlus size={28} />
          </div>
          <h1 className="text-4xl font-display font-bold">DAFTAR AKUN</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-3 border-red-500 text-red-700 font-bold text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleManualRegister} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-bold text-sm block">NAMA LENGKAP</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  required
                  className="w-full brutalist-input pl-12"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-bold text-sm block">EMAIL</label>
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
          </div>

          <div className="space-y-2">
            <label className="font-bold text-sm block">PILIH ROLE ANDA</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("mahasiswa")}
                className={`py-3 border-3 border-black font-bold ${role === "mahasiswa" ? "bg-neon-yellow shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-white"}`}
              >
                MAHASISWA
              </button>
              <button
                type="button"
                onClick={() => setRole("dosen")}
                className={`py-3 border-3 border-black font-bold ${role === "dosen" ? "bg-neon-purple text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-white"}`}
              >
                DOSEN
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-sm block">PASSWORD (MIN. 6 KARAKTER)</label>
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
            {loading ? "MEMPROSES..." : "DAFTAR MANUAL"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-black"></div></div>
          <div className="relative flex justify-center text-xs font-bold uppercase"><span className="bg-white px-2">Atau</span></div>
        </div>

        <button
          onClick={handleGoogleRegister}
          disabled={loading}
          className="w-full brutalist-button bg-white text-black hover:bg-gray-50 flex items-center justify-center gap-3"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          <span className="font-bold">DAFTAR DENGAN GOOGLE</span>
        </button>

        <p className="text-center font-bold mt-8">
          Sudah punya akun? <Link to="/login" className="text-neon-blue hover:underline">Masuk</Link>
        </p>
      </motion.div>
    </div>
  );
}
