/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendEmailVerification, signOut } from "firebase/auth";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "motion/react";
import { Mail, ShieldCheck, LogOut, RefreshCw, AlertTriangle, CheckSquare } from "lucide-react";
import { auth, db } from "../lib/firebase";
import { useAuth } from "../lib/AuthContext";

export default function VerifyEmailPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [bypassing, setBypassing] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(async () => {
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        clearInterval(interval);
        navigate("/");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleManualBypass = async () => {
    if (!auth.currentUser) return;
    setBypassing(true);
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        emailVerifiedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setMessage("Bypass berhasil! Mengalihkan...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err: any) {
      console.error("Bypass Error:", err);
      setMessage(`Gagal bypass: ${err.message}`);
    }
    setBypassing(false);
  };

  const handleResend = async () => {
    if (!auth.currentUser) {
      setMessage("Gagal: Sesi pengguna tidak ditemukan. Silakan masuk kembali.");
      return;
    }
    
    setLoading(true);
    setMessage("");
    try {
      // Reload user safety
      await auth.currentUser.reload();
      
      if (!auth.currentUser.email) {
        throw new Error("Alamat email tidak ditemukan di profil Anda.");
      }

      await sendEmailVerification(auth.currentUser);
      setMessage("Email verifikasi telah dikirim ulang! Silakan cek Inbox atau folder SPAM.");
    } catch (err: any) {
      console.error("Resend Error:", err);
      if (err.code === "auth/too-many-requests") {
        setMessage("Terlalu banyak permintaan. Silakan tunggu beberapa menit.");
      } else if (err.code === "auth/missing-email") {
        setMessage("Gagal: Alamat email tidak terdeteksi. Silakan coba masuk kembali.");
      } else {
        setMessage(`Gagal mengirim ulang: ${err.message}`);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neon-green flex items-center justify-center p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md brutalist-card p-10 bg-white"
      >
        <div className="w-20 h-20 bg-neon-blue border-4 border-black flex items-center justify-center mx-auto mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <Mail size={40} />
        </div>

        <h1 className="text-4xl font-display font-bold mb-4 text-center">VERIFIKASI EMAIL</h1>
        
        <div className="text-center mb-6">
          <p className="font-medium mb-1">Email dikirim ke:</p>
          <p className="text-xl font-bold underline break-all">{auth.currentUser?.email}</p>
        </div>

        <div className="mb-6 p-4 border-3 border-black bg-neon-yellow shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-bold text-sm mb-2 uppercase flex items-center gap-2">
            <ShieldCheck size={18} /> Kenapa Email Tidak Ada?
          </p>
          <ul className="text-xs space-y-1 font-medium list-disc ml-4">
            <li>Cek folder <strong>SPAM</strong>, <strong>PROMOSI</strong>, atau <strong>SOSIAL</strong>.</li>
            <li>Email mungkin butuh waktu 1-5 menit untuk sampai.</li>
            <li>Pastikan alamat email yang Anda ketik sudah benar.</li>
            <li>Firebase terkadang membatasi pengiriman jika terlalu sering.</li>
          </ul>
        </div>

        {message && (
          <div className={`mb-6 p-4 border-2 border-black font-bold text-sm ${message.includes("Gagal") ? "bg-red-100 text-red-600" : "bg-neon-green"}`}>
            {message}
          </div>
        )}

        <div className="flex items-center justify-center space-x-2 text-sm font-bold mb-8">
          <RefreshCw className="animate-spin text-neon-purple" size={16} />
          <span>Sistem menunggu tautan verifikasi diklik...</span>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleResend}
            disabled={loading || bypassing}
            className="w-full brutalist-button bg-white hover:bg-gray-50 flex items-center justify-center space-x-2"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            <span>KIRIM ULANG EMAIL</span>
          </button>

          <button
            onClick={handleManualBypass}
            disabled={loading || bypassing}
            className="w-full brutalist-button bg-neon-yellow hover:bg-yellow-400 flex items-center justify-center space-x-2 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
          >
            <CheckSquare size={18} />
            <span>{bypassing ? "PROSES..." : "LEWATI VERIFIKASI (BYPASS)"}</span>
          </button>
          
          <div className="p-4 bg-orange-50 border-2 border-orange-200 text-[11px] leading-relaxed">
            <p className="font-bold flex items-center gap-1 mb-1"><AlertTriangle size={12} /> DEVELOPER NOTE:</p>
            Jika email tetap tidak masuk setelah 5 menit, kemungkinan ada kendala di sistem pengiriman Firebase. Gunakan tombol bypass di atas untuk melanjutkan ke Dashboard.
          </div>
          
          <button
            onClick={() => signOut(auth)}
            disabled={loading || bypassing}
            className="w-full brutalist-button bg-black text-white hover:bg-red-500 flex items-center justify-center space-x-2 text-sm"
          >
            <LogOut size={18} />
            <span>KEMBALI / GANTI AKUN</span>
          </button>
        </div>
        
        <div className="mt-8 text-[10px] uppercase font-bold text-gray-500 text-center">
          Note: Firebase default menggunakan Link Verifikasi, bukan Kode Angka.
        </div>
      </motion.div>
    </div>
  );
}
