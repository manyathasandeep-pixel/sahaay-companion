import { Shield, Brain, Lock, Heart } from "lucide-react";
import { useLang } from "@/lib/language";
import AppLayout from "@/components/AppLayout";

export default function About() {
  const { t } = useLang();

  const items = [
    { icon: Shield, title: t("aboutSafety"), color: "gradient-primary" },
    { icon: Brain, title: t("aboutAI"), color: "gradient-calm" },
    { icon: Lock, title: t("aboutPrivacy"), color: "gradient-warm" },
    { icon: Heart, title: t("aboutMission"), color: "gradient-primary" },
  ];

  return (
    <AppLayout>
      <div className="p-4 overflow-y-auto h-full">
        <h2 className="text-xl font-bold text-foreground mb-1">{t("aboutTitle")}</h2>
        <p className="text-sm text-muted-foreground mb-6">{t("noDiagnosis")}</p>

        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-card border animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
                <item.icon size={18} className="text-primary-foreground" />
              </div>
              <p className="text-sm text-foreground leading-relaxed">{item.title}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-primary-foreground">S</span>
          </div>
          <p className="text-xs text-muted-foreground">Sahaay v1.0 — Verified Multilingual Health Companion</p>
          <p className="text-[10px] text-muted-foreground mt-1">Built for accessible health literacy</p>
        </div>
      </div>
    </AppLayout>
  );
}
