'use client';
import { useEffect, useState } from "react"

export default function Home() {

  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!text.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTranslatedText('');
      return;
    }
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
        if (data.translatedText !== undefined) {
          setTranslatedText(data.translatedText);
        }
      } catch (err) {
        console.error("Failed to translate:", err);
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms debounce to avoid spamming requests while typing
    return () => clearTimeout(timer);
  }, [text]);



  return (
    <main className="w-screen h-screen bg-gray-300 flex items-center justify-center p-4 font-mono">
      <div id="container" className="w-full h-full bg-gray-200/60 rounded-xl flex p-4 gap-4 ">

        {/* english text area */}
        <div className="w-1/2 h-full flex flex-col">

           <textarea
            placeholder="Type text in English..."
            className="w-full h-full p-4 border border-black/40 bg-black/60 rounded-lg resize-none outline-none text-white/90"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

        </div>

        {/* spanish translated text area */}
        <div className="w-1/2 h-full">
           <textarea
            readOnly
            placeholder={isLoading ? "Translating..." : "Translation (Spanish)..."}
            className="w-full h-full p-4 border border-black/40 bg-black/60 rounded-lg resize-none outline-none text-white/90"
            value={translatedText}
          />
        </div>

      </div>
    </main>
  )
};
