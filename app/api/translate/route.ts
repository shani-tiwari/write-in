
import { NextResponse } from "next/server";
// import translate from "google-translate-api";

export async function POST(req: Request) {
  try {
    const { text, to } = await req.json();
    if (!text || typeof text !== "string" || !text.trim() || !to) { 
      return NextResponse.json({ formattedText: "", translatedText: "" });
    }

    const targetLang = encodeURIComponent(to);
    const queryText = encodeURIComponent(text);
    console.log(targetLang, queryText);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${queryText}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google API returned status ${response.status}`);
    };
    
    const data = await response.json();
    // data[0] contains array of translated chunks: [[chunk1, ...], [chunk2, ...]]
    const translatedText = data?.[0]?.map((item: [string]) => item[0]).join("") || "";

    // Split text whenever a dot (.) appears so each sentence starts on a fresh line
    const formattedText = translatedText
      .split(/(?<=\.)(?!\.)\s*/)
      .map((line: string) => line.trim())
      .filter(Boolean)
      .join('\n');
        
    return NextResponse.json({ formattedText, translatedText }, { status: 200 });

  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  };

}
