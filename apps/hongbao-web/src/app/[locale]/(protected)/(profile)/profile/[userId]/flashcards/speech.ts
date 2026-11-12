/**
 * Speaks Mandarin text via the browser's built-in Web Speech API - there's no
 * recorded-audio backend, so this is synthesized speech rather than a native
 * speaker's recording.
 */
export const speak = (text: string) => {
  if (!canSpeak()) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
};

export const canSpeak = () =>
  typeof window !== "undefined" && "speechSynthesis" in window;
