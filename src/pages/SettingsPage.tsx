import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/language";
import AppLayout from "@/components/AppLayout";
import { LogOut, Globe } from "lucide-react";
import { toast } from "sonner";

const LANGUAGES = [
  { code: "en" as const, label: "English", native: "English" },
  { code: "hi" as const, label: "Hindi", native: "हिन्दी" },
  { code: "ta" as const, label: "Tamil", native: "தமிழ்" },
  { code: "bn" as const, label: "Bengali", native: "বাংলা" },
];

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { lang, setLang, t } = useLang();

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out");
  };

  return (
    <AppLayout>
      <div className="p-4 overflow-y-auto h-full">
        <h2 className="text-xl font-bold text-foreground mb-6">{t("settings")}</h2>

        {/* Language */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Globe size={16} className="text-primary" />
            <span className="text-sm font-semibold text-foreground">{t("language")}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); toast.success(`Language set to ${l.label}`); }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  lang === l.code
                    ? "border-primary bg-primary/5"
                    : "bg-card hover:border-primary/30"
                }`}
              >
                <p className="text-sm font-semibold text-foreground">{l.native}</p>
                <p className="text-[10px] text-muted-foreground">{l.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Account */}
        <div className="mb-6 p-4 rounded-2xl bg-card border">
          <p className="text-xs text-muted-foreground mb-1">Signed in as</p>
          <p className="text-sm font-semibold text-foreground">{user?.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-destructive/30 text-destructive text-sm font-semibold hover:bg-destructive/5 transition-colors"
        >
          <LogOut size={16} />
          {t("logout")}
        </button>
      </div>
    </AppLayout>
  );
}
