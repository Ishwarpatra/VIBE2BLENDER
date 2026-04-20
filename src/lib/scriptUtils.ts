export function cleanPythonScript(rawScript: string): string {
  if (!rawScript) return '';
  
  let cleaned = rawScript.trim();
  
  // Remove starting ```python or ```py or ```
  cleaned = cleaned.replace(/^```(python|py)?\s*/gi, '');
  
  // Remove trailing ```
  cleaned = cleaned.replace(/\s*```$/g, '');
  
  return cleaned.trim();
}
