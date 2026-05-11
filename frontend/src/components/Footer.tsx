import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/proworld-logo.png";

export default function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="responsive-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* 🔥 Logo + About */}
          <div className="space-y-4">
            <Link to="/">
  <h2 className="text-2xl font-bold text-white cursor-pointer transition hover:scale-105 drop-shadow-[0_0_15px_rgba(255,255,255,1)]">
    ProWorld
  </h2>
</Link>

            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Leading IT services and training company helping students build real-world skills.
            </p>
          </div>

          {/* 🔥 Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "About", path: "/about" },
                { label: "Services", path: "/services" },
                { label: "Internship", path: "/internship" },
                { label: "Careers", path: "/careers" },
              ].map((l) => (
                <Link
                  key={l.path}
                  to={l.path}
                  className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 🔥 More */}
          <div>
            <h4 className="font-semibold text-lg mb-4">More</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "Features", path: "/features" },
                { label: "Works", path: "/works" },
                { label: "Contact", path: "/contact" },
              ].map((l) => (
                <Link
                  key={l.path}
                  to={l.path}
                  className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 🔥 Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <div className="flex flex-col gap-3 text-sm text-primary-foreground/70">

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  ProWorld Technology, T-3, SK Open Mall,<br />
                  B.Y. College Rd, Above Puma Showroom,<br />
                  Nashik, Maharashtra
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <a href="tel:+919561702030" className="hover:underline">
                  +91 9561702030
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <a href="mailto:info@proworldtech.com" className="hover:underline">
                  info@proworldtech.com
                </a>
              </div>


            </div>
          </div>
        </div>

        {/* 🔥 Bottom */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} ProWorld Technology. All rights reserved.
        </div>
      </div>
    </footer>
  );
}