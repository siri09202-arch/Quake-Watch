/**
 * Data processing utilities for earthquake information
 */

import { EarthquakeRaw, QuakeHistoryItem, MapMarker, Epicenter } from "../types/earthquake";

/**
 * Transform raw P2PQuake API data to our internal format
 */
export function processEarthquakeData(raw: EarthquakeRaw): QuakeHistoryItem | null {
  if (!raw.earthquake) {
    return null;
  }

  const hypocenter = raw.earthquake.hypocenter;
  const intensity = raw.earthquake.intensity;

  const epicenter: Epicenter = {
    latitude: hypocenter.latitude,
    longitude: hypocenter.longitude,
    depth: hypocenter.depth,
    magnitude: hypocenter.magnitude,
    name: hypocenter.name,
  };

  const maxIntensity =
    intensity.appendix?.maxInt ?? intensity.forecastMaxInt ?? 0;

  const areas = raw.earthquake.intensity.appendix?.regions
    ? flattenIntensityData(raw.earthquake.intensity.appendix.regions)
    : [];

  const item: QuakeHistoryItem = {
    id: parseInt(raw.code) || 0,
    time: raw.time,
    epicenter,
    maxIntensity,
    tsunami: {
      status: raw.tsunami?.status || "Unknown",
    },
    areas,
    isEEW: raw.eew?.alertstatus === "発表" || false,
    isLatest: false,
  };

  return item;
}

/**
 * Flatten nested intensity region data
 */
function flattenIntensityData(
  regions: any[]
): Array<{ pref: string; intensity: number; area?: string }> {
  const flattened: Array<{ pref: string; intensity: number; area?: string }> = [];

  regions.forEach((region) => {
    // Add prefecture-level data
    flattened.push({
      pref: region.name,
      intensity: region.maxInt,
    });

    // Add city-level data if available
    if (region.cities && Array.isArray(region.cities)) {
      region.cities.forEach((city: any) => {
        if (city.maxInt > 0) {
          flattened.push({
            pref: region.name,
            area: city.name,
            intensity: city.maxInt,
          });
        }
      });
    }
  });

  return flattened;
}

/**
 * Convert QuakeHistoryItem to map markers
 */
export function createMapMarkers(quake: QuakeHistoryItem): MapMarker[] {
  const markers: MapMarker[] = [];

  // Add epicenter marker
  markers.push({
    id: quake.id,
    latitude: quake.epicenter.latitude,
    longitude: quake.epicenter.longitude,
    intensity: quake.maxIntensity,
    magnitude: quake.epicenter.magnitude,
    time: quake.time,
    isEpicenter: true,
    prefName: quake.epicenter.name,
  });

  // Add intensity point markers for each area
  quake.areas.forEach((area, index) => {
    // Only add unique area markers, not prefecture aggregates
    if (area.area) {
      markers.push({
        id: `${quake.id}-area-${index}`,
        latitude: 0, // Would need geocoding service to get actual coordinates
        longitude: 0,
        intensity: area.intensity,
        prefName: `${area.pref} ${area.area}`,
      });
    }
  });

  return markers;
}

/**
 * Format epicenter name for display
 */
export function formatEpicenterName(name: string): string {
  // Remove Japanese punctuation and clean up
  return name.replace(/\s+/g, " ").trim();
}

/**
 * Calculate time elapsed since earthquake
 */
export function getTimeElapsed(isoTime: string): string {
  const time = new Date(isoTime);
  const now = new Date();
  const diffMs = now.getTime() - time.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return `${diffSeconds}秒前`;
  } else if (diffMinutes < 60) {
    return `${diffMinutes}分前`;
  } else if (diffHours < 24) {
    return `${diffHours}時間前`;
  } else {
    return `${diffDays}日前`;
  }
}

/**
 * Sort earthquakes by recency (newest first)
 */
export function sortByRecency(
  quakes: QuakeHistoryItem[]
): QuakeHistoryItem[] {
  return [...quakes].sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  );
}

/**
 * Filter earthquakes by minimum magnitude
 */
export function filterByMagnitude(
  quakes: QuakeHistoryItem[],
  minMagnitude: number
): QuakeHistoryItem[] {
  return quakes.filter((q) => q.epicenter.magnitude >= minMagnitude);
}

/**
 * Filter earthquakes by time range
 */
export function filterByTimeRange(
  quakes: QuakeHistoryItem[],
  hours: number
): QuakeHistoryItem[] {
  const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
  return quakes.filter((q) => new Date(q.time) > cutoffTime);
}

/**
 * Calculate bounding box for map from markers
 */
export function calculateBoundingBox(
  markers: MapMarker[]
): [[number, number], [number, number]] {
  if (markers.length === 0) {
    // Default to Japan
    return [
      [24, 123],
      [46, 145],
    ];
  }

  let minLat = Infinity,
    maxLat = -Infinity;
  let minLng = Infinity,
    maxLng = -Infinity;

  markers.forEach((m) => {
    minLat = Math.min(minLat, m.latitude);
    maxLat = Math.max(maxLat, m.latitude);
    minLng = Math.min(minLng, m.longitude);
    maxLng = Math.max(maxLng, m.longitude);
  });

  // Add padding
  const latPadding = (maxLat - minLat) * 0.1 || 1;
  const lngPadding = (maxLng - minLng) * 0.1 || 1;

  return [
    [minLat - latPadding, minLng - lngPadding],
    [maxLat + latPadding, maxLng + lngPadding],
  ];
}
