import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";
import Calendar from "../components/Calendar";
import { YearPicker, MonthPicker } from "../components/Pickers";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }
    setUser(user);
    await fetchTasks(user.id);
    setLoading(false);
  };

  const fetchTasks = async (userId) => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (!error) setTasks(data || []);
  };

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const addTask = async () => {
    if (!taskText.trim() || !user) return;
    const { data, error } = await supabase
      .from("tasks")
      .insert([{ user_id: user.id, text: taskText, date: formatDate(selectedDate) }])
      .select();
    if (!error) {
      setTasks([data[0], ...tasks]);
      setTaskText("");
    }
  };

  const deleteTask = async (id) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (!error) setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleSave = async (taskId) => {
    if (!editingText.trim()) return;
    const { error } = await supabase.from("tasks").update({ text: editingText }).eq("id", taskId);
    if (!error) {
      setTasks(tasks.map((t) => (t.id === taskId ? { ...t, text: editingText } : t)));
      setEditingTaskId(null);
      setEditingText("");
    }
  };

  const handleMonthChange = (dir) => {
    if (dir === 'month') setShowMonthPicker(true);
    else if (dir === 'year') setShowYearPicker(true);
    else setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + dir));
  };

  const getTaskCount = (day) => {
    const dateStr = formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    return tasks.filter((t) => t.date === dateStr).length;
  };

  const filteredTasks = tasks.filter((t) => t.date === formatDate(selectedDate));

  if (loading) return <div style={{ textAlign: "center", paddingTop: "50px" }}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Taskify 📝</h1>
        <p style={styles.subtitle}>🌟 Welcome {user?.email}!</p>

        <button onClick={() => setShowCalendar(!showCalendar)} style={styles.dateBtn}>
          📅 {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </button>

        {showCalendar && (
          <>
            <div style={styles.popup}>
              {showYearPicker ? (
                <YearPicker
                  currentYear={currentMonth.getFullYear()}
                  onSelect={(year) => {
                    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
                    setShowYearPicker(false);
                  }}
                  onBack={() => setShowYearPicker(false)}
                />
              ) : showMonthPicker ? (
                <MonthPicker
                  currentMonth={currentMonth.getMonth()}
                  onSelect={(month) => {
                    setCurrentMonth(new Date(currentMonth.getFullYear(), month, 1));
                    setShowMonthPicker(false);
                  }}
                  onBack={() => setShowMonthPicker(false)}
                />
              ) : (
                <Calendar
                  selectedDate={selectedDate}
                  currentMonth={currentMonth}
                  onDateSelect={setSelectedDate}
                  onMonthChange={handleMonthChange}
                  onYearChange={() => setShowYearPicker(true)}
                  onClose={() => {
                    setShowCalendar(false);
                    setShowYearPicker(false);
                    setShowMonthPicker(false);
                  }}
                  taskCounts={getTaskCount}
                />
              )}
            </div>
            <div onClick={() => setShowCalendar(false)} style={styles.overlay} />
          </>
        )}

        <div style={styles.inputGroup}>
          <input
            type="text"
            placeholder="Add a new task..."
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            style={styles.input}
          />
          <button onClick={addTask} style={styles.addBtn}>Add</button>
        </div>

        <div style={styles.taskList}>
          {filteredTasks.length === 0 ? (
            <p style={styles.emptyMsg}>📭 Is din aapne koi task add nahi kiya!</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {filteredTasks.map((task, idx) => (
                <li key={task.id} style={styles.taskItem}>
                  <div style={styles.taskRow}>
                    <div style={styles.taskContent}>
                      <span style={styles.taskNum}>{idx + 1}.</span>
                      <span style={{color:"black"}}>{task.text}</span>
                    </div>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <button onClick={() => {
                        if (editingTaskId === task.id) {
                          setEditingTaskId(null);
                          setEditingText("");
                        } else {
                          setEditingTaskId(task.id);
                          setEditingText(task.text);
                        }
                      }} style={styles.editBtn}>Edit</button>
                      <button onClick={() => deleteTask(task.id)} style={styles.delBtn}>X</button>
                    </div>
                  </div>
                  {editingTaskId === task.id && (
                    <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSave(task.id)}
                        style={{ ...styles.input, margin: 0 }}
                      />
                      <button onClick={() => handleSave(task.id)} style={styles.saveBtn}>Save</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button onClick={async () => { await supabase.auth.signOut(); navigate("/login"); }} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#FFF3E0", fontFamily: "sans-serif", padding: "0 20px" },
  card: { backgroundColor: "#FFCC80", padding: "40px", borderRadius: "15px", boxShadow: "0 8px 16px rgba(0,0,0,0.3)", width: "400px", maxWidth: "100%", textAlign: "center", position: "relative" },
  title: { color: "#E65100", marginBottom: "20px" },
  subtitle: { color: "#4E342E", fontSize: "16px", marginBottom: "20px" },
  dateBtn: { backgroundColor: "#FFE0B2", border: "2px solid #FF6F00", borderRadius: "8px", padding: "10px 20px", cursor: "pointer", fontSize: "16px", fontWeight: "bold", color: "#E65100", display: "flex", alignItems: "center", gap: "10px", margin: "0 auto 20px" },
  popup: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "#FFE0B2", padding: "20px", borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", zIndex: 1000, width: "320px" },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 999 },
  inputGroup: { display: "flex", gap: "10px", marginBottom: "20px" },
  input: { flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #FFB74D", backgroundColor: "#FFE0B2", color: "#4E342E" },
  addBtn: { padding: "10px 15px", borderRadius: "8px", border: "none", backgroundColor: "#FF6F00", color: "#fff", fontWeight: "bold", cursor: "pointer" },
  taskList: { maxHeight: "250px", overflowY: "auto" },
  emptyMsg: { color: "#4E342E", fontStyle: "italic", fontSize: "14px", backgroundColor: "#FFE0B2", padding: "15px", borderRadius: "8px" },
  taskItem: { backgroundColor: "#FFE0B2", marginBottom: "10px", padding: "10px", borderRadius: "8px", display: "flex", flexDirection: "column" },
  taskRow: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  taskContent: { display: "flex", alignItems: "center", gap: "10px" },
  taskNum: { fontWeight: "bold", color: "#000000", minWidth: "20px", textAlign: "center" },
  editBtn: { backgroundColor: "#FFB74D", color: "#4E342E", border: "none", borderRadius: "5px", cursor: "pointer", padding: "2px 6px" },
  delBtn: { backgroundColor: "#E65100", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", padding: "2px 6px" },
  saveBtn: { padding: "8px 12px", borderRadius: "5px", border: "none", backgroundColor: "#FF6F00", color: "#fff", cursor: "pointer" },
  logoutBtn: { marginTop: "20px", padding: "10px 20px", borderRadius: "8px", border: "none", backgroundColor: "#FF6F00", color: "#fff", fontWeight: "bold", cursor: "pointer" },
};

export default Home;