import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageCircle, Heart, Settings, ShieldCheck } from "lucide-react";
import { useLang } from "@/lib/language";

const NAV_ITEMS = [
  { path: "/", icon: MessageCircle, labelKey: "chat" },
  { path: "/nudges", icon: Heart, labelKey: "nudges" },
  { path: "/settings", icon: Settings, labelKey: "settings" },
  { path: "/about", icon: ShieldCheck, labelKey: "about" },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { t } = useLang();

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-card">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">S</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground leading-tight">Sahaay</h1>
            <p className="text-[10px] text-muted-foreground leading-none">Verified Health Companion</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">{children}</main>

      {/* Bottom nav */}
      <nav className="flex border-t bg-card px-2 pb-safe">
        {NAV_ITEMS.map(({ path, icon: Icon, labelKey }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center flex-1 py-2 gap-0.5 transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{t(labelKey)}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
