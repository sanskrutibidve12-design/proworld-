import { useState } from "react";
import MentorLayout from "@/components/mentor/MentorLayout";
import API from "@/api/api";
import { useQuery, useMutation } from "@tanstack/react-query";

export default function Remarks() {
  const [form, setForm] = useState({
    student_id: "",
    remark: "",
    rating: 5,
    update_id: "",
  });

  // 👨‍🎓 Students
  const { data: students = [] } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const res = await API.get("/my_students/");
      return res.data;
    },
  });

  // 📅 Updates
  const { data: updates = [] } = useQuery({
    queryKey: ["updates"],
    queryFn: async () => {
      const res = await API.get("/mentor_updates/");
      return res.data;
    },
  });

  // 🎯 Filter updates based on selected student
  const filteredUpdates = updates.filter(
    (u: any) => u.student === students.find((s:any)=>s.id == form.student_id)?.name
  );

  // 🚀 Submit
  const { mutate } = useMutation({
    mutationFn: async () => {
      return API.post("/add_remark/", {
        ...form,
        rating: Number(form.rating),
      });
    },
    onSuccess: () => {
      alert("✅ Remark added");
      setForm({
        student_id: "",
        remark: "",
        rating: 5,
        update_id: "",
      });
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    mutate();
  };

  return (
    <MentorLayout>
      <div className="p-6 bg-gray-50 min-h-screen">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">
          💬 Give Feedback
        </h1>

        <div className="bg-white p-6 rounded-2xl shadow-md max-w-xl">

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* STUDENT */}
            <div>
              <label className="text-sm">Student</label>
              <select
                value={form.student_id}
                onChange={(e) =>
                  setForm({ ...form, student_id: e.target.value, update_id: "" })
                }
                className="w-full border p-2 rounded-lg mt-1"
              >
                <option value="">Select Student</option>
                {students.map((s: any) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* UPDATE */}
            <div>
              <label className="text-sm">Update (optional)</label>
              <select
                value={form.update_id}
                onChange={(e) =>
                  setForm({ ...form, update_id: e.target.value })
                }
                className="w-full border p-2 rounded-lg mt-1"
              >
                <option value="">General Remark</option>

                {filteredUpdates.map((u: any) => (
                  <option key={u.id} value={u.id}>
                    {u.content.slice(0, 25)}...
                  </option>
                ))}
              </select>
            </div>

            {/* REMARK */}
            <div>
              <label className="text-sm">Remark</label>
              <textarea
                value={form.remark}
                onChange={(e) =>
                  setForm({ ...form, remark: e.target.value })
                }
                className="w-full border p-2 rounded-lg mt-1"
              />
            </div>

            {/* RATING */}
            <div>
              <label className="text-sm">Rating</label>
              <select
                value={form.rating}
                onChange={(e) =>
                  setForm({ ...form, rating: Number(e.target.value) })
                }
                className="w-full border p-2 rounded-lg mt-1"
              >
                {[1,2,3,4,5].map(r => (
                  <option key={r} value={r}>
                    {r} ⭐
                  </option>
                ))}
              </select>
            </div>

            <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
              Submit
            </button>

          </form>
        </div>
      </div>
    </MentorLayout>
  );
}