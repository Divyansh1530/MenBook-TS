import React from 'react'
import PageTransition from '../components/PageTransition';

function Privacy() {
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
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-20 md:py-28">
        <p className="text-xs uppercase tracking-widest text-[#5e534a]">Legal</p>
        <h1 className="mt-4 text-[clamp(2.5rem,6vw,4rem)] hero-heading leading-[1.15] tracking-tighter transform scale-y-[1.3] origin-left">Privacy Policy</h1>
        <p className="mt-6 text-[#5e534a] leading-relaxed">
          This policy explains what data MenBook collects, how we use it, and how we keep it safe. If you have any questions, contact us at <a href="mailto:menbook.studio@gmail.com" className="text-orange-700 hover:underline">menbook.studio@gmail.com</a>.
        </p>

        <div className="mt-14 space-y-12">
          <Section title="Data we collect">
            <p className="leading-relaxed">
              When you create an account, book a session, or message a mentor, we collect information needed to make that work:
            </p>
            <ul className="mt-4 list-disc pl-5 space-y-2">
              <li>Name and email address</li>
              <li>Profile information and avatar (optional)</li>
              <li>Booking history, session times, and messages</li>
              <li>Mentor-specific details such as expertise, experience, LinkedIn, and hourly rate</li>
              <li>Payment and billing information, handled by our payment provider</li>
            </ul>
          </Section>

          <Section title="Cookies">
            <p className="leading-relaxed">
              MenBook uses cookies and similar technologies to keep you signed in, remember your preferences, and understand how people use the platform. You can manage cookie settings through your browser at any time.
            </p>
            <p className="mt-4 leading-relaxed">
              We use essential cookies for authentication and analytics cookies to help us improve the product. We do not sell cookie data to third parties.
            </p>
          </Section>

          <Section title="Payments">
            <p className="leading-relaxed">
              All payments on MenBook are processed by Razorpay. We do not store your full card or bank details on our servers. When you complete a booking, your payment information is securely handled by Razorpay's infrastructure and is subject to Razorpay's privacy and security policies.
            </p>
          </Section>

          <Section title="Contact">
            <p className="leading-relaxed">
              For privacy-related questions or data requests, email us at <a href="mailto:menbook.studio@gmail.com" className="text-orange-700 hover:underline">menbook.studio@gmail.com</a>.
            </p>
          </Section>
        </div>

        <p className="mt-16 text-sm text-[#5e534a]">Last updated: {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}.</p>
      </div>
    </div>
    </PageTransition>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="hero-heading leading-[1.15] tracking-tighter transform scale-y-[1.3] origin-left text-2xl">{title}</h2>
      <div className="mt-4 text-[#5e534a]">{children}</div>
    </section>
  )
}

export default Privacy