'use client';
import { useEffect, useState } from "react";
import Button from "./components/ui/Button";
import SaveButton from "./components/save_data/SaveButton";
import { translateText } from "@/services/translateService";
import { HugeiconsIcon } from "@hugeicons/react";
import { Instagram, Twitter, Bookmark01Icon } from '@hugeicons/core-free-icons';
import Link from "next/link";

// import { speakText } from "@/services/speakService";

const MAX_CHARS = 500;
const languages = [
  // { code: "en", label: "English" },
  { code: "es", label: "Spanish", speak: "es-ES" },
  { code: "fr", label: "French", speak: "fr-FR" },
  { code: "de", label: "German", speak: "de-DE" },
  // { code: "ja", label: "Japanese", speak: "ja-JP" },
];


export default function Home() {
  
  const [text, setText] = useState('I am thinking about -');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("es");

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {setIsMobile(window.innerWidth < 768)};
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

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

  // Move the conditional return below all your hooks. 
  if (isMobile) return <NotAvailable/>

  return (
    <main className="w-screen h-screen bg-gray-300 flex items-center justify-center select-none">
      <div id="container" className="w-full h-full bg-gray-200/60 rounded-xl flex flex-col p-2 md:p-4 gap-2 md:gap-4 font-handlee">

        <header className="flex gap-6 justify-around items-center text-xs md:text-base text-black/80 font-merienda">
          <h1 className=" bg-white">
            Write what you think. 
          </h1>
          <p className="hidden md:block bg-white">
            Your thoughts, translated into selected language.
          </p>
          <span className="bg-white">
            Learn how to say it. 
          </span>
        </header>

        {/* Navigation & languages options */}
        <div className="relative flex w-full justify-between md:justify-center items-center gap-2 md:gap-3">
          <div className="md:absolute left-0 flex items-center">
            <Link
              href="/saved"
              className="px-2 md:px-3 py-0.5 rounded-lg transition-colors text-xs md:text-base bg-black/80 text-white hover:bg-black flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Saved Entries"
            >
              <HugeiconsIcon icon={Bookmark01Icon} size={16} />
              <span>Saved</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
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
          </div>

          <div className="socials absolute right-0 flex gap-2 md:gap-4">
            <Link href='https://x.com/shanidevelops' target="_blank">
              <HugeiconsIcon icon={Twitter} size={22} className="text-black/50" />
            </Link>

            <Link href='https://instagram.com/shani.develops' target="_blank">
              <HugeiconsIcon icon={Instagram} size={22} className="text-black/50" />
            </Link>
          </div>
        </div>

        <div className="flex md:flex-row flex-col justify-between w-full h-full gap-1.5 md:text-xl">

          {/* english text area */}
          <div className="w-full md:w-1/2 h-full flex flex-col relative">
            <textarea
              placeholder="what's in your mind today ?"
              maxLength={MAX_CHARS}
              className="w-full h-full px-2 py-4 md:p-4 font-caveat border border-black/30 bg-white/10 rounded-lg resize-none outline-none text-black"
              value={text}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) {
                  setText(e.target.value);
                }
              }}
            />
            <div className="absolute bottom-3 right-3 text-sm text-white bg-black/80 leading-5 select-none pointer-events-none">
              {text.length}/{MAX_CHARS}
            </div>
          </div>

          {/* spanish translated text area */}
          <div className="w-full md:w-1/2 h-full flex flex-col relative ">

            <textarea
              readOnly
              placeholder={isLoading ? "Translating..." : "you didn't write anything yet you didn't  🫠"}
              className="w-full h-full px-2 py-4 md:py-4 md:pr-14 font-caveat  border border-black/30 bg-white/10 rounded-lg resize-none outline-none text-black/80"
              value={translatedText}
            />

            {/* <div className="absolute top-14 right-3 w-fit h-fit">
              <button onClick={() => speakText(translatedText, languages.find((l) => l.code === targetLanguage)?.speak || "en-ES" )}>
                🔊 
              </button>
            </div> */}

            <div className="absolute -top-1 -right-1 md:top-2 md:right-2 w-fit h-fit flex items-center gap-2">
              <SaveButton text={text} translated={translatedText} />
              <Button textToCopy={translatedText} />
            </div>

          </div>

        </div>

      </div>
    </main>
  );
};

function NotAvailable(){
  return (
    <div className="w-full h-screen flex items-center justify-center"><p className="text-3xl">Not Available for phones, Currently.</p></div>
  );
}

