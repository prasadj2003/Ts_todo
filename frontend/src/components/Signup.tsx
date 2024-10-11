// import { useState } from "react";
// import axios from "axios";

// function Signup() {

//     const [username, setUsername] = useState("");
//     const [firstname, setFirstname] = useState("");
//     const [lastname, setLastname] = useState("");
//     const [password, setPassword] = useState("");

//     async function handleClick(e: any) {
//         e.preventDefault();

//         const user = {
//             username: username,
//             firstname: firstname,
//             lastname: lastname,
//             password: password
//         }

//         await axios.post("http://localhost:3000/signup", user)
//     }


//   return (
//     <div>
//         <h1>Signup</h1>
        
//         <label id="username" htmlFor="username"></label>
//         <input id="username" name="username" placeholder="user@123" onChange={(e) => setUsername(e.target.value)}></input>
//         <label id="firstname" htmlFor="firstname"></label>
//         <input id="firstname" name="firstname" placeholder="john" onChange={(e) => setFirstname(e.target.value)}></input>
//         <label id="lastname" htmlFor="lastname"></label>
//         <input id="lastname" name="lastname" placeholder="doe" onChange={(e) => setLastname(e.target.value)}></input>
//         <label id="password" htmlFor="password"></label>
//         <input id="password" name="password" placeholder="password" type="password" onChange={(e) => setPassword(e.target.value)}></input>
//         <button onClick={handleClick}>Sign up</button>
//     </div>
//   )
// }
// export default Signup

// import { useState } from "react";
// import axios from "axios";

// function Signup() {
//   const [username, setUsername] = useState("");
//   const [firstname, setFirstname] = useState("");
//   const [lastname, setLastname] = useState("");
//   const [password, setPassword] = useState("");

//   async function handleClick(e: any) {
//     e.preventDefault();

//     const user = {
//       username,
//       firstname,
//       lastname,
//       password,
//     };

//     try {
//       await axios.post("http://localhost:3000/signup", user);
//       alert("Signup successful");
//       setUsername("");
//       setFirstname("");
//       setLastname("");
//       setPassword("");
//     } catch (error) {
//       console.error("Error signing up:", error);
//       alert("Signup failed");
//     }
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
//         <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
        
//         <form className="space-y-4">
//           <div>
//             <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
//             <input 
//               id="username"
//               name="username"
//               placeholder="user@123"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">First Name</label>
//             <input 
//               id="firstname"
//               name="firstname"
//               placeholder="John"
//               value={firstname}
//               onChange={(e) => setFirstname(e.target.value)}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Last Name</label>
//             <input 
//               id="lastname"
//               name="lastname"
//               placeholder="Doe"
//               value={lastname}
//               onChange={(e) => setLastname(e.target.value)}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
//             <input 
//               id="password"
//               name="password"
//               type="password"
//               placeholder="********"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             onClick={handleClick}
//             className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-400"
//           >
//             Sign Up
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Signup;
