/**
 * Color mapping utilities for seismic intensity levels
 * Based on JMA seismic intensity scale (0-7)
 */

// Intensity level: 0, 1, 2, 3, 4, 5-, 5+, 6-, 6+, 7
export const INTENSITY_COLORS: Record<number | string, string> = {
  "-1": "#808080", // Not yet determined - Gray
  "0": "#00FFFF",  // Intensity 0 - Cyan
  "1": "#0099FF",  // Intensity 1 - Light Blue
  "2": "#00CC00",  // Intensity 2 - Light Green
  "3": "#FFFF00",  // Intensity 3 - Yellow
  "4": "#FF9900",  // Intensity 4 - Orange
  "5": "#FF6600",  // Intensity 5- - Dark Orange
  "5.5": "#FF3300", // Intensity 5+ - Red-Orange
  "6": "#FF0000",  // Intensity 6- - Red
  "6.5": "#990000", // Intensity 6+ - Dark Red
  "7": "#660066",  // Intensity 7 - Purple (Maximum)
};

export const INTENSITY_LABELS: Record<number | string, string> = {
  "-1": "未定",
  "0": "0 (感じない)",
  "1": "1 (かすかに感じる)",
  "2": "2 (弱い)",
  "3": "3 (弱～中程度)",
  "4": "4 (中程度～強い)",
  "5": "5- (強い)",
  "5.5": "5+ (非常に強い)",
  "6": "6- (非常に強い)",
  "6.5": "6+ (非常に強い)",
  "7": "7 (激震)",
};

/**
 * Convert numeric intensity to color
 * @param intensity - Numeric intensity value (0-7 or -1 for unknown)
 * @returns Hex color code
 */
export function getIntensityColor(intensity: number | undefined): string {
  if (intensity === undefined || intensity === null) {
    return INTENSITY_COLORS["-1"];
  }

  // Handle decimal intensity (5-, 5+, 6-, 6+)
  if (intensity >= 5 && intensity < 6) {
    if (intensity < 5.5) {
      return INTENSITY_COLORS["5"];
    } else {
      return INTENSITY_COLORS["5.5"];
    }
  }

  if (intensity >= 6 && intensity < 7) {
    if (intensity < 6.5) {
      return INTENSITY_COLORS["6"];
    } else {
      return INTENSITY_COLORS["6.5"];
    }
  }

  return INTENSITY_COLORS[Math.floor(intensity)] || INTENSITY_COLORS["-1"];
}

/**
 * Get intensity label string
 * @param intensity - Numeric intensity value
 * @returns Japanese label
 */
export function getIntensityLabel(intensity: number | undefined): string {
  if (intensity === undefined || intensity === null) {
    return INTENSITY_LABELS["-1"];
  }

  return INTENSITY_LABELS[Math.floor(intensity)] || INTENSITY_LABELS["-1"];
}

/**
 * Tsunami status to color mapping
 */
export const TSUNAMI_COLORS: Record<string, string> = {
  "None": "#00FF00",        // Green - No tsunami
  "Unknown": "#FFFF00",     // Yellow - Unknown
  "Checking": "#FFA500",    // Orange - Checking
  "NonTsunami": "#00FF00",  // Green - No tsunami
  "Tsunami": "#FF0000",     // Red - Tsunami
  "MajorTsunami": "#8B0000", // Dark Red - Major tsunami
};

/**
 * Tsunami status to Japanese label mapping
 */
export const TSUNAMI_LABELS: Record<string, string> = {
  "None": "津波なし",
  "Unknown": "不明",
  "Checking": "調査中",
  "NonTsunami": "津波なし",
  "Tsunami": "津波発生",
  "MajorTsunami": "大津波",
};

export function getTsunamiColor(status: string | undefined): string {
  return TSUNAMI_COLORS[status || "Unknown"] || TSUNAMI_COLORS["Unknown"];
}

export function getTsunamiLabel(status: string | undefined): string {
  return TSUNAMI_LABELS[status || "Unknown"] || TSUNAMI_LABELS["Unknown"];
}
