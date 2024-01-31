import { CategoryStats } from "@/app/types/statisticTypes";
import { PieChart, Pie, Cell, Tooltip } from "recharts";


export const CategoryStatsChart = ({ categoryStats }: { categoryStats: CategoryStats[] }) => {
  const colors = [ "#6059A8", "#472B83", "#367AA9", "#125F95", "#7963B3" ];

  return (
    <div className="category-chart">
      <h3>Most popular categories</h3>
      <PieChart width={600} height={500}>
        <Pie
          data={categoryStats}
          cx={200}
          cy={200}
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 80).toFixed(0)}%`}
          outerRadius={80}
          fill="#DBE5F0"
          dataKey="categoryCount"
          nameKey="category"
        >
          {
            categoryStats.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))
          }
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}