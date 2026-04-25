import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/adminlayout";
import API from "../../api/api";
import toast from "react-hot-toast";

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [domains, setDomains] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [domain, setDomain] = useState("");

  useEffect(() => {
    fetchTasks();
    fetchDomains();
  }, []);

  // ✅ FETCH TASKS
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks/");
      console.log("TASKS DATA 👉", res.data); // 🔥 DEBUG
      setTasks(res.data);
    } catch {
      toast.error("Failed to load tasks");
    }
  };

  // ✅ FETCH DOMAINS
  const fetchDomains = async () => {
    try {
      const res = await API.get("/domains/");
      setDomains(res.data);
    } catch {
      toast.error("Failed to load domains");
    }
  };

  // ✅ CREATE TASK
  const createTask = async () => {
    if (!title || !date || !domain) {
      toast.error("Fill all required fields");
      return;
    }

    try {
      await API.post("/tasks/", {
        title,
        description,
        date,
        domain: Number(domain), // 🔥 FIX: ensure it's number
      });

      toast.success("Task created");
      fetchTasks();

      // reset form
      setTitle("");
      setDescription("");
      setDate("");
      setDomain("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create task");
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">

        <h1 className="text-xl font-bold">Tasks Management</h1>

        {/* CREATE TASK */}
        <div className="bg-white p-4 rounded-xl shadow space-y-3">
          <input
            placeholder="Title"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="date"
            value={date}
            onChange={(e)=>setDate(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <select
            value={domain}
            onChange={(e)=>setDomain(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Domain</option>
            {domains.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <button
            onClick={createTask}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Task
          </button>
        </div>

        {/* TASK LIST */}
        <div className="bg-white p-4 rounded-xl shadow">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-2">Title</th>
                <th className="text-left py-2">Domain</th>
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Completed</th>
              </tr>
            </thead>

            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-400">
                    No tasks found
                  </td>
                </tr>
              ) : (
                tasks.map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="py-2">{t.title}</td>

                    {/* 🔥 FIX: fallback if null */}
                    <td className="py-2">
                      {t.domain_name || "No Domain"}
                    </td>

                    <td className="py-2">{t.date}</td>

                    {/* 🔥 FIX: fallback */}
                    <td className="py-2">
                      {t.completed_count ?? 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

      </div>
    </AdminLayout>
  );
}