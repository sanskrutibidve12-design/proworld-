import { useEffect, useState } from "react";
import MentorLayout from "@/components/mentor/MentorLayout";
import API from "@/api/api";

export default function MentorAttendance() {

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await API.get("/mentor_attendance/");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 📊 Stats
  const avg =
    data.length > 0
      ? Math.round(data.reduce((acc, s) => acc + s.attendance, 0) / data.length)
      : 0;

  const high = data.filter(s => s.attendance > 75).length;
  const low = data.filter(s => s.attendance < 50).length;

  return (
    <MentorLayout>

      {/* 🔷 HEADER */}
      <h1 className="text-2xl font-bold mb-6">Attendance Overview</h1>

      {/* 📊 CARDS */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <p className="text-gray-500 text-sm">Average Attendance</p>
          <h2 className="text-2xl font-bold">{avg}%</h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <p className="text-gray-500 text-sm">High Attendance</p>
          <h2 className="text-2xl font-bold">{high}</h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <p className="text-gray-500 text-sm">Low Attendance</p>
          <h2 className="text-2xl font-bold">{low}</h2>
        </div>

      </div>

      {/* 📋 TABLE */}
      <div className="bg-white rounded-2xl shadow-sm p-4">

        <table className="w-full text-sm text-center">

          <thead className="bg-gray-100">
            <tr>
              <th>Student</th>
              <th>Attendance</th>
            </tr>
          </thead>

          <tbody>
            {data.map((s, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">

                <td className="py-2 font-medium">{s.student}</td>

                <td>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${s.attendance > 75 ? "bg-green-100 text-green-600" :
                      s.attendance > 50 ? "bg-yellow-100 text-yellow-600" :
                      "bg-red-100 text-red-600"}
                  `}>
                    {s.attendance}%
                  </span>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </MentorLayout>
  );
}