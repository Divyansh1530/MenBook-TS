import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, User, Calendar, Contact, Info, Search, Home, LogIn, UserPlus } from 'lucide-react';
import api from '../api/axios';
import { AxiosError } from 'axios';
import type { NavBarProps } from '../types/user';
import {toast} from 'sonner'


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
      toast.error(err.response?.data?.message || 'Logout failed');
    }
  };

  const isMentorIncomplete = user?.role === 'mentor' && !user.isProfileComplete;

  return (
    <nav className="sticky top-0 w-full bg-[#fdfaf3]/90 backdrop-blur-sm border-b border-black/5 px-6 md:px-12 z-9999">
      <div className="max-w-7xl mx-auto flex justify-between h-16 items-center">
        

        <Link to={isMentorIncomplete ? "/mentor-onboarding" : "/"} className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#120f0a] rounded-lg flex items-center justify-center">
            <span className="text-[#fdfaf3] font-serif font-bold text-xl">M</span>
          </div>
          <span className="hero-heading font-serif text-xl tracking-tighter text-[#1a1a1a] transform scale-y-[1.2] origin-left">MenBook</span>
        </Link>

        {isMentorIncomplete ? (
          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-900 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider">
            Mentor Setup In Progress
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-10">
            <Link to="/" className="text-[0.95rem] font-medium text-gray-700 hover:text-black transition-colors">Home</Link>
            <Link to="/browse-mentors" className="text-[0.95rem] font-medium text-gray-700 hover:text-black transition-colors">Browse mentors</Link>
            <Link to="/about" className='text-[0.95rem] font-medium text-gray-700 hover:text-black transition-colors'>About</Link>
            <Link to="/contact" className='text-[0.95rem] font-medium text-gray-700 hover:text-black transition-colors'>Contact</Link>
            

            {user?.role === 'mentor' && (
              <Link to="/mentor-availability" className="flex items-center gap-1.5 text-[0.95rem] font-medium text-gray-700 hover:text-black transition-colors">
                <Calendar size={16} />
                Availability
              </Link>
            )}
          </div>
        )}


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

                  {!isMentorIncomplete && (
                    <>
                      <Link 
                        to="/dashboard" 
                        onClick={() => setProfileOpen(false)} 
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white transition-colors text-gray-700">
                        <LayoutDashboard size={18} className="text-gray-400" />
                        <span>Dashboard</span>
                      </Link>
                      <Link 
                        to="/profile" 
                        onClick={() => setProfileOpen(false)} 
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white transition-colors text-gray-700">
                        <User size={18} className="text-gray-400" /> 
                        <span>Profile settings</span>
                      </Link>
                      <hr className="my-2 border-black/5" />
                    </>
                  )}

                  <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white transition-colors text-gray-700 cursor-pointer">
                    <LogOut size={18} className="text-gray-400" /> 
                    <span>Log out</span>
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
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-red-100 shrink-0 flex items-center justify-center">
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
               <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[#1a1a1a] leading-tight">{user.name}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-red-50 text-red-400 rounded-md uppercase tracking-wider">{user.role}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
               </div>
            </div>
          )}

          {isMentorIncomplete ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Please complete your essential mentor details to continue.
              </p>
              <button 
                onClick={handleLogout} 
                className="flex items-center w-full text-lg gap-2 font-medium text-red-600 cursor-pointer">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <>
              <Link 
                to="/" 
                className="text-lg font-medium text-gray-800 flex items-center gap-1" 
                onClick={() => setMenuOpen(false)}>
                <Home size={18} className='text-gray-400'/>
                <span>Home</span>
              </Link>
              <Link 
                to="/browse-mentors" 
                className="text-lg font-medium text-gray-800 flex items-center gap-1" 
                onClick={() => setMenuOpen(false)}>
                <Search size={18} className='text-gray-400'/>
                <span>Browse Mentors</span>
              </Link>
              
              <Link 
                to="/about" 
                className="text-lg font-medium text-gray-800 flex items-center gap-1" 
                onClick={() => setMenuOpen(false)}>
                <Info size={18} className='text-gray-400' />
                <span>About</span>
              </Link>
              <Link 
                to="/contact" 
                className="text-lg font-medium text-gray-800 flex items-center gap-1" 
                onClick={() => setMenuOpen(false)}>
                <Contact size={18} className='text-gray-400'/>
                <span>Contact</span>
              </Link>

              {!user && (
                <div className='flex items-center gap-5'>
                  <Link
                    to="/signup"
                    className='text-lg py-1 font-medium text-gray-900  flex items-center gap-1 underline-offset-1'
                    onClick={() => setMenuOpen(false)}
                  >
                    <UserPlus size={18} className='text-gray-400'/>
                    <span>Signup</span>
                  </Link>
                  <Link
                    to="/login"
                    className='text-lg py-1 font-medium text-gray-900  flex items-center gap-1 underline-offset-1'
                    onClick={() => setMenuOpen(false)}
                  >
                    <LogIn size={18} className='text-gray-400' />
                    <span>Login</span>
                  </Link>
                  
                </div>
              )}

              {user && (
                <>
                  {user.role === 'mentor' && (
                    <Link to="/mentor-availability" className="flex items-center gap-1 text-lg font-medium text-gray-800" onClick={() => setMenuOpen(false)}>
                      <Calendar size={18} className='text-gray-400'/>
                      <span>Availability</span>
                    </Link>
                  )}
                  <Link to="/dashboard" className="flex items-center text-lg font-medium text-gray-800 space-x-1" onClick={() => setMenuOpen(false)}>
                    <LayoutDashboard size={18} className="text-gray-400" />
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/profile" className="flex items-center text-lg font-medium text-gray-800 space-x-1" onClick={() => setMenuOpen(false)}>
                    <User size={18} className="text-gray-400" />
                    <span>Profile Settings</span>
                  </Link>
                  <button onClick={handleLogout} className="flex items-center w-full text-lg gap-1 font-medium text-red-600 cursor-pointer">
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default NavBar;