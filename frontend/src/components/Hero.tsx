import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Hero() {
  const navigate = useNavigate();
  const [mentorCount, setMentorCount] = useState(0);

  useEffect(() => {

  const fetchMentors = async () => {

    try {

      const response = await api.get(
        '/users/mentors?page=1&limit=1'
      )

      setMentorCount(
        response.data.data.totalMentors
      )

    } catch (error) {

      console.log(error)
    }
  }

  fetchMentors()

}, [])

  return (
    <section className="relative min-h-screen bg-[#fdfaf3] pt-5 md:pt-25 pb-24 px-6 md:px-12 lg:px-24 flex items-center overflow-hidden">
      
      
      <div 
        className="absolute inset-0 z-0 opacity-[0.4]"
        style={{
          backgroundImage: `radial-gradient(#e5e7eb 1px, transparent 0)`,
          backgroundSize: '4px 4px'
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center ">
        <div 
            className="absolute bottom-[-65%] left-[-40%] md:bottom-[-50%] md:left-[-20%] w-90 h-90 rounded-full opacity-90 blur-[90px] z-0"
            style={{
              background: 'radial-gradient(circle, #f5c9be 100%, transparent 70%)'
            }}
          />
        
        <div className="lg:col-span-7 flex flex-col items-start space-y-8">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-300 bg-white/80 backdrop-blur-sm text-xs font-medium text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            Now with {mentorCount || '240'}+ vetted mentors
          </div>

          <h1 className="hero-heading font-serif text-[37px] md:text-8xl text-[#1a1a1a] leading-[1.15] md:leading-[0.9] tracking-tighter transform scale-y-[1.2] origin-left">
            Find the person <br />
            worth a <span className="italic relative inline-block">
              whole hour
              <span className="absolute md:top-15 top-7 left-0 w-full h-[0.43em] bg-[#f5c9be] -z-10"></span>
            </span> <br />
            of your time.
          </h1>

          <p className="max-w-lg text-lg text-gray-600 mt-8 leading-relaxed font-sans z-10">
            MenBook is a quiet marketplace for honest mentorship — therapists, designers, engineers, founders. No noise, no inflated bios. Just a calendar, and a conversation that moves you.
          </p>

          <div className="flex flex-wrap items-center gap-8 pt-2 z-10">
            <button
              onClick={() => navigate('/browse-mentors')}
              className="bg-[#120f0a] text-[#fdfaf3] px-6 py-3 rounded-full font-medium flex items-center gap-3 hover:bg-black transition-all group text-sm"
            >
              Browse mentors
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => navigate('/signup?role=mentor')}
              className="text-[#1a1a1a] font-medium hover:underline flex items-center gap-2 transition-all px-4"
            >
              Become a mentor &rarr;
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6 lg:flex flex-col items-center lg:items-end hidden">
          <StatCard value={`${mentorCount || '240'}+`} label="MENTORS" />
          <StatCard value="18k" label="SESSIONS BOOKED" />
          <StatCard value="4.92" label="AVG RATING" />
        </div>

      </div>
    </section>
  );
}

interface StatCardBody {
    value:string;
    label:string
}

const StatCard = ({ value, label }:StatCardBody) => (
  <div className="w-90 bg-[#fdf9f3] border border-black/15 rounded-2xl p-5 transition-transform hover:-translate-y-1">
    <h2 className="text-4xl font-serif text-[#1a1a1a] mb-2">{value}</h2>
    <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
      {label}
    </p>
  </div>
);

export default Hero;