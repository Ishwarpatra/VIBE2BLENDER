# Vibe2Blender

**Accelerating 3D Asset Pipelines for Indie Game Devs**

Creating stunning 3D environments and assets is traditionally a time-consuming and technically demanding process. Indie developers often face tight deadlines and a high barrier to entry when diving into complex 3D rendering ecosystems like Blender. 

**Vibe2Blender addresses the industry challenge of slow asset prototyping by allowing developers to move from idea to 3D geometry using natural language prompts.** By automating the boilerplate—scene setup, lighting geometry, material generation, and camera placement—we drastically reduce the iteration cycle from days to mere moments. This allows developers to focus on *intent-driven development* rather than manual coding or repetitive 3D modeling.

## Narrative & Tech Stack

Vibe2Blender is built utilizing **Google Antigravity workflows**, allowing us to build a functional, highly-scalable app in a fraction of the time. 

- **Google Cloud Run:** By leveraging a fully serverless, no-database architecture on Cloud Run, we skipped traditional backend boilerplate entirely. This allows the application to scale instantly with zero downtime.
- **Gemini API & "Vibe Coding":** The Gemini API powers our core inference engine. Mastering these AI-native workflows has increased our prototyping productivity 10x, enabling complex natural-language-to-Python API translation with built-in formatting hooks.

## Narrative (Phase 3 Submission)

### Technical Blog Hook
*How we used "Vibe Coding" and Google Antigravity to skip backend boilerplate entirely and ship a robust, AI-native 3D generator directly to Google Cloud Run in record time.*

### Build-In-Public LinkedIn Post
*Just deployed Vibe2Blender on Google Cloud Run! 🚀 Integrating the Gemini API entirely changed how I approach 3D development. By leaning into AI-native "vibe coding" and Google Antigravity workflows, I increased development speed 10x, skipping tedious backend boilerplate and pushing a genuinely scalable serverless app to production. Indie Game Devs, you can now generate massive Blender environments using pure natural language.*

## Features
* **Matrix-style Cyber UI:** A beautifully rendered, accessible interface powered by Tailwind CSS and React. Fully keyboard accessible.
* **Auto Syntax Correction:** Built with an embedded safety linter to proactively intercept legacy `<2.79` API methods for guaranteed modern Blender functionality.
* **Client Validation:** Automatically scrubs and validates AI outputs using custom Vitest JavaScript suites before reaching the user.
