# Quake Watch - Real-time Earthquake & Tsunami Viewer

A real-time earthquake and tsunami monitoring application that displays seismic data on an interactive map with comprehensive disaster information.

## 🌍 Features

- **Real-time Earthquake Monitoring**: Strong motion monitor and early earthquake warning display
- **Multi-Data Source Integration**: JMA XML, DM-D.S.S, Strong Motion Network, etc.
- **Geospatial Visualization**: High-precision map projection showing epicenter, seismic intensity distribution, and tsunami information
- **Disaster Crisis Management**: Reception and display of disaster/crisis management notices via QZSS (Quasi-Zenith Satellite System)

## 📊 Data Sources

- **P2PQuake API**: https://www.p2pquake.net/develop/json_api_v2/
  - Earthquake data
  - Tsunami information
  - Seismic intensity reports
  - Disaster management notices

## 🎨 UI Layout

- **Left Panel**: Earthquake history and detailed seismic information
  - Latest earthquake details (magnitude, time, epicenter)
  - Seismic intensity at various locations
  - Tsunami presence/absence indicator
  - Depth information
- **Right Panel**: Interactive map with:
  - Seismic intensity dots (color-coded)
  - Epicenter marker
  - Real-time updates

## 🛠 Tech Stack

- React 18 + TypeScript
- Leaflet for map visualization
- Tailwind CSS for styling
- Axios for API calls
- Date-fns for date formatting

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm build
```

## 📝 Project Structure

```
src/
├── components/
│   ├── Map.tsx              # Leaflet map component
│   ├── EarthquakePanel.tsx   # Left info panel
│   ├── QuakeHistory.tsx      # Earthquake history list
│   └── QuakeDetails.tsx      # Detailed earthquake info
├── services/
│   ├── p2pquakeAPI.ts        # P2PQuake API client
│   └── dataProcessor.ts      # Data processing utilities
├── types/
│   └── earthquake.ts         # TypeScript type definitions
├── hooks/
│   └── useEarthquakeData.ts  # Custom hooks for data fetching
├── utils/
│   └── colors.ts             # Seismic intensity color mapping
├── App.tsx
├── App.css
└── index.tsx
```

## 📡 API Integration

### P2PQuake JSON API v2 Endpoints

- `/earthquake/info` - Earthquake information
- `/tsunami/info` - Tsunami information
- `/earthquake/log` - Earthquake history
- `/intensity/info` - Seismic intensity information

## 🎯 Development Roadmap

- [ ] Core map and earthquake data display
- [ ] Real-time data updates (WebSocket/Polling)
- [ ] Earthquake history panel
- [ ] Seismic intensity coloring
- [ ] Tsunami alert system
- [ ] QZSS crisis management notice display
- [ ] Performance optimization
- [ ] Error handling and user notifications
- [ ] Responsive mobile design

## 📄 License

MIT

## 👤 Author

siri09202-arch
