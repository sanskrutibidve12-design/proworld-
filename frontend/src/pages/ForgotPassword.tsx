import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/proworld-logo.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    await fetch("https://proworld-tech.onrender.com/api/forgot-password/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setSent(true);
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
            Forgot Password
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter your email to receive reset link
          </p>
        </div>

        {/* SUCCESS MESSAGE */}
        {sent ? (
          <div className="text-center space-y-4">
            <p className="text-green-600 font-medium">
              📩 Reset link sent to your email
            </p>

            <Button
              onClick={() => navigate("/")}
              className="w-full gradient-primary"
            >
              Back to Login
            </Button>
          </div>
        ) : (
          <>
            {/* FORM */}
            <div className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full gradient-primary text-primary-foreground rounded-xl py-3"
              >
                Send Reset Link
              </Button>
            </div>

            {/* FOOTER */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Remember your password?{" "}
              <span
                onClick={() => navigate("/")}
                className="text-primary font-medium hover:underline cursor-pointer"
              >
                Login
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}