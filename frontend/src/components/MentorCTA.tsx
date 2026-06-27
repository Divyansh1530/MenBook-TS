import { useNavigate } from 'react-router-dom';

function MentorCTA() {
  const navigate = useNavigate();

  return (
    <section className="bg-[#fdfaf3] pb-30 px-4 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden bg-[#1a110a] rounded-[25px] p-12 md:p-20 lg:p-22 flex flex-col items-start gap-8">
          
          <div 
            className="absolute bottom-[-20%] right-[-4%] w-90 h-90 rounded-full opacity-70 blur-[80px]"
            style={{
              background: 'radial-gradient(circle, #7c2d12 90%, transparent 70%)'
            }}
          />

          <div className="relative z-10 max-w-2xl space-y-6">
            <p className="text-[11px] font-normal tracking-[0.2em] text-[#d1c8b9] uppercase">
              FOR MENTORS
            </p>
            
            <h2 className="hero-heading font-serif text-3xl md:text-6xl text-[#fdfaf3] leading-tighter tracking-tighter transform scale-y-[1.2] origin-left">
              Have something <br />
              worth teaching?
            </h2>

            <p className="text-[#cec8bf] text-md md:text-lg font-sans leading-relaxed max-w-full">
              Set your hours, your rate, your buffer. We handle the rest. 
              Most mentors fill 3–5 sessions in their first week.
            </p>
          </div>

          <button
            onClick={() => navigate('/signup?role=mentor')}
            className="relative z-10 bg-[#fdfaf3] text-[#1a110a] px-7 py-3 rounded-full font-medium text-sm hover:bg-white transition-all active:scale-95"
          >
            Apply to be a mentor
          </button> 
        </div>
      </div>
    </section>
  );
}

export default MentorCTA;