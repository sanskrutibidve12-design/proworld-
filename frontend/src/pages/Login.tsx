import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // 👈 add this
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/proworld-logo.png";

export default function Login() {
  const { toast } = useToast();
  const navigate = useNavigate(); // 👈 add this

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

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
      console.log(data);

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
      // 💾 OPTIONAL: store user info
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("name", data.name);
      toast({
        title: "Login Successful ✅",
        description: "Redirecting...",
      });
     console.log(data.role);
      // 🚀 ROLE BASED REDIRECT
      if (data.role === "admin") {
        navigate("/admin/dashboard");
      } 
      else if (data.role === "mentor") {
        if (data.mentor_type === "college") {
          navigate("/mentor/college/dashboard");
        }
        else{
          navigate("/mentor/industry/dashboard");
        }
      }
      else if (data.role=="student"){
        navigate("/student/StudentDashboard");
      }
      else {
        navigate("/student/StudentDashboard");
      }

    } catch (error) {
      console.error(error);
      toast({
        title: "Server Error ⚠️",
        description: "Try again later",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-primary p-4">
      <div className="bg-background rounded-2xl shadow-hero w-full max-w-md p-8">
        <div className="text-center mb-8">
          <img src={logo} alt="ProWorld" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground text-sm">Sign in to your account</p>
        </div>

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
              className="text-sm text-primary hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full gradient-primary text-primary-foreground rounded-xl py-3"
          >
            Log In
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}