import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";

export type PieData = { name: string; value: number };

export type BetPieChartProps = {
  data: PieData[];
};

const COLORS = ["#16a34a", "#dc2626", "#3b82f6", "#f59e0b"];

export default function BetPieChart({ data }: BetPieChartProps) {
  const total = data.reduce((s, d) => s + Math.max(0, d.value), 0);
  const [containerWidth, setContainerWidth] = useState(0);

  // Custom legend renderer
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="list-none p-0 m-0 flex flex-col justify-center">
        {payload.map((entry: any, index: number) => {
          const percent =
            total > 0 ? ((entry.value / total) * 100).toFixed(0) : "0";
          return (
            <li
              key={`item-${index}`}
              className="flex items-center mb-2 text-sm"
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: entry.color,
                  marginRight: 8,
                }}
              />
              <span>{`${entry.value} votes (${percent}%) - ${entry.payload.name}`}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  // Update container width to adjust pie size dynamically
  useEffect(() => {
    const handleResize = () => {
      const el = document.getElementById("bet-piechart-container");
      if (el) setContainerWidth(el.offsetWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate outerRadius based on container width
  const outerRadius = Math.min(80, containerWidth * 0.4);

  return (
    <div id="bet-piechart-container" className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="40%" // shift pie left to leave space for legend
            cy="50%"
            outerRadius={outerRadius}
            innerRadius={outerRadius / 2}
            isAnimationActive={true}
            labelLine={false}
            label={({
              value,
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
            }) => {
              const RADIAN = Math.PI / 180;
              const radius = innerRadius + (outerRadius - innerRadius) / 2;
              const safeMidAngle = midAngle ?? 0;
              const x = cx + radius * Math.cos(-safeMidAngle * RADIAN);
              const y = cy + radius * Math.sin(-safeMidAngle * RADIAN);
              const percent =
                total > 0 ? ((value ?? 0) / total * 100).toFixed(0) : "0";
              return (
                <text
                  x={x}
                  y={y}
                  fill="#fff"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={11}
                >
                  {`${percent}%`}
                </text>
              );
            }}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(val: any) => [String(val), "Votes"]} />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            content={renderLegend}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
