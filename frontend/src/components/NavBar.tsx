import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, User, Calendar } from 'lucide-react';
import api from '../api/axios';
import { AxiosError } from 'axios';
import type { NavBarProps } from '../types/user';


function NavBar({
  user,
  setUser
}:NavBarProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {

  const handleClickOutside = (event: MouseEvent) => {

    if (
      profileRef.current &&
      !profileRef.current.contains(event.target as Node)
    ) {

      setProfileOpen(false)
    }
  }

  document.addEventListener(
    'mousedown',
    handleClickOutside
  )

  return () =>
    document.removeEventListener(
      'mousedown',
      handleClickOutside
    )

}, [])

  const handleLogout = async () => {
    try {
      await api.post('users/logout', {}, { withCredentials: true });
      setUser(null);
      setProfileOpen(false);
      navigate('/login');
    } catch (error) {
      const err = error as AxiosError<{message:string}>  
      alert(err.response?.data?.message || 'Logout failed');
    }
  };

  // Helper functions for dynamic routing based on role
  const getDashboardLink = () => '/dashboard'
  const getProfileLink = () => '/profile'; // Both roles use the same /profile route

  return (
    <nav className="sticky top-0 w-full bg-[#fdfaf3]/90 backdrop-blur-sm border-b border-black/5 px-6 md:px-12 z-9999">
      <div className="max-w-7xl mx-auto flex justify-between h-16 items-center">
        

        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#120f0a] rounded-lg flex items-center justify-center">
            <span className="text-[#fdfaf3] font-serif font-bold text-xl">M</span>
          </div>
          <span className="hero-heading font-serif text-xl tracking-tighter text-[#1a1a1a] transform scale-y-[1.2] origin-left">MenBook</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Link to="/" className="text-[0.95rem] font-medium text-gray-700 hover:text-black transition-colors">Home</Link>
          <Link to="/browse-mentors" className="text-[0.95rem] font-medium text-gray-700 hover:text-black transition-colors">Browse mentors</Link>
          

          {user?.role === 'mentor' && (
            <Link to="/mentor-availability" className="flex items-center gap-1.5 text-[0.95rem] font-medium text-gray-700 hover:text-black transition-colors">
              <Calendar size={16} />
              Availability
            </Link>
          )}
        </div>


        <div className="hidden md:flex items-center gap-8">
          {user ? (
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 pl-1 pr-4 py-1 bg-white/50 border border-black/5 rounded-full hover:bg-white transition-all shadow-sm"
              >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-red-100 flex items-center justify-center">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-red-500 text-sm font-serif">
                        {user.name[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                <span className="text-sm font-medium text-gray-800">{user.name}</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-[#fdfaf3] border border-black/5 rounded-[28px] shadow-2xl p-6 flex flex-col gap-1">
                  <div className="pb-4 border-b border-black/5 mb-2">
                    <p className="font-bold text-[#1a1a1a]">{user.name}</p>
                    <p className="text-sm text-gray-400 mb-2 truncate">{user.email}</p>
                    <span className="text-[10px] font-bold px-2 py-1 bg-red-50 text-red-400 rounded-md uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>

                  <Link 
                  to={getDashboardLink()} 
                  onClick={() => setProfileOpen(false)} 
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white transition-colors text-gray-700">
                  <LayoutDashboard 
                  size={18} 
                  className="text-gray-400" 
                  />
                  <span>
                    Dashboard
                  </span>
                  </Link>
                  <Link 
                  to={getProfileLink()} 
                  onClick={() => setProfileOpen(false)} 
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white transition-colors text-gray-700">
                    <User 
                    size={18} 
                    className="text-gray-400" 
                    /> 
                    <span>
                      Profile settings
                    </span>
                  </Link>
                  <hr className="my-2 border-black/5" />
                  <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white transition-colors text-gray-700">
                    <LogOut 
                    size={18} 
                    className="text-gray-400" 
                    /> 
                    <span>
                      Log out
                    </span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-7">
              <Link to="/login" className="text-gray-700 font-medium">Log in</Link>
              <Link to="/signup" className="bg-[#120f0a] text-white px-5 py-2 rounded-full font-normal">Sign up</Link>
            </div>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#fdfaf3] border-t border-black/5 p-6 space-y-4 pb-10">
          {user && (
            <div className="flex items-center gap-3 mb-6 p-4 bg-white/40 rounded-3xl border border-black/5">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-red-100 flex items-center justify-center">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-red-500 font-serif">
                      {user.name[0].toUpperCase()}
                    </span>
                  )}
                </div>
               <div>
                  <p className="font-bold text-[#1a1a1a]">{user.name}</p>
                  <p className="text-[10px] font-bold px-6 py-1 bg-red-50 text-red-400 rounded-md uppercase tracking-wider">{user.role}</p>
               </div>
            </div>
          )}
          <Link 
          to="/" 
          className="block text-lg font-medium text-gray-800" 
          onClick={() => setMenuOpen(false)}>
            Home
            </Link>
          <Link 
          to="/browse-mentors" 
          className="block text-lg font-medium text-gray-800" 
          onClick={() => setMenuOpen(false)}>
            Browse Mentors
          </Link>
          {!user &&
          <div className='flex gap-5'>
          <Link
          to="/login"
          className='text-lg py-1 font-medium text-gray-900'
          onClick={() => setMenuOpen(false)}
          >
           Login
          </Link>
          <Link
          to="/signup"
          className='text-md font-normal bg-black rounded-full px-4 py-2 text-white'
          onClick={() => setMenuOpen(false)}
          >
           Signup
          </Link>
          </div>
        }
          {user && (
            <>

              {user.role === 'mentor' && (
                <Link to="/mentor-availability" className="block text-lg font-medium text-gray-800" onClick={() => setMenuOpen(false)}>Availability</Link>
              )}
              <Link to={getDashboardLink()} className="block text-lg font-medium text-gray-800" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to={getProfileLink()} className="block text-lg font-medium text-gray-800" onClick={() => setMenuOpen(false)}>Profile Settings</Link>
              <button onClick={handleLogout} className="w-full text-left text-lg font-medium text-red-600">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default NavBar;