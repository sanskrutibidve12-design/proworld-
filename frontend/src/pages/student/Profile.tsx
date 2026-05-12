import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Save, User, Phone, Hash, GraduationCap, Building2,
  ChevronRight, Bell, CheckCircle2, AlertCircle, Loader2, Menu
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

// ─── Profile Form ─────────────────────────────────────────────────────────────
interface ProfileData {
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

export default function ProfilePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<ProfileData>({
    name: "", email: "", roll_no: "",
    mobile_no: "", college: "", course: "", domain: "",
  });
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // ── Fetch profile on mount ─────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    fetch(`${BASE}/student/profile/`, { headers: authHeaders() })
      .then(async (res) => {
        if (res.status === 401) { navigate("/login"); return; }
        const data = await res.json();
        setForm({
          name: data.name || "",
          email: data.email || "",
          roll_no: data.roll_no || "",
          mobile_no: data.mobile_no || "",
          college: data.college || "",
          course: data.course || "",
          domain: data.domain || "",
          internship_start: data.internship_start || "",
          internship_end: data.internship_end || "",
        });
        setFetching(false);
      })
      .catch(() => {
        setErrorMsg("Failed to load profile. Please refresh.");
        setFetching(false);
      });
  }, []);

  // ── Save profile ───────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setSaveStatus("idle");
    try {
      const res = await fetch(`${BASE}/student/profile/`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({
          name: form.name,
          roll_no: form.roll_no,
          mobile_no: form.mobile_no,
        }),
      });
      if (res.ok) {
        setSaveStatus("success");
      } else {
        setSaveStatus("error");
        setErrorMsg("Failed to save. Please try again.");
      }
    } catch {
      setSaveStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
    setSaving(false);
    setTimeout(() => setSaveStatus("idle"), 3000);
  };

  const handleChange = (field: keyof ProfileData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ── Field config ───────────────────────────────────────────────────────────
  const fields: {
    key: keyof ProfileData;
    label: string;
    icon: React.ReactNode;
    readOnly?: boolean;
    type?: string;
    placeholder?: string;
  }[] = [
    { key: "name",     label: "Full Name",      icon: <User size={14} />,         placeholder: "Your full name" },
    { key: "email",    label: "Email Address",  icon: <User size={14} />,         readOnly: true },
    { key: "roll_no",  label: "Roll Number",    icon: <Hash size={14} />,         placeholder: "e.g. CSE2021045" },
    { key: "mobile_no",label: "Mobile Number",  icon: <Phone size={14} />,        type: "tel", placeholder: "10-digit number" },
    { key: "college",  label: "College",        icon: <Building2 size={14} />,    readOnly: true },
    { key: "course",   label: "Course",         icon: <GraduationCap size={14} />,readOnly: true },
    { key: "domain",   label: "Domain",         icon: <GraduationCap size={14} />,readOnly: true },
  ];

  // ── Loading state ──────────────────────────────────────────────────────────
  if (fetching) {
    return (
      <StudentLayout activePage="View Profile" studentName="Student">
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <Loader2 size={28} className="text-blue-500 animate-spin" />
          <p className="text-sm text-gray-400">Loading your profile...</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout activePage="View Profile" studentName={form.name || "Student"}>
      <div className="max-w-xl mx-auto space-y-6">
        {/* Page title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Update your name, roll number, and mobile number
          </p>
        </div>

        {/* Avatar / summary card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-2xl p-5 flex items-center gap-4 shadow-md">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0">
            {form.name.charAt(0).toUpperCase() || "S"}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-lg leading-tight truncate">{form.name || "—"}</p>
            <p className="text-sm opacity-75 truncate">{form.email}</p>
            <p className="text-xs opacity-60 mt-0.5 truncate">
              {form.college} · {form.domain}
            </p>
          </div>
        </div>

        {/* Internship duration (read-only info strip) */}
        {(form.internship_start || form.internship_end) && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
              Internship Duration:
            </span>
            <span className="text-sm text-blue-700 font-medium">
              {form.internship_start || "?"} → {form.internship_end || "?"}
            </span>
          </div>
        )}

        {/* Error banner */}
        {errorMsg && saveStatus === "error" && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <p className="text-sm text-red-600">{errorMsg}</p>
          </div>
        )}

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1.5">
                <span className="text-gray-400">{f.icon}</span>
                {f.label}
                {f.readOnly && (
                  <span className="ml-1 text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                    read-only
                  </span>
                )}
              </label>
              <input
                type={f.type || "text"}
                value={form[f.key] || ""}
                disabled={f.readOnly}
                placeholder={f.placeholder}
                onChange={(e) => !f.readOnly && handleChange(f.key, e.target.value)}
                className={`w-full rounded-xl border px-3 py-2.5 text-sm transition-colors focus:outline-none ${
                  f.readOnly
                    ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed"
                    : "bg-white border-gray-200 text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                }`}
              />
            </div>
          ))}

          {/* Save button */}
          <div className="pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                saveStatus === "success"
                  ? "bg-green-500 text-white"
                  : saveStatus === "error"
                  ? "bg-red-500 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {saving ? (
                <Loader2 size={15} className="animate-spin" />
              ) : saveStatus === "success" ? (
                <CheckCircle2 size={15} />
              ) : saveStatus === "error" ? (
                <AlertCircle size={15} />
              ) : (
                <Save size={15} />
              )}
              {saving
                ? "Saving..."
                : saveStatus === "success"
                ? "Changes Saved!"
                : saveStatus === "error"
                ? "Save Failed"
                : "Save Changes"}
            </button>
            <p className="text-xs text-center text-gray-400 mt-2">
              Email, college, course and domain cannot be changed. Contact admin if needed.
            </p>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
} 