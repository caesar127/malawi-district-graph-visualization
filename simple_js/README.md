# 🇲🇼 Malawi District Graph Visualization

This project visualizes the 28 districts of Malawi as a graph using D3.js. Each node represents a district, and each edge represents a shared border (adjacency).

The graph layout is generated using a force-directed algorithm implemented in `forceLayout.js`.

---

## 📁 Project Structure

project-folder/
├── data.json # Input graph data (raw nodes + edges)
├── forceLayout.js # Layout algorithm that generates output.json
├── output.json # Final positioned graph used for rendering
├── index.html # D3 visualization of the output graph
└── README.md # You are here

yaml


---

## Data Flow

1. **`data.json`** contains unpositioned nodes and their adjacency list.
2. **`forceLayout.js`** reads `data.json`, computes layout, and writes `output.json`.
3. **`index.html`** reads `output.json` and renders the graph using D3.js.

---

## How to Generate `output.json`

Make sure you have Node.js installed.

From the project directory, run:

node forceLayout.js
This will:

Read data.json

Run the force-directed layout algorithm

Write the result to output.json

Ensure forceLayout.js reads from data.json and writes to output.json in the same folder.

How to View the Graph
Option 1: Use npx serve (Recommended)


npx serve .
Open your browser at:


http://localhost:3000
Option 2: Python HTTP Server


python3 -m http.server 8000
Then visit:

http://localhost:8000
Option 3: VS Code Live Server
Install the Live Server extension in VS Code

Open the folder

Right-click index.html → "Open with Live Server"

Sample Data Format
data.json
{
  "nodes": [
    { "id": "Blantyre" },
    { "id": "Lilongwe" }
  ],
  "edges": [
    ["Blantyre", "Lilongwe"]
  ]
}

output.json (after layout)
{
  "nodes": [
    { "id": "Blantyre", "x": 0.6, "y": 0.7 },
    { "id": "Lilongwe", "x": 0.4, "y": 0.3 }
  ],
  "edges": [
    ["Blantyre", "Lilongwe"]
  ]
}

Built With
D3.js v7
JavaScript

HTML/CSS