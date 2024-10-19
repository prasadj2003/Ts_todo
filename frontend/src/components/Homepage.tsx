import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Homepage() {
  interface Todo {
    id: number;
    title: string;
    description: string;
    completed: boolean;
  }

  const navigate = useNavigate();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState<string>("");
  const [todoDescription, setTodoDescription] = useState<string>("");

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTodoId, setEditTodoId] = useState<number | null>(null);

  // Fetch todos from the backend when the component mounts
  const fetchTodos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/todos");
      console.log("Fetched todos:", res.data.todos);
      setTodos(res.data.todos || []);
    } catch (error) {
      console.log("Error fetching todos", error);
    }
  };

  useEffect(() => {
    // async function fetchTodos() {
    //   try {
    //     const res = await axios.get("http://localhost:3000/todos");
    //     console.log("Fetched todos:", res.data.todos);
    //     setTodos(res.data.todos || []); // Set todos to an empty array if undefined
    //   } catch (error) {
    //     console.log("Error fetching todos", error);
    //   }
    // }

    fetchTodos();
  }, []);

  // async function handleClick() {
  //   const todoBody = {
  //     title: todoTitle,
  //     description: todoDescription,
  //   };

  //   try {
  //     if (isEditing && editTodoId !== null) {
  //       // Update the todo
  //       const updatedTodo = {
  //         title: todoTitle,
  //         description: todoDescription,
  //         completed: false, // Keep it false while editing
  //       };
  //       const res = await axios.put(`http://localhost:3000/todos/${editTodoId}`, updatedTodo);

  //       setTodos(
  //         todos.map((todo) =>
  //           todo.id === editTodoId
  //             ? { ...todo, title: updatedTodo.title, description: updatedTodo.description }
  //             : todo
  //         )
  //       );
  //       console.log("Todo updated successfully", res);
  //       setIsEditing(false);
  //       setEditTodoId(null);
  //     } else {
  //       // Add a new todo
  //       const res = await axios.post("http://localhost:3000/todos", todoBody);
  //       setTodos((prevTodos) => [...prevTodos, { ...res.data.todo, completed: false }]); // Include completed as false for new todos
  //       console.log("Todo added successfully", res);
  //     }

  //     setTodoTitle("");
  //     setTodoDescription("");
  //   } catch (error) {
  //     console.log("Error adding or updating todo", error);
  //   }
  // }

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
      fetchTodos();
    } catch (error) {
      console.log("error adding todo", error);
    }
  }

  // async function handleComplete(todoId: number) {
  //   try {
  //     const res = await axios.put(`http://localhost:3000/todos/${todoId}`, {
  //       completed: true,
  //     });

  //     setTodos(
  //       todos.map((todo) =>
  //         todo.id === todoId ? { ...todo, completed: true } : todo
  //       )
  //     );
  //     console.log("Todo completed", res);
  //   } catch (error) {
  //     console.error("Failed to complete todo", error);
  //   }
  // }

  async function handleComplete(id: number) {
    const todoToBeCompleted = todos.find((todo) => todo.id === id);
    console.log(todoToBeCompleted);
    // title, description and completed needs to be in the todo body -> I am getting this message "Todo body not in proper format"
    const res = await axios.put(`http://localhost:3000/todos/${id}`, {
      ...todoToBeCompleted,
      completed: true,
    });
    if (res.statusText === "OK")
      alert(`todo with id:${id} marked as completed`);
    else alert("todo not marked as completed");
    fetchTodos();
  }

  async function handleEdit(id: number) {
    const todoToEdit = todos.find((todo) => todo.id === id);
    setIsEditing(true);
    if (todoToEdit) {
      setTodoTitle(todoToEdit.title);
      setTodoDescription(todoToEdit.description);
      setIsEditing(true);
      setEditTodoId(id);
    }
    fetchTodos();
  }

  async function handleDelete(todoId: number) {
    try {
      await axios.delete(`http://localhost:3000/todos/${todoId}`);
      setTodos(todos.filter((todo) => todo.id !== todoId));
      console.log("Todo deleted successfully");
    } catch (error) {
      console.error("Error deleting todo", error);
    }
    fetchTodos();
  }

  return (
    <div className="bg-gradient-to-b from-gray-600 to-gray-800 w-full h-screen flex flex-col items-center justify-start pt-10 overflow-auto">
      <h1 className="color-white text-white font-bold text-5xl mb-5">TaskTrek</h1>
      <div className="flex flex-row space-x-4">
        <input
          name="todo"
          id="todo"
          required
          type="text"
          value={todoTitle}
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
          placeholder="Description..."
          onChange={(e) => setTodoDescription(e.target.value)}
        />
        <button
          type="submit"
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 font-medium rounded-lg px-6 py-3 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
          onClick={handleClick}
        >
          {isEditing ? "Update Task" : "Add Task"}
        </button>
      </div>

      <div className="mt-8">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`text-white mb-4 bg-slate-500 pt-3 pb-3 pr-5 pl-5 rounded-md w-96 ${
                todo.completed ? "line-through" : ""
              }`}
            >
              <h1 className="text-white font-bold">{todo.title}</h1>
              <h2 className="text-white">{todo.description}</h2>
              <button
                className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 shadow-lg shadow-green-500/50 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                onClick={() => handleComplete(todo.id)}
              >
                Complete
              </button>
              <button
                className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 shadow-lg shadow-cyan-500/50 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                onClick={() => handleEdit(todo.id)}
              >
                Edit
              </button>
              <button
                className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 shadow-lg shadow-red-500/50 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                onClick={() => handleDelete(todo.id)}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-white">No todos found</p>
        )}
      </div>
      <div className="flex flex-row justify-center items-center">
        <button
          className="w-60 py-3 px-6 mb-4 mr-5 text-lg font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200"
          onClick={() => navigate("/calendar")}
        >
          calendar
        </button>
        <button
          className="w-60 py-3 px-6 mb-4 ml-5 text-lg font-semibold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-200"
          onClick={() => navigate("/statistics")}
        >
          statistics
        </button>
      </div>
    </div>
  );
}

export default Homepage;
