import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CheckCircle2, Circle, Lock, TrendingUp,
  BookOpen, Calendar, Bell, ChevronRight, Flame
} from "lucide-react";

const BASE = "http://127.0.0.1:8000/api";

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface StudentProfile {
  name: string;
  email: string;
  roll_no: string;
  mobile_no: string;
  college: string;
  course: string;
  domain: string;
  internship_start?: string;
  internship_end?: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  date: string;
  completed: boolean;
}

interface Progress {
  total_tasks: number;
  completed_tasks: number;
  percentage: number;
  streak: number;
}

interface DailyUpdateRecord {
  id: number;
  date: string;
  content: string;
}

interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
}

// ─── Progress Tracker ─────────────────────────────────────────────────────────
function ProgressTracker({ progress }: { progress: Progress }) {
  const pct = progress.percentage || 0;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-blue-600" />
          <span className="font-semibold text-gray-800 text-sm">Internship Progress</span>
        </div>
        <div className="flex items-center gap-1 bg-orange-50 text-orange-500 text-xs font-semibold px-2 py-1 rounded-full">
          <Flame size={13} />
          {progress.streak} day streak
        </div>
      </div>
      <div className="flex items-end gap-2 mb-2">
        <span className="text-3xl font-bold text-gray-900">{pct}%</span>
        <span className="text-xs text-gray-400 mb-1">
          {progress.completed_tasks}/{progress.total_tasks} tasks done
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-400 h-2.5 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Internship Summary ───────────────────────────────────────────────────────
function InternshipSummary({ student }: { student: StudentProfile }) {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl p-5 text-white shadow-md">
      <div className="flex items-center gap-2 mb-4 opacity-80">
        <BookOpen size={16} />
        <span className="text-sm font-medium">Internship Summary</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Domain", value: student.domain },
          { label: "Course", value: student.course },
          { label: "College", value: student.college },
          {
            label: "Duration",
            value:
              student.internship_start && student.internship_end
                ? `${student.internship_start} → ${student.internship_end}`
                : "Not set",
          },
        ].map((item) => (
          <div key={item.label} className="bg-white/15 rounded-xl p-3">
            <p className="text-[10px] uppercase tracking-wider opacity-70 mb-0.5">
              {item.label}
            </p>
            <p className="text-sm font-semibold leading-tight">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Task List ────────────────────────────────────────────────────────────────
function TaskList({ tasks, onToggle }: { tasks: Task[]; onToggle: (id: number) => void }) {
  const done = tasks.filter((t) => t.completed).length;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lock size={15} className="text-gray-400" />
          <span className="font-semibold text-gray-800 text-sm">Today's Tasks</span>
        </div>
        <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-2.5 py-1 rounded-full">
          {done}/{tasks.length}
        </span>
      </div>
      {tasks.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">No tasks for today</p>
      ) : (
        <div className="space-y-2.5">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => onToggle(task.id)}
              className="flex items-start gap-3 w-full text-left group"
            >
              {task.completed ? (
                <CheckCircle2 size={18} className="text-blue-500 mt-0.5 shrink-0" />
              ) : (
                <Circle size={18} className="text-gray-300 mt-0.5 shrink-0 group-hover:text-blue-300 transition-colors" />
              )}
              <span
                className={`text-sm leading-snug ${
                  task.completed ? "line-through text-gray-400" : "text-gray-700"
                }`}
              >
                {task.title}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Daily Update ─────────────────────────────────────────────────────────────
function DailyUpdate({ existingUpdate }: { existingUpdate: DailyUpdateRecord | null }) {
  const [content, setContent] = useState(existingUpdate?.content || "");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const max = 2000;

  useEffect(() => {
    if (existingUpdate?.content) setContent(existingUpdate.content);
  }, [existingUpdate]);

  const handleSave = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/student/daily-updates/`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        setContent("");
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-blue-600" />
          <span className="font-semibold text-gray-800 text-sm">Today's Update</span>
        </div>
        <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long", month: "short", day: "numeric", year: "numeric",
          })}
        </span>
      </div>
      <textarea
        className="w-full h-44 resize-none rounded-xl border-2 border-blue-100 focus:border-blue-400 focus:outline-none p-3 text-sm text-gray-700 bg-gray-50 transition-colors"
        placeholder="What did you work on today? Share your progress, blockers, and learnings..."
        value={content}
        onChange={(e) => setContent(e.target.value.slice(0, max))}
      />
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-28 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-400 rounded-full transition-all"
              style={{ width: `${(content.length / max) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">{content.length}/{max}</span>
        </div>
        <button
          onClick={handleSave}
          disabled={!content.trim() || loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            saved
              ? "bg-green-500 text-white"
              : content.trim()
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : saved ? "✓ Saved!" : "Save Update"}
        </button>
      </div>
    </div>
  );
}

// ─── Notification Bell ────────────────────────────────────────────────────────
function NotificationPanel({ notifications }: { notifications: Notification[] }) {
  // ✅ FIX 1: Track seen IDs in localStorage so badge clears after viewing
  const [seenIds, setSeenIds] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem("seen_notif_ids");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [open, setOpen] = useState(false);

  // ✅ FIX 2: Count unread as notifications NOT yet seen
  const unread = notifications.filter((n) => !seenIds.includes(n.id)).length;

  const handleOpen = () => {
    const willOpen = !open;
    if (willOpen) {
      // ✅ Mark all as seen when bell is opened
      const allIds = notifications.map((n) => n.id);
      localStorage.setItem("seen_notif_ids", JSON.stringify(allIds));
      setSeenIds(allIds);
    }
    setOpen(willOpen);
  };

  // Close panel when clicking outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#notif-panel")) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" id="notif-panel">
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
      >
        <Bell size={20} className="text-gray-600" />
        {/* ✅ FIX 3: Number badge instead of plain dot */}
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold px-1">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white border border-gray-100 shadow-xl rounded-2xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="font-semibold text-gray-800 text-sm">Notifications</span>
            {notifications.length > 0 && (
              <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full">
                {notifications.length} total
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No notifications yet</p>
            ) : (
              notifications.map((n) => {
                const isNew = !seenIds.includes(n.id);
                return (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-gray-50 last:border-0 flex gap-3 items-start transition-colors ${
                      isNew ? "bg-blue-50/50" : "bg-white"
                    }`}
                  >
                    {/* Blue dot for new, gray for seen */}
                    <div
                      className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                        isNew ? "bg-blue-500" : "bg-gray-200"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 leading-snug">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sidebar Layout ───────────────────────────────────────────────────────────
function StudentLayout({
  children,
  activePage,
  studentName,
  notifications,
}: {
  children: React.ReactNode;
  activePage: string;
  studentName: string;
  notifications: Notification[];
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
    localStorage.removeItem("seen_notif_ids"); // ✅ clear seen on logout
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="h-14 bg-white border-b border-gray-100 flex items-center px-6 justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">PW</span>
          </div>
          <span className="font-bold text-gray-900 text-sm">Pro-World Technology</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationPanel notifications={notifications} />
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {studentName.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-56 min-h-[calc(100vh-56px)] bg-white border-r border-gray-100 p-4 sticky top-14">
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
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const navigate = useNavigate();

  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [progress, setProgress] = useState<Progress>({
    total_tasks: 0, completed_tasks: 0, percentage: 0, streak: 0,
  });
  const [todayUpdate, setTodayUpdate] = useState<DailyUpdateRecord | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Separated so polling can reuse it without re-fetching everything
  async function fetchNotifications() {
    try {
      const res = await fetch(`${BASE}/my_notifications/`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (e) {
      console.error("Notification fetch error:", e);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    async function fetchAll() {
      try {
        // ✅ FIX: All 5 fetches properly destructured (was only 4 before)
        const [profileRes, tasksRes, progressRes, updatesRes, notifRes] = await Promise.all([
          fetch(`${BASE}/student/profile/`, { headers: authHeaders() }),
          fetch(`${BASE}/student/tasks/`, { headers: authHeaders() }),
          fetch(`${BASE}/student/progress/`, { headers: authHeaders() }),
          fetch(`${BASE}/student/daily-updates/`, { headers: authHeaders() }),
          fetch(`${BASE}/my_notifications/`, { headers: authHeaders() }),  // ✅ was missing
        ]);

        if (profileRes.ok) setStudent(await profileRes.json());
        if (tasksRes.ok) setTasks(await tasksRes.json());
        if (progressRes.ok) setProgress(await progressRes.json());

        if (updatesRes.ok) {
          const updates: DailyUpdateRecord[] = await updatesRes.json();
          const today = new Date().toISOString().split("T")[0];
          setTodayUpdate(updates.find((u) => u.date === today) || null);
        }

        // ✅ FIX: notifRes now actually exists and is used
        if (notifRes.ok) {
          const data = await notifRes.json();
          setNotifications(data.notifications || []);
        }

      } catch (e) {
        console.error("Fetch error:", e);
      }
      setLoading(false);
    }

    fetchAll();

    // ✅ Poll every 30 seconds for new remarks from mentor
    const interval = setInterval(fetchNotifications, 30000);

    // ✅ Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const handleToggleTask = async (taskId: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
    try {
      await fetch(`${BASE}/student/tasks/${taskId}/complete/`, {
        method: "PATCH",
        headers: authHeaders(),
      });
      const res = await fetch(`${BASE}/student/progress/`, { headers: authHeaders() });
      if (res.ok) setProgress(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <StudentLayout
      activePage="Home"
      studentName={student?.name || "Student"}
      notifications={notifications}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Hi, {student?.name?.split(" ")[0] || "Student"} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long", month: "long", day: "numeric", year: "numeric",
          })}{" "}
          · Student Dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ProgressTracker progress={progress} />
        {student && <InternshipSummary student={student} />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DailyUpdate existingUpdate={todayUpdate} />
        </div>
        <TaskList tasks={tasks} onToggle={handleToggleTask} />
      </div>
    </StudentLayout>
  );
}