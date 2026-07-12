import { useEffect, useState , type ChangeEvent , type ReactNode } from 'react'
import { Star, Calendar, CheckSquare, TrendingUp, ArrowRight, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { AxiosError } from 'axios'
import type { UserDashboardProps } from '../types/user'
import type {Booking} from '../types/booking'
import type { Review } from '../types/review'
import Skeleton from './Skeleton'
import {toast} from 'sonner'

function UserDashboard({
  user
}:UserDashboardProps) {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled" | "all">('upcoming')
  const [editingReview,setEditingReview] = useState<Review | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await api.get<{data:Booking[]}>('/booking/user-bookings', {
        withCredentials: true
      })
      setBookings(response.data.data)
    } catch (error) {
      const err = error as AxiosError  
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    try {
      await api.post('/review/create', {
        mentorId: selectedBooking!.mentorId._id,
        bookingId: selectedBooking!._id,
        rating,
        comment
      }, { withCredentials: true })
      toast.success('Review submitted successfully')
      setSelectedBooking(null)
      setEditingReview(null)
      setRating(5)
      setComment('')
      fetchBookings()
    } catch (error) {
      const err = error as AxiosError<{message:string}>  
      toast.error(err.response?.data?.message || 'Failed to submit review')
    }
  }

  const handleUpdateReview = async () => {

  try {

    await api.patch(
      `/review/${editingReview!._id}`,

      {
        rating,
        comment
      },

      {
        withCredentials: true
      }
    )

    toast.success('Review updated successfully')

    setEditingReview(null)

    setSelectedBooking(null)

    setRating(5)

    setComment('')

    fetchBookings()

  } catch (error) {
    const err = error as AxiosError<{message:string}>
    toast.error(
      err.response?.data?.message ||
      'Failed to update review'
    )
  }
}

  const handleDeleteReview = async (reviewId:string) => {

  const confirmDelete = window.confirm(
    'Delete this review?'
  )

  if (!confirmDelete) {
    return
  }

  try {

    await api.delete(
      `/review/${reviewId}`,
      {
        withCredentials: true
      }
    )

    toast.success('Review deleted successfully')

    fetchBookings()

  } catch (error) {
    const err = error as AxiosError<{message:string}>
    toast.error(
      err.response?.data?.message ||
      'Failed to delete review'
    )
  }
}

  const formatDate = (date:string):string => new Date(date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })

  if (loading)
  return (
    <section className="min-h-screen bg-[#fdfaf3] py-12 md:py-24 px-4 sm:px-8 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto xl:mx-35">

        {/* Header */}
        <Skeleton className="h-3 w-28 mb-5" />
        <Skeleton className="h-16 w-56 mb-5" />
        <Skeleton className="h-6 w-80 mb-10" />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white/40 border border-black/10 rounded-4xl p-8"
            >
              <Skeleton className="h-5 w-28 mb-6" />
              <Skeleton className="h-10 w-20" />
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-10 w-28 rounded-full"
            />
          ))}
        </div>

        {/* Booking Cards */}
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white/40 border border-black/5 rounded-4xl p-8"
            >
              <div className="flex justify-between items-center">

                <div className="flex gap-5 items-center">
                  <Skeleton className="w-16 h-16 rounded-2xl" />

                  <div>
                    <Skeleton className="h-7 w-44 mb-3" />
                    <Skeleton className="h-4 w-52" />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <Skeleton className="h-6 w-24 mb-2" />
                    <Skeleton className="h-4 w-16" />
                  </div>

                  <Skeleton className="h-12 w-36 rounded-2xl" />
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );

  const upcomingBookings = bookings.filter(
  booking =>
    (booking.status === 'confirmed' ||
    booking.status === 'pending') &&
    new Date(booking.startTime) > new Date()
)

const now = new Date()

const completedBookings = bookings.filter(
  booking => booking.status === 'completed' && new Date(booking.endTime) <= now
)

const cancelledBookings = bookings.filter(
  booking => booking.status === 'cancelled'
)

const upcomingCount = upcomingBookings.length

const completedCount = completedBookings.length

const cancelledCount = cancelledBookings.length

const displayedBookings =
  activeTab === 'upcoming'
    ? upcomingBookings
    : activeTab === 'completed'
    ? completedBookings
    : activeTab === 'cancelled'
    ? cancelledBookings
    : bookings

const totalInvested = bookings.reduce(
  (acc, curr) =>
    curr.status === 'cancelled' || curr.status === "confirmed"
      ? acc + Number(curr.amount || 0)
      : acc,
  0
)

  return (
    <section className="min-h-screen bg-[#fdfaf3] py-12 md:py-24 px-4 sm:px-8 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto xl:mx-35">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
          <div className="w-full">
            <p className="text-[10px] font-normal tracking-[0.2em] text-black/50 uppercase mb-3 md:mb-4">WELCOME BACK</p>
            <h1 className="hero-heading font-serif text-4xl sm:text-5xl md:text-6xl text-[#1a1a1a] mb-4 tracking-tighter transform scale-y-[1.2] origin-left">
              {user?.name?.split(' ')[0] || 'User'}.
            </h1>
            <p className="text-gray-500 text-base md:text-lg">A snapshot of your learning journey.</p>
          </div>
          <button 
            onClick={() => navigate('/browse-mentors')}
            className="w-50 md:w-60 bg-[#120f0a] text-white px-8 py-3 md:py-4 rounded-full font-medium flex items-center justify-center gap-3 hover:bg-black transition-all group"
          >
            Find a mentor <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-20">
          <StatCard icon={<Calendar size={18} />} label="UPCOMING SESSIONS" value={upcomingCount} />
          <StatCard icon={<CheckSquare size={18} />} label="COMPLETED" value={completedCount} />
          <StatCard icon={<X size={18} />}label="CANCELLED" value={cancelledCount} />
          <StatCard icon={<TrendingUp size={18} />} label="INVESTED" value={`₹${totalInvested}`} />
        </div>

        <div className="space-y-6 md:space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-black/5 pb-6">

  <div className="flex flex-wrap gap-3">

    <button
      onClick={() => setActiveTab('upcoming')}
      className={`px-5 py-2 rounded-full text-sm transition-all ${
        activeTab === 'upcoming'
          ? 'bg-[#120f0a] text-white'
          : 'bg-white text-gray-500'
      }`}
    >
      Upcoming
    </button>

    <button
      onClick={() => setActiveTab('completed')}
      className={`px-5 py-2 rounded-full text-sm transition-all ${
        activeTab === 'completed'
          ? 'bg-[#120f0a] text-white'
          : 'bg-white text-gray-500'
      }`}
    >
      Completed
    </button>

    <button
      onClick={() => setActiveTab('cancelled')}
      className={`px-5 py-2 rounded-full text-sm transition-all ${
        activeTab === 'cancelled'
          ? 'bg-[#120f0a] text-white'
          : 'bg-white text-gray-500'
      }`}
    >
      Cancelled
    </button>

    <button
      onClick={() => setActiveTab('all')}
      className={`px-5 py-2 rounded-full text-sm transition-all ${
        activeTab === 'all'
          ? 'bg-[#120f0a] text-white'
          : 'bg-white text-gray-500'
      }`}
    >
      View all
    </button>

  </div>

</div>

          {displayedBookings.length === 0 ? (
            <div className="border-2 border-dashed border-black/5 rounded-[2.5rem] md:rounded-4xl p-10 md:p-20 text-center">
              <p className="text-gray-500">Nothing scheduled yet. <Link to="/browse-mentors" className="text-red-500 font-medium hover:underline">Browse mentors</Link></p>
            </div>
          ) : (
            <div className="grid gap-4 md:gap-6">
              {displayedBookings.map((booking) => (
                <div key={booking._id} className="bg-white/40 border border-black/5 rounded-4xl md:rounded-4xl p-6 md:p-8 transition-all hover:bg-white hover:shadow-xl hover:shadow-black/5">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex items-center gap-4 md:gap-6">
                      <img 
                        src={booking.mentorId?.avatar || '/default-avatar.png'} 
                        className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl object-cover grayscale-[0.5]" 
                        alt="mentor" 
                      />
                      <div>
                        <h3 className="font-serif text-xl md:text-2xl text-[#1a1a1a]">{booking.mentorId?.name}</h3>
                        <p className="text-gray-500 text-xs md:text-sm">{formatDate(booking.startTime)}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-row md:flex-row items-center justify-between w-full lg:w-auto gap-4 md:gap-8 border-t lg:border-t-0 pt-4 lg:pt-0">
                      <div className="text-left md:text-right">
                        <span
                        className={`px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${
                          booking.status === "cancelled"
                            ? "bg-red-50 text-red-500"
                            : new Date(booking.endTime) <= new Date()
                            ? "bg-green-50 text-green-600"
                            : "bg-orange-50 text-orange-600"
                        }`}
                      >
                        {
                          booking.status === "cancelled"
                            ? "cancelled"
                            : new Date(booking.endTime) <= new Date()
                            ? "completed"
                            : booking.status
                        }
                      </span>
                        <p className="font-serif text-lg md:text-xl mt-1 text-[#1a1a1a]">₹{booking.amount}</p>
                      </div>
                      
                     {booking.status === 'completed' && new Date(booking.endTime) <= new Date() && (

    booking.review ? (

    <div className="flex gap-2">

      <button
        onClick={() => {

          setSelectedBooking(booking)

          setEditingReview(booking.review!)

          setRating(booking.review!.rating)

          setComment(booking.review!.comment)
        }}
        className="bg-[#120f0a] text-white px-5 py-2 md:px-6 md:py-3 rounded-2xl text-xs md:text-sm font-medium hover:bg-black transition-all"
      >
        Edit Review
      </button>

      <button
        onClick={() =>
          handleDeleteReview(
            booking.review!._id
          )
        }
        className="bg-red-500 text-white px-5 py-2 md:px-6 md:py-3 rounded-2xl text-xs md:text-sm font-medium hover:bg-red-600 transition-all"
      >
        Delete
      </button>

    </div>

  ) : (

    <button
      onClick={() => {

        setSelectedBooking(booking)

        setEditingReview(null)

        setRating(5)

        setComment('')
      }}
      className="bg-[#120f0a] text-white px-5 py-2 md:px-6 md:py-3 rounded-2xl text-xs md:text-sm font-medium hover:bg-black transition-all"
    >
      Leave Review
    </button>

  )
)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedBooking && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-100 p-4">
            <div className="bg-[#fdfaf3] rounded-[2.5rem] md:rounded-[40px] w-full max-w-xl p-8 md:p-12 relative border border-black/5 shadow-2xl">
              <button onClick={() => setSelectedBooking(null)} className="absolute top-6 right-6 md:top-8 md:right-8 text-gray-400 hover:text-black transition-colors">
                <X size={24} />
              </button>
              <h2 className="font-serif text-3xl md:text-4xl text-[#1a1a1a] mb-6 md:mb-8">{editingReview ? "Update your review" : "How was your session"}</h2>
              <div className="flex gap-2 mb-6 md:mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)}>
                    <Star size={28} fill={star <= rating ? "#e94e36" : "none"} className={star <= rating ? "text-[#e94e36]" : "text-gray-200"} />
                  </button>
                ))}
              </div>
              <textarea 
                rows={4} 
                value={comment} 
                onChange={(e:ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)} 
                placeholder="Your experience helps others..."
                className="w-full bg-white border border-black/5 rounded-3xl p-5 md:p-6 outline-none focus:ring-2 focus:ring-black/5 mb-6 md:mb-8 font-sans text-sm md:text-base"
              />
              <button onClick={editingReview ? handleUpdateReview : handleSubmitReview} className="w-full bg-[#120f0a] text-white py-3 md:py-4 rounded-full font-medium text-base md:text-lg hover:bg-black transition-all">
                Submit Review
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

interface StatCardProps {
    icon:ReactNode;
    label:string;
    value:string | number;
}

const StatCard = ({ icon, label, value }:StatCardProps) => (
  <div className="bg-white/40 border border-black/15 rounded-4xl md:rounded-4xl py-6 px-8 md:px-10 flex flex-col items-start transition-all hover:bg-white hover:shadow-lg hover:shadow-black/5">
    <div className="flex items-center gap-2 text-black/50 mb-4 md:mb-6">
      {icon}
      <span className="text-[9px] md:text-[10px] font-normal text-black/80 tracking-[0.2em] uppercase">{label}</span>
    </div>
    <span className="hero-heading font-serif text-4xl md:text-5xl text-[#1a1a1a]">{value}</span>
  </div>
)

export default UserDashboard