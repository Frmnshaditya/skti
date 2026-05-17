/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendEmailVerification, signOut } from "firebase/auth";
import { motion } from "motion/react";
import { Mail, CheckCircle, LogOut, RefreshCw } from "lucide-react";
import { auth } from "../lib/firebase";

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false);
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

  const handleResend = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      await sendEmailVerification(auth.currentUser);
      setMessage("Email verifikasi telah dikirim ulang!");
    } catch (err: any) {
      setMessage("Terlalu banyak permintaan. Silakan tunggu sebentar.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neon-green flex items-center justify-center p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md brutalist-card p-10 bg-white text-center"
      >
        <div className="w-20 h-20 bg-neon-blue border-4 border-black flex items-center justify-center mx-auto mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <Mail size={40} />
        </div>

        <h1 className="text-4xl font-display font-bold mb-4">VERIFIKASI EMAIL</h1>
        <p className="font-medium mb-8">
          Kami telah mengirimkan email verifikasi ke <span className="font-bold underline">{auth.currentUser?.email}</span>. 
          Silakan cek inbox (atau folder spam) Anda.
        </p>

        {message && (
          <div className="mb-8 p-3 border-2 border-black bg-neon-yellow font-bold text-sm">
            {message}
          </div>
        )}

        <div className="flex items-center justify-center space-x-2 text-sm font-bold mb-8">
          <RefreshCw className="animate-spin text-neon-purple" size={16} />
          <span>Menunggu konfirmasi Anda...</span>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleResend}
            disabled={loading}
            className="w-full brutalist-button bg-white hover:bg-gray-50 flex items-center justify-center space-x-2"
          >
            <span>KIRIM ULANG EMAIL</span>
          </button>
          
          <button
            onClick={() => signOut(auth)}
            className="w-full brutalist-button bg-black text-white hover:bg-red-500 flex items-center justify-center space-x-2"
          >
            <LogOut size={18} />
            <span>MASUK DENGAN AKUN LAIN</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
