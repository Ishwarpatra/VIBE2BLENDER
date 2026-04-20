export function validateInputs(vibe: string, apiKey: string): string | null {
  if (!vibe.trim()) {
    return "Error: Prompt cannot be empty.";
  }
  const trimmedKey = apiKey.trim();
  if (!trimmedKey) {
    return "Error: API key is missing. Please provide your Gemini API key (or compatible alternative).";
  }
  if (trimmedKey.length < 10) {
    return "Error: The provided API key seems too short. Please provide a valid API key.";
  }
  return null;
}

export function parseApiResponse(jsonStr: string): { script: string, review: string } {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error("Invalid response format");
    }
    if (!parsed.script) {
      throw new Error("Response is missing the 'script' field");
    }
    return {
      script: parsed.script || "",
      review: parsed.review || ""
    };
  } catch (e: any) {
    throw new Error("Failed to parse API response: " + e.message);
  }
}
