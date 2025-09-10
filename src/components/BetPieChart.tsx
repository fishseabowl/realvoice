import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

export type BetPieChartProps = {
  yes: number;
  no: number;
};

const COLORS = ["#16a34a", "#dc2626"]; // Yes = green, No = red

function formatPercent(part: number, total: number) {
  if (total <= 0) return "0%";
  return `${Math.round((part / total) * 100)}%`;
}

export default function BetPieChart({ yes, no }: BetPieChartProps) {
  const safeYes = Math.max(0, Number.isFinite(yes) ? yes : 0);
  const safeNo = Math.max(0, Number.isFinite(no) ? no : 0);
  const total = safeYes + safeNo;

  const data = [
    { name: "Yes", value: safeYes },
    { name: "No", value: safeNo },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Bet Distribution</h2>
        <div className="text-sm text-gray-500">Total: {total}</div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              innerRadius={60}
              isAnimationActive
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
                const RADIAN = Math.PI / 180;
                const radius = innerRadius + (outerRadius - innerRadius) / 2;
                const safeMidAngle = midAngle ?? 0;
                const x = cx + radius * Math.cos(-safeMidAngle * RADIAN);
                const y = cy + radius * Math.sin(-safeMidAngle * RADIAN);
                return (
                  <text
                    x={x}
                    y={y}
                    fill="#fff"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={14}
                  >
                    {`${name}: ${(((value ?? 0) / total) * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`slice-${entry.name}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            {
              <Tooltip
                formatter={(val: any, n: any) => [String(val), String(n)]}
              />
            }
            <Legend verticalAlign="bottom" height={32} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl bg-green-50 px-3 py-2">
          <div className="font-medium text-green-700">Yes</div>
          <div className="text-green-700/80">
            {safeYes} • {formatPercent(safeYes, total)}
          </div>
        </div>
        <div className="rounded-xl bg-red-50 px-3 py-2">
          <div className="font-medium text-red-700">No</div>
          <div className="text-red-700/80">
            {safeNo} • {formatPercent(safeNo, total)}
          </div>
        </div>
      </div>
    </div>
  );
}
