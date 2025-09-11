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

const COLORS = ["#16a34a", "#dc2626", "#3b82f6", "#f59e0b"];

export default function BetPieChart({ data }: BetPieChartProps) {
  const total = data.reduce((s, d) => s + Math.max(0, d.value), 0);

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={40}
            isAnimationActive={true}
            labelLine={false}
            label={({
              name,
              value,
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
            }) => {
              // position labels inside slices
              const RADIAN = Math.PI / 180;
              const radius = innerRadius + (outerRadius - innerRadius) / 2;
              const safeMidAngle = midAngle ?? 0;
              const x = cx + radius * Math.cos(-safeMidAngle * RADIAN);
              const y = cy + radius * Math.sin(-safeMidAngle * RADIAN);
              const safeValue = value ?? 0;
              const percent =
                total > 0 ? ((safeValue / total) * 100).toFixed(0) : "0";
              return (
                <text
                  x={x}
                  y={y}
                  fill="#fff"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={11}
                >
                  {`${name}: ${percent}%`}
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
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
