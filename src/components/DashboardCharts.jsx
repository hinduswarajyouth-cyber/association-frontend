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
  Legend,
} from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#f97316", "#dc2626"];

/* =========================
   MONTHLY CASHFLOW
========================= */
export function MonthlyCashflowChart({ data }) {
  return (
    <div style={chartCard}>
      <div style={cardHeader}>
        <h3 style={cardTitle}>📊 Monthly Cashflow</h3>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} barGap={8}>
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />

          <Bar
            dataKey="credit"
            name="Collection"
            fill="#16a34a"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="debit"
            name="Expense"
            fill="#dc2626"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* =========================
   FUND BALANCE PIE
========================= */
export function FundBalanceChart({ data }) {
  return (
    <div style={chartCard}>
      <div style={cardHeader}>
        <h3 style={cardTitle}>💰 Fund-wise Balance</h3>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="balance"
            nameKey="fund_name"
            outerRadius={120}
            innerRadius={60}
            paddingAngle={3}
            label
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/* =========================
   TOOLTIP
========================= */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div style={tooltip}>
      {label && <p style={{ fontWeight: 600 }}>{label}</p>}
      {payload.map((item, i) => (
        <p key={i} style={{ color: item.color, margin: 0 }}>
          {item.name}: ₹{Number(item.value).toLocaleString("en-IN")}
        </p>
      ))}
    </div>
  );
}

/* =========================
   STYLES
========================= */

const chartCard = {
  background: "#ffffff",
  padding: 24,
  borderRadius: 16,
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  marginBottom: 24,
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
};

const cardTitle = {
  fontSize: 16,
  fontWeight: 600,
};

const tooltip = {
  background: "#ffffff",
  padding: "10px 12px",
  borderRadius: 8,
  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  fontSize: 13,
};
