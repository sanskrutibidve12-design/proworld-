import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/adminlayout";
import API from "../../api/api";

export default function AdminUpdates() {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    API.get("/admin/updates/").then(res => setUpdates(res.data));
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Student Updates</h1>

        {updates.map((u: any) => (
          <div key={u.id} className="bg-white p-4 rounded shadow mb-3">
            <p className="font-semibold">{u.student}</p>
            <p className="text-sm text-gray-500">{u.email}</p>
            <p className="mt-2">{u.content}</p>
            <p className="text-xs text-gray-400 mt-1">{u.date}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}