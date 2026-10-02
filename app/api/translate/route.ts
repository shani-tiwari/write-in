
import { NextResponse } from "next/server";
// import translate from "google-translate-api";

export async function POST(req: Request) {
  try {
    const { text, to = 'es' } = await req.json();
    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ translatedText: "" });
    }

    const targetLang = encodeURIComponent(to);
    const queryText = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${queryText}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google API returned status ${response.status}`);
    };
    
    const data = await response.json();
    // data[0] contains array of translated chunks: [[chunk1, ...], [chunk2, ...]]
    const translatedText = data?.[0]?.map((item: [string]) => item[0]).join("") || "";
    return NextResponse.json({ translatedText });

  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  };

}
