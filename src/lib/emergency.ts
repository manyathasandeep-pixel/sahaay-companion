const EMERGENCY_KEYWORDS = [
  "chest pain", "suicide", "kill myself", "want to die", "severe bleeding",
  "trouble breathing", "can't breathe", "heart attack", "stroke", "unconscious",
  "overdose", "poisoning", "सीने में दर्द", "आत्महत्या", "सांस लेने में तकलीफ",
  "மார்பு வலி", "தற்கொலை", "மூச்சுத் திணறல்", "বুকে ব্যথা", "আত্মহত্যা", "শ্বাসকষ্ট",
];

export function detectEmergency(text: string): boolean {
  const lower = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some(kw => lower.includes(kw));
}
