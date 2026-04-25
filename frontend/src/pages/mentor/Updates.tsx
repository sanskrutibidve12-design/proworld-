import { useEffect, useState } from "react";
import MentorLayout from "@/components/mentor/MentorLayout";
import API from "@/api/api";

export default function MentorUpdates() {
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const res = await API.get("/mentor_updates/");
      setUpdates(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MentorLayout>

      {/* 🔷 HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-2xl mb-6">
        <h1 className="text-2xl font-bold">Student Updates</h1>
        <p className="text-sm opacity-80">Track daily progress of students</p>
      </div>

      {/* 📦 CONTENT */}
      <div className="bg-white rounded-2xl shadow-sm p-5">

        {loading ? (
          <p>Loading...</p>
        ) : updates.length === 0 ? (
          <p className="text-gray-500 text-center">No updates available</p>
        ) : (
          <div className="space-y-4">

            {updates.map((u) => (
              <div
                key={u.id}
                className="border rounded-xl p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">{u.student}</h3>
                  <span className="text-xs text-gray-400">{u.date}</span>
                </div>

                <p className="text-sm text-gray-500 mb-2">
                  Domain: {u.domain}
                </p>

                <p className="text-gray-700">{u.content}</p>
              </div>
            ))}

          </div>
        )}

      </div>

    </MentorLayout>
  );
}