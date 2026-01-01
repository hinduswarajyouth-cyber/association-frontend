import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <button
      onClick={logout}
      style={{
        padding: "8px 14px",
        background: "crimson",
        color: "#fff",
        border: "none",
        borderRadius: 5,
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
}
