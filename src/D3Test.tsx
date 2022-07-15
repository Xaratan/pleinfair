import * as d3 from "d3";
import { useContext, useEffect, useRef, useState } from "react";
import { ZoomContext } from "./contexts/ZoomContext";

export function D3Test() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [data, setData] = useState<number[]>([10, 20, 30, 40, 50]);
  const zoomContext = useContext(ZoomContext);

  function handleZoom(e: any) {
    console.log(zoomContext);

    zoomContext.transform.setValue(e.transform);

    d3.select(svgRef.current).select("g").attr("transform", e.transform);
    // apply transform to the chart
    //console.log(e);
  }

  useEffect(() => {
    if (zoomContext.ready.current) {
      console.log("once...", data, zoomContext.transform.value);
      const zoom = d3.zoom().on("zoom", handleZoom);
      //.transform(zoomContext.transform.value);

      const svg = d3.select(svgRef.current);

      svg.selectAll("*").remove();

      svg
        .call(zoom as any)
        .append("g")
        .attr("transform", zoomContext.transform.value)
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => i * 50)
        .attr("cy", 50)
        .attr("r", (d) => d)
        .attr("fill", "orange")
        .exit()
        .remove();
    }
  }, [data, svgRef.current, zoomContext.ready.current]);

  return (
    <div>
      <h1>D3 Test</h1>
      <svg ref={svgRef} width="400" height="400"></svg>
    </div>
  );
}
