import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Download, ChevronLeft, ChevronRight, CheckCircle2,
  Clock, FileText, Bell, Loader2, MessageSquare, Star, Menu
} from "lucide-react";
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
interface DailyUpdate {
  id: number;
  date: string;
  content: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  date: string;
  completed: boolean;
}

interface MentorRemark {
  id: number;
  remark: string;
  rating: number;
  created_at: string;
  mentor: number;        // mentor id from serializer
  mentor_name?: string;  // if your serializer includes it
}

interface WeekData {
  week_start: string;
  week_end: string;
  updates: DailyUpdate[];
  tasks: Task[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Returns Monday of the week that is `offsetWeeks` weeks ago (0 = current week)
function getMondayISO(offsetWeeks = 0): string {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun,1=Mon,...
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday - offsetWeeks * 7);
  return monday.toISOString().split("T")[0];
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  return `${s.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${e.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });
}

function weekLabel(offsetWeeks: number): string {
  if (offsetWeeks === 0) return "This Week";
  if (offsetWeeks === 1) return "Last Week";
  return `${offsetWeeks} Weeks Ago`;
}

// ─── Download report as .txt ──────────────────────────────────────────────────
function downloadReport(
  week: WeekData,
  remarks: MentorRemark[],
  offsetWeeks: number
) {
  const lines = [
    `WEEKLY INTERNSHIP REPORT`,
    `Week: ${weekLabel(offsetWeeks)} (${formatDateRange(week.week_start, week.week_end)})`,
    "",
    "═══════════════════════════════",
    "DAILY UPDATES",
    "═══════════════════════════════",
    ...(week.updates.length
      ? week.updates.map((u) => `${formatDate(u.date)}:\n${u.content}`)
      : ["No updates this week."]),
    "",
    "═══════════════════════════════",
    "TASKS",
    "═══════════════════════════════",
    ...(week.tasks.length
      ? week.tasks.map((t) => `[${t.completed ? "✓" : " "}] ${t.title}`)
      : ["No tasks this week."]),
    "",
    "═══════════════════════════════",
    "MENTOR REMARKS",
    "═══════════════════════════════",
    ...(remarks.length
      ? remarks.map((r) => `Rating: ${r.rating}/5\n${r.remark}`)
      : ["No remarks yet."]),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `weekly_report_${week.week_start}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Notification Bell ────────────────────────────────────────────────────────
function NotificationPanel() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
      >
        <Bell size={20} className="text-gray-600" />
      </button>
      {open && (
        <div className="absolute right-0 top-12 w-72 bg-white border border-gray-100 shadow-xl rounded-2xl z-50 p-4">
          <p className="text-sm font-semibold text-gray-800 mb-2">Notifications</p>
          <p className="text-sm text-gray-400 text-center py-4">No notifications</p>
        </div>
      )}
    </div>
  );
}

// ─── Student Layout ───────────────────────────────────────────────────────────
function StudentLayout({
  children,
  activePage,
  studentName,
}: {
  children: React.ReactNode;
  activePage: string;
  studentName: string;
}) {
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
        <div className="flex items-center gap-2">
          <NotificationPanel />
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {studentName.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden md:block w-56 min-h-[calc(100vh-56px)] bg-white border-r border-gray-100 p-4 sticky top-14">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold px-2 mb-3">
            Quick Menu
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.label === activePage;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                  {isActive && <ChevronRight size={14} />}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all mt-4"
            >
              Logout
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>

      {/* Mobile sheet for sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left">
          <div className="w-64 h-full bg-white text-gray-900 flex flex-col">
            <div className="px-6 py-5 flex items-center gap-3 border-b border-gray-100">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">PW</span>
              </div>
              <span className="font-bold text-gray-900 text-sm">Pro-World Technology</span>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 pb-2 pt-1">Quick Menu</p>
              {navItems.map((item) => {
                const isActive = item.label === activePage;
                return (
                  <button
                    key={item.label}
                    onClick={() => { navigate(item.href); setMobileOpen(false); }}
                    className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {item.label}
                    {isActive && <ChevronRight size={14} />}
                  </button>
                );
              })}
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="flex items-center w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all mt-4">Logout</button>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ─── Star Rating Display ──────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={13}
          className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1 font-medium">{rating}/5</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function WeeklyReportPage() {
  const navigate = useNavigate();

  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, 1 = last week, etc.
  const [weekData, setWeekData] = useState<WeekData | null>(null);
  const [remarks, setRemarks] = useState<MentorRemark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [studentName, setStudentName] = useState("Student");

  // ── Fetch profile once ─────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    fetch(`${BASE}/student/profile/`, { headers: authHeaders() })
      .then(async (res) => {
        if (res.status === 401) { navigate("/login"); return; }
        const data = await res.json();
        setStudentName(data.name || "Student");
      })
      .catch(() => {});
  }, []);

  // ── Fetch weekly data when week changes ────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setError("");
    const weekStart = getMondayISO(weekOffset);

    Promise.all([
      fetch(`${BASE}/student/weekly-report/?week_start=${weekStart}`, {
        headers: authHeaders(),
      }),
      fetch(`${BASE}/student/feedback/`, { headers: authHeaders() }),
    ])
      .then(async ([weekRes, remarksRes]) => {
        if (weekRes.status === 401) { navigate("/login"); return; }

        if (weekRes.ok) {
          const data: WeekData = await weekRes.json();
          setWeekData(data);
        } else {
          setError("Failed to load weekly report.");
        }

        if (remarksRes.ok) {
          const allRemarks: MentorRemark[] = await remarksRes.json();
          // Filter remarks to those created within this week's range
          const weekStartDate = new Date(weekStart + "T00:00:00");
          const weekEndDate = new Date(weekStart + "T00:00:00");
          weekEndDate.setDate(weekEndDate.getDate() + 6);
          weekEndDate.setHours(23, 59, 59);

          const weekRemarks = allRemarks.filter((r) => {
            const createdAt = new Date(r.created_at);
            return createdAt >= weekStartDate && createdAt <= weekEndDate;
          });
          setRemarks(weekRemarks);
        }

        setLoading(false);
      })
      .catch(() => {
        setError("Network error. Please try again.");
        setLoading(false);
      });
  }, [weekOffset]);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const completedTasks = weekData?.tasks.filter((t) => t.completed).length ?? 0;
  const totalTasks = weekData?.tasks.length ?? 0;
  const currentWeekStart = getMondayISO(weekOffset);
  const currentWeekEnd = (() => {
    const d = new Date(currentWeekStart + "T00:00:00");
    d.setDate(d.getDate() + 6);
    return d.toISOString().split("T")[0];
  })();

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <StudentLayout activePage="Weekly Report" studentName={studentName}>
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <Loader2 size={28} className="text-blue-500 animate-spin" />
          <p className="text-sm text-gray-400">Loading weekly report...</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout activePage="Weekly Report" studentName={studentName}>
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Weekly Report</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Auto-generated from your daily updates & tasks
            </p>
          </div>
          {weekData && (
            <button
              onClick={() => downloadReport(weekData, remarks, weekOffset)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
            >
              <Download size={15} />
              Download
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Week navigator */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            className="p-2 rounded-xl hover:bg-gray-50 transition-colors"
            title="Previous week"
          >
            <ChevronLeft size={18} className="text-gray-500" />
          </button>
          <div className="text-center">
            <p className="font-bold text-gray-900">{weekLabel(weekOffset)}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {formatDateRange(currentWeekStart, currentWeekEnd)}
            </p>
          </div>
          <button
            disabled={weekOffset <= 0}
            onClick={() => setWeekOffset(weekOffset - 1)}
            className="p-2 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-colors"
            title="Next week"
          >
            <ChevronRight size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Updates",
              value: weekData?.updates.length ?? 0,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Tasks Done",
              value: `${completedTasks}/${totalTasks}`,
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              label: "Remarks",
              value: remarks.length > 0 ? remarks.length : "–",
              color: "text-orange-500",
              bg: "bg-orange-50",
            },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Daily Updates section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
            <FileText size={15} className="text-blue-600" />
            <p className="text-sm font-semibold text-gray-800">Daily Updates</p>
            <span className="ml-auto text-xs text-gray-400">
              {weekData?.updates.length ?? 0} entries
            </span>
          </div>

          {!weekData?.updates.length ? (
            <div className="px-5 py-8 text-center text-gray-400">
              <p className="text-sm">No updates submitted this week</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {weekData.updates.map((u) => (
                <div key={u.id} className="px-5 py-3.5 flex gap-4">
                  <span className="text-xs font-semibold text-blue-500 bg-blue-50 px-2.5 py-1 rounded-lg h-fit shrink-0 mt-0.5 whitespace-nowrap">
                    {formatDate(u.date)}
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed">{u.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tasks section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
            <Clock size={15} className="text-blue-600" />
            <p className="text-sm font-semibold text-gray-800">Tasks This Week</p>
            {totalTasks > 0 && (
              <span className="ml-auto text-xs bg-blue-50 text-blue-600 font-semibold px-2.5 py-1 rounded-full">
                {completedTasks}/{totalTasks} done
              </span>
            )}
          </div>

          {!weekData?.tasks.length ? (
            <div className="px-5 py-8 text-center text-gray-400">
              <p className="text-sm">No tasks assigned this week</p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {weekData.tasks.map((t) => (
                <div key={t.id} className="flex items-start gap-3">
                  {t.completed ? (
                    <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                  ) : (
                    <Clock size={16} className="text-orange-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-sm ${
                        t.completed ? "text-gray-400 line-through" : "text-gray-700"
                      }`}
                    >
                      {t.title}
                    </span>
                    {t.description && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{t.description}</p>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                      t.completed ? "bg-blue-50 text-blue-500" : "bg-orange-50 text-orange-500"
                    }`}
                  >
                    {t.completed ? "Done" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mentor Remarks section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
            <MessageSquare size={15} className="text-blue-600" />
            <p className="text-sm font-semibold text-gray-800">Mentor Remarks</p>
            {remarks.length > 0 && (
              <span className="ml-auto text-xs bg-orange-50 text-orange-500 font-semibold px-2.5 py-1 rounded-full">
                {remarks.length} remark{remarks.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {remarks.length === 0 ? (
            <div className="px-5 py-8 text-center text-gray-400">
              <MessageSquare size={28} className="mx-auto mb-2 opacity-20" />
              <p className="text-sm">No mentor remarks this week</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {remarks.map((r) => (
                <div key={r.id} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <StarRating rating={r.rating} />
                    <span className="text-xs text-gray-400">
                      {new Date(r.created_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{r.remark}</p>
                  {r.mentor_name && (
                    <p className="text-xs text-gray-400 mt-1.5 font-medium">
                      — {r.mentor_name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Average rating for the week (if remarks exist) */}
        {remarks.length > 0 && (
          <div className="bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-2xl p-5">
            <p className="text-xs font-semibold opacity-70 uppercase tracking-wide mb-1">
              Weekly Performance Score
            </p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold">
                {(remarks.reduce((sum, r) => sum + r.rating, 0) / remarks.length).toFixed(1)}
              </span>
              <span className="text-sm opacity-70 mb-1">/ 5.0 avg rating</span>
            </div>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const avg = remarks.reduce((sum, r) => sum + r.rating, 0) / remarks.length;
                return (
                  <Star
                    key={star}
                    size={16}
                    className={
                      star <= Math.round(avg)
                        ? "text-yellow-300 fill-yellow-300"
                        : "text-white/30 fill-white/30"
                    }
                  />
                );
              })}
            </div>
          </div>
        )}

      </div>
    </StudentLayout>
  );
}