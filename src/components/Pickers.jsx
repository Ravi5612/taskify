export const YearPicker = ({ currentYear, onSelect, onBack }) => {
    const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  
    return (
      <div>
        <h3 style={{ color: "#E65100", marginBottom: "15px", fontSize: "16px" }}>Select Year</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", maxHeight: "250px", overflowY: "auto", marginBottom: "15px" }}>
          {years.map((year) => (
            <button
              key={year}
              onClick={() => onSelect(year)}
              style={{
                padding: "10px",
                backgroundColor: year === currentYear ? "#FF6F00" : "#FFCC80",
                color: year === currentYear ? "#fff" : "#4E342E",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {year}
            </button>
          ))}
        </div>
        <button onClick={onBack} style={btnStyle}>Back</button>
      </div>
    );
  };
  
  export const MonthPicker = ({ currentMonth, onSelect, onBack }) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
    return (
      <div>
        <h3 style={{ color: "#E65100", marginBottom: "15px", fontSize: "16px" }}>Select Month</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "15px" }}>
          {months.map((month, idx) => (
            <button
              key={month}
              onClick={() => onSelect(idx)}
              style={{
                padding: "10px",
                backgroundColor: idx === currentMonth ? "#FF6F00" : "#FFCC80",
                color: idx === currentMonth ? "#fff" : "#4E342E",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "12px",
              }}
            >
              {month.slice(0, 3)}
            </button>
          ))}
        </div>
        <button onClick={onBack} style={btnStyle}>Back</button>
      </div>
    );
  };
  
  const btnStyle = {
    backgroundColor: "#FF6F00",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: "bold",
    width: "100%",
  };