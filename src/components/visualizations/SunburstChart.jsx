import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { buildFileTree } from '../../utils/helpers';

export const SunburstChart = ({ fileList, repoName }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!fileList || fileList.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const container = svg.node().parentElement;
    if (!container) return;

    const width = container.getBoundingClientRect().width;
    const height = container.getBoundingClientRect().height;
    const radius = Math.min(width, height) / 6;

    const hierarchicalData = buildFileTree(fileList);
    hierarchicalData.name = repoName;

    const partition = data => {
      const root = d3.hierarchy(data)
        .sum(d => (d.children ? 0 : 1))
        .sort((a, b) => b.value - a.value);
      return d3.partition()
        .size([2 * Math.PI, root.height + 1])
        (root);
    }

    const root = partition(hierarchicalData);
    root.each(d => d.current = d);

    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, hierarchicalData.children.length + 1));

    const arc = d3.arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius * 1.5)
      .innerRadius(d => d.y0 * radius)
      .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const path = g.append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
      .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
      .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.8 : 0.6) : 0)
      .attr("pointer-events", d => arcVisible(d.current) ? "auto" : "none")
      .attr("d", d => arc(d.current))
      .style("transition", "all 0.2s ease-in-out")
      .on("mouseover", function() {
        d3.select(this).attr("stroke", "#fff").attr("stroke-width", 2);
      })
      .on("mouseout", function() {
        d3.select(this).attr("stroke", "none");
      });

    path.filter(d => d.children)
      .style("cursor", "pointer")
      .on("click", clicked);

    const parent = g.append("circle")
      .datum(root)
      .attr("r", radius)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("click", clicked);

    const centerText = g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("fill", "white")
      .style("font-size", "1.2em")
      .text(repoName);

    function clicked(event, p) {
      parent.datum(p.parent || root);
      centerText.text(p.data.name);

      root.each(d => d.target = {
        x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        y0: Math.max(0, d.y0 - p.depth),
        y1: Math.max(0, d.y1 - p.depth)
      });

      const t = g.transition().duration(750);

      path.transition(t)
        .tween("data", d => {
          const i = d3.interpolate(d.current, d.target);
          return t => d.current = i(t);
        })
        .filter(function(d) {
          return +this.getAttribute("fill-opacity") || arcVisible(d.target);
        })
        .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.8 : 0.6) : 0)
        .attr("pointer-events", d => arcVisible(d.target) ? "auto" : "none")
        .attrTween("d", d => () => arc(d.current));
    }

    function arcVisible(d) {
      return d && d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

  }, [fileList, repoName]);

  return (
    <div className="w-full bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-4 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-slate-100">Repository Sunburst</h3>
      <div className="w-full h-[65vh] lg:h-[calc(80vh-4rem)]">
        <svg ref={svgRef} width="100%" height="100%" />
      </div>
    </div>
  );
};