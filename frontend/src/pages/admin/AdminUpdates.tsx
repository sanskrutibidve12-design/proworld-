import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/adminlayout";
import API from "../../api/api";
import { FileText } from "lucide-react";

export default function AdminUpdates() {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    API.get("/admin/updates/").then(res => setUpdates(res.data));
  }, []);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Updates</h2>
          <p className="text-sm text-gray-500 mt-0.5">{updates.length} updates submitted</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {updates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
              <FileText size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No updates found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Student", "Domain", "Update", "Date"].map(h => (
                  <th key={h} className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {updates.map((u: any, i) => (
                <tr key={u.id} className={`hover:bg-blue-50/30 transition-colors ${i % 2 !== 0 ? "bg-gray-50/30" : ""}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0">
                        {u.student?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{u.student}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700">
                      {u.domain || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-sm">
                    <p className="line-clamp-2">{u.content}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">{u.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}