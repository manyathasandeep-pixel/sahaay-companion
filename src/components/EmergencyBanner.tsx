import { AlertTriangle, Phone } from "lucide-react";
import { useLang } from "@/lib/language";

export default function EmergencyBanner({ onDismiss }: { onDismiss: () => void }) {
  const { t } = useLang();

  return (
    <div className="mx-3 my-2 p-4 rounded-xl bg-destructive/10 border border-destructive/30 animate-fade-in">
      <div className="flex items-start gap-3">
        <AlertTriangle className="text-destructive shrink-0 mt-0.5" size={22} />
        <div className="flex-1">
          <p className="text-sm font-semibold text-destructive mb-1">🚨 {t("emergency")}</p>
          <p className="text-xs text-muted-foreground mb-3">{t("helpline")}</p>
          <div className="flex gap-2">
            <a
              href="tel:112"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-semibold"
            >
              <Phone size={14} />
              {t("findHelp")}
            </a>
            <button
              onClick={onDismiss}
              className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
