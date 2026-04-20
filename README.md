# Vibe2Blender

**Accelerating 3D Asset Pipelines for Indie Game Devs**

![Vibe2Blender link:]([https://vibe2blender-653567444278.us-central1.run.app])

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Framework: React 19](https://img.shields.io/badge/Framework-React%2019-61DAFB?logo=react)](https://react.dev/)
[![Engine: Gemini 1.5 Pro](https://img.shields.io/badge/Engine-Gemini%201.5%20Pro-8E75B2?logo=google-gemini)](https://ai.google.dev/)
[![Deployment: Cloud Run](https://img.shields.io/badge/Deployment-Cloud%20Run-4285F4?logo=google-cloud)](https://cloud.google.com/run)

Creating stunning 3D environments and assets is traditionally a time-consuming and technically demanding process. Indie developers often face tight deadlines and a high barrier to entry when diving into complex 3D rendering ecosystems like Blender. **Vibe2Blender** addresses the industry challenge of slow asset prototyping by allowing developers to move from idea to 3D geometry using natural language prompts.

## 🏗️ Architecture & Logic
The solution is built as a smart, dynamic assistant that follows a purely serverless, zero-database architecture designed for 10x productivity.

* **Intent-Driven Development**: We utilized Google Antigravity to move away from manual coding toward intent-driven development, automating boilerplate such as scene setup and lighting geometry.
* **Auto Syntax Correction**: The implementation includes an embedded safety linter to proactively intercept legacy <2.79 API methods, ensuring guaranteed modern Blender functionality.
* **Multimodal Inference**: The Gemini API powers our core inference engine, enabling complex natural-language-to-Python API translation with built-in formatting hooks.

## 🛠️ Tech Stack
* **Google Cloud Run**: Leveraged for a serverless architecture that enables the application to scale instantly with zero downtime.
* **Gemini API**: Powers the core inference engine to translate "vibes" into mathematically valid Blender Python scripts.
* **Vite & React 19**: Powers the high-performance, accessible interface featuring a Matrix-style Cyber UI.
* **Tailwind CSS**: Provides a beautifully rendered, accessible interface that is fully keyboard accessible.

## 🚀 How to Run
To use the generated assets, follow these steps:
1.  **Generate**: Enter a description in the prompt input (e.g., "a neon sword with a glowing edge").
2.  **Copy**: Click the **Copy Code** button to retrieve the functional Python script.
3.  **Blender Setup**: Open Blender 4.0+ and navigate to the **Scripting** tab at the top of the interface.
4.  **Execute**: Click **+ New** to create a text block, paste your script, and click the **Run Script** play icon.
    * *Note: You do not need to run \`pip install bpy\`; the module is built natively into Blender.*

## 🧪 Testing & Validation
The application automatically scrubs and validates AI outputs using custom Vitest JavaScript suites to ensure script integrity before reaching the user.

---
**Assumptions**: To use this project, the user must have **Blender 4.0+ installed** and a **valid Gemini API key**.

 🏗️ File Tree Structure
 To maintain the < 1 MB repository size limit and follow the single-branch rule, 
 the project is structured for maximum efficiency:
 ```
vibe2blender/
├── .github/workflows/   # CI/CD for Google Cloud Run
├── public/              # Static assets
├── src/
│   ├── components/      # UI: MatrixRain, Terminal, Modal
│   ├── lib/             # Gemini API & SDK configuration
│   ├── tests/           # Vitest: logic and edge-case validation
│   ├── App.tsx          # Main Application Logic
│   └── main.tsx         # Entry point
├── package.json         # Build scripts (npm start for Cloud Run)
├── vite.config.ts       # Cloud Run port & host configuration
├── tsconfig.json        # TypeScript configuration
└── README.md            # Challenge documentation
```

# Implementation & LogicThe solution is built as a smart, dynamic assistant that follows a purely serverless, no-database architecture:
* **Vertical**: Industry 3D Asset Automation.
* **Intent-Driven Workflow**: We utilized Google Antigravity to build the solution through prompting and coding, skipping traditional backend boilerplate.
* **Logical Decision Making**: The assistant doesn't just generate code; it performs Auto Syntax Correction. It proactively intercepts legacy Blender API methods to ensure the output is compatible with version 4.0+.
*** Failure Paths**: The implementation includes defensive logic to scrub and validate AI outputs using custom JavaScript suites before they reach the user.
 
# Tech Stack (Google Services)
This project demonstrates an effective and meaningful integration of Google Services to achieve a 10x productivity boost:
* **Google Antigravity**: The primary workspace for "vibe coding" and rapid application building.
*  **API (3.1)**: The core inference engine used to translate natural language into mathematically valid Blender Python scripts.
* **Google Cloud Run**: Used for hosting the live preview, providing a scalable, serverless environment with zero-downtime deployments.
* **Vite & React**: Powers the high-performance, accessible terminal interface.
* **NarrativeApproach**: By automating boilerplate—scene setup, lighting, and material generation—we reduce the prototyping cycle from days to seconds.
* **Assumptions**: Users are expected to have Blender 4.0+ installed locally to run the generated .py scripts.
* **Build-in-Public**: This project was developed as part of a 14-day cycle, moving from a "napkin idea" to a working demo through AI-native workflows
