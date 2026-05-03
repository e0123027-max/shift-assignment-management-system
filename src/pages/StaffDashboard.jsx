import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const StaffDashboard = () => {
  const { user, logout } = useAuth();
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const { data } = await API.get("/assignments/my");
        setAssignments(data);
      } catch (err) {
        console.error("Error fetching assignments:", err);
      }
    };
    fetchAssignments();
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: "20px auto", padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Staff Dashboard</h2>
        <div>
          <span>Welcome, {user?.name} </span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <h3>My Assigned Shifts ({assignments.length})</h3>
      {assignments.length === 0 ? (
        <p>No shifts assigned yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th style={{ padding: 8, textAlign: "left" }}>Shift</th>
              <th style={{ padding: 8, textAlign: "left" }}>Start</th>
              <th style={{ padding: 8, textAlign: "left" }}>End</th>
              <th style={{ padding: 8, textAlign: "left" }}>Assigned By</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: 8 }}>{a.shift?.label || "—"}</td>
                <td style={{ padding: 8 }}>
                  {new Date(a.shift?.startTime).toLocaleString()}
                </td>
                <td style={{ padding: 8 }}>
                  {new Date(a.shift?.endTime).toLocaleString()}
                </td>
                <td style={{ padding: 8 }}>{a.assignedBy?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StaffDashboard;