import React, { useState } from "react";
import Calendar from "./Calendar";
import DayModal from "./DayModal";
import content from "./content";

function App() {
  const [selectedDate, setSelectedDate] = useState(null);

  // Example: May 2025 (month is 0-indexed, so 4 = May)
  const countdownEnd = new Date(2025, 5, 23); // June 23, 2025

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Countdown to Barcelona!</h1>

      {/* Calendar */}
      <Calendar
        year={2025}
        month={4} // May (0-indexed)
        onDateClick={setSelectedDate}
        countdownEnd={countdownEnd}
      />

      {/* Day Modal */}
      <DayModal
        date={selectedDate}
        content={content[selectedDate]}
        onClose={() => setSelectedDate(null)}
      />
    </div>
  );
}

export default App;
