/**
 * Type definitions for earthquake data from P2PQuake API
 */

export interface EarthquakeInfo {
  id: number;
  time: string; // ISO 8601 format
  earthquake: {
    originTime: string;
    hypocenterCode: number;
    maxIntensity: number | null;
    minIntensity: number | null;
  };
  eew?: {
    status: string;
    reportNum: number;
    reportTime: string;
  };
  tsunamiType?: string; // "None" | "Unknown" | "Checking" | "NonTsunami" | "Tsunami" | "MajorTsunami"
  intensity?: IntensityData[];
}

export interface IntensityData {
  pref: string;
  area?: string;
  station?: string;
  intensity: number;
  // -1 = not yet, 0-7 = intensity level
}

export interface Epicenter {
  latitude: number;
  longitude: number;
  depth: number; // km
  magnitude: number;
  name: string; // e.g. "石川県能登沖" (Noto Peninsula Offshore)
}

export interface TsunamiInfo {
  status: "None" | "Unknown" | "Checking" | "NonTsunami" | "Tsunami" | "MajorTsunami";
  waveHeight?: number; // cm
  observedTime?: string;
  estimatedHeight?: number; // cm
}

export interface QuakeHistoryItem {
  id: number;
  time: string;
  epicenter: Epicenter;
  maxIntensity: number;
  tsunami: TsunamiInfo;
  areas: IntensityData[];
  isEEW: boolean;
  isLatest: boolean;
}

export interface MapMarker {
  id: number;
  latitude: number;
  longitude: number;
  intensity: number;
  magnitude?: number;
  time?: string;
  isEpicenter?: boolean;
  prefName?: string;
}

export interface UIState {
  selectedEarthquake: QuakeHistoryItem | null;
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  autoRefresh: boolean;
  refreshInterval: number; // milliseconds
}

export interface EarthquakeRaw {
  code: string;
  time: string;
  earthquake?: {
    hypocenter: {
      name: string;
      latitude: number;
      longitude: number;
      depth: number;
      magnitude: number;
    };
    intensity: {
      forecastMaxInt: number;
      appendix: {
        maxInt: number;
        regions: Array<{
          name: string;
          maxInt: number;
          pref: string;
          cities: Array<{
            name: string;
            maxInt: number;
          }>;
        }>;
      };
    };
  };
  tsunami?: {
    status: string;
  };
  eew?: {
    alertstatus: string;
    reportnum: number;
  };
}
