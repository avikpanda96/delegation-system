

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function ChartBox({ data }) {
  return (
    <BarChart width={400} height={250} data={data}>
      <XAxis dataKey="status" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="total" fill="#8884d8" />
    </BarChart>
  );
}