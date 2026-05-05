import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/proworld-logo.png";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    const res = await fetch(
      `http://127.0.0.1:8000/api/reset-password/${token}/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      setSuccess(true);
    } else {
      alert(data.error);
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

          <h1 className="text-2xl font-bold text-foreground">
            Reset Password
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter your new password
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <p className="text-green-600 font-medium">
              ✅ Password reset successful
            </p>

            <Button
              onClick={() => navigate("/")}
              className="w-full gradient-primary"
            >
              Go to Login
            </Button>
          </div>
        ) : (
          <>
            {/* FORM */}
            <div className="space-y-4">
              <div>
                <Label>New Password</Label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button
                onClick={handleReset}
                className="w-full gradient-primary text-primary-foreground rounded-xl py-3"
              >
                Reset Password
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}