import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#f97316", "#dc2626"];

export function MonthlyCashflowChart({ data }) {
  return (
    <div style={chartCard}>
      <h3>📊 Monthly Cashflow</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="credit" fill="#16a34a" name="Collection" />
          <Bar dataKey="debit" fill="#dc2626" name="Expense" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FundBalanceChart({ data }) {
  return (
    <div style={chartCard}>
      <h3>💰 Fund-wise Balance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="balance"
            nameKey="fund_name"
            outerRadius={120}
            label
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

const chartCard = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  marginBottom: 20,
};
