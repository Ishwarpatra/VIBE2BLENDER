# VibeVenue
**A Spatial Planning Assistant for Physical Event Experiences**

![VibeVenue Architecture](public/architecture_diagram.png)

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Framework: React 19](https://img.shields.io/badge/Framework-React%2019-61DAFB?logo=react)](https://react.dev/)
[![Engine: Gemini 1.5 Flash](https://img.shields.io/badge/Engine-Gemini%201.5%20Flash-8E75B2?logo=google-gemini)](https://ai.google.dev/)
[![Deployment: Cloud Run](https://img.shields.io/badge/Deployment-Cloud%20Run-4285F4?logo=google-cloud)](https://cloud.google.com/run)

Creating stunning event experiences and safe spatial blueprints is traditionally a time-consuming and technically demanding process. Event planners and producers often face tight deadlines and a high barrier to entry when diving into complex 3D rendering ecosystems like Blender to validate physical layouts. 

**VibeVenue** addresses the industry challenge of slow spatial prototyping by allowing event producers to move from idea to real-world 3D layouts using natural language prompts.

---

### 🏗️ Architecture & Implementation
The solution follows a purely serverless, zero-database architecture designed for 10x productivity.

#### 🏗️ File Tree Structure
To maintain the < 1 MB repository size limit and follow the single-branch rule, the project is structured for maximum efficiency:
\`\`\`text
vibevenue/
├── .github/workflows/   # CI/CD for Google Cloud Run
├── public/              # Static assets (Logos, SVGs)
├── src/
│   ├── components/      # UI: MatrixRain, Terminal, Modal
│   ├── lib/             # Gemini API & Validation Logic
│   ├── tests/           # Vitest: Logic and edge-case validation
│   ├── App.tsx          # Main Application Logic
│   └── main.tsx         # Entry point
├── package.json         # Build scripts (npm start for Cloud Run)
├── vite.config.ts       # Cloud Run port & host configuration
├── tsconfig.json        # TypeScript configuration
└── README.md            # Challenge documentation
\`\`\`

* **Chosen Vertical**: Physical Event Experience.
* **Approach & Logic**: We used Google Antigravity to move away from manual layout coding toward intent-driven development. By automating the boilerplate—such as generating 10x10 booths scaled to real metric units—we drastically reduce the iteration cycle.
* **Intent-Driven Presets**: We implemented required industry presets (e.g., "Booth Planning", "Stage Setup") to ensure the assistant makes logical decisions based on real-world event context.
* **Auto Syntax Correction**: An embedded safety linter proactively intercepts legacy <2.79 API methods, ensuring guaranteed modern Blender functionality.

### 🛠️ Tech Stack (Google Services)
* **Google Cloud Run**: Leveraged for a serverless architecture that enables the application to scale instantly with zero downtime.
* **Gemini 1.5 Flash**: Powers the core inference engine to translate abstract "vibes" into mathematically valid Blender Python scripts.
* **Google Antigravity**: The primary workspace for "vibe coding" and building functional applications in record time.

### 🚀 How to Run
1.  **Generate**: Enter a spatial prompt (e.g., "A Gala dinner layout with 10 round tables").
2.  **Copy**: Click the **Copy Code** button to retrieve the functional Python script.
3.  **Blender Setup**: Open Blender 4.0+, navigate to the **Scripting** tab, create a **+ New** block, and paste your script.
4.  **Execute**: Click the **Run Script** play icon.

---
**Assumptions**: To use this project, the user must have **Blender 4.0+ installed** and a **valid Gemini API key**.
