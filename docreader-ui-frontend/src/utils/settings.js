export const DEFAULT_SETTINGS = {
  topK: 5,
  minSimilarity: 0.0,
  stream: true,
};

export function getStoredSettings() {
  try {
    const stored = localStorage.getItem('docreader_settings');
    if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {
    // Ignore storage errors
  }
  return DEFAULT_SETTINGS;
}
