import React from 'react'
import PageTransition from '../components/PageTransition';

function TermsPage() {
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
        <p className="text-xs uppercase tracking-widest text-[#5e534a] ">Legal</p>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,4vw,4rem)] hero-heading leading-[1.15] tracking-tighter transform scale-y-[1.3] origin-left">Terms & Conditions</h1>
        <p className="mt-6 text-[#5e534a] leading-relaxed">
          These terms govern how MenBook is used by learners, mentors, and visitors. By using the platform, you agree to them. If you have questions, contact us at <a href="mailto:hello@menbook.studio" className="text-orange-700 hover:underline">hello@menbook.studio</a>.
        </p>

        <div className="mt-14 space-y-12">
          <Section title="Booking policy">
            <p className="leading-relaxed">
              Bookings are confirmed only after payment is successfully processed through Razorpay. Once confirmed, both the learner and mentor will receive a booking confirmation. Mentors are responsible for keeping their availability accurate and honoring confirmed bookings.
            </p>
            <p className="mt-4 leading-relaxed">
              Learners may not book a session for someone else without the mentor's consent. Each booking is tied to the account that made it.
            </p>
          </Section>

          <Section title="Cancellation & refund policy">
            <p className="leading-relaxed">
              Cancellations made more than 24 hours before the scheduled session are eligible for a full refund. Cancellations within 24 hours may be refunded at the mentor's discretion.
            </p>
            <p className="mt-4 leading-relaxed">
              If a mentor cancels a confirmed session, the learner will receive a full refund. Repeated no-shows by either party may result in account restrictions.
            </p>
          </Section>

          <Section title="Mentor responsibilities">
            <p className="leading-relaxed">
              Mentors agree to provide accurate profile information, maintain professional conduct, and show up on time for confirmed sessions. Mentors set their own rates and availability, and are responsible for keeping both up to date.
            </p>
            <p className="mt-4 leading-relaxed">
              Mentors may not share contact information or move bookings off-platform to avoid fees. MenBook reserves the right to remove mentors who violate this policy.
            </p>
          </Section>

          <Section title="User responsibilities">
            <p className="leading-relaxed">
              Users agree to interact respectfully, provide honest information, and not misuse the platform. Harassment, spam, or fraudulent bookings will result in account suspension.
            </p>
            <p className="mt-4 leading-relaxed">
              Users are responsible for attending scheduled sessions and preparing any materials or questions ahead of time.
            </p>
          </Section>

          <Section title="Payment terms">
            <p className="leading-relaxed">
              All payments are processed securely through Razorpay. MenBook may charge a platform fee on each transaction, which will be shown clearly before checkout. Payouts to mentors are made according to the schedule shown in their dashboard.
            </p>
            <p className="mt-4 leading-relaxed">
              Prices are set by mentors and may change. Any price change applies only to new bookings and does not affect already confirmed sessions.
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
  );
}

export default TermsPage