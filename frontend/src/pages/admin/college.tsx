import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/adminlayout";
import API from "../../api/api";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, Building2, X, ChevronDown } from "lucide-react";

// ✅ ONLY CHANGE: moved outside
const ModalInput = ({ value, onChange, placeholder }: any) => (
  <input
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
  />
);

export default function Colleges() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<any>(null);
  const [filter, setFilter] = useState({ sort: "" });
  const [form, setForm] = useState({ name: "" });

  useEffect(() => { fetchColleges(); }, [filter]);

  const fetchColleges = async () => {
    try {
      const query = new URLSearchParams(filter).toString();
      const res = await API.get(`/colleges/?${query}`);
      setColleges(res.data);
    } catch {
      toast.error("Failed to fetch colleges");
    }
  };

  const handleAdd = async () => {
    try {
      await API.post("/colleges/", form);
      toast.success("College added successfully");
      setShowAdd(false);
      setForm({ name: "" });
      fetchColleges();
    } catch {
      toast.error("Add failed");
    }
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/colleges/${editing.id}/`, editing);
      toast.success("College updated");
      setEditing(null);
      fetchColleges();
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/colleges/${confirmDelete.id}/`);
      toast.success("College deleted");
      setConfirmDelete(null);
      fetchColleges();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <AdminLayout>
      <div className="flex gap-6">
        {/* Filter */}
        <div className="w-56 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
            <h3 className="font-bold text-gray-800 text-sm mb-4">Sort</h3>
            <div className="relative">
              <select
                onChange={(e) => setFilter({ sort: e.target.value })}
                className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all pr-8"
              >
                <option value="">Default</option>
                <option value="id">By ID</option>
                <option value="name">By Name</option>
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Colleges</h2>
              <p className="text-sm text-gray-500 mt-0.5">{colleges.length} colleges registered</p>
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-blue-200 transition-all hover:-translate-y-0.5"
            >
              <Plus size={16} /> Add College
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {colleges.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                  <Building2 size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">No colleges found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["ID", "College Name", "Actions"].map(h => (
                      <th key={h} className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {colleges.map((c, i) => (
                    <tr key={c.id} className={`hover:bg-blue-50/30 transition-colors ${i % 2 !== 0 ? "bg-gray-50/30" : ""}`}>
                      <td className="px-6 py-4 text-sm text-gray-400 font-mono w-16">#{c.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                            {c.name.charAt(0)}
                          </div>
                          <span className="text-sm font-semibold text-gray-800">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setEditing(c)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold transition-colors">
                            <Edit2 size={12} /> Edit
                          </button>
                          <button onClick={() => setConfirmDelete(c)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors">
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

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Add College</h3>
              <button onClick={() => setShowAdd(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-3">
              {/* ✅ ONLY FIX HERE */}
              <ModalInput
                value={form.name}
                placeholder="College Name"
                onChange={(e: any) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowAdd(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleAdd} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-blue-200 transition-all">Save</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}