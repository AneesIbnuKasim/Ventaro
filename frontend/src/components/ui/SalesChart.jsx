import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", total: 400 },
  { day: "Tue", total: 600 },
  { day: "Mon", total: 400 },
  { day: "Tue", total: 600 },
  { day: "Mon", total: 400 },
  { day: "Tue", total: 600 },
];

export default function SalesChart({data, className}) {
  return (
    <div className={`bg-white p-4 rounded-xl shadow ${className}`}>
      <h3 className="font-semibold mb-2">Total Sales</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="_id" />
          <Tooltip />
          <Bar dataKey="totalSales" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}