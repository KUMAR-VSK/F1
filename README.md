# 🏎️ F1 Race Viewer

A seamless, premium native macOS desktop application for Formula 1 fans. Built with **Electron, React, Vite, and Tailwind CSS**. 

F1 Race Viewer automatically syncs with the true global F1 racing calendar to track practice, qualifying, and race sessions in an interactive timeline, securely triggering native desktop notifications, and managing integrated streaming for your personalized viewing experience.

## ✨ Features

- **Automated Universal Calendar**: Connects safely entirely to the official backwards-compatible `jolpi.ca` endpoints to display comprehensive current season Standings and Dashboard schedules (with resilience to API changes).
- **Session Timelines**: A visually stunning *"Weekend View"* tracking when upcoming races or practices are going live, driven dynamically by **Framer Motion** animations.
- **Native macOS Notifications**: Never miss a race again. Utilizing advanced native background polling, the application triggers push notifications natively resolving them through your Notification Center when any session starts within exactly 10 minutes.
- **Stream Auto-configuration**: Provide your chosen stream/broadcast configuration source once within the Settings UI (supports `.m3u8` HLS files). The app automatically stores it offline and pipes the video asynchronously directly forward.
- **Wikipedia Constructors & Driver Enhancements**: Pulls dynamic, crisp visual representations directly from Wikipedia's Content endpoints to enrich the table experiences. 
- **Premium Aesthetics**: Engineered mirroring the industry-leading standards of F1 TV & Netflix. Dark-tailored layout (`bg-darker`), immersive glassmorphism aesthetics, frameless custom draggable header boundaries, and highly responsive.

## 🚀 Tech Stack

- **Frameworks**: React (18+) built over Vite HMR 
- **Desktop Runtime**: Electron built on NodeJS bindings
- **Design System**: Tailwind CSS & Framer Motion
- **Connectivity**: Axios + hls.js API mapping & resilient asynchronous Video rendering
- **Distributor Tools**: `electron-builder`

---

## 💻 Development & Building 

### Requirements
- Node.js environment installed locally. 
- macOS environment (for native features and `.dmg` bundling).

### 1. Setup

Clone the repository and install all node packages via NPM.
```bash
git clone https://github.com/KUMAR-VSK/F1.git
cd F1
npm install
```

### 2. Start Dev Environment
Spin up both the local `vite` hot-reloading server alongside the `electron` app runtime together concurrently using:
```bash
npm start
```

### 3. Build & Package DMG Installer for Distribution
Compile your ultimate native macOS executable completely self-contained within an `.app` and mounted tightly on a `.dmg` volume instance:
```bash
npm run dist
```
Once the engine has completely processed your React modules and packaged the architecture natively through `electron-builder`, locate the compiled artifacts straight inside the generated `/release` directory wrapper!

---
*Disclaimer: F1 Race Viewer does not host/distribute streams or directly break broadcasting properties. Please refer to legally sourced broadcasters to plug into your individual provider configs.*
