import { Calendar as FullCalendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'



// Define a type for a todo item
interface Todo {
  title: string;
}

function Calendar() {

  const navigate = useNavigate();


  const calendarEl = useRef<HTMLDivElement>(null)
  const [allTodosOfDay, setAllTodosOfDay] = useState<Todo[]>([]) // Set the correct type for the state

  // Fetch tasks from the API
  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await axios.get("http://localhost:3000/todos")
        const tasks: Todo[] = res.data.todos // Make sure tasks match the Todo type
        setAllTodosOfDay(tasks) // Store fetched tasks in state
      } catch (error) {
        console.error("Error fetching tasks:", error)
      }
    }
    
    fetchTasks()
  }, []) // Empty dependency array to run only once when component mounts

  // Initialize calendar when tasks are available
  useEffect(() => {
    if (calendarEl.current && allTodosOfDay.length > 0) {
      const calendar = new FullCalendar(calendarEl.current, {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        weekends: true,
        height: '100%',
        aspectRatio: 1.5,
        events: allTodosOfDay.map((todo) => ({
          title: todo.title,
          start: new Date(), // Assuming todos have a 'date' field
        })),
      })
      calendar.render()
    }
  }, [allTodosOfDay]) // Re-render calendar when allTodosOfDay updates

  return (
    <div className="flex items-center justify-center h-screen">
      <div 
        id="calendar" 
        ref={calendarEl} 
        className="h-full w-2/3 max-w-7xl p-4 bg-white shadow-lg rounded-lg overflow-auto"
      />
      <div className="flex flex-col items-center justify-center bg-gradient-to-b from-gray-600 to-gray-800 w-1/3 h-full">
    <button 
      className="w-60 py-3 px-6 mb-4 text-lg font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200"
      onClick={() => navigate('/homepage')}
    >
      Home
    </button>
    
    <button 
      className="w-60 py-3 px-6 mb-4 text-lg font-semibold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-200"
      onClick={() => navigate('/statistics')}
    >
      Statistics
    </button>
  </div>
      
    </div>
  )
}

export default Calendar
