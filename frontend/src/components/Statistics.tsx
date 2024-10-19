import Chart from "chart.js/auto";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Statistics() {
  const navigate = useNavigate();

  const [dates, setDates] = useState<string[]>([]);
  const [totalTodos, setTotalTodos] = useState<number>(0);
  const [completedTodos, setCompletedTodos] = useState<number[]>([]);

  // Fetch todos data and set total and completed todos
  async function fetchTodosData() {
    const res = await axios.get("http://localhost:3000/todos");
    const todos = res.data.todos;
    setTotalTodos(todos.length);

    const completedTodosCount = todos.filter((todo) => todo.completed).length;
    setCompletedTodos([completedTodosCount]); // Assuming you're tracking per-day counts
  }

  // Fetch data and initialize dates once when component mounts
  useEffect(() => {
    fetchTodosData();
    const today = new Date();
    const calculatedDates = getDates(today, 15);
    setDates(calculatedDates);
  }, []);

  // Function to generate dates for the last n days
  function getDates(startDate: Date, days: number): string[] {
    const dates: string[] = [];
    let currentDate = new Date(startDate);

    while (dates.length < days) {
      const day = currentDate.getDate().toString().padStart(2, "0");
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const year = currentDate.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;
      dates.push(formattedDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  // Initialize the chart when data is ready
  useEffect(() => {
    let chartInstance: Chart | null = null;

    if (dates.length && completedTodos.length) {
      const ctx = document.getElementById("chart") as HTMLCanvasElement;

      if (chartInstance) {
        chartInstance.destroy(); // Destroy any existing chart to avoid memory leaks
      }

      chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: dates,
          datasets: [
            {
              label: "Completed Todos",
              data: completedTodos,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              grid: {
                color: "black",
                tickColor: "blue",
              },

              title: {
                text: "completed todos",
                display: true,
                color: "blue",
              },
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              },
              max: totalTodos,
            },

            x: {
              title: {
                text: "dates",
                display: true,
                color: "blue",
              },
            },
          },
        },
      });
    }

    // Cleanup on unmount to avoid multiple chart instances
    return () => {
      if (chartInstance) chartInstance.destroy();
    };
  }, [completedTodos, totalTodos]);

  console.log("total todos: ", totalTodos);
  console.log("completed todos: ", completedTodos);
  // Tailwind CSS Styling to ensure proper fit
  return (
    <div className="flex justify-center items-center h-screen bg-blue-100">
      {/* Chart Container */}
      <div className="w-2/3 p-6 bg-white rounded-lg shadow-lg mr-10">
        <canvas id="chart"></canvas>
      </div>

      {/* Button Section */}
      <div className="flex flex-col items-center justify-center bg-gradient-to-b from-gray-600 to-gray-800 w-1/3 h-full text-white">
        <button
          className="w-60 py-3 px-6 mb-6 text-lg font-semibold text-white bg-indigo-500 rounded-lg shadow-lg hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300"
          onClick={() => navigate("/homepage")}
        >
          Home
        </button>

        <button
          className="w-60 py-3 px-6 mb-4 text-lg font-semibold text-white bg-teal-500 rounded-lg shadow-lg hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all duration-300"
          onClick={() => navigate("/calendar")}
        >
          Calendar
        </button>
      </div>
    </div>
  );
}

export default Statistics;
