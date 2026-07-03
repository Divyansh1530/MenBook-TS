import { useState } from "react";
import { Send , Mail , Github , Linkedin , ArrowRight} from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";

function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sent");
  };

  return (
    <PageTransition>
    <div className="relative">
        <div 
        className="absolute inset-0 z-0 opacity-[0.4]"
        style={{
          backgroundImage: `radial-gradient(#e5e7eb 1px, transparent 0)`,
          backgroundSize: '4px 4px'
        }}
      ></div>
      <div className="absolute inset-0 grain opacity-50 pointer-events-none" />
      <div className="absolute -top-32 -left-32 h-125 w-125 rounded-full" style={{ background: "radial-gradient(circle, oklch(0.62 0.20 30 / 0.12), transparent 70%)" }} />

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Contact</p>
          <h1 className="mt-4 font-display hero-heading leading-[1.15] tracking-tight transform scale-y-[1.2] origin-left text-[clamp(2.5rem,4.5vw,5rem)]">Say hello.</h1>
          <p className="mt-6 text-lg text-[#5e534a] leading-relaxed max-w-xl">
            Questions about booking, becoming a mentor, or just want to share feedback? We read every message.
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <form onSubmit={onSubmit} className="rounded-2xl border border-gray-300 bg-[#fffbf6] p-8 shadow-md md:h-[75.1vh]">
            <div className="space-y-5">
              <div>
                <label className="text-md" htmlFor="name">Name</label>
                <input id="name" placeholder="Your name" className="px-3 mt-1.5 border border-[#ded6cd] w-[70vw] md:w-[34vw] rounded-xl h-[5vh] shadow-sm" />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="email" placeholder="you@example.com" className="px-3 mt-1.5 border border-[#ded6cd] w-[70vw] md:w-[34vw] rounded-xl h-[5vh] shadow-sm" />
              </div>
              <div>
                <label htmlFor="message">Message</label>
                <textarea id="message" placeholder="Tell us what's on your mind..." className="px-3 py-2 min-h-35 mt-1.5 border border-[#ded6cd] w-[70vw] md:w-[34vw] rounded-xl h-[5vh] shadow-sm" />
              </div>
              <button type="submit" className="w-full h-10 rounded-full bg-black text-white hover:bg-accent">
                {status === "sent" ? (
                  <>Message sent</>
                ) : (
                  <>
                    Send message <Send className="h-4 w-4 inline-flex" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="space-y-8">
            <div>
              <h2 className="hero-heading leading-[1.15] tracking-tighter transform scale-y-[1.3] origin-left text-2xl ">Other ways to reach us</h2>
              <p className="mt-3 leading-relaxed text-[#5e534a]">
                Prefer a direct line? Find us below. We usually respond within one business day.
              </p>
            </div>

            <div className="space-y-4">
              <ContactLink icon={<Mail className="h-5 w-5" />} label="Email" href="mailto:menbook.studio@gmail.com" value="menbook.studio@gmail.com" />
              <ContactLink icon={<Github className="h-5 w-5" />} label="GitHub" href="https://github.com/Divyansh1530" value="github.com/Divyansh1530" />
              <ContactLink icon={<Linkedin className="h-5 w-5" />} label="LinkedIn" href="https://www.linkedin.com/in/divyansh-yadav-4abb87315/" value="linkedin.com/in/divyansh-yadav-4abb87315/" />
            </div>

            <div className="rounded-2xl border border-border bg-[#1a0f06]
            text p-8">
              <p className="text-xs uppercase tracking-widest text-[#a19a91]">For mentors</p>
              <p className="mt-2 text-[#e5dfd8] ">Interested in joining as a mentor? Apply now and we'll help you get started.</p>
              <Link to="/signup" className="mt-4 inline-flex items-center gap-2 text-sm font-medium hover:text-orange-700 text-[#fbf6ee]">
                Apply to become a mentor <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}

function ContactLink({ icon, label, href, value }: { icon: React.ReactNode; label: string; href: string; value: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-2xl border border-gray-300 p-4 hover:border-accent transition-colors">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#fce8e2] text-[#e74634] ">
        {icon}
      </span>
      <div>
        <p className="text-xs uppercase tracking-widest text-[#5e534a]">{label}</p>
        <p className="text-sm font-medium mt-0.5">{value}</p>
      </div>
    </a>
  );
}

export default ContactPage
