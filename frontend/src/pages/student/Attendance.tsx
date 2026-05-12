import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronRight, Menu } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const BASE = "https://proworld-tech.onrender.com/api";

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface AttendanceRecord {
  id: number;
  date: string;
  present: boolean;
}

interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  percentage: number;
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────
function DonutChart({ present, total }: { present: number; total: number }) {
  const pct = total === 0 ? 0 : (present / total) * 100;
  const radius = 70;
  const circ = 2 * Math.PI * radius;
  const dash = (pct / 100) * circ;
  const color = pct >= 75 ? "#2563eb" : pct >= 50 ? "#f59e0b" : "#ef4444";
  const label = pct >= 75 ? "Great!" : pct >= 50 ? "Needs Improvement" : "Critical";

  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="16" />
        <circle
          cx="90" cy="90" r={radius}
          fill="none" stroke={color} strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ / 4}
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
        <text x="90" y="85" textAnchor="middle" fontSize="26" fontWeight="700" fill="#111827">
          {Math.round(pct)}%
        </text>
        <text x="90" y="106" textAnchor="middle" fontSize="11" fill="#6b7280">
          {present}/{total} days
        </text>
      </svg>
      <span
        className="text-xs font-semibold px-3 py-1 rounded-full mt-1"
        style={{ background: `${color}18`, color }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Calendar ─────────────────────────────────────────────────────────────────
function MonthCalendar({
  records,
  year,
  month,
}: {
  records: AttendanceRecord[];
  year: number;
  month: number; // 0-indexed
}) {
  const byDate = useMemo(() => {
    const map: Record<string, boolean> = {};
    records.forEach((r) => (map[r.date] = r.present));
    return map;
  }, [records]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  const today = new Date().toISOString().split("T")[0];

  const days = useMemo(() => {
    const result: ({ day: number; key: string; status: boolean | undefined } | null)[] = [];
    for (let i = 0; i < startDay; i++) result.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      result.push({ day: d, key, status: byDate[key] });
    }
    return result;
  }, [byDate, year, month, daysInMonth, startDay]);

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthName = new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-3">{monthName}</p>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-gray-400">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d, i) => {
          if (!d) return <div key={`empty-${i}`} />;
          const isToday = d.key === today;
          return (
            <div
              key={d.key}
              title={`${d.key}: ${d.status === undefined ? "No record" : d.status ? "Present" : "Absent"}`}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium border transition-all
                ${isToday ? "ring-2 ring-blue-500 ring-offset-1" : ""}
                ${d.status === true ? "bg-blue-100 text-blue-700 border-blue-100"
                  : d.status === false ? "bg-red-100 text-red-500 border-red-100"
                  : "bg-gray-50 text-gray-400 border-gray-100"
                }`}
            >
              {d.day}
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 mt-4 justify-center">
        {[
          { color: "bg-blue-100 border-blue-100", text: "Present" },
          { color: "bg-red-100 border-red-100", text: "Absent" },
          { color: "bg-gray-50 border-gray-100", text: "No Record" },
        ].map((l) => (
          <div key={l.text} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded border ${l.color}`} />
            <span className="text-xs text-gray-500">{l.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sidebar Layout ───────────────────────────────────────────────────────────
function StudentLayout({ children, activePage }: { children: React.ReactNode; activePage: string }) {
  const navigate = useNavigate();
  const navItems = [
    { label: "Home", href: "/student/StudentDashboard" },
    { label: "My Attendance", href: "/student/Attendance" },
    { label: "Manager Feedback", href: "/student/feedback" },
    { label: "Task History", href: "/student/taskhistory" },
    { label: "Weekly Report", href: "/student/WeeklyReport" },
    { label: "View Profile", href: "/student/profile" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initial = (user?.email || "S").charAt(0).toUpperCase();

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="h-14 bg-white border-b border-gray-100 flex items-center px-6 justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 rounded-md bg-white/90 mr-2">
            <Menu />
          </button>
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">PW</span>
          </div>
          <span className="font-bold text-gray-900 text-sm">Pro-World Technology</span>
        </div>
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {initial}
        </div>
      </header>
      <div className="flex">
        <aside className="hidden md:block w-56 min-h-[calc(100vh-56px)] bg-white border-r border-gray-100 p-4 sticky top-14">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold px-2 mb-3">Quick Menu</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.label === activePage;
              return (
                <Link key={item.label} to={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                  {isActive && <ChevronRight size={14} />}
                </Link>
              );
            })}
            <button onClick={handleLogout}
              className="flex items-center w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all mt-4">
              Logout
            </button>
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function AttendancePage() {
  const [stats, setStats] = useState<AttendanceStats>({ total: 0, present: 0, absent: 0, percentage: 0 });
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Calendar month navigation
  const now = new Date();
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [calYear, setCalYear] = useState(now.getFullYear());

  useEffect(() => {
    async function fetchAttendance() {
      try {
        const res = await fetch(`${BASE}/student/attendance/`, { headers: authHeaders() });
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setRecords(data.records);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    fetchAttendance();
  }, []);

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
    else setCalMonth(calMonth - 1);
  };

  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
    else setCalMonth(calMonth + 1);
  };

  if (loading) {
    return (
      <StudentLayout activePage="My Attendance">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout activePage="My Attendance">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
          <p className="text-sm text-gray-500 mt-0.5">Your attendance overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Donut */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center">
            <p className="text-sm font-semibold text-gray-700 mb-4">Overall Attendance</p>
            <DonutChart present={stats.present} total={stats.total} />
            <div className="mt-4 grid grid-cols-2 gap-3 w-full">
              <div className="text-center bg-blue-50 rounded-xl py-3">
                <p className="text-xl font-bold text-blue-600">{stats.present}</p>
                <p className="text-xs text-gray-500">Present</p>
              </div>
              <div className="text-center bg-red-50 rounded-xl py-3">
                <p className="text-xl font-bold text-red-400">{stats.absent}</p>
                <p className="text-xs text-gray-500">Absent</p>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-500">‹</button>
              <span className="text-sm font-semibold text-gray-700">
                {new Date(calYear, calMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
              <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-500">›</button>
            </div>
            <MonthCalendar records={records} year={calYear} month={calMonth} />
          </div>
        </div>

        {/* Log Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <p className="text-sm font-semibold text-gray-700">Attendance Log</p>
          </div>
          {records.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No attendance records found</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {[...records].sort((a, b) => b.date.localeCompare(a.date)).map((r) => (
                <div key={r.id} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-gray-700">
                    {new Date(r.date).toLocaleDateString("en-US", {
                      weekday: "short", month: "short", day: "numeric", year: "numeric",
                    })}
                  </span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    r.present ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-500"
                  }`}>
                    {r.present ? "Present" : "Absent"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}