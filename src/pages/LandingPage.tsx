/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { GraduationCap, ArrowRight, Zap, Shield, Layout } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black selection:bg-neon-yellow selection:text-black">
      {/* Navbar */}
      <nav className="p-8 flex justify-between items-center border-b-4 border-black">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-black text-white flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_rgba(34,211,238,1)]">
            <GraduationCap />
          </div>
          <span className="font-display font-bold text-2xl tracking-tighter">SAKTI</span>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="font-bold hover:underline decoration-4 decoration-neon-blue">Log In</Link>
          <Link to="/register" className="brutalist-button py-2 bg-neon-blue">Gabung Sekarang</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 py-20 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="inline-block px-4 py-1 bg-neon-green border-2 border-black font-mono font-bold text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            Sistem Informasi Akademik Modern
          </motion.div>
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-7xl md:text-8xl font-display font-bold leading-none tracking-tighter"
          >
            KELOLA <br/>
            <span className="text-white [-webkit-text-stroke:3px_black]">AKADEMIK</span> <br/>
            DENGAN <span className="text-neon-purple">BRUTAL.</span>
          </motion.h1>
          <p className="text-xl font-medium max-w-xl">
            Sistem akademik dengan UI neobrutalist yang berani, cepat, dan aman. 
            Didesain untuk mahasiswa dan dosen masa depan.
          </p>
          <div className="flex gap-4">
            <Link to="/register" className="brutalist-button bg-black text-white flex items-center gap-2 group">
              Daftar Sekarang <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link to="/about" className="brutalist-button bg-white hover:bg-gray-100">Pelajari Lebih Lanjut</Link>
          </div>
        </div>

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex-1 relative"
        >
          <div className="w-full h-[500px] border-8 border-black bg-white shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-12 border-b-4 border-black bg-gray-100 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400 border-2 border-black"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400 border-2 border-black"></div>
              <div className="w-3 h-3 rounded-full bg-green-400 border-2 border-black"></div>
            </div>
            <div className="mt-16 p-8 grid grid-cols-2 gap-4">
              <div className="h-40 border-4 border-black bg-neon-yellow shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col justify-end">
                <p className="font-display font-bold text-2xl">MHS-2024</p>
              </div>
              <div className="h-40 border-4 border-black bg-neon-blue shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col justify-end">
                <p className="font-display font-bold text-2xl">DSN-001</p>
              </div>
              <div className="h-40 border-4 border-black bg-neon-purple shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col justify-end">
                 <p className="font-display font-bold text-2xl">GRADES</p>
              </div>
              <div className="h-40 border-4 border-black bg-neon-green shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col justify-end">
                 <p className="font-display font-bold text-2xl">COURSES</p>
              </div>
            </div>
          </div>
          {/* Abstract geometric shapes around */}
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-neon-yellow border-4 border-black rotate-12 -z-10"></div>
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-neon-purple border-4 border-black -rotate-12 -z-10"></div>
          <div className="absolute top-1/2 -left-20 w-16 h-16 bg-neon-blue border-4 border-black rounded-full -z-10"></div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-8 py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-display font-bold mb-16 underline decoration-neon-green decoration-8 underline-offset-8">KEUNGGULAN KAMI</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Zap, title: "Super Cepat", desc: "Arsitektur modern menjamin performa maksimal untuk setiap akses data." },
              { icon: Shield, title: "Sangat Aman", desc: "Autentikasi berlapis dan validasi data yang ketat menjaga privasi Anda." },
              { icon: Layout, title: "UI Intuitif", desc: "Desain neobrutalist yang memudahkan navigasi tanpa mengabaikan estetika." }
            ].map((f, i) => (
              <div key={i} className="p-8 border-4 border-neon-blue shadow-[8px_8px_0px_0px_#bc13fe]">
                <f.icon className="w-12 h-12 text-neon-green mb-6" />
                <h3 className="text-2xl font-display font-bold mb-4">{f.title}</h3>
                <p className="text-gray-400 font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-12 border-t-8 border-black text-center">
        <p className="font-display font-bold text-xl mb-4">SAKTI © 2024</p>
        <p className="font-mono text-sm text-gray-500">DIBUAT DENGAN SEMANGAT GEOMETRIK BOLD</p>
      </footer>
    </div>
  );
}
