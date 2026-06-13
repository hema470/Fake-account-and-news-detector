# 🛡️ InstaShield — Fake Account & News Detector

InstaShield is a premium, AI-powered web application built with **Next.js 15+**, **React 19**, and **Framer Motion**. It provides real-time behavioral and heuristic analysis to identify fake social media profiles (across Instagram, Facebook, and X/Twitter) as well as fake news and sensationalism.

---

## 🚀 Getting Started

To run the application locally on your machine, follow these steps:

### 1. Install Dependencies
Before running the server, make sure you have all required npm packages installed. Run this in your project root directory:
```bash
npm install
```

### 2. Start the Development Server
Run the following command to start the Next.js development server:
```bash
npm run dev
```

### 3. Open in Browser
Once the server is running, open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🔍 Troubleshooting: "Nothing is Loading / Blank Page"

If you open the localhost link and nothing is loading, please check the following solutions:

### 1. Check the Terminal Port Output
If port `3000` is already occupied by another process, Next.js will automatically fall back to another port (such as `3001`, `3002`, etc.). 
- Look closely at your terminal output after running `npm run dev`.
- Find the line that looks like: `▲ Local: http://localhost:3001`
- Open the exact URL displayed in your terminal.

### 2. Make Sure Dependencies are Installed
If you run `npm run dev` and get command errors, or if files fail to load, ensure you ran `npm install` first. If issues persist, try clean installing:
```bash
rm -rf node_modules .next
npm install
```

### 3. Node.js Version Compatibility
This project runs on React 19 and Next.js 15+. It requires **Node.js 18.17.0** or newer. Check your Node version using:
```bash
node -v
```
*(If your version is older, please update Node.js).*

### 4. Clear Browser Cache
Sometimes, local development server caching can prevent pages from loading correctly.
- Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac) to perform a hard refresh.
- Alternatively, try opening the link in an **Incognito / Private Window**.

---

## 🛠️ Built With

- **Framework**: [Next.js](https://nextjs.org/) (App Router & Turbopack)
- **Styling**: Vanilla CSS, TailwindCSS, & Glassmorphism design tokens
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
