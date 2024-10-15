import Homepage from "./components/Homepage"
import Landing from "./components/Landing"
import Signin from "./components/Signin"
import Signup from "./components/Signup"

import { BrowserRouter, Routes, Route } from "react-router-dom"


function App() {
  
  


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/homepage" element={<Homepage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
