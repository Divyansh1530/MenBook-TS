import { BrowserRouter , Routes , Route } from "react-router-dom"
import Signup from "./pages/Signup"
import NavBar from "./components/NavBar"
// import type { NavBarProps } from "./types/user"
import type { User } from "./types/user"
import { useState } from "react"
import Login from "./pages/Login"
import Home from "./pages/Home"


function App() {

  const [user , setUser] = useState<User | null>(null)

  return (
    <BrowserRouter>
      <div className="bg-[#fbf6ee]">
        <NavBar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />}/>
          <Route path="/login" element={<Login setUser={setUser} />}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
