
'use client';

import { useState } from "react";
import Select from "react-select";

const airportOptions = [
  { value: "DCA", label: "Washington National (DCA)" },
  { value: "IAD", label: "Washington Dulles (IAD)" },
  { value: "BWI", label: "Baltimore/Washington (BWI)" },
  { value: "JFK", label: "New York (JFK)" },
  { value: "LHR", label: "London Heathrow (LHR)" },
  { value: "CDG", label: "Paris Charles de Gaulle (CDG)" },
  { value: "HND", label: "Tokyo Haneda (HND)" },
  { value: "DXB", label: "Dubai International (DXB)" },
  { value: "LAX", label: "Los Angeles (LAX)" },
  { value: "ORD", label: "Chicago O'Hare (ORD)" },
  { value: "NBO", label: "Nairobi Jomo Kenyatta (NBO)" },
  { value: "ADD", label: "Addis Ababa Bole (ADD)" },
  { value: "CMN", label: "Casablanca Mohammed V (CMN)" },
  { value: "LOS", label: "Lagos Murtala Muhammed (LOS)" },
  { value: "DKR", label: "Dakar Blaise Diagne (DKR)" }
];

const timeZoneOptions = [
  { value: "UTC-5", label: "UTC-5 – Eastern Time (Washington DC, New York)" },
  { value: "UTC-6", label: "UTC-6 – Central Time (Chicago)" },
  { value: "UTC-8", label: "UTC-8 – Pacific Time (Los Angeles)" },
  { value: "UTC+0", label: "UTC+0 – GMT (London)" },
  { value: "UTC+1", label: "UTC+1 – WAT (Lagos, Dakar)" },
  { value: "UTC+3", label: "UTC+3 – EAT (Nairobi, Addis Ababa)" },
  { value: "UTC+4", label: "UTC+4 – Gulf Time (Dubai)" },
  { value: "UTC+9", label: "UTC+9 – JST (Tokyo)" }
];

export default function Page() {
  const [entries, setEntries] = useState([
    {
      date: "",
      isWorkDay: "yes",
      departureCity: null,
      departure: "",
      departureTZ: null,
      arrivalDate: "",
      arrivalCity: null,
      arrival: "",
      arrivalTZ: null,
      compTime: null,
    },
  ]);

  const calculateCompTime = (entry) => {
    try {
      const depOffset = parseInt(entry.departureTZ?.value.replace("UTC", "")) || 0;
      const arrOffset = parseInt(entry.arrivalTZ?.value.replace("UTC", "")) || 0;

      const dep = new Date(`${entry.date}T${entry.departure}:00Z`);
      dep.setHours(dep.getHours() - depOffset);

      let arr = new Date(`${entry.arrivalDate || entry.date}T${entry.arrival}:00Z`);
      arr.setHours(arr.getHours() - arrOffset);

      if (arr < dep) arr.setDate(arr.getDate() + 1);

      let totalMinutes = 0;
      const current = new Date(dep);

      while (current < arr) {
        const day = current.getDay();
        const hour = current.getHours();
        const isWorkHour = (hour >= 9 && hour < 17) && (day >= 1 && day <= 5) && entry.isWorkDay === "yes";
        if (!isWorkHour) totalMinutes += 1;
        current.setMinutes(current.getMinutes() + 1);
      }

      return (Math.round((totalMinutes / 60) * 4) / 4).toFixed(2);
    } catch {
      return null;
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    if (updated[index].date && updated[index].departure && updated[index].arrival && updated[index].departureTZ && updated[index].arrivalTZ) {
      updated[index].compTime = calculateCompTime(updated[index]);
    }
    setEntries(updated);
  };

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        date: "",
        isWorkDay: "yes",
        departureCity: null,
        departure: "",
        departureTZ: null,
        arrivalDate: "",
        arrivalCity: null,
        arrival: "",
        arrivalTZ: null,
        compTime: null,
      },
    ]);
  };

  const totalCompTime = entries.reduce((sum, entry) => {
    return sum + (parseFloat(entry.compTime) || 0);
  }, 0);

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Comp Time for Travel Calculator</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: "0.5rem", fontWeight: "bold", borderBottom: "1px solid #ccc", paddingBottom: "0.5rem" }}>
        <div>Date</div>
        <div>Workday</div>
        <div>Departure City</div>
        <div>Departure Time</div>
        <div>Departure Time Zone</div>
        <div>Arrival City</div>
        <div>Arrival Date</div>
        <div>Arrival Time</div>
        <div>Arrival Time Zone</div>
        <div>Comp Time</div>
      </div>
      {entries.map((entry, index) => (
        <div key={index} style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: "0.5rem", marginTop: "0.5rem", alignItems: "center" }}>
          <input type="date" value={entry.date} onChange={(e) => handleChange(index, "date", e.target.value)} />
          <select value={entry.isWorkDay} onChange={(e) => handleChange(index, "isWorkDay", e.target.value)}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <Select options={airportOptions} value={entry.departureCity} onChange={(v) => handleChange(index, "departureCity", v)} />
          <input type="time" value={entry.departure} onChange={(e) => handleChange(index, "departure", e.target.value)} />
          <Select options={timeZoneOptions} value={entry.departureTZ} onChange={(v) => handleChange(index, "departureTZ", v)} />
          <Select options={airportOptions} value={entry.arrivalCity} onChange={(v) => handleChange(index, "arrivalCity", v)} />
          <input type="date" value={entry.arrivalDate} onChange={(e) => handleChange(index, "arrivalDate", e.target.value)} />
          <input type="time" value={entry.arrival} onChange={(e) => handleChange(index, "arrival", e.target.value)} />
          <Select options={timeZoneOptions} value={entry.arrivalTZ} onChange={(v) => handleChange(index, "arrivalTZ", v)} />
          <div>{entry.compTime ? `${entry.compTime} hrs` : "--"}</div>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
        <button onClick={addEntry} style={{ padding: "0.5rem 1rem", backgroundColor: "#333", color: "#fff", borderRadius: "5px" }}>Add Segment</button>
        <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Total Comp Time: {totalCompTime.toFixed(2)} hrs</div>
      </div>
    </div>
  );
}
