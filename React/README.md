# Malawi District Graph Visualization

This project visualizes Malawi's 28 districts as a graph using force-directed layout algorithm(Fruchterman–Reingold). You can upload a custom JSON graph file and optionally run optimization in-browser to compute node positions within a 1×1 unit square.

## Features

- Force-directed graph layout (Fruchterman–Reingold by default)
- Upload your own `.json` file (containing nodes & edges)
- Click **Optimize** to recompute layout inside the browser
- Beautiful, responsive UI with TailwindCSS and D3.js
- oggle between raw and optimized layouts

---

## 📁 Project Structure

malawi-district-graph-visualization/React
├── public/
│ ├── data.json # Sample raw graph data
│ └── output.json # Sample pre-optimized graph layout
├── src/
│ ├── App.jsx # Main app component
│ ├── forceLayout.js # Force-directed layout algorithm
│ └── index.css # TailwindCSS styles
├── index.html
├── package.json
└── vite.config.js

---

## ✅ Requirements

- Node.js (v16 or newer recommended)
- npm or yarn

---

## 🛠️ Setup & Run Locally

### 1. Clone the repository

git clone https://github.com/your-username/malawi-district-graph-visualization.git
cd malawi-district-graph-visualization

2. Install dependencies
bash
npm install
# or
yarn

3. Start the development server
bash
npm run dev
# or
yarn dev
Visit http://localhost:5173 in your browser.

📄 JSON Format Example
Here’s what your uploaded JSON file should look like:

{
  "nodes": [
    { "id": "Lilongwe", "x": 0.4, "y": 0.5 },
    { "id": "Blantyre", "x": 0.6, "y": 0.7 }
  ],
  "edges": [
    ["Lilongwe", "Blantyre"],
    ["Lilongwe", "Mzuzu"]
  ]
}
x and y can be initial positions (0–1 range) or all 0s — they’ll be computed when you click Optimize.

Upload Your Own Graph
Click the Upload JSON button, choose a .json file in the correct format, and then click Optimize to apply the algorithm and visualize the new layout.

Built With
React
Vite
D3.js
Tailwind CSS

Notes
The algorithm works within a 1×1 unit square coordinate system.
Final output positions are automatically clamped between [0, 1].