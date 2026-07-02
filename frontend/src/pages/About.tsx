import React from 'react'
import { UserCheck , Calendar , MessageSquare , ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

function About() {
  return (
    <PageTransition>
    <div className="relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-[0.4]"
        style={{
          backgroundImage: `radial-gradient(#e5e7eb 1px, transparent 0)`,
          backgroundSize: '4px 4px'
        }}
      ></div>
      <div className="absolute inset-0 grain opacity-50 pointer-events-none" />
      <div className="absolute -top-32 -right-32 h-125 w-125 rounded-full" style={{ background: "radial-gradient(circle, oklch(0.62 0.20 30 / 0.15), transparent 70%)" }} />

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">About MenBook</p>
            <h1 className="mt-4 text-[clamp(2.5rem,4.5vw,5rem)] hero-heading leading-[1.15] md:leading-none tracking-tighter transform scale-y-[1.2] origin-left">
            A quiet place to find the right person to talk to.
          </h1>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-300 bg-[#fffbf6] p-8">
            <h2 className="font-normal text-xl hero-heading leading-[1.15] tracking-tighter transform scale-y-[1.2] origin-left">What MenBook is</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed text-[#5e534a]">
              MenBook is a mentorship booking platform. It brings together people who need guidance — in design, engineering, therapy, career, finance, and more — with mentors who have done the work and are ready to share what they know.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-300 bg-[#fffbf6] p-8">
            <h2 className="font-display text-xl font-normal hero-heading leading-[1.15] tracking-tighter transform scale-y-[1.2] origin-left">The problem it solves</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed text-[#5e534a]">
              Finding the right advice is noisy. Most platforms bury you in profiles, inflated bios, and aggressive sales funnels. MenBook strips that away. One clean profile, one calendar, one honest conversation.
            </p>
          </div>
        </div>

        <div className="mt-20">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">How it works</p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl hero-heading leading-[1.15] tracking-tighter transform scale-y-[1.2] origin-left">Three steps to a conversation that matters.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <StepCard
              n="01"
              icon={<UserCheck className="h-5 w-5" />}
              title="Find a mentor"
              desc="Browse by specialization, experience, and availability. No clutter."
            />
            <StepCard
              n="02"
              icon={<Calendar className="h-5 w-5" />}
              title="Pick a slot"
              desc="Book a time that works for both of you. Instant confirmation."
            />
            <StepCard
              n="03"
              icon={<MessageSquare className="h-5 w-5" />}
              title="Show up and grow"
              desc="Have the session. Leave with clarity, next steps, and momentum."
            />
          </div>
        </div>

        <div className="mt-20 rounded-3xl border border-border bg-[#1a0f06] px-8 py-14 md:p-16">
          <div className="max-w-2xl">
            <p className="text-xs text-[#a19a91] uppercase tracking-widest">Why we built it</p>
            <h2 className="mt-3 font-display hero-heading leading-[1.15] tracking-tighter transform scale-y-[1.2] origin-left text-3xl text-[#fbf6ee] md:text-4xl">We believe mentorship should feel human, not transactional.</h2>
            <p className="mt-6 leading-relaxed text-[#cec8bf]">
              MenBook was built because the best conversations we ever had came from people a few steps ahead of us. We wanted to make those conversations easier to find, safer to book, and simple to keep coming back to.
            </p>
          </div>
        </div>

        <div className="mt-20 flex flex-wrap items-center gap-4">
          <Link to="/browse-mentors" className="group inline-flex items-center gap-2 rounded-full bg-[#1a0f06] px-6 py-3 text-sm text-[#fbf6ee] hover:bg-accent transition-colors">
            Browse mentors
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link to="/signup" className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-sm hover:bg-muted transition-colors">
            Become a mentor
          </Link>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}

function StepCard({ n, icon, title, desc }: { n: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-gray-300 bg-[#fffbf6] p-6">
      <div className="flex items-center justify-between">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#fce8e2] text-[#e74634]">
          {icon}
        </div>
        <span className="font-display hero-heading leading-[1.15] tracking-tighter transform scale-y-[1.2] origin-left text-3xl text-[#cec8c2]">{n}</span>
      </div>
      <h3 className="mt-6 font-display hero-heading leading-[1.15] tracking-tight transform scale-y-[1.2] origin-left text-xl">{title}</h3>
      <p className="mt-2 text-md text-[#5e534a] leading-6">{desc}</p>
    </div>
  )
}

export default About