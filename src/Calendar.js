import React, { useState } from "react";
import "./Calendar.css";

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = ({ year, month, onDateClick, countdownEnd }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time for accurate comparison
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  // For the "breaking" animation on today
  const [breaking, setBreaking] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  // Today's date string in YYYY-MM-DD format
  const todayDateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Handle unlocking today: animate, then open modal
  const handleOwlClick = () => {
    if (!breaking) {
      setBreaking(true);
      setTimeout(() => {
        setUnlocked(true);
        setBreaking(false);
        onDateClick(todayDateString); // Open modal for today after unlock
      }, 1000); // match animation duration
    }
  };

  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);
    dateObj.setHours(0, 0, 0, 0);

    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    const isFuture = dateObj > today;

    // Show the owl on future days, and on today if it's not yet unlocked
    const showOwl = isFuture || (isToday && !unlocked);

    // Date string for this cell
    const cellDateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    calendarCells.push(
      <div
        key={day}
        className={`calendar-cell${isToday ? " today" : ""}${isFuture ? " disabled" : ""}`}
        onClick={() => {
          // Only allow clicking if not in the future and (for today) if unlocked
          if (!isFuture && (!isToday || unlocked)) {
            onDateClick(cellDateString);
          }
        }}
        style={{ cursor: !isFuture ? "pointer" : "not-allowed" }}
      >
        {day}
        {showOwl && (
          <img
            src="/images/owl-cave.png"
            alt="Owl Cave Symbol"
            className={`owl-cave-cell${isToday && breaking ? " breaking" : ""}`}
            onClick={isToday
              ? (e) => {
                  e.stopPropagation(); // Prevent cell click
                  handleOwlClick();
                }
              : undefined}
            style={{
              zIndex: 10,
              pointerEvents: isToday ? "auto" : "none",
              cursor: isToday ? "pointer" : "default"
            }}
          />
        )}
      </div>
    );
  }

 return (
    <div className="calendar-container" style={{ position: "relative", overflow: "hidden" }}>
      {/* Falling blossoms */}
      <img src={process.env.PUBLIC_URL + "/images/blossom.png"} className="cherry-blossom" alt="blossom" />
      <img src={process.env.PUBLIC_URL + "/images/blossom.png"} className="cherry-blossom" alt="blossom" />
      <img src={process.env.PUBLIC_URL + "/images/blossom.png"} className="cherry-blossom" alt="blossom" />
      <img src={process.env.PUBLIC_URL + "/images/blossom.png"} className="cherry-blossom" alt="blossom" />
      <img src={process.env.PUBLIC_URL + "/images/blossom.png"} className="cherry-blossom" alt="blossom" />

      {/* Calendar header and grid */}
      <div className="calendar-header">
        <h2>
          {today.toLocaleString("default", { month: "long" })} {year}
        </h2>
      </div>
      <div className="calendar-grid">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="calendar-cell header">
            {wd}
          </div>
        ))}
        {calendarCells}
      </div>
    </div>
  );
};

export default Calendar;
