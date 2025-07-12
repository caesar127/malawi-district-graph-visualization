import { useEffect, useState, useRef } from "react";
import { forceDirectedLayout } from "./forceLayout";
import * as d3 from "d3";

export default function App() {
  const [rawData, setRawData] = useState(null); // raw uploaded JSON
  const [graph, setGraph] = useState({ nodes: [], edges: [] }); // rendered graph state
  const svgRef = useRef(); // D3 anchor point

  useEffect(() => {
    if (!graph.nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clear previous render

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Map normalized layout space [0–1] to screen space with padding
    const x = d3
      .scaleLinear()
      .domain([0, 1])
      .range([50, width - 50]);
    const y = d3
      .scaleLinear()
      .domain([0, 1])
      .range([50, height - 50]);

    // Render edges as lines between connected nodes
    svg
      .selectAll("line")
      .data(graph.edges)
      .enter()
      .append("line")
      .attr("x1", (d) => x(graph.nodes.find((n) => n.id === d[0]).x))
      .attr("y1", (d) => y(graph.nodes.find((n) => n.id === d[0]).y))
      .attr("x2", (d) => x(graph.nodes.find((n) => n.id === d[1]).x))
      .attr("y2", (d) => y(graph.nodes.find((n) => n.id === d[1]).y))
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1.5);

    // Render nodes as circles
    svg
      .selectAll("circle")
      .data(graph.nodes)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.x))
      .attr("cy", (d) => y(d.y))
      .attr("r", 5)
      .attr("fill", "#28C69F");

    // Node labels for easier inspection
    svg
      .selectAll("text")
      .data(graph.nodes)
      .enter()
      .append("text")
      .attr("x", (d) => x(d.x) + 8)
      .attr("y", (d) => y(d.y) + 4)
      .text((d) => d.id)
      .attr("font-size", 10)
      .attr("fill", "#444");
  }, [graph]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Clear existing visualization immediately
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    setGraph({ nodes: [], edges: [] });
    setRawData(null);

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      // Basic format validation
      if (!json.nodes || !json.edges) {
        throw new Error("Invalid format");
      }

      // Delay update slightly to allow visual reset before rendering
      setTimeout(() => {
        setRawData(json);
        setGraph({ nodes: json.nodes, edges: json.edges });
      }, 50);
    } catch (error) {
      alert(
        "Failed to load graph. Ensure it's a valid JSON file with nodes and edges."
      );
      console.error(error);
    }
  };

  const handleOptimize = () => {
    if (!rawData) return;

    // Recompute layout using force-directed algorithm
    const optimized = forceDirectedLayout(rawData.nodes, rawData.edges);

    // Preserve original edge structure
    setGraph({ nodes: optimized, edges: rawData.edges });
  };

  return (
    <div className="min-h-screen bg-[#28C69F] text-white p-1">
      <div className="flex justify-between items-center my-2">
        <h1 className="text-2xl font-semibold">Graph Visualizer</h1>

        <div className="flex gap-4 items-center">
          {/* Upload button: styled label over hidden input */}
          <label className="text-sm font-medium text-[#28C69F] bg-white rounded-md px-3 py-1 cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={handleUpload}
              className="hidden"
            />
            Upload JSON
          </label>

          <button
            onClick={handleOptimize}
            className="text-sm font-medium bg-white text-[#28C69F] rounded-md px-4 py-1 hover:bg-gray-100 disabled:opacity-50"
            disabled={!rawData} // disable until data is loaded
          >
            Optimize Layout
          </button>
        </div>
      </div>

      {/* Main SVG rendering area */}
      <div className="flex justify-center">
        <svg
          ref={svgRef}
          className="w-full h-[90vh] rounded-2xl bg-white overflow-auto"
        />
      </div>
    </div>
  );
}
