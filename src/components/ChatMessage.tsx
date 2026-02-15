import ReactMarkdown from "react-markdown";
import { Info } from "lucide-react";
import { useLang } from "@/lib/language";
import { useState } from "react";

interface Props {
  role: "user" | "assistant";
  content: string;
}

export default function ChatMessage({ role, content }: Props) {
  const { t } = useLang();
  const [showInfo, setShowInfo] = useState(false);
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
      <div className={`max-w-[85%] px-4 py-3 ${isUser ? "chat-bubble-user" : "chat-bubble-assistant"}`}>
        {!isUser && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[10px] font-semibold text-primary">✔️ {t("verified")}</span>
            <button onClick={() => setShowInfo(!showInfo)} className="text-muted-foreground hover:text-foreground">
              <Info size={12} />
            </button>
          </div>
        )}
        {!isUser && showInfo && (
          <p className="text-[10px] text-muted-foreground mb-2 bg-muted rounded-md px-2 py-1">
            {t("verifiedInfo")}
          </p>
        )}
        <div className={`text-sm leading-relaxed ${isUser ? "" : "prose prose-sm max-w-none text-card-foreground prose-headings:text-card-foreground prose-strong:text-card-foreground"}`}>
          {isUser ? content : <ReactMarkdown>{content}</ReactMarkdown>}
        </div>
      </div>
    </div>
  );
}
