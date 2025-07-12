const fs = require("fs");
const path = require("path");

// Layout constants — normalized coordinate space and physics tuning
const WIDTH = 1;
const HEIGHT = 1;
const ITERATIONS = 500;
const AREA = WIDTH * HEIGHT;

// Optimal spacing constant for force calculations (based on node density)
const K = Math.sqrt(AREA / 28);

// Threshold to avoid infinite or excessive repulsion when nodes are very close
const MIN_DIST = 0.03;

// Utility to constrain values within specified limits
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

function forceDirectedLayout(nodes, edges) {
  // Map node IDs to node objects and initialize force deltas
  const nodeMap = Object.fromEntries(
    nodes.map((n) => [n.id, { ...n, dx: 0, dy: 0 }])
  );

  // Main layout loop — simulates physical relaxation over multiple iterations
  for (let iter = 0; iter < ITERATIONS; iter++) {
    // Reset displacement vectors before each force pass
    for (const node of Object.values(nodeMap)) {
      node.dx = 0;
      node.dy = 0;
    }

    const nodeList = Object.values(nodeMap);

    // REPULSION: Apply repulsive force between all node pairs
    for (let i = 0; i < nodeList.length; i++) {
      for (let j = i + 1; j < nodeList.length; j++) {
        const a = nodeList[i];
        const b = nodeList[j];
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let dist = Math.sqrt(dx * dx + dy * dy) + 0.001; // avoid divide-by-zero

        let force = (K * K) / dist;

        // Strengthen repulsion if nodes are within unsafe proximity
        if (dist < MIN_DIST) {
          force *= 2;
        }

        let fx = (dx / dist) * force;
        let fy = (dy / dist) * force;

        a.dx += fx;
        a.dy += fy;
        b.dx -= fx;
        b.dy -= fy;
      }
    }

    // ATTRACTION: Apply spring forces for each edge (pulls connected nodes together)
    for (const [source, target] of edges) {
      const a = nodeMap[source];
      const b = nodeMap[target];
      let dx = a.x - b.x;
      let dy = a.y - b.y;
      let dist = Math.sqrt(dx * dx + dy * dy) + 0.001;

      let force = (dist * dist) / K; // force increases with distance

      let fx = (dx / dist) * force;
      let fy = (dy / dist) * force;

      a.dx -= fx;
      a.dy -= fy;
      b.dx += fx;
      b.dy += fy;
    }

    // Apply displacements and limit node movement to prevent instability
    for (const node of Object.values(nodeMap)) {
      node.x = clamp(node.x + clamp(node.dx, -1, 1) * 0.01, 0, 1);
      node.y = clamp(node.y + clamp(node.dy, -1, 1) * 0.01, 0, 1);
    }
  }

  // Return final layout without internal state
  return Object.values(nodeMap).map(({ id, x, y }) => ({ id, x, y }));
}

// Load input data from JSON
const dataPath = path.join(__dirname, "data.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
const { nodes, edges } = data;

// Compute final node layout
const layout = forceDirectedLayout(nodes, edges);

// Write output layout to file (for D3 or other consumers)
const outputPath = path.join(__dirname, "output.json");
fs.writeFileSync(outputPath, JSON.stringify(layout, null, 2));

console.log("Layout generated and saved to output.json");
console.log("Computed layout:", layout);