import { useState } from "react";
import MentorLayout from "@/components/mentor/MentorLayout";
import API from "@/api/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Tasks() {
  const queryClient = useQueryClient();

  // 🧠 FORM STATE
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    assigned_to: "",
  });

  // 📦 FETCH STUDENTS
  const { data: students = [] } = useQuery({
    queryKey: ["myStudents"],
    queryFn: async () => {
      const res = await API.get("/my_students/");
      return res.data;
    },
  });

  // 📦 FETCH TASKS
  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await API.get("/tasks/");
      return res.data;
    },
  });

  // 🚀 CREATE TASK
  const { mutate } = useMutation({
    mutationFn: async (newTask: any) => {
      const res = await API.post("/tasks/", newTask);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      // reset form
      setForm({
        title: "",
        description: "",
        date: "",
        assigned_to: "",
      });
    },
  });

  // 📤 SUBMIT
  const handleSubmit = (e: any) => {
    e.preventDefault();

    mutate({
      ...form,
      assigned_to: form.assigned_to || null,
    });
  };

  return (
    <MentorLayout>
      <div className="p-6 bg-gray-50 min-h-screen">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-indigo-700">
            Task Management
          </h1>
          <p className="text-gray-500 text-sm">
            Assign and track tasks for your students
          </p>
        </div>

        {/* ================= CREATE TASK ================= */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-indigo-100">
          <h2 className="text-xl font-semibold text-indigo-600 mb-4">
            Assign New Task
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* TITLE */}
            <div>
              <label className="text-sm text-gray-600">Task Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                className="w-full mt-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* DATE */}
            <div>
              <label className="text-sm text-gray-600">Due Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
                className="w-full mt-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full mt-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* STUDENT DROPDOWN */}
            <div>
              <label className="text-sm text-gray-600">Assign To</label>
              <select
                value={form.assigned_to}
                onChange={(e) =>
                  setForm({ ...form, assigned_to: e.target.value })
                }
                className="w-full mt-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">All Domain Students</option>

                {students.map((s: any) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <p className="text-xs text-gray-400 mt-1">
                Leave empty to assign to all students in your domain
              </p>
            </div>

            {/* BUTTON */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Assign Task
              </button>
            </div>
          </form>
        </div>

        {/* ================= TASK LIST ================= */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-indigo-100">
          <h2 className="text-xl font-semibold text-indigo-600 mb-4">
            Assigned Tasks
          </h2>

          <div className="space-y-4">

            {tasks.length === 0 && (
              <p className="text-gray-500 text-sm">No tasks assigned yet</p>
            )}

            {tasks.map((task: any) => (
              <div
                key={task.id}
                className="border border-gray-200 rounded-xl p-4 flex justify-between items-center hover:shadow-sm transition"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {task.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Assigned to:{" "}
                    {task.assigned_to_name || "All Domain Students"}
                  </p>

                  <p className="text-xs text-gray-400">
                    Due: {task.date}
                  </p>
                </div>

                <div className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  {task.completed_count} Completed
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </MentorLayout>
  );
}