import { useState, useEffect } from "react";
import axios from "axios";

function Homepage() {
  interface Todo {
    id: number;
    title: string;
    description: string;
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState<string>("");
  const [todoDescription, setTodoDescription] = useState<string>("");

  useEffect(() => {
    async function fetchTodos() {
      try {
        const res = await axios.get("http://localhost:3000/todos");
        setTodos(res.data.todos);
      } catch (error) {
        console.log("error fetching todo", error);
      }
    }

    fetchTodos();
  }, [todos]);

  async function handleClick() {
    const todoBody = {
      title: todoTitle,
      description: todoDescription,
    };

    try {
      const res = await axios.post("http://localhost:3000/todos", todoBody);
      setTodoTitle("");
      setTodoDescription("");
      console.log("todo added successfully", res);
    } catch (error) {
      console.log("error adding todo", error);
    }
  }

  async function handleComplete(todoId: number) {
    // style should be strike through and completed marked as true in DB
    try {
      const res = await axios.put(`http://localhost:3000/todos/${todoId}`, {completed: true})
      setTodos(todos.map(todo => todo.id === todoId ? { ...todo, completed: true } : todo));
      console.log("todo completed", res)
    } catch (error) {
      console.log("failed to complete todo", error)
    }
  }

  async function handleEdit() {
    
  }

  async function handleDelete(todoId: number) {


    try {
      const result = await axios.delete(`http://localhost:3000/todos/${todoId}`)
      console.log(result);
    } catch (error) {
      console.log("error deleteing todo: ", error)
    }
  }

  return (
    <div className="bg-black w-full h-screen flex flex-col items-center justify-start pt-10">
      <div className="flex flex-row space-x-4">
        <input
          name="todo"
          id="todo"
          required
          type="text"
          value={todoTitle} // only after binding this to the state variable does it get reset after clicking add todo button
          className="text-black font-mono w-64 p-3 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter a task..."
          onChange={(e) => setTodoTitle(e.target.value)}
        />
        <input
          name="description"
          id="description"
          type="text"
          value={todoDescription}
          className="text-black font-mono w-32 p-3 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="description..."
          onChange={(e) => setTodoDescription(e.target.value)}
        />
        <button
          type="submit"
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 font-medium rounded-lg px-6 py-3 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
          onClick={handleClick}
        >
          Add Task
        </button>
      </div>

      <div className="mt-8">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="text-white mb-4 bg-slate-500 pt-3 pb-3 pr-5 pl-5 rounded-md w-96"
          >
            <h1 className="text-white font-bold">{todo.title}</h1>
            <h2 className="text-white">{todo.description}</h2>
            <button className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={handleComplete}>
              Complete
            </button>
            <button className="mtext-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={() => handleEdit(todo.id)}>
              Edit
            </button>
            <button className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={() => handleDelete(todo.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Homepage;
