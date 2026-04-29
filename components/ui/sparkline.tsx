import type { ReactElement } from "react";

type SparklineProps = {
  data: number[];
  width?: number;
  height?: number;
  /** Renders a larger version with an area fill — used in the detail drawer */
  large?: boolean;
};

export function Sparkline({
  data,
  width = 72,
  height = 26,
  large = false,
}: SparklineProps): ReactElement | null {
  if (data.length < 2) return null;

  const padding = 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pts: [number, number][] = data.map((v, i) => [
    (i / (data.length - 1)) * (width - padding * 2) + padding,
    height - padding - ((v - min) / range) * (height - padding * 2),
  ]);

  const polylinePoints = pts.map(([x, y]) => `${x},${y}`).join(" ");

  const trending = data[data.length - 1] >= data[0];
  const stroke = large
    ? trending
      ? "rgba(21,128,61,0.78)"
      : "rgba(220,38,38,0.78)"
    : "rgba(123,106,66,0.65)";

  if (large) {
    const last = pts[pts.length - 1];
    const first = pts[0];
    const areaPath = [
      `M ${pts.map(([x, y]) => `${x},${y}`).join(" L ")}`,
      `L ${last[0]},${height - padding}`,
      `L ${first[0]},${height - padding}`,
      "Z",
    ].join(" ");

    const fillColor = trending
      ? "rgba(21,128,61,0.07)"
      : "rgba(220,38,38,0.07)";

    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        overflow="visible"
      >
        <path d={areaPath} fill={fillColor} />
        <polyline
          points={polylinePoints}
          fill="none"
          stroke={stroke}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={last[0]}
          cy={last[1]}
          r="2.5"
          fill={stroke}
        />
      </svg>
    );
  }

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        points={polylinePoints}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
