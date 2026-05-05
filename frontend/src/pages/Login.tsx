import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/proworld-logo.png";

export default function Login() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [savedUsers, setSavedUsers] = useState<any[]>([]);

  // ✅ Load saved users
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("rememberedUsers") || "[]");
    setSavedUsers(users);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Login Failed ❌",
          description: data.error || "Invalid credentials",
        });
        return;
      }

      // 🔐 STORE TOKEN
      localStorage.setItem("token", data.access);
      localStorage.setItem("mentor_type", data.mentor_type);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("name", data.name);

      // ✅ MULTIPLE REMEMBER ME
      if (form.remember) {
        const existing = JSON.parse(localStorage.getItem("rememberedUsers") || "[]");

        const filtered = existing.filter((u: any) => u.email !== data.email);
        const updated = [data, ...filtered];

        localStorage.setItem("rememberedUsers", JSON.stringify(updated));
        setSavedUsers(updated); // update UI instantly
      }

      toast({
        title: "Login Successful ✅",
        description: "Redirecting...",
      });

      // 🚀 REDIRECT
      redirectUser(data);

    } catch (error) {
      console.error(error);
      toast({
        title: "Server Error ⚠️",
        description: "Try again later",
      });
    }
  };

  // 🔁 Common redirect logic
  const redirectUser = (user: any) => {
    if (user.role === "admin") {
      navigate("/admin/dashboard");
    } else if (user.role === "mentor") {
      if (user.mentor_type === "college") {
        navigate("/mentor/college/dashboard");
      } else {
        navigate("/mentor/industry/dashboard");
      }
    } else {
      navigate("/student/StudentDashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-primary p-4">
      <div className="bg-background rounded-2xl shadow-hero w-full max-w-md p-8">

        {/* HEADER */}
        <div className="text-center mb-8">
          <Link to="/">
            <img
              src={logo}
              alt="ProWorld"
              className="h-16 w-auto mx-auto mb-4 cursor-pointer hover:scale-105 transition"
            />
          </Link>

          <h1 className="text-2xl font-bold text-foreground">Welcome !!</h1>
          <p className="text-muted-foreground text-sm">Log in to your account</p>
        </div>

        {/* ✅ SAVED USERS */}
        {savedUsers.length > 0 && (
          <div className="mb-6 space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              Choose an account
            </p>

            {savedUsers.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between border rounded-xl p-4 cursor-pointer hover:bg-muted transition"
              >
                {/* CLICK TO LOGIN */}
                <div
                  className="flex-1"
                  onClick={() => {
                    localStorage.setItem("token", user.access);
                    redirectUser(user);
                  }}
                >
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>

                {/* REMOVE */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const updated = savedUsers.filter((_, i) => i !== index);
                    localStorage.setItem("rememberedUsers", JSON.stringify(updated));
                    setSavedUsers(updated);
                  }}
                  className="text-red-500 text-sm ml-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />
          </div>

          {/* REMEMBER + FORGOT */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(e) =>
                  setForm({ ...form, remember: e.target.checked })
                }
                className="rounded"
              />
              Remember Me
            </label>

            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-primary hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <Button
            type="submit"
            className="w-full gradient-primary text-primary-foreground rounded-xl py-3"
          >
            Log In
          </Button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-primary font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}