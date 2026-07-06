import { useEffect, useState , type ChangeEvent , type FormEvent } from 'react'
import { useNavigate,Navigate } from 'react-router-dom'
import api from '../api/axios'
import { AxiosError } from 'axios'
import type { NavBarProps } from '../types/user'
import PageTransition from '../components/PageTransition'
import {toast} from 'sonner'

function MentorOnboarding({
    user,
    setUser
}:NavBarProps) {

  const navigate = useNavigate()
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading , setLoading] = useState(true)
  const [submitting , setSubmitting] = useState(false)
  
    interface MentorOnBoardingForm {
        title:string;
        bio:string;
        pricing:string;
        expertise:string;
        experience:string;
        linkedin:string;
        portfolio:string;
    }

  const [formData, setFormData] = useState<MentorOnBoardingForm>({
    title: '',
    bio: '',
    expertise: '',
    pricing: '',
    experience: '',
    linkedin: '',
    portfolio: ''
  })

  useEffect(() => {

    const fetchUser = async() => {
        try {
            const response = await api.get(
                "/users/current-user",
                {
                    withCredentials:true
                }
            )
            setUser(response.data.data)
        }catch{
           //
        }finally{
            setLoading(false)
        }
    }
    fetchUser()

  },[])

  const handleChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {

    e.preventDefault()

    try {

      setSubmitting(true)

      await api.patch(
        '/users/update-details',

        {
          title: formData.title,

          bio: formData.bio,

          expertise: formData.expertise
            .split(',')
            .map(item => item.trim()),

          pricing: Number(formData.pricing),

          experience: formData.experience,

          linkedin: formData.linkedin,

          portfolio: formData.portfolio,

          isProfileComplete: true
        },

        {
          withCredentials: true
        }
      )
      if (avatar) {
        const data = new FormData();
        data.append("avatar", avatar);

        await api.patch(
            "/users/update-avatar",
            data,
            {
            withCredentials: true,
            headers: {
                "Content-Type":
                "multipart/form-data",
            },
            }
        );
        }
      const response = await api.get(
          "/users/current-user",
          {
            withCredentials: true
          }
        )

        setUser(response.data.data)

      toast.success('Profile completed successfully')

      navigate('/dashboard')

    } catch (error) {
      const err = error as AxiosError<{message:string}>  
      toast.error(
        err.response?.data?.message ||
        'Failed to complete profile'
      )

    } finally {

      setLoading(false)
    }
  }
  
  if (loading) {
    return(
        <div className='min-h-screen flex items-center justify-center bg-[#fdfaf3]'>
            Loading...
        </div>
    )
  }

  if (user?.role !== "mentor") {
    
    return <Navigate to="/"/>

  }

  if (user?.isProfileComplete) {
    
    return(
        <div className="min-h-screen bg-[#fdfaf3] flex items-center justify-center px-6">
            <div className='bg-white p-10 rounded-4xl border border-black/10 max-w-lg text-center'>
                <h1 className='font-serif text-4xl mb-4'> 
                    Profile already completed
                </h1>

                <p className='text-gray-500 mb-8'>
                    You can edit your mentor details anytime from your profile page
                </p>

                <button
                onClick={() => navigate("/profile")}
                className='bg-black text-white px-6 py-3 rounded-full'
                >
                    Go to Profile
                </button>
            </div>
        </div>
    )

  }

  return (
  <PageTransition>
    <section className="min-h-screen bg-[#fdfaf3] py-24 px-6 md:px-12 lg:px-24">

      <div className="max-w-3xl mx-auto">

        {/* HEADER */}

        <div className="mb-14">

          <p className="text-[10px] tracking-[0.2em] uppercase text-black/50 mb-4">
            MENTOR SETUP
          </p>

          <h1 className="hero-heading font-serif text-5xl text-[#1a1a1a] tracking-tight transform scale-y-[1.2] origin-left mb-6">
            Complete your mentor profile
          </h1>

          <p className="text-gray-500 text-lg leading-relaxed">
            Add your expertise and pricing so learners can discover you.
          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="bg-white/40 border border-black/5 rounded-[40px] p-10 space-y-8"
        >

          {/* TITLE */}

          <div>

            <label className="block text-[10px] tracking-[0.15em] uppercase text-black/50 mb-2">
              TITLE
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Therapist"
              required
              className="w-full bg-[#fbf6ee] border border-black/10 rounded-2xl px-5 py-4 outline-none"
            />

          </div>

          {/* BIO */}

          <div>

            <label className="block text-[10px] tracking-[0.15em] uppercase text-black/50 mb-2">
              BIO
            </label>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell learners what you help with..."
              required
              rows={5}
              className="w-full bg-[#fbf6ee] border border-black/10 rounded-2xl px-5 py-4 outline-none resize-none"
            />

          </div>

          {/* EXPERTISE + PRICING */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>

              <label className="block text-[10px] tracking-[0.15em] uppercase text-black/50 mb-2">
                EXPERTISE
              </label>

              <input
                type="text"
                name="expertise"
                value={formData.expertise}
                onChange={handleChange}
                placeholder="React, Career, Design"
                required
                className="w-full bg-[#fbf6ee] border border-black/10 rounded-2xl px-5 py-4 outline-none"
              />

            </div>

            <div>

              <label className="block text-[10px] tracking-[0.15em] uppercase text-black/50 mb-2">
                PRICING
              </label>

              <input
                type="number"
                name="pricing"
                value={formData.pricing}
                onChange={handleChange}
                placeholder="499"
                required
                className="w-full bg-[#fbf6ee] border border-black/10 rounded-2xl px-5 py-4 outline-none"
              />

            </div>

          </div>

          {/* EXPERIENCE */}

          <div>

            <label className="block text-[10px] tracking-[0.15em] uppercase text-black/50 mb-2">
              EXPERIENCE
            </label>

            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="5 years at Google"
              className="w-full bg-[#fbf6ee] border border-black/10 rounded-2xl px-5 py-4 outline-none"
            />

          </div>

          {/* LINKEDIN */}

          <div>

            <label className="block text-[10px] tracking-[0.15em] uppercase text-black/50 mb-2">
              LINKEDIN
            </label>

            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/..."
              className="w-full bg-[#fbf6ee] border border-black/10 rounded-2xl px-5 py-4 outline-none"
            />

          </div>

          {/* PORTFOLIO */}

          <div>

            <label className="block text-[10px] tracking-[0.15em] uppercase text-black/50 mb-2">
              PORTFOLIO
            </label>

            <input
              type="text"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              placeholder="https://yourportfolio.com"
              className="w-full bg-[#fbf6ee] border border-black/10 rounded-2xl px-5 py-4 outline-none"
            />

          </div>
          <div>
            <label className="block text-[10px] font-normal tracking-[0.15em] text-black/50 uppercase mb-2">AVATAR IMAGE</label>
            <input
              type="file"
              onChange={(e) => setAvatar(e.target.files?.[0] ?? null)}
              className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-black/5 file:text-black hover:file:bg-black/10"
            />
          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#120f0a] text-white py-4 rounded-full font-medium hover:bg-black transition-all active:scale-95"
          >
            {
              submitting
                ? 'Saving...'
                : 'Complete profile'
            }
          </button>

        </form>

      </div>

    </section>
    </PageTransition>
  )
}

export default MentorOnboarding