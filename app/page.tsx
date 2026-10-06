'use client';
import { useEffect, useState } from "react";
import Button from "./components/ui/Button";
import { translateText } from "@/services/translateService";
import { HugeiconsIcon } from "@hugeicons/react";
import { Instagram, Twitter } from '@hugeicons/core-free-icons';
import Link from "next/link";

// import { speakText } from "@/services/speakService";

const MAX_CHARS = 250;
const languages = [
  // { code: "en", label: "English" },
  { code: "es", label: "Spanish", speak: "es-ES" },
  { code: "fr", label: "French", speak: "fr-FR" },
  { code: "de", label: "German", speak: "de-DE" },
  { code: "ja", label: "Japanese", speak: "ja-JP" },
];


export default function Home() {
  
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("es");

  function toggleLoading(flag: boolean){
    setIsLoading(flag)
  };

  useEffect(() => {
    if (!text.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTranslatedText('');
      toggleLoading(false);
      return;
    }
    if (text.length > MAX_CHARS) { return; }

    const abortController = new AbortController();
    toggleLoading(true);

    translateText(
      text, 
      targetLanguage, 
      abortController.signal
    )
      .then((data) => {
        if (data.formattedText !== undefined) {
          setTranslatedText(data.formattedText);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to translate:", err);
        }
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          toggleLoading(false);
        }
      });

    return () => { abortController.abort() };
  }, [text, targetLanguage]);


  return (
    <main className="w-screen h-screen bg-gray-300 flex items-center justify-center md:p-4 select-none">
      <div id="container" className="w-full h-full bg-gray-200/60 rounded-xl flex flex-col p-2 md:p-4 gap-2 md:gap-4 font-handlee">

        <header className="flex gap-6 justify-around items-center text-xs md:text-base text-black/80 font-merienda">
          <h1 className=" bg-white">
            Write what you think. 
          </h1>
          <p className="hidden md:block bg-white">
            Your thoughts, translated into your next language.
          </p>
          <span className="bg-white">
            Learn how to say it. 
          </span>
        </header>

        {/* languages options */}
        <div className="relative flex w-full md:justify-center items-center gap-2 md:gap-3 ">
          {
            languages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  if (text.trim()) {
                    setTranslatedText("");
                  }
                  setTargetLanguage(language.code);
                }}
                className={`px-2 md:px-3 py-0.5 rounded-lg transition-colors text-xs md:text-base ${
                  language.code === targetLanguage
                    ? "bg-black/80 text-white" // Active state: Darker background, white text
                    : "bg-black/40 text-white/70 hover:bg-black/60 hover:text-white/90"
                }`}
              >
                {language.label}
              </button>
            ))
          }
          <div className="socials absolute right-0  flex md:gap-4 ">
            <Link href='https://x.com/shanidevelops' target="_blank">
              <HugeiconsIcon icon={Twitter} size={22} className="text-black/50" />
            </Link>

            <Link href='https://instagram.com/shani.develops' target="_blank">
              <HugeiconsIcon icon={Instagram} size={22} className="text-black/50" />
            </Link>
          </div>
        </div>

        <div className="flex md:flex-row flex-col justify-between w-full h-full gap-1.5 md:gap-4 md:text-xl">

          {/* english text area */}
          <div className="w-full md:w-1/2 h-full flex flex-col relative">
            <textarea
              placeholder="what's in your mind today ?"
              maxLength={MAX_CHARS}
              className="w-full h-full px-2 py-4 md:p-4 font-caveat border-2 border-black/30 bg-white/10 rounded-lg resize-none outline-none text-black"
              value={text}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) {
                  setText(e.target.value);
                }
              }}
            />
            <div className="absolute bottom-3 right-3 text-sm text-black/70 bg-white/80 leading-5 select-none pointer-events-none">
              {text.length}/{MAX_CHARS}
            </div>
          </div>

          {/* spanish translated text area */}
          <div className="w-full md:w-1/2 h-full flex flex-col relative">

            <textarea
              readOnly
              placeholder={isLoading ? "Translating..." : "you didn't write anything yet 🫠"}
              className="w-full h-full px-2 py-4 md:p-4 font-caveat  border-2 border-black/30 bg-white/10 rounded-lg resize-none outline-none text-black/80"
              value={translatedText}
            />

            {/* <div className="absolute top-14 right-3 w-fit h-fit">
              <button onClick={() => speakText(translatedText, languages.find((l) => l.code === targetLanguage)?.speak || "en-ES" )}>
                🔊 
              </button>
            </div> */}

            <div className="absolute top-3 right-3 w-fit h-fit">
              <Button textToCopy={translatedText} />
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}

