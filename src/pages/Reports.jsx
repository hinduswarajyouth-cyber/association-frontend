import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import ReportTable from "../components/ReportTable";

export default function Reports() {
  const [monthly, setMonthly] = useState([]);
  const [fundWise, setFundWise] = useState([]);
  const [memberWise, setMemberWise] = useState([]);

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD JSON REPORTS
  ========================= */
  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const [m, f, mem] = await Promise.all([
        api.get("/reports/monthly"),
        api.get("/reports/fund-wise"),
        api.get("/reports/member-wise"),
      ]);

      setMonthly(m.data.report || []);
      setFundWise(f.data.report || []);
      setMemberWise(mem.data.report || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     PDF DOWNLOAD
  ========================= */
  const openPDF = (url) => {
    if (url.includes("monthly") && (!month || !year)) {
      alert("Please enter month and year");
      return;
    }

    window.open(`http://localhost:3000${url}`, "_blank");
  };

  return (
    <>
      <Navbar />

      <div style={container}>
        <h2>📊 Reports</h2>

        {loading && <p>Loading reports...</p>}

        {/* =========================
           MONTH FILTER + PDF
        ========================= */}
        <div style={filterBox}>
          <input
            type="number"
            min="1"
            max="12"
            placeholder="Month (1-12)"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <input
            type="number"
            placeholder="Year (2025)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />

          <button
            onClick={() =>
              openPDF(`/reports/pdf/monthly?month=${month}&year=${year}`)
            }
          >
            📄 Monthly PDF
          </button>
        </div>

        {/* =========================
           MONTHLY REPORT
        ========================= */}
        <ReportTable
          title="📆 Monthly Report"
          columns={["month", "count", "total_amount"]}
          data={monthly}
        />

        {/* =========================
           FUND-WISE REPORT
        ========================= */}
        <div style={pdfRow}>
          <h3>💰 Fund-wise Report</h3>
          <button onClick={() => openPDF("/reports/pdf/fund-wise")}>
            📄 PDF
          </button>
        </div>

        <ReportTable
          columns={["fund_name", "total_amount"]}
          data={fundWise}
        />

        {/* =========================
           MEMBER-WISE REPORT
        ========================= */}
        <div style={pdfRow}>
          <h3>👤 Member-wise Report</h3>
          <button onClick={() => openPDF("/reports/pdf/member-wise")}>
            📄 PDF
          </button>
        </div>

        <ReportTable
          columns={["member_name", "total_amount"]}
          data={memberWise}
        />
      </div>
    </>
  );
}

/* =========================
   🎨 STYLES (🔥 REQUIRED)
========================= */

const container = {
  maxWidth: 1000,
  margin: "30px auto",
  padding: 20,
};

const filterBox = {
  display: "flex",
  gap: 10,
  marginBottom: 25,
  alignItems: "center",
};

const pdfRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 30,
};
