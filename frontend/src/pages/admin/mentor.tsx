import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/adminlayout";
import API from "../../api/api";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, Users, X, ChevronDown } from "lucide-react";

export default function Mentors() {

  const [mentors, setMentors] = useState<any[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);
  const [domains, setDomains] = useState<any[]>([]);

  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<any>(null);

  const [filter, setFilter] = useState({
    college: "",
    sort: "",
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile_no: "",
    college: "",
    domain: "",
    role: "",
  });

  useEffect(() => {
    fetchAll();
  }, [filter]);

  const fetchAll = async () => {
    try {
      const query = new URLSearchParams(filter).toString();

      const [men, colg, dom] = await Promise.all([
        API.get(`/mentors/?${query}`),
        API.get("/colleges/"),
        API.get("/domains/"),
      ]);

      setMentors(men.data);
      setColleges(colg.data);
      setDomains(dom.data);

    } catch {
      toast.error("Failed to fetch data ❌");
    }
  };

  const handleAdd = async () => {
    if (!form.name || !form.email || !form.role) {
      toast.error("All fields are required ❌");
      return;
    }
    if (form.role === "college" && !form.college) {
      toast.error("Select college ❌");
      return;
    }
    if (form.role === "industry" && !form.domain) {
      toast.error("Select domain ❌");
      return;
    }
    try {
      const payload: any = {
        name: form.name,
        email: form.email,
        mobile_no: form.mobile_no,
        role: form.role,
      };
      if (form.role === "college") payload.college = Number(form.college);
      if (form.role === "industry") payload.domain = Number(form.domain);

      await API.post("/mentors/", payload);
      toast.success("Mentor added 🎉");
      setShowAdd(false);
      setForm({ name: "", email: "", mobile_no: "", college: "", domain: "", role: "" });
      fetchAll();
    } catch (err: any) {
      console.log(err.response?.data);
      toast.error("Error adding mentor ❌");
    }
  };

  const handleUpdate = async () => {
    try {
      const payload: any = {
        name: editing.name,
        email: editing.email,
        mobile_no: editing.mobile_no,
        role: editing.role,
      };
      if (editing.role === "college") payload.college = Number(editing.college);
      if (editing.role === "industry") payload.domain = Number(editing.domain);

      await API.put(`/mentors/${editing.id}/`, payload);
      toast.success("Mentor updated ✏️");
      setEditing(null);
      fetchAll();
    } catch {
      toast.error("Update failed ❌");
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/mentors/${confirmDelete.id}/`);
      toast.success("Mentor deleted 🗑️");
      setConfirmDelete(null);
      fetchAll();
    } catch {
      toast.error("Delete failed ❌");
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all";
  const selectClass = "w-full appearance-none border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all";

  return (
    <AdminLayout>
      <div className="flex gap-6">

        {/* FILTER */}
        <div className="w-56 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
            <h3 className="font-bold text-gray-800 text-sm mb-4">Filters</h3>

            <div className="space-y-3">
              <div className="relative">
                <select
                  onChange={(e) => setFilter({ ...filter, college: e.target.value })}
                  className={selectClass}
                >
                  <option value="">All Colleges</option>
                  {colleges.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  onChange={(e) => setFilter({ ...filter, sort: e.target.value })}
                  className={selectClass}
                >
                  <option value="">Sort</option>
                  <option value="id">By ID</option>
                  <option value="name">By Name</option>
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Mentors</h2>
              <p className="text-sm text-gray-500 mt-0.5">{mentors.length} mentors registered</p>
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-blue-200 transition-all hover:-translate-y-0.5"
            >
              <Plus size={16} /> Add Mentor
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {mentors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                  <Users size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">No mentors found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["ID", "Name", "Email", "Mobile", "College", "Role", "Actions"].map(h => (
                      <th key={h} className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {mentors.map((m, i) => (
                    <tr key={m.id} className={`hover:bg-blue-50/30 transition-colors ${i % 2 !== 0 ? "bg-gray-50/30" : ""}`}>
                      <td className="px-6 py-4 text-sm text-gray-400 font-mono w-16">#{m.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                            {m.name?.charAt(0)}
                          </div>
                          <span className="text-sm font-semibold text-gray-800">{m.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{m.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{m.mobile_no}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{m.college_name || "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          m.role === "college"
                            ? "bg-purple-50 text-purple-700"
                            : "bg-green-50 text-green-700"
                        }`}>
                          {m.role === "college" ? "College" : "Industry"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setEditing(m)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold transition-colors">
                            <Edit2 size={12} /> Edit
                          </button>
                          <button onClick={() => setConfirmDelete(m)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors">
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ADD MODAL */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Add Mentor</h3>
              <button onClick={() => setShowAdd(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} className={inputClass} />
              <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} className={inputClass} />
              <input placeholder="Mobile" onChange={e => setForm({...form, mobile_no: e.target.value})} className={inputClass} />
              <div className="relative">
                <select onChange={e => setForm({...form, role: e.target.value})} className={selectClass}>
                  <option value="">Select Role</option>
                  <option value="college">College Mentor</option>
                  <option value="industry">Industry Mentor</option>
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {form.role === "college" && (
                <div className="relative">
                  <select onChange={e => setForm({...form, college: e.target.value})} className={selectClass}>
                    <option value="">Select College</option>
                    {colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              )}
              {form.role === "industry" && (
                <div className="relative">
                  <select onChange={e => setForm({...form, domain: e.target.value})} className={selectClass}>
                    <option value="">Select Domain</option>
                    {domains.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              )}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowAdd(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleAdd} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-blue-200 transition-all">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Edit Mentor</h3>
              <button onClick={() => setEditing(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <input value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} className={inputClass} />
              <input value={editing.email} onChange={e => setEditing({...editing, email: e.target.value})} className={inputClass} />
              <input value={editing.mobile_no} onChange={e => setEditing({...editing, mobile_no: e.target.value})} className={inputClass} />
              <div className="relative">
                <select value={editing.role} onChange={e => setEditing({...editing, role: e.target.value})} className={selectClass}>
                  <option value="college">College Mentor</option>
                  <option value="industry">Industry Mentor</option>
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {editing.role === "college" && (
                <div className="relative">
                  <select value={editing.college} onChange={e => setEditing({...editing, college: Number(e.target.value)})} className={selectClass}>
                    {colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              )}
              {editing.role === "industry" && (
                <div className="relative">
                  <select value={editing.domain} onChange={e => setEditing({...editing, domain: Number(e.target.value)})} className={selectClass}>
                    {domains.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              )}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setEditing(null)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleUpdate} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-blue-200 transition-all">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Delete Mentor</h3>
              <p className="text-sm text-gray-500 mt-1">
                Are you sure you want to delete <span className="font-semibold text-gray-700">{confirmDelete.name}</span>?
              </p>
            </div>
            <div className="px-6 pb-6 pt-4 flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-red-200 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}