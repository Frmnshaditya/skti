/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { MahasiswaData } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  Search, 
  Trash2, 
  Edit3, 
  Eye, 
  UserPlus,
  Filter,
  TrendingUp,
  Award,
  X,
  Save,
  User,
  Hash,
  MapPin,
  Phone,
  BookOpen
} from "lucide-react";
import { Link } from "react-router-dom";
import { handleFirestoreError, OperationType } from "../lib/firestoreUtils";

export default function DosenDashboard() {
  const [students, setStudents] = useState<MahasiswaData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<MahasiswaData>>({
    namaLengkap: "",
    nim: "",
    alamat: "",
    nomorTelepon: "",
    kelas: ""
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "mahasiswas"));
      const studentData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MahasiswaData));
      setStudents(studentData);
    } catch (err: any) {
      console.error("Error fetching students:", err);
      handleFirestoreError(err, OperationType.LIST, "mahasiswas");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddData = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const docId = `mhs_${Date.now()}`;
      const payload = {
        ...formData,
        userId: `manual_${Date.now()}`, // Placeholder for manually added students
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(doc(db, "mahasiswas", docId), payload);
      setIsModalOpen(false);
      setFormData({
        namaLengkap: "",
        nim: "",
        alamat: "",
        nomorTelepon: "",
        kelas: ""
      });
      fetchStudents();
    } catch (err: any) {
      console.error("Error adding student:", err);
      try {
        handleFirestoreError(err, OperationType.CREATE, "mahasiswas");
      } catch (errorWithInfo: any) {
        const info = JSON.parse(errorWithInfo.message);
        setError(`Gagal: ${info.error}`);
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Yakin ingin menghapus data mahasiswa ini?")) {
      try {
        await deleteDoc(doc(db, "mahasiswas", id));
        fetchStudents();
      } catch (err: any) {
        console.error("Error deleting student:", err);
        handleFirestoreError(err, OperationType.DELETE, `mahasiswas/${id}`);
      }
    }
  };

  const filteredStudents = students.filter(s => 
    (s.namaLengkap?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (s.nim?.includes(searchTerm) || false)
  );

  return (
    <div className="space-y-12">
      {/* Existing Header */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-6xl font-display font-bold tracking-tighter mb-4">DOSEN PANEL</h1>
          <p className="text-xl font-medium text-gray-500">Manajemen data mahasiswa dan monitoring performa akademik.</p>
        </div>
        <div className="flex space-x-4">
           <div className="brutalist-card p-4 bg-neon-green flex items-center space-x-3">
             <TrendingUp size={24} />
             <div>
               <p className="text-xs font-bold leading-none">TOTAL MHS</p>
               <p className="text-2xl font-display font-bold">{students.length}</p>
             </div>
           </div>
           <div className="brutalist-card p-4 bg-neon-purple text-white flex items-center space-x-3">
             <Award size={24} />
             <div>
               <p className="text-xs font-bold leading-none">RATA-RATA IPK</p>
               <p className="text-2xl font-display font-bold">3.42</p>
             </div>
           </div>
        </div>
      </header>

      {/* Search & Actions */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} />
          <input 
            type="text"
            placeholder="Cari berdasarkan Nama atau NIM..."
            className="w-full brutalist-input pl-12 h-16 text-lg font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <button className="brutalist-button bg-white hover:bg-gray-50 flex items-center gap-2">
            <Filter size={20} /> FILTER
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="brutalist-button bg-black text-white hover:bg-neon-blue flex items-center gap-2"
          >
            <UserPlus size={20} /> TAMBAH DATA
          </button>
        </div>
      </div>

      {/* Modal Add Student */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl brutalist-card bg-white p-8 md:p-12 overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute right-6 top-6 p-2 border-2 border-black hover:bg-neon-red transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-4xl font-display font-bold mb-8 uppercase">Tambah Mahasiswa</h2>

              <form onSubmit={handleAddData} className="space-y-6">
                 {error && (
                   <div className="p-4 bg-red-100 border-2 border-red-500 font-bold text-red-600">
                     {error}
                   </div>
                 )}
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-bold text-sm flex items-center gap-2">
                        <User size={16} /> NAMA LENGKAP
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full brutalist-input"
                        value={formData.namaLengkap}
                        onChange={(e) => setFormData({...formData, namaLengkap: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-sm flex items-center gap-2">
                        <Hash size={16} /> NIM
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full brutalist-input"
                        value={formData.nim}
                        onChange={(e) => setFormData({...formData, nim: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-sm flex items-center gap-2">
                        <BookOpen size={16} /> KELAS
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full brutalist-input"
                        value={formData.kelas}
                        onChange={(e) => setFormData({...formData, kelas: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-sm flex items-center gap-2">
                        <Phone size={16} /> TELEPON
                      </label>
                      <input
                        type="tel"
                        className="w-full brutalist-input"
                        value={formData.nomorTelepon}
                        onChange={(e) => setFormData({...formData, nomorTelepon: e.target.value})}
                      />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="font-bold text-sm flex items-center gap-2">
                      <MapPin size={16} /> ALAMAT
                    </label>
                    <textarea
                      rows={3}
                      className="w-full brutalist-input"
                      value={formData.alamat}
                      onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                    />
                 </div>

                 <div className="pt-6 flex justify-end">
                    <button 
                      type="submit"
                      disabled={saving}
                      className="brutalist-button bg-black text-white hover:bg-neon-blue flex items-center gap-2 px-12"
                    >
                      <Save size={20} /> {saving ? "MENYIMPAN..." : "SIMPAN"}
                    </button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Table Section */}
      <div className="brutalist-card bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black text-white border-b-4 border-black font-display font-bold text-sm uppercase tracking-widest">
              <tr>
                <th className="p-6">MAHASISWA</th>
                <th className="p-6">NIM</th>
                <th className="p-6">KELAS</th>
                <th className="p-6">TELEPON</th>
                <th className="p-6 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-black">
              <AnimatePresence>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="p-8">
                        <div className="h-4 bg-gray-200 w-full mb-2"></div>
                        <div className="h-4 bg-gray-100 w-1/2"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <motion.tr 
                      key={student.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 border-2 border-black bg-neon-yellow flex items-center justify-center font-bold">
                            {student.namaLengkap.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold">{student.namaLengkap}</p>
                            <p className="text-xs font-mono text-gray-500">{student.alamat}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 font-mono font-bold">{student.nim}</td>
                      <td className="p-6">
                        <span className="brutalist-badge bg-neon-blue">{student.kelas || "N/A"}</span>
                      </td>
                      <td className="p-6 text-sm font-medium">{student.nomorTelepon || "-"}</td>
                      <td className="p-6">
                        <div className="flex justify-end space-x-2">
                          <button className="p-2 border-2 border-black hover:bg-neon-yellow transition-colors" title="Lihat">
                            <Eye size={18} />
                          </button>
                          <button className="p-2 border-2 border-black hover:bg-neon-blue transition-colors" title="Edit">
                            <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(student.id!)}
                            className="p-2 border-2 border-black hover:bg-red-500 hover:text-white transition-colors" 
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-20 text-center">
                      <div className="flex flex-col items-center justify-center opacity-50">
                        <Users size={64} className="mb-4" />
                        <p className="font-display font-bold text-2xl">DATA TIDAK DITEMUKAN</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
