# HH Goa Frame Generator

A modern, high-performance web application designed for the HackHind Goa 2026 hackathon. This tool allows users to instantly generate premium circular PFP frames and custom Builder ID badges entirely client-side, with seamless support for iPhone HEIC images, dynamic title generation, direct file downloads, and integrated X (Twitter) sharing.

## Tech Stack & Libraries
- **React + Vite**: Fast, interactive single-page application framework.
- **Tailwind CSS v4**: Stark developer visual styling inspired by Vercel's clean aesthetic.
- **Lucide React**: Lightweight vector icons.
- **`react-easy-crop`**: Fluid crop and zoom interactions supporting mobile touch/pinch gestures.
- **`heic2any`**: Client-side conversion of HEIC images from iPhones.
- **Supabase Storage**: Hosting generated cards publicly to power dynamic X social cards.
- **Astro Server (SSR)**: Dynamic page OG meta headers generation on the edge.

## Project Structure
- `src/components`: Custom UI controls and input components.
- `src/canvas`: HTML5 Canvas drawing engines.
- `src/hooks`: Custom utility hooks.
- `src/utils`: Helper functions.
- `src/data`: Static datasets.
- `src/services`: API connection wrappers.
- `src/assets`: Local image elements and styling.

## Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
