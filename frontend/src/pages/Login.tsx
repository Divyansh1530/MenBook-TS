import { useState , type ChangeEvent , type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import type { User } from '../types/user';
import { AxiosError } from 'axios';
import {FcGoogle} from 'react-icons/fc'
import {toast} from 'sonner'
import PageTransition from '../components/PageTransition';
import { Eye,EyeOff } from 'lucide-react';

interface LoginProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface LoginFormData {
    email:string;
    password:string;
}

function Login({
  setUser
}:LoginProps) {
  const navigate = useNavigate()
  const [role] = useState<"user" | "mentor">('user') // State for User/Mentor toggle
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword , setShowPassword] = useState(false)


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await api.post(
        '/users/login',
        { ...formData, role }, // Including role in request if your backend needs it
        { withCredentials: true }
      )
      setUser(response.data.data.user)
      navigate("/")
    } catch (error) {
      const err = error as AxiosError<{message:string}>
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
    <div className="md:min-h-screen min-h-[80vh] bg-[#fdfaf3] flex flex-col items-center justify-center pt-5 md:pt-20 p-6">
      <div className="w-full max-w-md">
        
        <div className="mb-10">
          <h1 className="hero-heading font-serif text-4xl text-[#1a1a1a] mb-3 tracking-tight transform scale-y-[1.4] origin-left">
            Welcome back.
          </h1>
          <p className="text-gray-600 font-sans">
            Log in to manage your sessions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            
          <a 
          href={`${import.meta.env.VITE_API_URL}/users/auth/google/login`}
          className="flex bg-[#fefcf8] items-center justify-center gap-3 w-full rounded-2xl border border-gray-300 py-3 font-medium transition"
          ><FcGoogle size={22}/>
          <span>Log in With Google</span>
          </a>
          <div className='flex items-center py-4 justify-center hero-heading font-serif text-md text-[#1a1a1a] mb-2 tracking-normal transform scale-y-[1.1] origin-left'>
            OR
          </div>
            <label className="block text-[10px] font-normal tracking-[0.15em] text-black/50 uppercase mb-2">
              EMAIL
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/40 border border-black/10 rounded-2xl px-5 py-4 outline-none focus:border-black/30 transition-all font-sans"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-normal tracking-[0.15em] text-black/50 uppercase mb-2">
              PASSWORD
            </label>
            <div className='relative'>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white/40 border border-black/10 rounded-2xl px-5 py-4 outline-none focus:border-black/30 transition-all font-sans"
              required
            />
            <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#120f0a] text-white py-3 rounded-full font-medium text-lg hover:bg-black transition-all active:scale-[0.98] mt-4"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
          
        </form>

        <p className="text-center text-gray-600 mt-8 font-sans">
          New here? <Link to="/signup" className="text-black font-semibold border-b border-black">Create an account</Link>
        </p>
      </div>
    </div>
    </PageTransition>
  )
}

export default Login