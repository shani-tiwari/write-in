'use client';

export interface Language {
  code: string;
  label: string;
  speak?: string;
}

export const languages: Language[] = [
  { code: "es", label: "Spanish", speak: "es-ES" },
  { code: "fr", label: "French", speak: "fr-FR" },
  { code: "de", label: "German", speak: "de-DE" },
  // { code: "en", label: "English" },
  // { code: "ja", label: "Japanese", speak: "ja-JP" },
];

interface LanguagesProps {
  languages?: Language[];
  targetLanguage: string;
  onSelectLanguage?: (code: string) => void;
  setTargetLanguage?: (code: string) => void;
  className?: string;
}

export default function Languages({
  languages: languageList = languages,
  targetLanguage,
  onSelectLanguage,
  setTargetLanguage,
  className = "flex items-center gap-4",
}: LanguagesProps) {

  function handleLanguageClick(code: string) {
    if (onSelectLanguage) {
      onSelectLanguage(code);
    } else if (setTargetLanguage) {
      setTargetLanguage(code);
    }
  }

  return (
    <div className={className}>
      {languageList.map((language) => (
        <button
          key={language.code}
          type="button"
          onClick={() => handleLanguageClick(language.code)}
          className={`px-2 md:px-3 py-0.5 rounded-lg transition-colors text-xs md:text-base cursor-pointer ${
            language.code === targetLanguage
              ? "bg-black/80 text-white" // Active state: Darker background, white text
              : "bg-black/40 text-white/70 hover:bg-black/60 hover:text-white/90"
          }`}
        >
          {language.label}
        </button>
      ))}
    </div>
  );
}
