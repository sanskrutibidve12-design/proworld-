// src/components/mentor/mentorlayout.tsx
import Sidebar from "./Sidebar";
import { Bell, Search } from "lucide-react";

export default function MentorLayout({ children }: any) {
  const email = localStorage.getItem("email") || "Admin";
  const initial = email.charAt(0).toUpperCase();

  return (
    <div className="flex bg-[#f4f6fb] min-h-screen">
      <Sidebar />

      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 w-72">
            <Search size={15} className="text-gray-400" />
            <input
              className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full"
              placeholder="Search anything..."
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-colors">
              <Bell size={16} className="text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                {initial}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-gray-700">{email}</p>
                <p className="text-[10px] text-gray-400">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}