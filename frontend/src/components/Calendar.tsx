import { Calendar as FullCalendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'



// Define a type for a todo item
interface Todo {
  title: string;
}

function Calendar() {
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
        weekends: false,
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
        className="h-full w-full max-w-7xl p-4 bg-white shadow-lg rounded-lg overflow-auto"
      />
    </div>
  )
}

export default Calendar
