# VibeVenue

**A Spatial Planning Assistant for Physical Event Experiences**

Creating stunning event experiences and safe spatial blueprints is traditionally a time-consuming and technically demanding process. Event planners and producers often face tight deadlines and a high barrier to entry when diving into complex 3D rendering ecosystems like Blender to validate physical layouts.

**VibeVenue addresses the industry challenge of slow spatial prototyping by allowing event producers to move from idea to real-world 3D layouts using natural language prompts.** 

**Chosen Vertical:** Physical Event Experience.  
**Approach & Logic:** We used Google Antigravity to move away from manual layout coding toward intent-driven development. By automating the boilerplate—such as generating 10x10 booths scaled to real metric units, applying event lighting "vibes" (Gala, Keynote), and validating "Attendee Flow" spacing compliance—we drastically reduce the iteration cycle. This allows producers to focus entirely on *intent-driven design* rather than manual syntax execution.

**Assumptions:** To use this project, the user must have **Blender 4.0+ installed** and a **valid Gemini API key**.

## Narrative & Tech Stack

The entire app was built using vibe coding within the Google Antigravity environment. 

- **Google Cloud Run:** We leveraged Google Cloud Run for a serverless, zero-database architecture that maximizes 10x productivity. By skipping traditional backend boilerplate entirely, the application scales instantly with zero downtime.
- **Gemini API & "Vibe Coding":** The Gemini API powers our core inference engine. Mastering these AI-native workflows has increased our prototyping productivity 10x, enabling complex natural-language-to-Python API translation with built-in spatial formatting logic.

## Narrative (Phase 3 Submission)

### Technical Blog Hook
*How we used "Vibe Coding" and Google Antigravity to build a Spatial Planning Assistant that skips backend boilerplate entirely and ships robust, AI-native physical event blueprints directly to Google Cloud Run in record time.*

### Build-In-Public LinkedIn Post
*Just deployed VibeVenue on Google Cloud Run! 🚀 Integrating the Gemini API entirely changed how I approach spatial event planning. By leaning into AI-native "vibe coding" and Google Antigravity workflows, I increased development speed 10x, skipping tedious backend boilerplate and pushing a genuinely scalable serverless app to production. Event Planners, you can now generate massive Blender blueprints with built-in flow and safety checks using pure natural language.*

## Features
* **Matrix-style Cyber UI:** A beautifully rendered, accessible interface powered by Tailwind CSS and React. Fully keyboard accessible.
* **Auto Syntax Correction:** Built with an embedded safety linter to proactively intercept legacy `<2.79` API methods for guaranteed modern Blender functionality.
* **Client Validation:** Automatically scrubs and validates AI outputs using custom Vitest JavaScript suites before reaching the user.
