import api from "../api/api";
import { useEffect, useState } from "react";
import DashboardHeader from "../components/DashboardHeader";

export default function ECDashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get("/api/dashboard/admin-summary").then((res) => {
      setSummary(res.data);
    });
  }, []);

  if (!summary) return null;

  return (
    <div style={{ padding: 30 }}>
      <DashboardHeader />
      <p>📊 Association Overview (Read Only)</p>

      <ul>
        <li>Total Members: {summary.total_members}</li>
        <li>Total Collection: ₹{summary.total_collection}</li>
        <li>Approved Receipts: {summary.approved_receipts}</li>
      </ul>
    </div>
  );
}
