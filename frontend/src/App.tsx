import { BrowserRouter , Routes , Route } from "react-router-dom"
import Signup from "./pages/Signup"
import NavBar from "./components/NavBar"
import type { User } from "./types/user"
import { useState,useEffect } from "react"
import api from "./api/axios"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Footer from "./components/Footer"
import BrowseMentors from "./pages/BrowseMentors"
import Mentor from "./pages/Mentors"
import MentorAvailability from "./pages/MentorAvailability"
import Profile from "./pages/Profile"
import Dashboard from "./pages/Dashboard"
import MentorOnboarding from "./pages/MentorOnboarding"


function App() {

  const [user , setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await api.get<{ data: User }>(
        "/users/current-user",
        {
          withCredentials: true,
        }
      );

      setUser(res.data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
  );
}

  return (
    <BrowserRouter>
      <div className="bg-[#fbf6ee]">
        <NavBar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse-mentors" element={<BrowseMentors />} />
          <Route path="/mentors/:id" element={<Mentor user={user} />} />
          <Route path="/mentor-availability" element={<MentorAvailability user={user} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/mentor-onboarding" element={<MentorOnboarding user={user} setUser={setUser} />} />
          <Route path="/signup" element={<Signup />}/>
          <Route path="/login" element={<Login setUser={setUser} />}/>
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
