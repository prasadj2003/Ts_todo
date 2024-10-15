function Homepage() {
  return (
    <div className="bg-black w-full h-screen flex flex-col items-center justify-start pt-10">
      <div className="flex flex-row space-x-4">
        <input
          name="todo"
          id="todo"
          required
          type="text"
          className="text-black font-mono w-64 p-3 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter a task..."
        />
        <button
          type="submit"
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 font-medium rounded-lg px-6 py-3 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
        >
          Add Task
        </button>
      </div>
    </div>
  );
}
export default Homepage;
