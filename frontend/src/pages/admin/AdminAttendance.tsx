import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/adminlayout";
import API from "../../api/api";

export default function AdminAttendance() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/admin/attendance/").then(res => setData(res.data));
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Attendance</h1>

        <table className="w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((r: any, i) => (
              <tr key={i}>
                <td>{r.student}</td>
                <td>{r.date}</td>
                <td>{r.present ? "Present" : "Absent"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}