/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { 
  LayoutDashboard, 
  UserCircle, 
  Users, 
  GraduationCap, 
  LogOut,
  ChevronRight,
  School
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { auth } from "../lib/firebase";

export const Sidebar: React.FC = () => {
  const { profile, isAdmin } = useAuth();
  const location = useLocation();

  const menuItems = [
    { 
      name: "Dashboard", 
      path: isAdmin ? "/dosen" : "/mahasiswa", 
      icon: LayoutDashboard,
      roles: ["mahasiswa", "dosen"]
    },
    { 
      name: "Profile", 
      path: "/profile", 
      icon: UserCircle,
      roles: ["mahasiswa", "dosen"]
    },
    { 
      name: "Management", 
      path: "/dosen/management", 
      icon: Users,
      roles: ["dosen"]
    }
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(profile?.role || ""));

  return (
    <div className="w-72 h-screen fixed left-0 top-0 bg-white border-r-4 border-black p-6 flex flex-col">
      <div className="mb-12 flex items-center space-x-3">
        <div className="w-12 h-12 bg-neon-blue border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <School size={28} />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl leading-none">SAKTI</h1>
          <p className="text-xs font-mono font-medium text-gray-500">ACADEMIC SYS</p>
        </div>
      </div>

      <nav className="flex-1 space-y-4">
        {filteredItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <motion.div
              whileHover={{ x: 4 }}
              className={`flex items-center justify-between p-4 border-3 border-black transition-all ${
                location.pathname === item.path 
                ? "bg-neon-yellow shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
                : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon size={20} />
                <span className="font-display font-bold">{item.name}</span>
              </div>
              <ChevronRight size={16} />
            </motion.div>
          </Link>
        ))}
      </nav>

      <div className="pt-6 border-t-4 border-black mt-auto">
        <div className="mb-6 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-neon-purple border-3 border-black flex items-center justify-center text-white font-bold">
            {profile?.name?.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold truncate text-sm">{profile?.name}</p>
            <p className="text-[10px] font-mono text-gray-500 uppercase">{profile?.role}</p>
          </div>
        </div>
        <button 
          onClick={() => auth.signOut()}
          className="w-full flex items-center justify-center space-x-2 p-3 bg-black text-white font-bold hover:bg-neon-purple transition-colors"
        >
          <LogOut size={18} />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
};
