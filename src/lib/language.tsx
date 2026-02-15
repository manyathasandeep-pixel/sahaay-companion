import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";

type Lang = "en" | "hi" | "ta" | "bn";

const labels: Record<Lang, Record<string, string>> = {
  en: {
    chat: "Chat",
    nudges: "My Wellbeing",
    settings: "Settings",
    about: "About & Safety",
    send: "Send",
    typeMessage: "Type your health question...",
    welcome: "Welcome to Sahaay",
    welcomeSub: "Your verified health information companion",
    login: "Log In",
    signup: "Sign Up",
    email: "Email",
    password: "Password",
    name: "Your Name",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    logout: "Log Out",
    language: "Language",
    markDone: "Mark as Done",
    streak: "day streak",
    emergency: "This may be urgent. Please contact emergency services or a nearby hospital immediately.",
    findHelp: "Find Emergency Help",
    helpline: "Emergency: 112 | Mental Health: iCall 9152987821",
    verified: "Verified Health Information",
    verifiedInfo: "Based on public health guidelines (WHO and national sources).",
    loading: "Loading...",
    noDiagnosis: "Sahaay provides health information only. We do not diagnose.",
    aboutTitle: "About Sahaay",
    aboutMission: "Accessible health literacy for all.",
    aboutPrivacy: "We do not store personal health data beyond your chat history.",
    aboutAI: "Sahaay uses AI to provide verified health information. It is not a replacement for professional medical advice.",
    aboutSafety: "Your safety is our priority. Emergency keywords trigger immediate help prompts.",
  },
  hi: {
    chat: "चैट",
    nudges: "मेरी भलाई",
    settings: "सेटिंग्स",
    about: "जानकारी और सुरक्षा",
    send: "भेजें",
    typeMessage: "अपना स्वास्थ्य प्रश्न लिखें...",
    welcome: "सहाय में आपका स्वागत है",
    welcomeSub: "आपका सत्यापित स्वास्थ्य सूचना साथी",
    login: "लॉग इन",
    signup: "साइन अप",
    email: "ईमेल",
    password: "पासवर्ड",
    name: "आपका नाम",
    noAccount: "कोई खाता नहीं है?",
    hasAccount: "पहले से खाता है?",
    logout: "लॉग आउट",
    language: "भाषा",
    markDone: "पूर्ण",
    streak: "दिन की लगातार",
    emergency: "यह तत्काल हो सकता है। कृपया तुरंत आपातकालीन सेवाओं से संपर्क करें।",
    findHelp: "आपातकालीन सहायता खोजें",
    helpline: "आपातकालीन: 112 | मानसिक स्वास्थ्य: iCall 9152987821",
    verified: "सत्यापित स्वास्थ्य जानकारी",
    verifiedInfo: "सार्वजनिक स्वास्थ्य दिशानिर्देशों पर आधारित (WHO और राष्ट्रीय स्रोत)।",
    loading: "लोड हो रहा है...",
    noDiagnosis: "सहाय केवल स्वास्थ्य जानकारी प्रदान करता है। हम निदान नहीं करते।",
    aboutTitle: "सहाय के बारे में",
    aboutMission: "सभी के लिए सुलभ स्वास्थ्य साक्षरता।",
    aboutPrivacy: "हम आपके चैट इतिहास के अलावा व्यक्तिगत स्वास्थ्य डेटा संग्रहीत नहीं करते।",
    aboutAI: "सहाय सत्यापित स्वास्थ्य जानकारी प्रदान करने के लिए AI का उपयोग करता है।",
    aboutSafety: "आपकी सुरक्षा हमारी प्राथमिकता है।",
  },
  ta: {
    chat: "அரட்டை",
    nudges: "என் நல்வாழ்வு",
    settings: "அமைப்புகள்",
    about: "பற்றி & பாதுகாப்பு",
    send: "அனுப்பு",
    typeMessage: "உங்கள் சுகாதார கேள்வியை தட்டச்சு செய்யுங்கள்...",
    welcome: "சஹாய்க்கு வரவேற்கிறோம்",
    welcomeSub: "உங்கள் சரிபார்க்கப்பட்ட சுகாதார தகவல் தோழர்",
    login: "உள்நுழை",
    signup: "பதிவு",
    email: "மின்னஞ்சல்",
    password: "கடவுச்சொல்",
    name: "உங்கள் பெயர்",
    noAccount: "கணக்கு இல்லையா?",
    hasAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
    logout: "வெளியேறு",
    language: "மொழி",
    markDone: "முடிந்தது",
    streak: "நாள் தொடர்",
    emergency: "இது அவசரமாக இருக்கலாம். உடனடியாக அவசர சேவைகளை தொடர்பு கொள்ளுங்கள்.",
    findHelp: "அவசர உதவி",
    helpline: "அவசரம்: 112 | மனநலம்: iCall 9152987821",
    verified: "சரிபார்க்கப்பட்ட சுகாதார தகவல்",
    verifiedInfo: "பொது சுகாதார வழிகாட்டுதல்களின் அடிப்படையில்.",
    loading: "ஏற்றுகிறது...",
    noDiagnosis: "சஹாய் சுகாதார தகவல்களை மட்டுமே வழங்குகிறது.",
    aboutTitle: "சஹாய் பற்றி",
    aboutMission: "அனைவருக்கும் அணுகக்கூடிய சுகாதார எழுத்தறிவு.",
    aboutPrivacy: "நாங்கள் தனிப்பட்ட சுகாதார தரவை சேமிக்கவில்லை.",
    aboutAI: "சஹாய் AI பயன்படுத்துகிறது.",
    aboutSafety: "உங்கள் பாதுகாப்பே எங்கள் முன்னுரிமை.",
  },
  bn: {
    chat: "চ্যাট",
    nudges: "আমার সুস্থতা",
    settings: "সেটিংস",
    about: "সম্পর্কে ও নিরাপত্তা",
    send: "পাঠান",
    typeMessage: "আপনার স্বাস্থ্য প্রশ্ন লিখুন...",
    welcome: "সহায়-তে স্বাগতম",
    welcomeSub: "আপনার যাচাইকৃত স্বাস্থ্য তথ্য সহচর",
    login: "লগ ইন",
    signup: "সাইন আপ",
    email: "ইমেইল",
    password: "পাসওয়ার্ড",
    name: "আপনার নাম",
    noAccount: "অ্যাকাউন্ট নেই?",
    hasAccount: "ইতিমধ্যে অ্যাকাউন্ট আছে?",
    logout: "লগ আউট",
    language: "ভাষা",
    markDone: "সম্পন্ন",
    streak: "দিনের ধারা",
    emergency: "এটি জরুরি হতে পারে। অনুগ্রহ করে জরুরি সেবায় যোগাযোগ করুন।",
    findHelp: "জরুরি সাহায্য",
    helpline: "জরুরি: 112 | মানসিক স্বাস্থ্য: iCall 9152987821",
    verified: "যাচাইকৃত স্বাস্থ্য তথ্য",
    verifiedInfo: "জনস্বাস্থ্য নির্দেশিকার উপর ভিত্তি করে।",
    loading: "লোড হচ্ছে...",
    noDiagnosis: "সহায় শুধুমাত্র স্বাস্থ্য তথ্য প্রদান করে।",
    aboutTitle: "সহায় সম্পর্কে",
    aboutMission: "সকলের জন্য সুলভ স্বাস্থ্য সাক্ষরতা।",
    aboutPrivacy: "আমরা ব্যক্তিগত স্বাস্থ্য তথ্য সংরক্ষণ করি না।",
    aboutAI: "সহায় AI ব্যবহার করে যাচাইকৃত তথ্য প্রদান করে।",
    aboutSafety: "আপনার নিরাপত্তা আমাদের অগ্রাধিকার।",
  },
};

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangCtx | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("preferred_language")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.preferred_language) setLangState(data.preferred_language as Lang);
      });
  }, [user]);

  const setLang = async (l: Lang) => {
    setLangState(l);
    if (user) {
      await supabase.from("profiles").update({ preferred_language: l }).eq("user_id", user.id);
    }
  };

  const t = (key: string) => labels[lang]?.[key] || labels.en[key] || key;

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
