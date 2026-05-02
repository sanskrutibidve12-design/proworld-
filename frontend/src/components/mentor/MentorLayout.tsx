// src/components/mentor/mentorlayout.tsx
import Sidebar from "./Sidebar";

export default function MentorLayout({ children }: any) {
  return (
    <div className="flex bg-[#f4f6fb] min-h-screen">
      <Sidebar />

      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        {/* Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}