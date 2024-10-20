import Calendar from "./components/Calendar"
import Homepage from "./components/Homepage"
import Landing from "./components/Landing"
import Signin from "./components/Signin"
import Signup from "./components/Signup"
import Statistics from "./components/Statistics"


import { BrowserRouter, Routes, Route } from "react-router-dom"


function App() {
  
  


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/statistics" element={<Statistics />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
