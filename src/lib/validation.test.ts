import { describe, it, expect } from 'vitest';
import { validateInputs, parseApiResponse } from './validation';

describe('validateInputs', () => {
  it('should return error for empty prompt', () => {
    expect(validateInputs('   ', 'valid_api_key')).toBe("Error: Prompt cannot be empty.");
  });

  it('should return error for missing API key', () => {
    expect(validateInputs('valid prompt', '   ')).toBe("Error: API key is missing. Please provide your Gemini API key (or compatible alternative).");
  });

  it('should return error for short API key', () => {
    expect(validateInputs('valid prompt', 'short')).toBe("Error: The provided API key seems too short. Please provide a valid API key.");
  });

  it('should return null for valid inputs', () => {
    expect(validateInputs('valid prompt', 'valid_api_key_123')).toBeNull();
  });
});

describe('parseApiResponse', () => {
  it('should parse a valid JSON response correctly', () => {
    const jsonStr = JSON.stringify({ script: "import bpy", review: "looks good" });
    const result = parseApiResponse(jsonStr);
    expect(result.script).toBe("import bpy");
    expect(result.review).toBe("looks good");
  });

  it('should throw an error for malformed JSON', () => {
    expect(() => parseApiResponse("definitely not json")).toThrow(/Failed to parse API response/);
  });

  it('should throw an error if the response is missing the script field', () => {
    const jsonStr = JSON.stringify({ review: "looks good, but no script" });
    expect(() => parseApiResponse(jsonStr)).toThrow(/Response is missing the 'script' field/);
  });
  
  it('should throw an error if the parsed JSON is not an object', () => {
    const jsonStr = JSON.stringify("just a string");
    expect(() => parseApiResponse(jsonStr)).toThrow(/Failed to parse API response/);
  });
});
