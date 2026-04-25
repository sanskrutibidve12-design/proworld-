import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/proworld-logo.png";
import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  LogOut,
  ChevronRight,
  ClipboardList,
  Star,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const mentorType = localStorage.getItem("mentor_type");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // 🔥 BASE PATH (MOST IMPORTANT FIX)
  const basePath =
    mentorType === "industry" ? "/mentor/industry" : "/mentor/college";

  // ✅ NAV ITEMS (CLEAN + DYNAMIC)
  const navItems =
    mentorType === "industry"
      ? [
          { label: "Dashboard", path: `${basePath}/dashboard`, icon: LayoutDashboard },
          { label: "Students", path: `${basePath}/students`, icon: GraduationCap },
          { label: "Attendance", path: `${basePath}/attendance`, icon: FileText },
          { label: "Updates", path: `${basePath}/updates`, icon: FileText },
          { label: "Tasks", path: `${basePath}/tasks`, icon: ClipboardList },
          { label: "Remarks", path: `${basePath}/remarks`, icon: Star },
        ]
      : [
          { label: "Dashboard", path: `${basePath}/dashboard`, icon: LayoutDashboard },
          { label: "Students", path: `${basePath}/students`, icon: GraduationCap },
          { label: "Attendance", path: `${basePath}/attendance`, icon: FileText },
          { label: "Updates", path: `${basePath}/updates`, icon: FileText },
        ];

  return (
    <div className="w-64 h-screen bg-[#0a0f1e] text-white fixed flex flex-col border-r border-white/5 shadow-2xl">
      
      {/* Logo */}
      <div className="px-6 py-5 flex items-center gap-3 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
          <img
            src={logo}
            className="w-6 h-6 cursor-pointer object-contain"
            onClick={() => navigate("/")}
            alt="logo"
          />
        </div>
        <div>
          <p className="font-bold text-sm tracking-wide text-white">Proworld</p>
          <p className="text-[10px] text-blue-400/80 tracking-widest uppercase">
            {mentorType === "industry" ? "Industry Mentor" : "College Mentor"}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-3 pb-2 pt-1">
          Main Menu
        </p>

        {navItems.map(({ label, path, icon: Icon }) => {
          const active = location.pathname === path;

          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                active
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon
                size={17}
                className={
                  active
                    ? "text-white"
                    : "text-white/40 group-hover:text-white/70"
                }
              />
              <span className="flex-1 text-left">{label}</span>
              {active && <ChevronRight size={13} className="text-blue-200" />}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}