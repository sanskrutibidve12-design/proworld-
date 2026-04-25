import Sidebar from "../../components/mentor/Sidebar";
import { useEffect, useState } from "react";
import MentorLayout from "@/components/mentor/MentorLayout";
import API from "@/api/api"; 

export default function CollegeDashboard() {

  const [stats, setStats] = useState<any>({});
  const [students, setStudents] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);
  const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning ☀️";
  if (hour < 18) return "Good Afternoon 🌤️";
  return "Good Evening 🌙";
};
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, studentRes, updateRes] = await Promise.all([
        API.get("/mentor_dashboard/"),
        API.get("/my_students/"),
        API.get("/mentor_updates/"),
      
      ]);

      setStats(statsRes.data);
      setStudents(studentRes.data);
      setUpdates(updateRes.data);

    } catch (err) {
      console.error(err);
    }
  };
const raw = localStorage.getItem("name") || "Mentor";

// remove @ part + numbers
const cleanName = raw.split("@")[0].replace(/[0-9]/g, "");
  return (
    <MentorLayout>

      {/* 🔷 TOP BANNER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 mb-6">
        <h1 className="text-1xl font-bold">
             {getGreeting()}, {cleanName}
</h1>
      </div>

      {/* 📊 STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <p className="text-gray-500 text-sm">Total Students</p>
          <h2 className="text-2xl font-bold">{stats.total_students}</h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <p className="text-gray-500 text-sm">Avg Attendance</p>
          <h2 className="text-2xl font-bold">{stats.avg_attendance}%</h2>
        </div>

      
      </div>

      {/* 👨‍🎓 STUDENTS TABLE */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <h2 className="font-bold mb-3">My Students</h2>

        <table className="w-full text-sm text-center">
          <thead className="bg-gray-100">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Domain</th>
              <th>Attendance</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-t">
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.domain}</td>
                <td>{s.attendance}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📝 UPDATES */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <h2 className="font-bold mb-3">Recent Updates</h2>

        <div className="space-y-3">
          {updates.slice(0, 5).map((u) => (
            <div key={u.id} className="border p-3 rounded-xl">
              <p className="font-semibold">{u.student}</p>
              <p className="text-sm text-gray-600">{u.content}</p>
              <p className="text-xs text-gray-400">{u.date}</p>
            </div>
          ))}
        </div>
      </div>

    </MentorLayout>
  );
}