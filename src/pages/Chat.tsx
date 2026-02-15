import { useState, useEffect, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/language";
import { streamChat } from "@/lib/streamChat";
import { detectEmergency } from "@/lib/emergency";
import ChatMessage from "@/components/ChatMessage";
import EmergencyBanner from "@/components/EmergencyBanner";
import AppLayout from "@/components/AppLayout";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

export default function Chat() {
  const { user } = useAuth();
  const { lang, t } = useLang();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showEmergency, setShowEmergency] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load chat history
  useEffect(() => {
    if (!user) return;
    supabase
      .from("chat_messages")
      .select("role, content")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data.map(m => ({ role: m.role as "user" | "assistant", content: m.content })));
        setInitialLoading(false);
      });
  }, [user]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !user) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    setInput("");
    setMessages(prev => [...prev, userMsg]);

    // Save user message
    await supabase.from("chat_messages").insert({
      user_id: user.id,
      role: "user",
      content: userMsg.content,
      language: lang,
    });

    // Emergency check
    if (detectEmergency(userMsg.content)) {
      setShowEmergency(true);
    }

    setIsLoading(true);
    let assistantContent = "";

    await streamChat({
      messages: [...messages, userMsg].slice(-20), // last 20 for context
      language: lang,
      onDelta: (chunk) => {
        assistantContent += chunk;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && prev.length > 0 && prev[prev.length - 2]?.content === userMsg.content) {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
          }
          return [...prev, { role: "assistant", content: assistantContent }];
        });
      },
      onDone: async () => {
        setIsLoading(false);
        if (assistantContent) {
          await supabase.from("chat_messages").insert({
            user_id: user!.id,
            role: "assistant",
            content: assistantContent,
            language: lang,
          });
        }
      },
      onError: (err) => {
        setIsLoading(false);
        toast.error(err);
      },
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        {showEmergency && <EmergencyBanner onDismiss={() => setShowEmergency(false)} />}

        {/* Messages area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
          {initialLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin text-primary" size={28} />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-20 h-20 rounded-2xl gradient-calm flex items-center justify-center mb-4">
                <span className="text-3xl">🩺</span>
              </div>
              <h2 className="text-lg font-bold text-foreground mb-1">{t("welcome")}</h2>
              <p className="text-sm text-muted-foreground max-w-xs">{t("welcomeSub")}</p>
              <p className="text-[10px] text-muted-foreground mt-3 max-w-xs">{t("noDiagnosis")}</p>
            </div>
          ) : (
            messages.map((msg, i) => <ChatMessage key={i} role={msg.role} content={msg.content} />)
          )}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex justify-start">
              <div className="chat-bubble-assistant px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft [animation-delay:200ms]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft [animation-delay:400ms]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-3 pb-3 pt-1">
          <form
            onSubmit={e => { e.preventDefault(); sendMessage(); }}
            className="flex items-center gap-2 bg-card border rounded-2xl px-3 py-2"
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t("typeMessage")}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center disabled:opacity-40 transition-opacity"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin text-primary-foreground" />
              ) : (
                <Send size={16} className="text-primary-foreground" />
              )}
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
