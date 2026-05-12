// src/components/admin/adminlayout.tsx
import Sidebar from "./Sidebar";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/proworld-logo.png";

export default function AdminLayout({ children }: any) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Applications", path: "/admin/applications" },
    { label: "Students", path: "/admin/students" },
    { label: "Mentors", path: "/admin/mentor" },
    { label: "Colleges", path: "/admin/colleges" },
    { label: "Courses", path: "/admin/courses" },
    { label: "Domains", path: "/admin/domains" },
    { label: "Tasks", path: "/admin/tasks" },
    { label: "Updates", path: "/admin/updates" },
    { label: "Attendance", path: "/admin/attendance" },
  ];

  return (
    <div className="flex bg-[#f4f6fb] min-h-screen">
      <Sidebar />

      {/* Mobile sheet for sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left">
          <div className="w-64 h-full bg-[#0a0f1e] text-white flex flex-col">
            <div className="px-6 py-5 flex items-center gap-3 border-b border-white/5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <img src={logo} className="w-6 h-6 cursor-pointer object-contain" onClick={() => { navigate('/'); setMobileOpen(false); }} alt="logo" />
              </div>
              <div>
                <p className="font-bold text-sm tracking-wide text-white">Proworld</p>
                <p className="text-[10px] text-blue-400/80 tracking-widest uppercase">Admin Panel</p>
              </div>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-3 pb-2 pt-1">Main Menu</p>
              {navItems.map(({ label, path }) => {
                const active = location.pathname === path;
                return (
                  <button
                    key={path}
                    onClick={() => {
                      navigate(path);
                      setMobileOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      active
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="flex-1 text-left">{label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-3 border-t border-white/5">
              <button onClick={() => { localStorage.clear(); navigate('/login'); setMobileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200">
                Logout
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="md:ml-64 flex-1 flex flex-col min-h-screen">
        {/* Mobile hamburger */}
        <div className="p-4 md:hidden">
          <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="p-2 rounded-md bg-white/90 shadow">
            <Menu />
          </button>
        </div>

        {/* Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}