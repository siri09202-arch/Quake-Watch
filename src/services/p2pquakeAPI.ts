/**
 * P2PQuake API v2 Client
 * https://www.p2pquake.net/develop/json_api_v2/
 */

import axios, { AxiosInstance } from "axios";
import { EarthquakeRaw, QuakeHistoryItem } from "../types/earthquake";

const API_BASE_URL = "https://api.p2pquake.net/v2";

class P2PQuakeAPI {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Get latest earthquake information
   */
  async getLatestEarthquake(): Promise<EarthquakeRaw | null> {
    try {
      const response = await this.client.get<EarthquakeRaw[]>(
        "/earthquake/info"
      );
      // API returns array, get the latest item
      return response.data && response.data.length > 0
        ? response.data[0]
        : null;
    } catch (error) {
      console.error("Error fetching latest earthquake:", error);
      throw error;
    }
  }

  /**
   * Get earthquake history
   * @param limit - Number of items to fetch (default: 30)
   * @param offset - Starting position (default: 0)
   */
  async getEarthquakeHistory(
    limit: number = 30,
    offset: number = 0
  ): Promise<EarthquakeRaw[]> {
    try {
      const response = await this.client.get<EarthquakeRaw[]>(
        `/earthquake/info?limit=${limit}&offset=${offset}`
      );
      return response.data || [];
    } catch (error) {
      console.error("Error fetching earthquake history:", error);
      throw error;
    }
  }

  /**
   * Get tsunami information
   */
  async getTsunamiInfo(): Promise<any> {
    try {
      const response = await this.client.get("/tsunami/info");
      return response.data;
    } catch (error) {
      console.error("Error fetching tsunami info:", error);
      throw error;
    }
  }

  /**
   * Get seismic intensity information
   */
  async getIntensityInfo(): Promise<any> {
    try {
      const response = await this.client.get("/intensity/info");
      return response.data;
    } catch (error) {
      console.error("Error fetching intensity info:", error);
      throw error;
    }
  }

  /**
   * Get area list for intensity information
   */
  async getIntensityAreaList(): Promise<any> {
    try {
      const response = await this.client.get("/intensity/list");
      return response.data;
    } catch (error) {
      console.error("Error fetching intensity area list:", error);
      throw error;
    }
  }

  /**
   * Stream earthquake updates using polling
   * @param callback - Callback function called when new data is available
   * @param interval - Polling interval in milliseconds (default: 5000)
   */
  streamEarthquakeUpdates(
    callback: (data: EarthquakeRaw) => void,
    interval: number = 5000
  ): NodeJS.Timer {
    let lastId = 0;

    const poll = async () => {
      try {
        const data = await this.getLatestEarthquake();
        if (data && data.code && parseInt(data.code) > lastId) {
          lastId = parseInt(data.code);
          callback(data);
        }
      } catch (error) {
        console.error("Error in streaming update:", error);
      }
    };

    // Initial poll
    poll();

    // Set up polling interval
    return setInterval(poll, interval);
  }
}

export const p2pquakeAPI = new P2PQuakeAPI();

export default p2pquakeAPI;
