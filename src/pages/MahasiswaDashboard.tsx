/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { doc, getDocs, collection, query, where, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../lib/AuthContext";
import { MahasiswaData } from "../types";
import { motion } from "motion/react";
import { User, MapPin, Phone, Hash, BookOpen, Save, CheckCircle } from "lucide-react";

export default function MahasiswaDashboard() {
  const { user, profile } = useAuth();
  const [data, setData] = useState<MahasiswaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, "mahasiswas"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          setData({ id: docSnap.id, ...docSnap.data() } as MahasiswaData);
        } else {
          // Initialize empty data
          setData({
            userId: user.uid,
            namaLengkap: profile?.name || "",
            nim: "",
            alamat: "",
            nomorTelepon: "",
            kelas: "",
            createdAt: "",
            updatedAt: ""
          });
        }
      } catch (err) {
        console.error("Error fetching mahasiswa data:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, [user, profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !data) return;
    setSaving(true);
    setSuccess(false);

    try {
      const docId = data.id || `mhs_${user.uid}`;
      const payload = {
        ...data,
        updatedAt: serverTimestamp(),
        createdAt: data.createdAt || serverTimestamp(),
      };
      // Remove id from payload if it exists
      const { id, ...saveableData } = payload;
      
      await setDoc(doc(db, "mahasiswas", docId), saveableData, { merge: true });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving data:", err);
    }
    setSaving(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-6xl font-display font-bold tracking-tighter mb-4">HALO, {profile?.name?.split(" ")[0]}!</h1>
        <p className="text-xl font-medium text-gray-500">Lengkapi data akademik Anda untuk mempermudah administrasi.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="brutalist-card p-8 bg-neon-yellow flex flex-col items-center justify-center space-y-6">
          <div className="w-32 h-32 rounded-full border-4 border-black bg-white flex items-center justify-center text-5xl font-bold shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            {profile?.name?.charAt(0)}
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-display font-bold">{profile?.name}</h2>
            <p className="font-mono font-bold text-sm bg-black text-white px-2 py-1 inline-block mt-2">
              MAHASISWA
            </p>
          </div>
          <div className="w-full pt-6 border-t-2 border-black space-y-3 font-medium">
             <div className="flex justify-between items-center">
               <span>Email:</span>
               <span className="font-bold">{profile?.email}</span>
             </div>
             <div className="flex justify-between items-center">
               <span>Status:</span>
               <span className="brutalist-badge bg-neon-green">Aktif</span>
             </div>
          </div>
        </div>

        {/* Stats */}
        <div className="md:col-span-2 grid grid-cols-2 gap-8">
           <div className="brutalist-card p-8 bg-white flex flex-col justify-between">
              <BookOpen size={40} className="mb-4" />
              <div>
                <p className="text-4xl font-display font-bold">24</p>
                <p className="font-bold text-gray-500">SKS DIAMBIL</p>
              </div>
           </div>
           <div className="brutalist-card p-8 bg-neon-blue flex flex-col justify-between">
              <Save size={40} className="mb-4" />
              <div>
                <p className="text-4xl font-display font-bold">3.85</p>
                <p className="font-bold">IPK TERAKHIR</p>
              </div>
           </div>
        </div>
      </div>

      <section>
        <div className="flex items-center space-x-4 mb-8">
          <h2 className="text-4xl font-display font-bold">DATA DIRI</h2>
          <div className="flex-1 h-2 bg-black"></div>
        </div>

        <form onSubmit={handleSave} className="brutalist-card p-10 bg-white">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="font-bold text-sm flex items-center gap-2">
                  <User size={16} /> NAMA LENGKAP
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap"
                  className="w-full brutalist-input"
                  value={data?.namaLengkap || ""}
                  onChange={(e) => setData({ ...data!, namaLengkap: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="font-bold text-sm flex items-center gap-2">
                  <Hash size={16} /> NOMOR INDUK MAHASISWA (NIM)
                </label>
                <input
                  type="text"
                  required
                  placeholder="123456789"
                  className="w-full brutalist-input"
                  value={data?.nim || ""}
                  onChange={(e) => setData({ ...data!, nim: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="font-bold text-sm flex items-center gap-2">
                   <BookOpen size={16} /> KELAS
                </label>
                <input
                  type="text"
                  placeholder="IF-22-A"
                  className="w-full brutalist-input"
                  value={data?.kelas || ""}
                  onChange={(e) => setData({ ...data!, kelas: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="font-bold text-sm flex items-center gap-2">
                  <MapPin size={16} /> ALAMAT
                </label>
                <textarea
                  rows={4}
                  placeholder="Jl. Geometris No. 101"
                  className="w-full brutalist-input"
                  value={data?.alamat || ""}
                  onChange={(e) => setData({ ...data!, alamat: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="font-bold text-sm flex items-center gap-2">
                   <Phone size={16} /> NOMOR TELEPON
                </label>
                <input
                  type="tel"
                  placeholder="08123456789"
                  className="w-full brutalist-input"
                  value={data?.nomorTelepon || ""}
                  onChange={(e) => setData({ ...data!, nomorTelepon: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t-4 border-black">
            {success && (
              <div className="flex items-center space-x-2 text-neon-green font-bold">
                 <CheckCircle />
                 <span>Data berhasil disimpan secara brutal!</span>
              </div>
            )}
            {!success && <div></div>}
            <button
              type="submit"
              disabled={saving}
              className="brutalist-button bg-black text-white hover:bg-neon-purple flex items-center space-x-2"
            >
              <Save size={20} />
              <span>{saving ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
