import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { buildFileTree } from '../../utils/helpers';

// Helper to determine bubble color based on file type
const getColor = (d) => {
  if (d.data.children) return '#00c49f'; // Folder color

  const extension = d.data.name.split('.').pop();
  switch (extension) {
    case 'js':
    case 'jsx':
      return '#f7df1e'; // JavaScript
    case 'json':
      return '#f7df1e';
    case 'css':
    case 'scss':
      return '#1572b6'; // CSS
    case 'html':
      return '#e34c26'; // HTML
    case 'md':
      return '#ffffff'; // Markdown (White)
    case 'png':
    case 'jpg':
    case 'svg':
    case 'gif':
      return '#af19ff'; // Images
    default:
      return '#8884d8'; // Default file color
  }
};

export const BubbleChart = ({ fileList, repoName }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!fileList || fileList.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svg.node().getBoundingClientRect().width;
    const height = 600; // Increased height for more space
    svg.attr('height', height);

    const hierarchicalData = buildFileTree(fileList);
    hierarchicalData.name = repoName;

    const root = d3.hierarchy(hierarchicalData)
      .sum(() => 1) // Give every node a value of 1 for sizing
      .sort((a, b) => b.value - a.value);

    const nodes = root.descendants();

    // --- START: DYNAMIC SIZING LOGIC ---
    // 1. Create a scaling factor based on the number of nodes.
    //    Fewer nodes will result in a larger scale factor and bigger bubbles.
    //    We clamp the value with Math.min and Math.max to prevent extreme sizes.
    const scaleFactor = Math.max(0.8, Math.min(4, 70 / Math.sqrt(nodes.length)));

    // 2. Define base radii and apply the scale factor.
    const folderRadius = 8 * scaleFactor;
    const fileRadius = 3 * scaleFactor;

    // 3. Create a helper function to get the radius for any given node.
    const getRadius = (d) => (d.data.children ? folderRadius : fileRadius);
    // --- END: DYNAMIC SIZING LOGIC ---


    const simulation = d3.forceSimulation(nodes)
      .force('x', d3.forceX(width / 2).strength(0.04))
      .force('y', d3.forceY(height / 2).strength(0.04))
      // Use the dynamic radius in the collision force
      .force('collide', d3.forceCollide(d => getRadius(d) + 2).strength(0.9));

    const node = svg.selectAll('.node')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

    // Apply the dynamic radius to the circle's 'r' attribute
    node.append('circle')
      .attr('r', getRadius)
      .style('fill', getColor)
      .style('stroke', '#0f172a')
      .style('stroke-width', 2);

    node.append('text')
      .attr('dy', '0.3em')
      .style('text-anchor', 'middle')
      .style('font-size', `${Math.max(6, 3 * scaleFactor)}px`) // Also scale font size
      .style('fill', 'white')
      .style('pointer-events', 'none')
      .text(d => (d.data.children && d.data.name.length < 15) ? d.data.name : ''); // Only label folders

    const tooltip = d3.select('body').append('div')
        .attr('class', 'd3-tooltip')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('visibility', 'hidden')
        .style('background', '#1f2937')
        .style('border', '1px solid #374151')
        .style('padding', '8px')
        .style('border-radius', '8px')
        .style('color', 'white');

    node.on('mouseover', function(event, d) {
        tooltip.text(d.data.name);
        return tooltip.style('visibility', 'visible');
    })
    .on('mousemove', function(event) {
        return tooltip.style('top', (event.pageY - 10) + 'px').style('left', (event.pageX + 10) + 'px');
    })
    .on('mouseout', function() {
        return tooltip.style('visibility', 'hidden');
    });

    simulation.on('tick', () => {
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
      tooltip.remove();
    };

  }, [fileList, repoName]);

  return (
    <div className="w-full bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-4 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-slate-100">Repository Bubble Graph</h3>
      <div className="w-full h-full">
        <svg ref={svgRef} width="100%" />
      </div>
    </div>
  );
};