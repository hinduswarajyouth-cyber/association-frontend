import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Meetings() {
  const { user } = useAuth();
  const role = user.role;

  const [meetings, setMeetings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [resolutions, setResolutions] = useState([]);

  useEffect(() => {
    api.get("/meetings").then(res => setMeetings(res.data));
  }, []);

  const openMeeting = async m => {
    setSelected(m);
    await api.post(`/meetings/join/${m.id}`);
    const r = await api.get(`/meetings/resolution/${m.id}`);
    setResolutions(r.data);
  };

  const vote = (id, v) =>
    api.post(`/meetings/vote/${id}`, { vote: v }).then(() => alert("Voted"));

  return (
    <>
      <Navbar />
      <h2>Meetings</h2>

      {meetings.map(m => (
        <div key={m.id}>
          <b>{m.title}</b>
          <button onClick={() => openMeeting(m)}>Open</button>
        </div>
      ))}

      {selected && (
        <>
          <h3>{selected.title}</h3>
          <a href={selected.join_link} target="_blank">Join (Zoom/Meet)</a>

          <h4>Resolutions</h4>
          {resolutions.map(r => (
            <div key={r.id}>
              <p>{r.title}</p>
              <p>Status: {r.status}</p>

              {role === "EC_MEMBER" && !r.is_locked && (
                <>
                  <button onClick={() => vote(r.id,"YES")}>YES</button>
                  <button onClick={() => vote(r.id,"NO")}>NO</button>
                </>
              )}

              {r.status === "APPROVED" && (
                <a href={`${import.meta.env.VITE_API_BASE_URL}/${r.pdf_path}`} target="_blank">
                  Download PDF
                </a>
              )}
            </div>
          ))}
        </>
      )}
    </>
  );
}
