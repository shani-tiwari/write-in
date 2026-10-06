


export const speakText = (text: string, lang: string) => {
  if (!text.trim()) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.3;

  window.speechSynthesis.speak(utterance);
};