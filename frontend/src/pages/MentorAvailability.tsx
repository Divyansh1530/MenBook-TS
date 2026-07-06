import { useEffect, useState,  type ChangeEvent } from 'react'
import {AxiosError} from 'axios'
import { Plus, Clock, Trash2, Pencil } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import type { MentorAvailabilityProps } from '../types/mentor'
import type { Availability, AvailabilityForm } from '../types/availability'
import api from '../api/axios'
import {toast} from 'sonner'
import PageTransition from '../components/PageTransition'
import Skeleton from '../components/Skeleton'

function MentorAvailability({
  user
}:MentorAvailabilityProps) {
  const [availability, setAvailability] = useState<Availability[]>([])
  const [formData, setFormData] = useState<AvailabilityForm>({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '12:00',
    slotDuration: 30,
    bufferTime: 10
  })
  const [editingAvailabilityId , setEditingAvailabilityId] = useState<string | null>(null)
  const [loading , setLoading] = useState(true)

  const days:string[] = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ]

  if (user?.role !== "mentor") {
    return <Navigate to="/" />
  }

  const fetchAvailability = async () => {
    try {
      setLoading(true)
      const response = await api.get<{data:Availability[]}>('/availability/mentor', {
        withCredentials: true
      })
      setAvailability(response.data.data)
    } catch (error) {
      const err = error as AxiosError<{message:string}>  
      toast.error(
        err.response?.data?.message
    );
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAvailability()
  }, [])

  const handleChange = (e:ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const convertTimeToMinutes = (time:string):number => {
    const [hours, minutes] = time.split(':')
    return Number(hours) * 60 + Number(minutes)
  }

  const handleCreateAvailability = async () => {
    try {
      if (startMins >= endMins) {
        return toast.error("End time must be after start time")
      }

      if (Number(formData.slotDuration) <= 0) {
        return toast.error("Invalid slot duration")
      }

      if (Number(formData.bufferTime) < 0) {
        return toast.error("Invalid buffer time")
      }
      const payload = {
        dayOfWeek: Number(formData.dayOfWeek),
        startTime: convertTimeToMinutes(formData.startTime),
        endTime: convertTimeToMinutes(formData.endTime),
        slotDuration: Number(formData.slotDuration),
        bufferTime: Number(formData.bufferTime)
      }
      await api.post('/availability/create', payload, {
        withCredentials: true
      })
      toast.success('Availability created successfully')
      fetchAvailability()
    } catch (error) {
      // const err = error as AxiosError
      toast.error('Failed to create availability')
    }
  }

  const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
};

  const handleEditAvailability = (item:Availability) => {
    setEditingAvailabilityId(item._id)

    setFormData({
      dayOfWeek:item.dayOfWeek,
      startTime:formatTime(item.startTime),
      endTime:formatTime(item.endTime),
      slotDuration:item.slotDuration,
      bufferTime:item.bufferTime
    })
  }

  const handleUpdateAvailability = async () => {
  if (!editingAvailabilityId) return;

  try {
    const payload = {
      dayOfWeek: Number(formData.dayOfWeek),
      startTime: convertTimeToMinutes(formData.startTime),
      endTime: convertTimeToMinutes(formData.endTime),
      slotDuration: Number(formData.slotDuration),
      bufferTime: Number(formData.bufferTime),
    };

    await api.patch(
      `/availability/${editingAvailabilityId}`,
      payload,
      {
        withCredentials: true,
      }
    );

    toast.success("Availability updated");

    setEditingAvailabilityId(null);

    fetchAvailability();

    setFormData({
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "12:00",
      slotDuration: 30,
      bufferTime: 10,
    });
  } catch {
    //
  }
};
  
  const handleDeleteAvailability = async (id:string) => {
    try {
      await api.delete(`/availability/${id}`, {
        withCredentials: true
      })
      fetchAvailability()
    } catch (error) {
      const err = error as AxiosError<{message:string}>  
      toast.error(err.response?.data?.message || "Failed to delete")
    }
  }

  const formatMinutes = (minutes:number):string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    const period = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = hours % 12 || 12
    return `${formattedHours}:${mins.toString().padStart(2, '0')} ${period}`
  }

  // Calculate generated slots for the preview badge
  const startMins = convertTimeToMinutes(formData.startTime)
  const endMins = convertTimeToMinutes(formData.endTime)
  const totalDuration = endMins - startMins
  const slotsCount = totalDuration > 0 ? Math.floor(totalDuration / (Number(formData.slotDuration) + Number(formData.bufferTime))) : 0

  if (loading) {
  return (
    <section className="min-h-screen bg-[#fdfaf3] py-24 px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto xl:px-20">

        {/* Header */}
        <Skeleton className="h-3 w-24 mb-4" />
        <Skeleton className="h-14 w-72 mb-6" />
        <Skeleton className="h-6 w-96 mb-12" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Left Form */}
          <div className="lg:col-span-5 bg-white/40 border border-black/5 rounded-[40px] p-10">

            <Skeleton className="h-8 w-48 mb-8" />

            <Skeleton className="h-14 rounded-2xl mb-6" />

            <div className="grid grid-cols-2 gap-4 mb-6">
              <Skeleton className="h-14 rounded-2xl" />
              <Skeleton className="h-14 rounded-2xl" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <Skeleton className="h-14 rounded-2xl" />
              <Skeleton className="h-14 rounded-2xl" />
            </div>

            <Skeleton className="h-12 rounded-2xl mb-6" />

            <Skeleton className="h-14 rounded-full" />

          </div>

          {/* Right Side */}
          <div className="lg:col-span-7">

            <Skeleton className="h-8 w-48 mb-8" />

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white/40 border border-black/5 rounded-4xl p-8 mb-4"
              >
                <Skeleton className="h-8 w-40 mb-4" />
                <Skeleton className="h-5 w-64 mb-6" />

                <div className="flex justify-end gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <Skeleton className="h-10 w-10 rounded-xl" />
                </div>
              </div>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
}

  return (
    <PageTransition>
    <section className="min-h-screen bg-[#fdfaf3] py-24 px-4 sm:px-6 md:px-12 lg:px-24">

      <div className="max-w-7xl mx-auto xl:px-20">
        
        <header className="mb-12 md:mb-16">
          <p className="text-[10px] font-normal tracking-[0.2em] text-black/50 uppercase mb-4">
            CALENDAR
          </p>
          <h1 className="hero-heading font-serif text-4xl sm:text-5xl md:text-6xl text-[#1a1a1a] mb-6 tracking-tight transform scale-y-[1.2] origin-left">
            Your availability
          </h1>
          <p className="text-gray-500 max-w-xl text-base sm:text-lg font-sans leading-relaxed">
            Define a window — we'll slice it into bookable slots with the buffer you need between sessions.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          <div className="lg:col-span-5 bg-white/40 border border-black/5 rounded-[40px] p-6 sm:p-10 shadow-sm">
            <h2 className="hero-heading transform scale-y-[1.2] origin-left font-serif text-2xl text-[#1a1a1a] mb-8 tracking-tighter">New window</h2>
            
            <div className="space-y-6">

              <div>
                <label className="block text-[10px] font-normal tracking-[0.15em] text-black/50 uppercase mb-2">DAY</label>
                <select
                  name="dayOfWeek"
                  value={formData.dayOfWeek}
                  onChange={handleChange}
                  className="w-full bg-[#fbf6ee] border border-black/10 rounded-2xl px-5 py-3 outline-none focus:border-black/30 transition-all font-sans"
                >
                  {days.map((day, index) => (
                    <option key={index} value={index}>{day}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-normal tracking-[0.15em] text-black/50 uppercase mb-2">START TIME</label>
                  <div className="relative">
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className="w-full bg-[#fbf6ee] border border-black/10 rounded-2xl px-5 py-4 outline-none focus:border-black/30 transition-all font-sans"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-normal tracking-[0.15em] text-black/50 uppercase mb-2">END TIME</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full bg-[#fbf6ee] border border-black/10 rounded-2xl px-5 py-4 outline-none focus:border-black/30 transition-all font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-normal tracking-[0.15em] text-black/50 uppercase mb-2">SLOT DURATION (MIN)</label>
                  <input
                    type="number"
                    name="slotDuration"
                    value={formData.slotDuration}
                    onChange={handleChange}
                    className="w-full bg-[#fbf6ee] border border-black/10 rounded-2xl px-5 py-4 outline-none focus:border-black/30 transition-all font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-normal tracking-[0.15em] text-black/50 uppercase mb-2">BUFFER (MIN)</label>
                  <input
                    type="number"
                    name="bufferTime"
                    value={formData.bufferTime}
                    onChange={handleChange}
                    className="w-full bg-[#fbf6ee] border border-black/10 rounded-2xl px-5 py-4 outline-none focus:border-black/30 transition-all font-sans"
                  />
                </div>
              </div>

              <div className="bg-[#eee7dd] rounded-2xl p-4 text-xs text-gray-500 font-sans">
                Will generate <span className="font-bold text-black">{slotsCount}</span> slots
              </div>

              <button
                onClick={editingAvailabilityId ? handleUpdateAvailability : handleCreateAvailability}
                className="w-full bg-[#120f0a] text-white py-4 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95"
              >
                <Plus size={18} />
                {editingAvailabilityId ? "Update Availability" : "Create Slots"}
              </button>
              {editingAvailabilityId && (
                  <button
                    onClick={() => {
                      setEditingAvailabilityId(null);

                      setFormData({
                        dayOfWeek: 1,
                        startTime: "09:00",
                        endTime: "12:00",
                        slotDuration: 30,
                        bufferTime: 10,
                      });
                    }}
                    className="w-full mt-3 border border-black/10 py-4 rounded-full"
                  >
                    Cancel
                  </button>
                )}
            </div>
          </div>

          <div className="lg:col-span-7">
            <h2 className="hero-heading font-serif text-2xl text-[#1a1a1a] mb-8 tracking-tighter transform scale-y-[1.2] origin-left">Your windows</h2>
            
            {availability.length === 0 ? (
              <div className="border-2 border-dashed border-black/5 rounded-[40px] p-10 sm:p-20 text-center">
                <p className="text-gray-500 font-sans">
                  No windows yet. Create your first one &rarr;
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {availability.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white/40 border border-black/5 rounded-4xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-white hover:shadow-lg hover:shadow-black/5"
                  >
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl text-[#1a1a1a] mb-2">
                        {days[item.dayOfWeek]}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-500 text-sm">
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          <Clock size={14} />
                          {formatMinutes(item.startTime)} - {formatMinutes(item.endTime)}
                        </span>
                        <span className="hidden sm:inline w-1 h-1 rounded-full bg-gray-300" />
                        <span className="whitespace-nowrap">{item.slotDuration}m slots</span>
                      </div>
                    </div>
                    <div className="flex gap-2 self-end sm:self-center">
                      <button 
                      onClick={() => handleEditAvailability(item)}
                      className="text-blue-500 hover:text-blue-700 transition-colors p-2"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteAvailability(item._id)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-2 self-end sm:self-center"
                    >
                      <Trash2 size={20} />
                    </button>
                    
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
    </PageTransition>
  )
}

export default MentorAvailability