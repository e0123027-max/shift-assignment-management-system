import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
const ManagerDashboard = () => {
  const { user, logout } = useAuth();
  const [shifts, setShifts] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [label, setLabel] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    try {
      const [shiftsRes, assignRes, staffRes] = await Promise.all([
        API.get("/shifts"),
        API.get("/assignments"),
        API.get("/auth/staff"),
      ]);
      setShifts(shiftsRes.data);
      setAssignments(assignRes.data);
      setStaffList(staffRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateShift = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await API.post("/shifts", { label, startTime, endTime });
      setLabel("");
      setStartTime("");
      setEndTime("");
      setMessage("Shift created successfully!");
      fetchData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to create shift");
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await API.post("/assignments", {
        staffId: selectedStaff,
        shiftId: selectedShift,
      });
      setMessage("Shift assigned successfully!");
      fetchData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to assign shift");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Manager Dashboard</h2>
        <div>
          <span>Welcome, {user?.name} </span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {message && (
        <p
          style={{
            padding: 10,
            background: message.includes("success") ? "#d4edda" : "#f8d7da",
            borderRadius: 4,
          }}
        >
          {message}
        </p>
      )}

      {/* Create Shift */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: 16,
          borderRadius: 8,
          marginBottom: 20,
        }}
      >
        <h3>Create Shift</h3>
        <form onSubmit={handleCreateShift}>
          <input
            type="text"
            placeholder="Shift Label (optional)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            style={{ padding: 8, marginRight: 8 }}
          />
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            style={{ padding: 8, marginRight: 8 }}
          />
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            style={{ padding: 8, marginRight: 8 }}
          />
          <button type="submit" style={{ padding: "8px 16px" }}>
            Create
          </button>
        </form>
      </div>

      {/* Assign Shift */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: 16,
          borderRadius: 8,
          marginBottom: 20,
        }}
      >
        <h3>Assign Shift to Staff</h3>
        <form onSubmit={handleAssign}>
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            required
            style={{ padding: 8, marginRight: 8 }}
          >
            <option value="">-- Select Staff --</option>
            {staffList.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.email})
              </option>
            ))}
          </select>
          <select
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            required
            style={{ padding: 8, marginRight: 8 }}
          >
            <option value="">-- Select Shift --</option>
            {shifts.map((s) => (
              <option key={s._id} value={s._id}>
                {s.label || "Shift"} ({new Date(s.startTime).toLocaleString()} -{" "}
                {new Date(s.endTime).toLocaleString()})
              </option>
            ))}
          </select>
          <button type="submit" style={{ padding: "8px 16px" }}>
            Assign
          </button>
        </form>
      </div>

      {/* Shifts List */}
      <div style={{ marginBottom: 20 }}>
        <h3>All Shifts ({shifts.length})</h3>
        <table
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th style={{ padding: 8, textAlign: "left" }}>Label</th>
              <th style={{ padding: 8, textAlign: "left" }}>Start</th>
              <th style={{ padding: 8, textAlign: "left" }}>End</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((s) => (
              <tr key={s._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: 8 }}>{s.label || "—"}</td>
                <td style={{ padding: 8 }}>
                  {new Date(s.startTime).toLocaleString()}
                </td>
                <td style={{ padding: 8 }}>
                  {new Date(s.endTime).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assignments List */}
      <div>
        <h3>All Assignments ({assignments.length})</h3>
        <table
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th style={{ padding: 8, textAlign: "left" }}>Staff</th>
              <th style={{ padding: 8, textAlign: "left" }}>Shift</th>
              <th style={{ padding: 8, textAlign: "left" }}>Start</th>
              <th style={{ padding: 8, textAlign: "left" }}>End</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: 8 }}>{a.staff?.name}</td>
                <td style={{ padding: 8 }}>{a.shift?.label || "—"}</td>
                <td style={{ padding: 8 }}>
                  {new Date(a.shift?.startTime).toLocaleString()}
                </td>
                <td style={{ padding: 8 }}>
                  {new Date(a.shift?.endTime).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerDashboard;