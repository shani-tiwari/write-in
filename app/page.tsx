'use client';
import { useEffect, useState } from "react";
import Button from "./components/ui/Button";

const MAX_CHARS = 250;

export default function Home() {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!text.trim()) {
      const timer = setTimeout(() => {  // cascading re-renders error --- stop
        setTranslatedText('');
      }, 0);
      return () => clearTimeout(timer);
    }
    if (text.length > MAX_CHARS) { return; }

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            to: "es",
          }),
        });
        const data = await res.json();
        if (data.formattedText !== undefined) {
          // switch to next line for next phrase
          setTranslatedText(data.formattedText);
        }
      } catch (err) {
        console.error("Failed to translate:", err);
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms debounce to avoid spamming requests while typing
    return () => clearTimeout(timer);
  }, [text]);

  // const remainingChars = Math.max(0, MAX_CHARS - text.length);

  return (
    <main className="w-screen h-screen bg-gray-300 flex items-center justify-center p-4">
      <div id="container" className="w-full h-full bg-gray-200/60 rounded-xl flex p-4 gap-4 font-handlee">

        {/* english text area */}
        <div className="w-1/2 h-full flex flex-col relative">
          <textarea
            placeholder="Type text in English..."
            maxLength={MAX_CHARS}
            className="w-full h-full font-caveat border border-black/40 bg-black/60 rounded-lg resize-none outline-none text-white/90 text-xl"
            value={text}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) {
                setText(e.target.value);
              }
            }}
          />
          <div className="absolute bottom-3 right-3 text-sm text-white/60 select-none pointer-events-none">
            {text.length}/{MAX_CHARS}
          </div>
        </div>

        {/* spanish translated text area */}
        <div className="w-1/2 h-full flex flex-col relative">
          <textarea
            readOnly
            placeholder={isLoading ? "Translating..." : "Translation (Spanish)..."}
            className="w-full h-full font-caveat  border border-black/40 bg-black/60 rounded-lg resize-none outline-none text-white/90 text-xl"
            value={translatedText}
          />
          <Button/>
        </div>

      </div>
    </main>
  );
}

