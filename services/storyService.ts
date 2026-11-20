export interface StoryData {
  _id?: string;
  story?: string;
  title?: string;
  author?: string;
  moral?: string;
}

export interface StoryResponse {
  story?: StoryData;
  message?: string;
}

// Module-level cache and in-flight promise to prevent duplicate API requests
let inFlightStoryPromise: Promise<StoryResponse> | null = null;
let cachedStory: StoryResponse | null = null;

/**
 * Fetches the daily short story.
 * Deduplicates concurrent/React StrictMode calls and caches the result
 * so only a single network request happens.
 */
export async function storyService(forceRefresh = false): Promise<StoryResponse> {
  if (forceRefresh) {
    cachedStory = null;
    inFlightStoryPromise = null;
  }

  // Return cached result if already fetched
  if (cachedStory) {
    return cachedStory;
  }

  // Deduplicate concurrent or React StrictMode double calls: reuse in-flight promise
  if (inFlightStoryPromise) {
    return inFlightStoryPromise;
  }

  inFlightStoryPromise = fetch("/api/story")
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Story Service request failed with status ${response.status}`);
      }
      const data = (await response.json()) as StoryResponse;
      cachedStory = data;
      return data;
    })
    .catch((err) => {
      cachedStory = null;
      throw err;
    })
    .finally(() => {
      inFlightStoryPromise = null;
    });

  return inFlightStoryPromise;
}

/**
 * Reset the story cache if manual refresh is needed.
 */
export function resetStoryCache(): void {
  cachedStory = null;
  inFlightStoryPromise = null;
}
