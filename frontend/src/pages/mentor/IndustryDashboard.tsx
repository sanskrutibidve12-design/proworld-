import { useEffect, useState } from "react";
import MentorLayout from "@/components/mentor/MentorLayout";
import API from "@/api/api";

export default function IndustryDashboard() {
  const [stats, setStats] = useState<any>({});
  const [students, setStudents] = useState<any[]>([]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning ☀️";
    if (hour < 18) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
  };

  const name =
    localStorage.getItem("name")?.split("@")[0] || "Mentor";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, studentRes] = await Promise.all([
        API.get("/mentor_dashboard/"),
        API.get("/my_students/"), // will fix logic next if needed
      ]);

      setStats(statsRes.data);
      setStudents(studentRes.data);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <MentorLayout>

      {/* 🔷 TOP BANNER */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-6 mb-6">
        <h1 className="text-3xl font-bold">
          {getGreeting()}, {name}
        </h1>
        <p className="text-sm opacity-80">
          Manage domain students & track performance
        </p>
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

        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <p className="text-gray-500 text-sm">Remarks Given</p>
          <h2 className="text-2xl font-bold">{stats.remarks}</h2>
        </div>

      </div>

      {/* 👨‍🎓 STUDENTS */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <h2 className="font-bold mb-3">Domain Students</h2>

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

    </MentorLayout>
  );
}