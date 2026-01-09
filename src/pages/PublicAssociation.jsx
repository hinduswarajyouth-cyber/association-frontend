import { useEffect, useState } from "react";
import api from "../api/api";

export default function PublicAssociation() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/public/association-info").then((res) => setData(res.data));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div style={page}>
      {data.logo && (
        <img
          src={import.meta.env.VITE_API_BASE_URL + data.logo}
          alt="logo"
          style={{ width: 140 }}
        />
      )}

      <h1>{data.name}</h1>
      <p>{data.address}</p>
      <p>📞 {data.phone}</p>
      <p>📧 {data.email}</p>
    </div>
  );
}

const page = {
  padding: 40,
  textAlign: "center",
};
