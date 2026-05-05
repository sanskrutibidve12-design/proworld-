import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/proworld-logo.png";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Internship", path: "/internship" },
  { label: "Careers", path: "/careers" },
];

const drawerLinks = [
  { label: "Features", path: "/features" },
  { label: "Works", path: "/works" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">

          {/* 🔥 LOGO + NAME */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="ProWorld Technology" className="h-12 w-auto" />
           <span className="text-2xl font-extrabold text-blue-900 tracking-wide cursor-pointer transition duration-300 hover:scale-110 hover:[text-shadow:0_0_10px_rgba(30,64,175,0.7)]">
  ProWorld
</span>
          </Link>

          {/* 🔥 DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.path
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* 🔥 LOGIN BUTTON */}
            <Link
              to="/login"
              className="ml-2 px-5 py-2 rounded-full text-sm font-medium border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              Login
            </Link>
          </div>

          {/* 🔥 RIGHT SIDE ICONS */}
          <div className="flex items-center gap-2">

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-full hover:bg-muted transition-colors"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Drawer trigger */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 🔥 MOBILE DROPDOWN */}
        {mobileOpen && (
          <div className="md:hidden bg-background border-b border-border animate-fade-in">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-5 py-3 rounded-full text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/70 hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="px-5 py-3 rounded-full text-sm font-medium border border-primary text-primary text-center"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* 🔥 RIGHT SIDE DRAWER */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60]">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-background shadow-hero animate-slide-right border-l border-border">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <img src={logo} alt="ProWorld" className="h-10 w-auto" />
                <span className="font-semibold text-foreground">ProWorld</span>
              </div>

              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-full hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
            <div className="p-4 flex flex-col gap-2">
              {drawerLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setDrawerOpen(false)}
                  className={`px-5 py-3 rounded-full text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/70 hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}