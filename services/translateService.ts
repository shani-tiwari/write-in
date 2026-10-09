export interface TranslationResponse {
  formattedText?: string;
  translatedText?: string;
  error?: string;
}

const RATE_LIMIT_MS = 1000;
let lastRequestTime = 0;

/**
 * Translates text with a 2000ms rate-limit using JavaScript Date and time methods.
 * Ensures subsequent requests wait if invoked within 2000ms of the previous call.
 */
export async function translateText(
  text: string,
  to: string,
  signal?: AbortSignal
): Promise<TranslationResponse> {

  const currentTime = new Date().getTime();
  const timeElapsed = currentTime - lastRequestTime;

  if (timeElapsed < RATE_LIMIT_MS) {

    const delay = RATE_LIMIT_MS - timeElapsed;

    await new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, delay);
      if (signal) {
        signal.addEventListener("abort", () => {
          clearTimeout(timer);
          reject(new DOMException("Aborted", "AbortError"));
        });
      }
    });

  }

  // Update the last request timestamp using JS Date
  lastRequestTime = new Date().getTime();

  const response = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, to }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Translation request failed with status ${response.status}`);
  }

  return response.json();
};
