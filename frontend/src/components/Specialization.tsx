import { useNavigate } from 'react-router-dom'

function Specialization() {
  const navigate = useNavigate()

  // Updated categories with taglines and symbols to match Screenshot 2026-05-14 224426.png
  const categories = [
    { id: 1, name: 'Therapist', icon: '🧠', tagline: 'Mind, mood & meaning' },
    { id: 2, name: 'UI / UX Designer', icon: '✳', tagline: 'Interfaces that resonate' },
    { id: 3, name: 'Software Engineer', icon: '{}', tagline: 'Ship better systems' },
    { id: 4, name: 'Product Manager', icon: '◆', tagline: 'Strategy to delivery' },
    { id: 5, name: 'Career Coach', icon: '↗', tagline: 'Roles, raises, leaps' },
    { id: 6, name: 'Finance Mentor', icon: '$', tagline: 'Money with intention' },
    { id: 7, name: 'Startup Founder', icon: '▲', tagline: 'Zero to traction' },
    { id: 8, name: 'Data Scientist', icon: '≈', tagline: 'Models that matter' }
  ]

  return (
    <section className="bg-[#fdfaf3] py-24 border-t border-black/5  px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-16">
          <p className="text-[11px] font-normal tracking-[0.2em] text-black/80 uppercase mb-4">
            01 — SPECIALIZATIONS
          </p>
          <div className="hero-heading text-3xl font-extralight md:text-5xl text-[#1a1a1a] leading-tighter tracking-tighter md:max-w-150 transform scale-y-[1.2] origin-left">
            Pick the corner of your life 
            that needs a second pair of eyes.
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/browse-mentors?search=${cat.name}`)}
              className="group bg-[#fdf9f3] border border-black/15 rounded-2xl p-6 flex flex-col items-start justify-between min-h-40 transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-black/5 cursor-pointer"
            >

              <div className="text-2xl text-red-500/80 mb-8 transition-transform group-hover:scale-110">
                {cat.icon}
              </div>


              <div>
                <h3 className="hero-heading tracking-tighter font-serif text-xl text-[#1a1a1a] mb-2 transform scale-y-[1.2] origin-left">
                  {cat.name}
                </h3>
                <p className="text-gray-500 font-sans text-sm tracking-tight">
                  {cat.tagline}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Specialization