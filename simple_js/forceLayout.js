const fs = require("fs");
const path = require("path");

const WIDTH = 1;
const HEIGHT = 1;
const ITERATIONS = 500;
const AREA = WIDTH * HEIGHT;
const K = Math.sqrt(AREA / 28);
const MIN_DIST = 0.03;

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

function forceDirectedLayout(nodes, edges) {
  const nodeMap = Object.fromEntries(
    nodes.map((n) => [n.id, { ...n, dx: 0, dy: 0 }])
  );

  for (let iter = 0; iter < ITERATIONS; iter++) {
    for (const node of Object.values(nodeMap)) {
      node.dx = 0;
      node.dy = 0;
    }

    const nodeList = Object.values(nodeMap);
    for (let i = 0; i < nodeList.length; i++) {
      for (let j = i + 1; j < nodeList.length; j++) {
        const a = nodeList[i];
        const b = nodeList[j];
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let dist = Math.sqrt(dx * dx + dy * dy) + 0.001;

        let force = (K * K) / dist;
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

    for (const [source, target] of edges) {
      const a = nodeMap[source];
      const b = nodeMap[target];
      let dx = a.x - b.x;
      let dy = a.y - b.y;
      let dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
      let force = (dist * dist) / K;

      let fx = (dx / dist) * force;
      let fy = (dy / dist) * force;

      a.dx -= fx;
      a.dy -= fy;
      b.dx += fx;
      b.dy += fy;
    }

    for (const node of Object.values(nodeMap)) {
      node.x = clamp(node.x + clamp(node.dx, -1, 1) * 0.01, 0, 1);
      node.y = clamp(node.y + clamp(node.dy, -1, 1) * 0.01, 0, 1);
    }
  }

  return Object.values(nodeMap).map(({ id, x, y }) => ({ id, x, y }));
}

const dataPath = path.join(__dirname, "data.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
const { nodes, edges } = data;

const layout = forceDirectedLayout(nodes, edges);

const outputPath = path.join(__dirname, "output.json");
fs.writeFileSync(outputPath, JSON.stringify(layout, null, 2));

console.log("Layout generated and saved to output.json");
