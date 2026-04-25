import AdminLayout from "../../components/admin/adminlayout";
import { useEffect, useState } from "react";
import {
  Trash2, Edit2, Plus, Users, X,
  ChevronDown, Shield, UserCheck, GraduationCap
} from "lucide-react";
import API from "../../api/api";

// ─── Role Badge ───────────────────────────────────────────────────────────────
const roleConfig: Record<string, { color: string; icon: any }> = {
  admin: { color: "bg-purple-50 text-purple-700 border-purple-200", icon: Shield },
  mentor: { color: "bg-blue-50 text-blue-700 border-blue-200", icon: UserCheck },
  student: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: GraduationCap },
};

const RoleBadge = ({ role }: { role: string }) => {
  const cfg = roleConfig[role] || { color: "bg-gray-100 text-gray-600 border-gray-200", icon: Users };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
      <Icon size={11} />
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<any>(null);
  const [form, setForm] = useState({
    email: "", username: "", password: "", role: "student"
  });

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    setFilteredUsers(
      filter === "all" ? users : users.filter((u) => u.role === filter)
    );
  }, [filter, users]);

  // ─── Fetch ──────────────────────────────────────────────────────────────────
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/users/");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      console.error("FETCH ERROR:", err);
      setError("Failed to load users. " + (err?.response?.data?.error || ""));
    }
    setLoading(false);
  };

  // ─── Add ────────────────────────────────────────────────────────────────────
  const handleAdd = async () => {
    try {
      await API.post("/users/create/", form);
      setShowAdd(false);
      setForm({ email: "", username: "", password: "", role: "student" });
      fetchUsers();
    } catch (err: any) {
      console.error("ADD ERROR:", err?.response?.data || err);
      alert("Error creating user: " + JSON.stringify(err?.response?.data || "Unknown error"));
    }
  };

  // ─── Update ─────────────────────────────────────────────────────────────────
  const handleUpdate = async () => {
    try {
      await API.put(`/users/update/${editingUser.id}/`, editingUser);
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      console.error("UPDATE ERROR:", err?.response?.data || err);
      alert("Error updating user");
    }
  };

  // ─── Delete ─────────────────────────────────────────────────────────────────
const handleDelete = async () => {
  console.log("DELETE CLICKED");

  try {
    const res = await API.delete(`/users/${confirmDelete.id}/`);
    console.log("DELETE RESPONSE", res);

    setConfirmDelete(null);
    fetchUsers();
  } catch (err) {
    console.log("DELETE ERROR", err);
  }
};

  // ─── Styles ──────────────────────────────────────────────────────────────────
  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all";
  const selectClass = "w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all pr-8";
  const filterTabs = ["all", "admin", "mentor", "student"];

  // ─── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // ─── Error ───────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 flex-col gap-3">
          <p className="text-red-500 text-sm font-medium">{error}</p>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex gap-6">

        {/* ── Filter Sidebar ── */}
        <div className="w-56 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
            <h3 className="font-bold text-gray-800 text-sm mb-4">Filter by Role</h3>
            <div className="space-y-1">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    filter === tab
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab === "all" ? <Users size={14} />
                    : tab === "admin" ? <Shield size={14} />
                    : tab === "mentor" ? <UserCheck size={14} />
                    : <GraduationCap size={14} />}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full ${
                    filter === tab ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {tab === "all" ? users.length : users.filter((u) => u.role === tab).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Users</h2>
              <p className="text-sm text-gray-500 mt-0.5">{filteredUsers.length} users found</p>
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-blue-200 transition-all hover:-translate-y-0.5"
            >
              <Plus size={16} /> Add User
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                  <Users size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {["User", "Email", "Role", "Actions"].map((h) => (
                        <th key={h} className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredUsers.map((u, i) => (
                      <tr key={u.id} className={`hover:bg-blue-50/30 transition-colors ${i % 2 !== 0 ? "bg-gray-50/30" : ""}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-xs font-bold">
                              {u.username?.charAt(0)?.toUpperCase() || u.email?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{u.username}</p>
                              <p className="text-xs text-gray-400">ID: #{u.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                        <td className="px-6 py-4"><RoleBadge role={u.role} /></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingUser(u)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => setConfirmDelete(u)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Add Modal ── */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Add User</h3>
              <button onClick={() => setShowAdd(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <input placeholder="Email Address" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
              <input placeholder="Username" value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })} className={inputClass} />
              <input type="password" placeholder="Password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass} />
              <div className="relative">
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={selectClass}>
                  <option value="student">Student</option>
                  <option value="mentor">Mentor</option>
                  <option value="admin">Admin</option>
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowAdd(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50">Cancel</button>
              <button onClick={handleAdd} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-blue-200">Create User</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Edit User</h3>
              <button onClick={() => setEditingUser(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <input value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} className={inputClass} />
              <input value={editingUser.username}
                onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })} className={inputClass} />
              <div className="relative">
                <select value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })} className={selectClass}>
                  <option value="student">Student</option>
                  <option value="mentor">Mentor</option>
                  <option value="admin">Admin</option>
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setEditingUser(null)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50">Cancel</button>
              <button onClick={handleUpdate} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-blue-200">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Delete User?</h3>
            <p className="text-sm text-gray-500 mb-6">"{confirmDelete.username}" will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}