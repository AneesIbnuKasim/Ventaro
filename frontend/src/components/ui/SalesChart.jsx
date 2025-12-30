import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function SalesChart({data, className}) {
  return (
    <div className={` p-4 rounded-xl shadow ${className}`}>
      <h3 className="font-semibold mb-2">Total Sales</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="_id" className="bg-red-500 " />
          <Tooltip />
          <Bar dataKey="totalSales" className="bg-red-500 " />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}