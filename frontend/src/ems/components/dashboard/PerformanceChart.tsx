import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PerformanceChartProps {
  data?: any[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const chartData = data?.map(d => ({
    name: d.name.split(' ')[0], // Shorten name
    completed: Math.round(d.performance),
    target: 100
  })) || [
      { name: "Sales", completed: 85, target: 100 },
      { name: "Marketing", completed: 72, target: 100 },
      { name: "Support", completed: 91, target: 100 },
      { name: "Content", completed: 68, target: 100 },
      { name: "Tech", completed: 78, target: 100 },
    ];
  return (
    <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="section-header">Team Performance</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Department-wise task completion
          </p>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(220 13% 91%)"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(220 10% 45%)", fontSize: 12 }}
              domain={[0, 100]}
            />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(220 10% 45%)", fontSize: 12 }}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0 0% 100%)",
                border: "1px solid hsl(220 13% 91%)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
              }}
              formatter={(value: number) => [`${value}%`, "Completed"]}
            />
            <Bar
              dataKey="completed"
              fill="hsl(142 71% 35%)"
              radius={[0, 6, 6, 0]}
              barSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
