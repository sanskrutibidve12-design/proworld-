import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../../api/api";
import toast from "react-hot-toast";

export default function MentorSignup() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match ❌");
      return;
    }

    try {
      await API.post(`/mentor-create-account/${token}/`, {
        password,
      });

      toast.success("Account created successfully 🎉");

      // redirect to login
      navigate("/login");

    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Something went wrong ❌");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-96">

        <h2 className="text-xl font-bold mb-4 text-center">
          Create Mentor Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            type="password"
            placeholder="Enter Password"
            className="w-full border p-2 rounded"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border p-2 rounded"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Create Account
          </button>

        </form>

      </div>
    </div>
  );
}