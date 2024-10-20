import { useState } from "react";
import axios from "axios";

function Appointment() {
  const [appointmentTitle, setAppointmentTitle] = useState<string>("");
  const [appointmentDateTime, setAppointmentDateTime] = useState<string>("");

  async function handleClick() {
    try {
      const res = await axios.post("http://localhost:3000/appointments", {
        title: appointmentTitle,
        dateTime: appointmentDateTime, // Send the combined datetime string
      });

      if (res.statusText === "OK") {
        alert("Appointment added successfully");
      }
    } catch (error) {
      console.log("Error adding appointment: ", error);
      alert("Error adding appointment");
    }
  }

  return (
    <div>
        
      <input
        name="title"
        id="title"
        required
        placeholder="Add appointment"
        type="text"
        value={appointmentTitle}
        onChange={(e) => setAppointmentTitle(e.target.value)}
        className="text-black font-mono w-64 p-3 mr-5 mt-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        name="datetime"
        id="datetime"
        required
        type="datetime-local" // Allows both date and time input
        value={appointmentDateTime}
        onChange={(e) => setAppointmentDateTime(e.target.value)}
        className="text-black font-mono w-64 p-3 mt-2 mr-5 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleClick}
        className="bg-blue-500 text-white font-mono py-2 px-4 mt-2 rounded-md hover:bg-blue-600"
      >
        Add Appointment
      </button>
    </div>
  );
}

export default Appointment;
