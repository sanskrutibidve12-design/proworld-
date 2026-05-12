import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CheckCircle2, Clock, XCircle, Filter,
  Bell, ChevronRight, Loader2, RefreshCw, Menu
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
interface Task {
  id: number;
  title: string;
  description: string;
  date: string;
  completed: boolean;
}

type FilterType = "all" | "completed" | "pending";

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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TaskHistoryPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [studentName, setStudentName] = useState("Student");

  // ── Fetch all tasks on mount ───────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    async function fetchData() {
      try {
        // Fetch tasks + profile in parallel
        const [tasksRes, profileRes] = await Promise.all([
          fetch(`${BASE}/student/tasks/?all=true`, { headers: authHeaders() }),
          fetch(`${BASE}/student/profile/`, { headers: authHeaders() }),
        ]);

        if (tasksRes.status === 401 || profileRes.status === 401) {
          navigate("/login");
          return;
        }

        if (tasksRes.ok) {
          const data: Task[] = await tasksRes.json();
          setTasks(data);
        } else {
          setError("Failed to load tasks.");
        }

        if (profileRes.ok) {
          const profile = await profileRes.json();
          setStudentName(profile.name || "Student");
        }
      } catch {
        setError("Network error. Please try again.");
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  // ── Toggle task completion ─────────────────────────────────────────────────
  const handleToggle = async (taskId: number) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
    try {
      await fetch(`${BASE}/student/tasks/${taskId}/complete/`, {
        method: "PATCH",
        headers: authHeaders(),
      });
    } catch {
      // Revert on failure
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
      );
    }
  };

  // ── Filter + group by date ─────────────────────────────────────────────────
  const filtered = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  const grouped = filtered.reduce<Record<string, Task[]>>((acc, t) => {
    (acc[t.date] = acc[t.date] || []).push(t);
    return acc;
  }, {});

  const totalDone = tasks.filter((t) => t.completed).length;
  const totalPending = tasks.filter((t) => !t.completed).length;

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <StudentLayout activePage="Task History" studentName="Student">
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <Loader2 size={28} className="text-blue-500 animate-spin" />
          <p className="text-sm text-gray-400">Loading your tasks...</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout activePage="Task History" studentName={studentName}>
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Task History</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              All tasks assigned to your domain
            </p>
          </div>
          <button
            onClick={() => {
              setLoading(true);
              setError("");
              fetch(`${BASE}/student/tasks/?all=true`, { headers: authHeaders() })
                .then((r) => r.json())
                .then((data) => { setTasks(data); setLoading(false); })
                .catch(() => { setError("Refresh failed."); setLoading(false); });
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 bg-white border border-gray-100 rounded-xl px-3 py-2 transition-colors shadow-sm"
          >
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Tasks",  value: tasks.length,  color: "text-gray-900",   bg: "bg-white"      },
            { label: "Completed",    value: totalDone,     color: "text-blue-600",   bg: "bg-blue-50"    },
            { label: "Pending",      value: totalPending,  color: "text-orange-500", bg: "bg-orange-50"  },
          ].map((s) => (
            <div
              key={s.label}
              className={`${s.bg} rounded-2xl border border-gray-100 p-4 text-center shadow-sm`}
            >
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-gray-400 shrink-0" />
          {(["all", "completed", "pending"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filter === f
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white border border-gray-100 text-gray-500 hover:border-blue-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && !loading && (
          <div className="text-center py-16 text-gray-400">
            <XCircle size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No tasks found</p>
            <p className="text-xs mt-1 opacity-70">
              {filter !== "all" ? `Try switching to "all" filter` : "Your mentor hasn't assigned tasks yet"}
            </p>
          </div>
        )}

        {/* Grouped task list */}
        {Object.entries(grouped)
          .sort(([a], [b]) => (a > b ? -1 : 1))
          .map(([date, dateTasks]) => (
            <div key={date}>
              {/* Date label */}
              <div className="flex items-center gap-3 mb-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {new Date(date + "T00:00:00").toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[10px] text-gray-400 font-medium">
                  {dateTasks.filter((t) => t.completed).length}/{dateTasks.length} done
                </span>
              </div>

              {/* Tasks for this date */}
              <div className="space-y-2">
                {dateTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-3 hover:border-blue-100 transition-colors"
                  >
                    {/* Toggle button */}
                    <button
                      onClick={() => handleToggle(task.id)}
                      className="mt-0.5 shrink-0 hover:scale-110 transition-transform"
                      title={task.completed ? "Mark as pending" : "Mark as done"}
                    >
                      {task.completed ? (
                        <CheckCircle2 size={20} className="text-blue-500" />
                      ) : (
                        <Clock size={20} className="text-orange-400" />
                      )}
                    </button>

                    {/* Task details */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold leading-snug ${
                          task.completed ? "text-gray-400 line-through" : "text-gray-800"
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                          {task.description}
                        </p>
                      )}
                    </div>

                    {/* Status badge */}
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                        task.completed
                          ? "bg-blue-50 text-blue-500"
                          : "bg-orange-50 text-orange-500"
                      }`}
                    >
                      {task.completed ? "Done" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </StudentLayout>
  );
}