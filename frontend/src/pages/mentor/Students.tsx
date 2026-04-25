import { useEffect, useState } from "react";
import MentorLayout from "@/components/mentor/MentorLayout";
import API from "@/api/api";

export default function Students() {

  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/my_students/");
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔍 filter logic
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MentorLayout>

      {/* 🔷 HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Students</h1>

        <input
          type="text"
          placeholder="Search student..."
          className="border px-4 py-2 rounded-xl text-sm w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 📊 CARDS */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <p className="text-gray-500 text-sm">Total Students</p>
          <h2 className="text-2xl font-bold">{students.length}</h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <p className="text-gray-500 text-sm">High Attendance</p>
          <h2 className="text-2xl font-bold">
            {students.filter(s => s.attendance > 75).length}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <p className="text-gray-500 text-sm">Low Attendance</p>
          <h2 className="text-2xl font-bold">
            {students.filter(s => s.attendance < 50).length}
          </h2>
        </div>

      </div>

      {/* 👨‍🎓 TABLE */}
      <div className="bg-white rounded-2xl shadow-sm p-4">

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
            {filteredStudents.map((s) => (
              <tr key={s.id} className="border-t hover:bg-gray-50">

                <td className="py-2 font-medium">{s.name}</td>
                <td>{s.email}</td>
                <td>{s.domain}</td>

                {/* 🎯 Attendance Badge */}
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