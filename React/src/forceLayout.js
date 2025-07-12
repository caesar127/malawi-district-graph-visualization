// Layout space dimensions (normalized to unit square [0,1] for portability and consistency)
const WIDTH = 1;
const HEIGHT = 1;

// Number of iterations for the layout convergence process
const ITERATIONS = 500;

// Total available area — used to determine optimal spacing constant (K)
const AREA = WIDTH * HEIGHT;

// Ideal distance between nodes based on available area and total node count
const K = Math.sqrt(AREA / 28); // 28 = expected number of nodes

// Minimum threshold to prevent excessively strong repulsive forces
const MIN_DIST = 0.03;

// Constrains a value within specified bounds
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

/**
 * Applies a basic force-directed layout algorithm (Fruchterman–Reingold variant)
 *
 * @param {Array<{id: string, x: number, y: number}>} nodes - Initial node positions with unique IDs
 * @param {Array<[string, string]>} edges - List of edges represented as [sourceId, targetId] pairs
 * @returns {Array<{id: string, x: number, y: number}>} - Updated node positions after layout convergence
 */

export function forceDirectedLayout(nodes, edges) {
  // Map node IDs to node objects, including displacement accumulators
  const nodeMap = Object.fromEntries(
    nodes.map((n) => [n.id, { ...n, dx: 0, dy: 0 }])
  );

  // Main simulation loop
  for (let iter = 0; iter < ITERATIONS; iter++) {
    // Reset accumulated displacements at the start of each iteration
    for (const node of Object.values(nodeMap)) {
      node.dx = 0;
      node.dy = 0;
    }

    const nodeList = Object.values(nodeMap);

    // Compute pairwise repulsive forces (O(n^2), optimized for small graphs)
    for (let i = 0; i < nodeList.length; i++) {
      for (let j = i + 1; j < nodeList.length; j++) {
        const a = nodeList[i];
        const b = nodeList[j];

        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.001; // avoid division by zero

        // Inverse-distance repulsive force
        let force = (K * K) / dist;

        // Boost force if nodes are unreasonably close
        if (dist < MIN_DIST) {
          force *= 2;
        }

        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        // Apply repulsion in opposite directions
        a.dx += fx;
        a.dy += fy;
        b.dx -= fx;
        b.dy -= fy;
      }
    }

    // Compute attractive forces along graph edges
    for (const [source, target] of edges) {
      const a = nodeMap[source];
      const b = nodeMap[target];

      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;

      // Distance-squared attractive force (spring-like behavior)
      const force = (dist * dist) / K;

      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;

      // Apply attraction in opposing directions
      a.dx -= fx;
      a.dy -= fy;
      b.dx += fx;
      b.dy += fy;
    }

    // Apply the computed displacements and constrain node positions within bounds
    for (const node of Object.values(nodeMap)) {
      // Clamp individual force vector to avoid large jumps (stabilizes the system)
      node.x = clamp(node.x + clamp(node.dx, -1, 1) * 0.01, 0, 1);
      node.y = clamp(node.y + clamp(node.dy, -1, 1) * 0.01, 0, 1);
    }
  }

  // Return final layout positions for all nodes
  return Object.values(nodeMap).map(({ id, x, y }) => ({ id, x, y }));
}
