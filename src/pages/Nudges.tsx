import { useState, useEffect } from "react";
import { Droplets, Wind, Footprints, Moon, Monitor, Check, Loader2, Plus, Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/language";
import AppLayout from "@/components/AppLayout";
import { toast } from "sonner";

const NUDGE_TYPES = [
  { type: "water", icon: Droplets, label: "Drink Water", emoji: "💧" },
  { type: "breathing", icon: Wind, label: "5-min Breathing", emoji: "🧘" },
  { type: "walk", icon: Footprints, label: "Take a Walk", emoji: "🚶" },
  { type: "sleep", icon: Moon, label: "Sleep Reminder", emoji: "😴" },
  { type: "screen", icon: Monitor, label: "Screen Break", emoji: "👁️" },
];

interface Nudge {
  id: string;
  nudge_type: string;
  is_done: boolean;
  streak_count: number;
  nudge_date: string;
}

export default function Nudges() {
  const { user } = useAuth();
  const { t } = useLang();
  const [nudges, setNudges] = useState<Nudge[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  const fetchNudges = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("wellbeing_nudges")
      .select("*")
      .eq("user_id", user.id)
      .eq("nudge_date", today);
    setNudges(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchNudges(); }, [user]);

  const createNudge = async (type: string) => {
    if (!user) return;
    const { error } = await supabase.from("wellbeing_nudges").insert({
      user_id: user.id,
      nudge_type: type,
      nudge_date: today,
    });
    if (error) { toast.error("Failed to add nudge"); return; }
    toast.success("Nudge added!");
    fetchNudges();
  };

  const markDone = async (nudge: Nudge) => {
    if (!user || nudge.is_done) return;
    const { error } = await supabase
      .from("wellbeing_nudges")
      .update({
        is_done: true,
        streak_count: nudge.streak_count + 1,
        last_completed_at: new Date().toISOString(),
      })
      .eq("id", nudge.id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success("Great job! 🎉");
    fetchNudges();
  };

  const activeTypes = nudges.map(n => n.nudge_type);
  const availableTypes = NUDGE_TYPES.filter(nt => !activeTypes.includes(nt.type));
  const completedCount = nudges.filter(n => n.is_done).length;

  return (
    <AppLayout>
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground mb-1">{t("nudges")}</h2>
            <p className="text-sm text-muted-foreground">Daily wellness activities</p>
          </div>

          {/* Progress */}
          {nudges.length > 0 && (
            <div className="mb-6 p-4 rounded-2xl bg-card border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">Today's Progress</span>
                <span className="text-sm font-bold text-primary">{completedCount}/{nudges.length}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full gradient-primary transition-all duration-500"
                  style={{ width: `${nudges.length > 0 ? (completedCount / nudges.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={28} />
            </div>
          ) : (
            <>
              {/* Active nudges */}
              <div className="space-y-3 mb-6">
                {nudges.map(nudge => {
                  const typeInfo = NUDGE_TYPES.find(nt => nt.type === nudge.nudge_type);
                  if (!typeInfo) return null;
                  const Icon = typeInfo.icon;
                  return (
                    <div
                      key={nudge.id}
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                        nudge.is_done ? "bg-primary/5 border-primary/20" : "bg-card"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        nudge.is_done ? "gradient-primary" : "bg-muted"
                      }`}>
                        {nudge.is_done ? (
                          <Check size={18} className="text-primary-foreground" />
                        ) : (
                          <Icon size={18} className="text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${nudge.is_done ? "text-primary" : "text-foreground"}`}>
                          {typeInfo.emoji} {typeInfo.label}
                        </p>
                        {nudge.streak_count > 0 && (
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Flame size={10} className="text-accent" /> {nudge.streak_count} {t("streak")}
                          </p>
                        )}
                      </div>
                      {!nudge.is_done && (
                        <button
                          onClick={() => markDone(nudge)}
                          className="px-3 py-1.5 rounded-lg gradient-primary text-primary-foreground text-xs font-semibold"
                        >
                          {t("markDone")}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add nudges */}
              {availableTypes.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Add a nudge for today</p>
                  <div className="flex flex-wrap gap-2">
                    {availableTypes.map(nt => (
                      <button
                        key={nt.type}
                        onClick={() => createNudge(nt.type)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card border text-xs font-medium text-foreground hover:border-primary/40 transition-colors"
                      >
                        <Plus size={12} className="text-primary" />
                        {nt.emoji} {nt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {nudges.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl gradient-warm flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">Start your wellness journey</p>
                  <p className="text-xs text-muted-foreground">Add a nudge above to begin</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
