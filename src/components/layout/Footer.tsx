import { Mail, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import CurvedLoop from "@/components/CurvedLoop";

const Footer = () => {
  const currentYear = new Date().getFullYear();



  return (
    <footer className="bg-slate-950 text-slate-200 border-t border-slate-800 relative overflow-hidden">
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20 overflow-hidden">
                <img alt="ResumeR" src="/LOGO.png" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                ResumeR
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              AI-powered resume builder that creates ATS-friendly resumes in
              minutes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Platform</h3>
            <ul className="space-y-2 text-sm">
              {["Home", "Templates", "Builder", "Documentation"].map((item) => (
                <li key={item}>
                  <Link
                    to={
                      item === "Home"
                        ? "/"
                        : item === "Documentation"
                          ? "#"
                          : `/${item.toLowerCase()}`
                    }
                    className="text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/ShaikhWarsi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-400 transition-colors"
                >
                  Github
                </a>
              </li>
              <li>
                <a
                  href="mailto:axeeddis@gmail.com"
                  className="flex items-center space-x-2 text-slate-400 hover:text-blue-400 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-slate-800 my-6" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-center">
          <div className="text-slate-500 text-sm">
            <span>&copy; {currentYear} Team Rocket. All rights reserved.</span>
          </div>
          <span className="hidden md:inline text-slate-700">•</span>
          <div className="text-slate-500 text-sm flex items-center justify-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> by
            Team Rocket
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
