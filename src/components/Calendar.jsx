const Calendar = ({ 
    selectedDate, 
    currentMonth, 
    onDateSelect, 
    onMonthChange, 
    onYearChange,
    onClose,
    taskCounts 
  }) => {
    const getDaysInMonth = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1).getDay();
      const lastDay = new Date(year, month + 1, 0).getDate();
      return { firstDay, lastDay };
    };
  
    const { firstDay, lastDay } = getDaysInMonth(currentMonth);
  
    const isSelected = (day) => {
      return (
        day === selectedDate.getDate() &&
        currentMonth.getMonth() === selectedDate.getMonth() &&
        currentMonth.getFullYear() === selectedDate.getFullYear()
      );
    };
  
    const isToday = (day) => {
      const today = new Date();
      return (
        day === today.getDate() &&
        currentMonth.getMonth() === today.getMonth() &&
        currentMonth.getFullYear() === today.getFullYear()
      );
    };
  
    const isFutureDate = (day) => {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date > today;
    };
  
    const handleDateClick = (day) => {
      if (isFutureDate(day)) return;
      const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      onDateSelect(newDate);
    };
  
    return (
      <>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <button onClick={() => onMonthChange(-1)} style={styles.navBtn}>←</button>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => onMonthChange('month')} style={styles.headerBtn}>
              {currentMonth.toLocaleDateString("en-US", { month: "long" })}
            </button>
            <button onClick={() => onYearChange('year')} style={styles.headerBtn}>
              {currentMonth.getFullYear()}
            </button>
          </div>
          <button onClick={() => onMonthChange(1)} style={styles.navBtn}>→</button>
        </div>
  
        <div style={styles.daysGrid}>
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div key={i} style={styles.dayName}>{day}</div>
          ))}
        </div>
  
        <div style={{ ...styles.daysGrid, marginBottom: "15px" }}>
          {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
          
          {Array.from({ length: lastDay }).map((_, i) => {
            const day = i + 1;
            const count = taskCounts(day);
            const future = isFutureDate(day);
            
            return (
              <div
                key={day}
                onClick={() => handleDateClick(day)}
                style={{
                  ...styles.dayCell,
                  backgroundColor: isSelected(day) ? "#FF6F00" : isToday(day) ? "#FFB74D" : "#FFCC80",
                  color: future ? "#ccc" : isSelected(day) ? "#fff" : "#4E342E",
                  cursor: future ? "not-allowed" : "pointer",
                  opacity: future ? 0.5 : 1,
                  border: isToday(day) ? "2px solid #E65100" : "none",
                }}
              >
                {day}
                {count > 0 && !future && (
                  <div style={styles.badge}>{count}</div>
                )}
              </div>
            );
          })}
        </div>
  
        <button onClick={onClose} style={styles.okBtn}>OK</button>
      </>
    );
  };
  
  const styles = {
    navBtn: {
      backgroundColor: "#FF6F00",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      padding: "5px 10px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    headerBtn: {
      background: "none",
      border: "none",
      color: "#E65100",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "14px",
      textDecoration: "underline",
    },
    daysGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gap: "3px",
      marginBottom: "5px",
    },
    dayName: {
      fontWeight: "bold",
      color: "#E65100",
      textAlign: "center",
      fontSize: "12px",
    },
    dayCell: {
      padding: "8px",
      borderRadius: "5px",
      textAlign: "center",
      fontSize: "12px",
      position: "relative",
    },
    badge: {
      position: "absolute",
      top: "1px",
      right: "1px",
      backgroundColor: "#E65100",
      color: "#fff",
      borderRadius: "50%",
      width: "14px",
      height: "14px",
      fontSize: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
    },
    okBtn: {
      backgroundColor: "#FF6F00",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "10px 20px",
      cursor: "pointer",
      fontWeight: "bold",
      width: "100%",
    },
  };
  
  export default Calendar;