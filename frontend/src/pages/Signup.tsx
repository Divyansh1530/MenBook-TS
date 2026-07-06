import { useState, type ChangeEvent, type FormEvent } from 'react'
import api from '../api/axios.ts'
import { Link, useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import type { AxiosError } from 'axios'
import { FcGoogle } from 'react-icons/fc'
import { Eye , EyeOff } from 'lucide-react'
import PageTransition from '../components/PageTransition.tsx'

interface FormErrors {
    name?:string;
    email?:string;
    password?:string;
    pricing?:string;
  }

  interface SignupFormData {
    name:string;
    email:string;
    password:string;
    role:"user" | "mentor";
    title:string;
    bio:string;
    expertise:string;
    pricing:string;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/

function Signup() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const roleFromURL = searchParams.get("role")

  const [errors , setErrors] = useState<FormErrors>({})
  
  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Minimum 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character.";
    }

    if (Number(formData.pricing) < 0) {
      newErrors.pricing = "Price cannot be negative"
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const [serverError , setServerError] = useState("")
  const [showPassword , setShowPassword] = useState(false)

  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    role: roleFromURL === "mentor" ? "mentor" : "user",
    title:"",
    bio: "",
    expertise: "",
    pricing: ""
  })

  const [avatar, setAvatar] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setLoading(true)
      const data = new FormData()
      data.append("name", formData.name)
      data.append("email", formData.email)
      data.append("password", formData.password)
      data.append("role", formData.role)

      if (formData.role === "mentor") {
        data.append("title", formData.title)
        data.append("bio", formData.bio)
        data.append("expertise", JSON.stringify(formData.expertise.split(",").map(i => i.trim())))
        data.append("pricing", Number(formData.pricing).toString())
      }
      if (avatar) data.append("avatar", avatar)

      await api.post("/users/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      })
      navigate("/login")
    } catch (error) {
      const err = error as AxiosError<{message:string}>;  
      setServerError(err.response?.data?.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
    <div className="min-h-screen bg-[#fdfaf3] flex flex-col items-center justify-center py-20 px-6">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-10">
          <h1 className="hero-heading font-serif text-left text-4xl text-[#1a1a1a] mb-3 tracking-tighter transform scale-y-[1.3] origin-left">
            Create your account.
          </h1>
          <p className="text-gray-500 text-left font-sans">
            Two minutes. No credit card.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-normal tracking-[0.15em] text-black/50 uppercase mb-3">
              I'M JOINING AS
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'user' })}
                className={`p-5 rounded-2xl border transition-all text-left flex flex-col gap-1 ${
                  formData.role === 'user' 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-white/40 border-black/5'
                }`}
              >
                <span className="font-serif text-xl">A learner</span>
                <span className="text-xs text-gray-500">Book mentors</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'mentor' })}
                className={`p-5 rounded-2xl border transition-all text-left flex flex-col gap-1 ${
                  formData.role === 'mentor' 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-white/40 border-black/5'
                }`}
              >
                <span className="font-serif text-xl">A mentor</span>
                <span className="text-xs text-gray-500">Take bookings</span>
              </button>
            </div>
          </div>
           <button
            type="button"
            onClick={() => {
              window.location.href =
                `${import.meta.env.VITE_API_URL}/users/auth/google/signup?role=${formData.role}`
            }}
             className="flex bg-[#fefcf8] items-center justify-center gap-3 w-full rounded-2xl border border-gray-300 py-3 font-medium transition cursor-pointer"
                      ><FcGoogle size={22}/>
                      <span>Sign up With Google</span>
          </button>
          <div className='text-center'>
            OR
          </div>
          <div>
            <label className="block text-[10px] font-normal tracking-[0.15em] text-black/50 uppercase mb-2">
              FULL NAME
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full bg-white/40 rounded-2xl px-5 py-4 outline-none transition-all font-sans
                ${
                  errors.name
                  ? "border border-red-500"
                  : "border border-black/10 focus:border-black/30"
                }
                `}
              
            />
            {errors.name && (
              <p className='mt-1 text-sm text-red-500'>
                {errors.name}
              </p>

            )}
          </div>

          <div>
            <label className="block text-[10px] font-normal tracking-[0.15em] text-black/50 uppercase mb-2">
              EMAIL
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full bg-white/40 rounded-2xl px-5 py-4 outline-none transition-all font-sans
                ${ 
                  errors.email
                  ? "border border-red-500"
                  : "border border-black/10 focus:border-black/30 "
                }
                `}
            />
            {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email}
                </p>
              )}
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
              required
              className={`w-full bg-white/40 rounded-2xl px-5 py-4 outline-none transition-all font-sans
                ${
                  errors.password
                  ? "border border-red-500"
                  : "border border-black/10 focus:border-black/30 "
                }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                </div>
            {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password}
                </p>
              )}
          </div>

          {formData.role === "mentor" && (
            <div className="space-y-6 pt-2 border-t border-black/5">
              <div>
                <label className="block text-[10px] font-normal tracking-[0.15em] text-black/50 uppercase mb-2">
                  TITLE
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-white/40 border border-black/10 rounded-2xl px-5 py-4 outline-none focus:border-black/30 transition-all font-sans"
                />
              </div>
               <div>
                <label className="block text-[10px] font-normal tracking-[0.15em] text-black/50 uppercase mb-2">BIO</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full bg-white/40 border border-black/10 rounded-2xl px-5 py-4 h-24 outline-none focus:border-black/30 transition-all font-sans" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-normal tracking-[0.15em] text-black/50 uppercase mb-2">EXPERTISE</label>
                  <input type="text" name="expertise" value={formData.expertise} onChange={handleChange} className="w-full bg-white/40 border border-black/10 rounded-2xl px-5 py-4 outline-none focus:border-black/30 transition-all font-sans" />
                </div>
                <div>
                  <label className="block text-[10px] font-normal tracking-[0.15em] text-black/50 uppercase mb-2">PRICE</label>
                  <input type="number" name="pricing" value={formData.pricing} onChange={handleChange} className={`w-full bg-white/40 border rounded-2xl px-5 py-4 outline-none transition-all font-sans
                  ${
                    errors.pricing
                    ? "border border-red-500"
                    : "border border-black/10 focus:border-black/30 "
                }`}
                     />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-normal tracking-[0.15em] text-black/50 uppercase mb-2">AVATAR IMAGE</label>
            <input
              type="file"
              onChange={(e:ChangeEvent<HTMLInputElement>) => setAvatar(e.target.files?.[0] ?? null)}
              className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-black/5 file:text-black hover:file:bg-black/10"
            />
          </div>
          {serverError && (
              <p className="text-red-500 text-sm text-center">
                {serverError}
              </p>
            )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#120f0a] text-white py-3 rounded-full font-medium text-lg hover:bg-black transition-all active:scale-[0.98] mt-4"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-8 font-sans">
          Already have one? <Link to="/login" className="text-black font-semibold border-b border-black">Log in</Link>
        </p>
      </div>
    </div>
    </PageTransition>
  )
}

export default Signup