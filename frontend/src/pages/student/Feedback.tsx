import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MessageSquare, Star, ChevronRight, Menu } from "lucide-react";
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
interface Remark {
  id: number;
  mentor_name: string;
  remark: string;
  rating: number;
  created_at: string;
  update_date: string | null;
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={
            s <= rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-200 fill-gray-200"
          }
        />
      ))}
    </div>
  );
}

// ─── Sidebar Layout ───────────────────────────────────────────────────────────
function StudentLayout({
  children,
  activePage,
}: {
  children: React.ReactNode;
  activePage: string;
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FeedbackPage() {
  const [remarks, setRemarks] = useState<Remark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeedback() {
      try {
        const res = await fetch(`${BASE}/my_feedback/`, {   // ✅ FIXED ENDPOINT
          headers: authHeaders(),
        });

        if (!res.ok) {
          console.error("Failed to fetch feedback");
          return;
        }

        const data = await res.json();

        // ✅ ensure always array
        if (Array.isArray(data)) {
          setRemarks(data);
        } else {
          setRemarks([]);
        }

      } catch (e) {
        console.error("Error fetching feedback:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchFeedback();
  }, []);

  // ✅ Average rating
  const avgRating =
    remarks.length > 0
      ? (remarks.reduce((a, r) => a + Number(r.rating), 0) / remarks.length).toFixed(1)
      : null;

  // ✅ Mentor name (latest remark)
  const mentorName =
    remarks.length > 0 ? remarks[0].mentor_name : null;

  if (loading) {
    return (
      <StudentLayout activePage="Manager Feedback">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout activePage="Manager Feedback">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Mentor Feedback
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Remarks from your assigned mentor
            </p>
          </div>

          {avgRating && (
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl px-4 py-3 text-center">
              <p className="text-2xl font-bold text-yellow-500">
                {avgRating}
              </p>
              <StarRating rating={Math.round(Number(avgRating))} />
              <p className="text-xs text-gray-400 mt-1">
                Avg rating
              </p>
            </div>
          )}
        </div>

        {/* Mentor card */}
        {mentorName && (
          <div className="bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-lg font-bold">
              {mentorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold">{mentorName}</p>
              <p className="text-xs opacity-75">Your Mentor</p>
            </div>
          </div>
        )}

        {/* No feedback */}
        {remarks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <MessageSquare size={32} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-semibold text-gray-500">
              No feedback yet
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Your mentor hasn't left any remarks yet
            </p>
          </div>
        ) : (

          /* Feedback list */
          <div className="space-y-4">
            {remarks.map((r, i) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative"
              >

                {i === 0 && (
                  <span className="absolute top-4 right-4 text-[10px] font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                    Latest
                  </span>
                )}

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <MessageSquare size={15} className="text-blue-600" />
                  </div>

                  <div className="flex-1">

                    {/* Rating + Update link */}
                    <div className="flex items-center gap-2 mb-1">
                      <StarRating rating={Number(r.rating)} />

                      {r.update_date && (
                        <>
                          <span className="text-xs text-gray-400">·</span>
                          <span className="text-xs text-gray-400">
                            Re: your update on{" "}
                            {new Date(r.update_date).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Remark */}
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {r.remark}
                    </p>

                    {/* Date */}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(r.created_at).toLocaleDateString()}
                    </p>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}