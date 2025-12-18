import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

export type PieData = { name: string; value: number };

export type BetPieChartProps = {
  data: PieData[];
};

const COLORS = [
  "#16a34a",
  "#dc2626",
  "#3b82f6",
  "#f59e0b",
  "#facc15",
  "#8b5cf6",
  "#ec4899",
];

const NO_VOTES_COLOR = "#d1d5db"; // gray-300

export default function BetPieChart({ data }: BetPieChartProps) {
  const total = data.reduce((sum, d) => sum + Math.max(0, d.value), 0);

  // -------- NEW: All options but equal values when no votes --------
  const noVotes = total === 0;

  const displayData = noVotes
    ? data.map((d) => ({ ...d, value: 1 })) // equal slices
    : data;

  const colors = noVotes
    ? data.map(() => NO_VOTES_COLOR)
    : data.map((_, i) => COLORS[i % COLORS.length]);
  // ----------------------------------------------------------------

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="list-none p-0 m-0 flex flex-col justify-center">
        {payload.map((entry: any, index: number) => {
          const name = entry.payload.name;
          const value = entry.payload.value;
          const percent = total > 0 ? ((value / total) * 100).toFixed(0) : "0";

          return (
            <li key={index} className="flex items-center mb-2 text-sm">
              <div
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: entry.color,
                  marginRight: 8,
                }}
              />
              <span>
                {noVotes
                  ? `${name} — 0 votes (0%)`
                  : `${name} — ${value} votes (${percent}%)`}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  const outerRadius = Math.max(50, 80 - data.length * 5);

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={displayData}
            dataKey="value"
            nameKey="name"
            cx="40%"
            cy="50%"
            outerRadius={outerRadius}
            innerRadius={noVotes ? 0 : outerRadius / 2}
            labelLine={false}
            isAnimationActive={true}
            label={({ value, cx, cy, midAngle, innerRadius, outerRadius }) => {
              if (noVotes) return null; // Do not show % if no votes

              const RADIAN = Math.PI / 180;
              const safeMidAngle = midAngle ?? 0;
              const radius = innerRadius + (outerRadius - innerRadius) / 2;
              const x = cx + radius * Math.cos(-safeMidAngle * RADIAN);
              const y = cy + radius * Math.sin(-safeMidAngle * RADIAN);
              const percent =
                total > 0 ? (((value ?? 0) / total) * 100).toFixed(0) : "0";

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
            {displayData.map((_, index) => (
              <Cell key={index} fill={colors[index]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(v, _name, entry: any) => {
              if (noVotes) return ["0", entry.payload.name];
              return [String(v), "Votes"];
            }}
          />

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
