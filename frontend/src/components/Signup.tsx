import { useState } from "react";
import axios from "axios";

function Signup() {
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");

  async function handleClick(e: any) {
    e.preventDefault();

    const user = {
      username: username,
      firstname: firstname,
      lastname: lastname,
      password: password,
    };

    try {
      await axios.post("http://localhost:3000/signup", user);
      alert("signed up successfully");
      setUsername("");
      setFirstname("");
      setLastname("");
      setPassword("");
    } catch (error) {
      console.log("error signing up: ", error);
      alert("signup failed") 
    }

  }
    

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="bg-slate-600 shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="mb-6 block text-3xl font-medium text-gray-900 dark:text-white">
          Signup
        </h1>

        <form>
          <label
            htmlFor="username"
            className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
          >
            username
          </label>
          <input
            id="username"
            name="username"
            placeholder="prasad@123"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
            className="mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />

          <label
            htmlFor="firstname"
            className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
          >
            firstname
          </label>
          <input
            id="firstname"
            name="firstname"
            placeholder="Prasad"
            value={firstname}
            required
            onChange={(e) => setFirstname(e.target.value)}
            className="mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />

          <label
            htmlFor="lastname"
            className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
          >
            lastname
          </label>
          <input
            id="lastname"
            name="lastname"
            placeholder="Joshi"
            value={lastname}
            required
            onChange={(e) => setLastname(e.target.value)}
            className="mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />

          <label
            htmlFor="password"
            className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
          >
            password
          </label>
          <input
            id="password"
            name="password"
            placeholder="******"
            value={password}
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
            className="mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </form>

        <button
          className="mt-2 w-full text-white bg-blue-600 hover:bg-black focus:ring-2 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          onClick={handleClick}
        >
          Sign up
        </button>
        <p className="mt-1 text-sm font-light text-white dark:text-white">
          Already have an account?{" "}
          <a
            href="#"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
export default Signup;
