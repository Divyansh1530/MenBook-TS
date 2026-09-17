import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, X, ArrowLeft } from 'lucide-react';
import type { MentorPageProps } from '../types/mentor';
import type { Mentor } from '../types/mentor';
import type { Review } from '../types/review';
import type { Slot } from '../types/availability';
import api from '../api/axios';
import {toast} from 'sonner'
import PageTransition from '../components/PageTransition';
import Skeleton from '../components/Skeleton'

function Mentors({
  user
}:MentorPageProps) {

  const { id } = useParams<{id:string}>();
  const navigate = useNavigate();

  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal and Slot states
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [dateRange, setDateRange] = useState<Date[]>([]);
  const [processingPayment, setProcessingPayment] = useState(false)
  const [showFullBio , setShowFullBio] = useState(false)
  const [showTestPaymentModal , setShowTestPaymentModal] = useState(false)
  const BIO_LIMIT = 150

  useEffect(() => {

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    setDateRange(dates);
  }, []);

  useEffect(() => {
    if (showBookingModal || showTestPaymentModal || processingPayment) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showBookingModal, showTestPaymentModal, processingPayment]);

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await api.get<{data:Mentor}>(`/users/mentors/${id}`);
        setMentor(response.data.data);
      } catch {
        toast.error("Failed to Fetch Mentor")
       }
    };

    const fetchReviews = async () => {
      try {
        const response = await api.get<{data:Review[]}>(`/review/mentors/${id}`);
        setReviews(response.data.data);
      } catch { 
        toast.error("Failed to Fetch Reviews")
       }
    };

    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchMentor(), fetchReviews()]);
      setLoading(false);
    };
    loadData();
  }, [id]);

  const fetchSlots = async (date:string) => {
    try {
      const response = await api.get<{data:Slot[]}>(
        `/availability/slots/${id}?date=${date}`,
        { withCredentials: true }
      );
       const currentTime = new Date()

    const filteredSlots =
      response.data.data.filter((slot:Slot) => {

        return (
          new Date(slot.startTimeISO)
          > currentTime
        )
      })
      setSlots(filteredSlots);
    } catch  { 
      toast.error("Failed to Fetch Slots")
   }
  };

  const handleDateSelect = (date:Date) => {
    const formatted = date.toISOString().split('T')[0];
    setSelectedDate(formatted);
    setSelectedSlot(null);
    fetchSlots(formatted);
  };

  const handleBookSession = async () => {
    if (!user) { navigate('/login'); return }
    if (!selectedSlot) return toast.warning("Please select a time slot");

    try {
      const bookingResponse = await api.post(
        '/booking/create',
        { mentorId: id, startTime: selectedSlot.startTimeISO, endTime: selectedSlot.endTimeISO },
        { withCredentials: true }
      );

      const { order } = (await api.post(
        '/payment/create-order',
        { bookingId: bookingResponse.data.data._id },
        { withCredentials: true }
      )).data.data;

        interface RazorpaySuccessResponse {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
        }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'MenBook',
        order_id: order.id,
        handler: async function (res:RazorpaySuccessResponse) {
            try {

              setProcessingPayment(true)

              await api.post(
                '/payment/verify-payment',
                {
                  razorpay_order_id: res.razorpay_order_id,
                  razorpay_payment_id: res.razorpay_payment_id,
                  razorpay_signature: res.razorpay_signature
                },
                { withCredentials: true }
              )

              setShowBookingModal(false)

              toast.success('Payment successful')
              navigate('/dashboard')

            } catch {

              toast.error('Payment verification failed')

            } finally {

              setProcessingPayment(false)
            }
          },
        theme: { color: '#e94e36' }
      };
      new window.Razorpay(options).open();
    } catch {
      //
    }
  };

  if (loading) {
  return (
    <section className="min-h-screen bg-[#fdfaf3] py-24 px-6">
      <div className="max-w-4xl mx-auto">

        <Skeleton className="h-6 w-40 mb-12" />

        <div className="flex flex-col md:flex-row gap-10">

          <Skeleton className="w-48 h-48 rounded-[40px]" />

          <div className="flex-1">

            <Skeleton className="h-12 w-72 mb-4" />

            <Skeleton className="h-6 w-28 mb-8" />

            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-4/5 mb-8" />

            <Skeleton className="h-14 w-56 rounded-full" />

          </div>

        </div>

      </div>
    </section>
  );
}

  return (
    <PageTransition>
    <section className="min-h-screen bg-[#fdfaf3] md:py-24 py-16 px-6 relative">
      <div className="max-w-4xl mx-auto">

        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-black mb-12 transition-colors">
          <ArrowLeft size={18} /> Back to mentors
        </button>

        <div className="flex flex-col md:flex-row md:gap-12 gap-8 items-start mb-20">
          <div className="md:w-48 md:h-48 w-35 h-35 rounded-[40px] bg-orange-100 shrink-0 overflow-hidden border-4 border-white shadow-sm">
            <img src={mentor!.avatar} alt={mentor!.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="font-serif md:text-5xl text-4xl text-[#1a1a1a]">{mentor!.name}</h1>
              <div className="flex items-center gap-1 text-sm font-bold bg-white px-3 py-1 rounded-full border border-black/5">
                <Star size={14} className="fill-red-500 text-red-500" />
                {mentor!.mentorProfile?.avgRating || "New"}
              </div>
            </div>
            <p className="text-xl text-gray-500 font-sans leading-relaxed max-w-2xl">
              {showFullBio ||
              mentor!.mentorProfile!.bio.length <= BIO_LIMIT
                ? mentor!.mentorProfile!.bio
                : `${mentor!.mentorProfile!.bio.slice(0, BIO_LIMIT)}...`}
            </p>

            {mentor!.mentorProfile!.bio.length > BIO_LIMIT && (
              <button
                onClick={() => setShowFullBio(!showFullBio)}
                className="flex mt-1 mb-3 text-sm font-medium text-black hover:underline"
              >
                {showFullBio ? "Read less" : "Read more"}
              </button>
            )}
            {user?.role !== "mentor" && (
            <button 
              onClick={() => { setShowBookingModal(true); fetchSlots(selectedDate); }}
              className="bg-[#120f0a] text-white px-10 py-4 rounded-full font-medium hover:bg-black transition-all shadow-xl active:scale-95"
            >
              Book a session • ₹{mentor!.mentorProfile?.pricing}
            </button>
            )}
          </div>
        </div>

        <div className="border-t border-black/5 pt-16">
  <h2 className="font-serif text-3xl mb-10">Community feedback</h2>

  {reviews.length === 0 ? (
    <div className="bg-white/40 border border-black/5 rounded-4xl p-12 text-center">
      <h3 className="text-2xl font-serif mb-3">
       No reviews yet. Book a session and share your experience.
      </h3>
      <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
        This mentor hasn't received any reviews yet.
        Book a session and be the first to share your experience.
      </p>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reviews.map((r) => (
        <div
          key={r._id}
          className="bg-white/40 border border-black/5 rounded-4xl p-8"
        >
          <div className="flex items-center gap-1 mb-4">
            {[...Array(r.rating)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className="fill-red-500 text-red-500"
              />
            ))}
          </div>

          <p className="text-gray-600 mb-6 italic">
            "{r.comment}"
          </p>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {r.userId?.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  )}
</div>


        {showBookingModal && createPortal(
          <div
            className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setShowBookingModal(false)}
          >
            <div
              className="relative bg-white w-full max-w-lg rounded-3xl sm:rounded-[36px] border border-black/5 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Pinned Header */}
              <div className="p-5 sm:p-7 pb-3 sm:pb-4 border-b border-black/5 relative shrink-0">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-black transition-colors p-1 rounded-full hover:bg-black/5"
                  aria-label="Close booking modal"
                >
                  <X size={22} />
                </button>
                <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-1">
                  BOOK A SESSION WITH
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#1a1a1a] pr-8 truncate">
                  {mentor!.name}
                </h2>
                <p className="text-gray-500 font-sans text-xs sm:text-sm mt-0.5">
                  {mentor!.mentorProfile?.experience || 'Expert'}
                </p>
              </div>

              {/* Scrollable Middle Content */}
              <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
                {/* Pick a Day */}
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">
                    PICK A DAY
                  </p>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {dateRange.map((date, i) => {
                      const isSelected = date.toISOString().split('T')[0] === selectedDate;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleDateSelect(date)}
                          className={`flex flex-col items-center min-w-14 sm:min-w-16 py-3 rounded-2xl border transition-all shrink-0 ${
                            isSelected
                              ? 'bg-[#e94e36] border-[#e94e36] text-white shadow-md shadow-red-200'
                              : 'bg-white border-black/5 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <span className="text-[10px] uppercase mb-1 font-bold">
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                          <span className="font-serif text-lg sm:text-xl font-medium">
                            {date.getDate()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pick a Time */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                      PICK A TIME
                    </p>
                    {slots.length > 0 && (
                      <span className="text-xs text-gray-400">
                        {slots.length} available
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 max-h-48 overflow-y-auto pr-1">
                    {slots.length > 0 ? (
                      slots.map((slot, i) => {
                        const isSelected = selectedSlot?.startTimeISO === slot.startTimeISO;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2.5 sm:py-3 px-2 rounded-xl sm:rounded-2xl border text-xs sm:text-sm font-medium transition-all text-center leading-snug ${
                              isSelected
                                ? 'bg-[#e94e36] border-[#e94e36] text-white shadow-sm'
                                : 'bg-white border-black/10 text-gray-700 hover:border-black/30'
                            }`}
                          >
                            <span className="block font-semibold">
                              {new Date(slot.startTimeISO).toLocaleTimeString([], {
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </span>
                            <span className={`block text-[11px] ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                              to {new Date(slot.endTimeISO).toLocaleTimeString([], {
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </span>
                          </button>
                        );
                      })
                    ) : (
                      <div className="col-span-2 sm:col-span-3 text-center py-6 text-gray-400 italic text-sm">
                        No slots available for this date.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pinned Footer */}
              <div className="p-4 sm:p-6 border-t border-black/5 bg-[#fdfaf3]/50 shrink-0 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-2xl sm:text-3xl text-[#1a1a1a]">
                      ₹{mentor!.mentorProfile?.pricing}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                    1-on-1 Mentoring
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!user) {
                      navigate('/login');
                      return;
                    }
                    if (!selectedSlot) {
                      toast.warning("Please select a time slot");
                      return;
                    }
                    setShowTestPaymentModal(true);
                  }}
                  className="bg-[#120f0a] text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-medium text-sm sm:text-base hover:bg-black transition-all active:scale-95 shadow-md shrink-0"
                >
                  {user ? 'Book now' : 'Log in to book'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {showTestPaymentModal && createPortal(
          <div
            className="fixed inset-0 z-110 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setShowTestPaymentModal(false)}
          >
            <div
              className="relative w-full max-w-md rounded-3xl sm:rounded-[32px] bg-white p-6 sm:p-8 shadow-2xl border border-black/5 max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowTestPaymentModal(false)}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 text-gray-400 hover:text-black transition-colors p-1"
                aria-label="Close payment modal"
              >
                <X size={22} />
              </button>

              <h2 className="font-serif text-2xl sm:text-3xl mb-3 text-[#1a1a1a]">
                Razorpay Test Mode
              </h2>

              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                This Website uses <strong>Razorpay Test Mode</strong>. No real money
                will be charged.
              </p>

              <div className="rounded-2xl bg-[#fdfaf3] border border-black/5 p-4 text-xs sm:text-sm space-y-2 mb-6">
                <p><strong>Card:</strong> 6527 6589 0000 1005</p>
                <p><strong>Expiry:</strong> Any future date</p>
                <p><strong>CVV:</strong> Any 3 digits</p>
                <p><strong>Name:</strong> Any name</p>
                <p><strong>OTP:</strong> 123456</p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTestPaymentModal(false)}
                  className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowTestPaymentModal(false);
                    handleBookSession();
                  }}
                  className="rounded-full bg-[#120f0a] px-6 py-2.5 text-sm font-medium text-white hover:bg-black transition-all active:scale-95"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {processingPayment && createPortal(
          <div className="fixed inset-0 z-120 bg-[#fdfaf3]/95 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="flex flex-col items-center text-center max-w-sm">
              <div className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-black/10 border-t-black rounded-full animate-spin mb-6 sm:mb-8" />

              <h2 className="font-serif text-2xl sm:text-3xl text-[#1a1a1a] mb-2 sm:mb-3">
                Confirming your booking
              </h2>

              <p className="text-gray-500 text-xs sm:text-sm">
                Please wait while we verify your payment.
              </p>
            </div>
          </div>,
          document.body
        )}

        </div>
      
    </section>
    </PageTransition>
  );
}



export default Mentors;