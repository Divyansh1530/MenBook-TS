import { useEffect, useState, type ChangeEvent } from 'react';
import api from '../api/axios';
import { Star, Search } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import type { Mentor } from '../types/mentor';
import type { BrowseMentorsResponse } from '../types/api';

function BrowseMentors() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchParams, setSearchParams] = useSearchParams();
  const [minPrice,setMinPrice] = useState("")
  const [rating,setRating] = useState("")
  const [sortBy,setSortBy] = useState("")
  const query = searchParams.get('search') || '';
  const [search, setSearch] = useState(query);
  const [debouncedSearch , setDebouncedSearch] = useState(search)
  const specialization = ""
  
  const navigate = useNavigate();

  interface Category {
    name:string;
    icon:string | null;
  }

  const categories:Category[] = [
    { name: 'All', icon: null },
    { name: 'Therapist', icon: '🧠' },
    { name: 'UI / UX Designer', icon: '✳' },
    { name: 'Software Engineer', icon: '{}' },
    { name: 'Product Manager', icon: '◆' },
    { name: 'Career Coach', icon: '↗' },
    { name: 'Finance Mentor', icon: '$' },
    { name: 'Startup Founder', icon: '▲' },
    { name: 'Data Scientist', icon: '≈' }
  ];

  useEffect(() => {

  const timer = setTimeout(() => {

    setDebouncedSearch(search)
    

  }, 500)

  return () => {

    clearTimeout(timer)
  }

}, [search])
useEffect(() => {

  setPage(1)

}, [
  debouncedSearch,
  specialization,
  minPrice,
  rating,
  sortBy
])

  useEffect(() => {
    const fetchMentors = async () => {
      setLoading(true);
      try {
        const response = await api.get<BrowseMentorsResponse>(
            '/users/mentors',
            {
              params: {
                page,
                limit: 9,
                search: debouncedSearch,
                specialization,
                minPrice,
                rating,
                sortBy,
                order: "desc"
              }
            }
          )

          setMentors(response.data.data.mentors)

          setTotalPages(response.data.data.totalPages)
      } catch (error) {
        const err = error as AxiosError
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, [
    debouncedSearch,
    specialization,
    minPrice,
    rating,
    sortBy,
    page
  ]);

  const handleCategoryClick = (catName:string) => {
    if (catName === 'All') {
      setSearchParams({});
      setSearch('');
    } else {
      setSearchParams({ search: catName });
      setSearch(catName);
    }
  };

  return (
    <div className="bg-[#fdfaf3] min-h-screen pt-20 pb-24 px-4 sm:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-10 sm:mb-12 text-left">
          <p className="text-[10px] font-normal tracking-[0.2em] text-black/50 uppercase mb-3">
            DIRECTORY
          </p>
          <h1 className="hero-heading font-serif text-4xl sm:text-6xl text-[#1a1a1a] mb-4 sm:mb-6 tracking-tighter transform scale-y-[1.2] origin-left">
            Browse mentors
          </h1>
          <p className="text-gray-500 max-w-xl text-base sm:text-lg font-sans leading-relaxed">
            Filter by specialization, or search by name. Every mentor is reviewed by hand.
          </p>
        </header>

<div className="mb-12 sm:mb-16 space-y-6">


  <div className="relative w-full sm:max-w-lg">

    <Search
      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
    />

    <input
      type="text"
      placeholder="Search by name, bio or expertise..."
      value={search}
      onChange={(e:ChangeEvent<HTMLInputElement>) =>
        setSearch(e.target.value)
      }
  
      className="w-full bg-white border border-black/5 rounded-full py-3 sm:py-4 pl-12 pr-6 outline-none focus:ring-2 focus:ring-black/5 transition-all shadow-sm text-sm sm:text-base"
    />
  </div>


  <div className="flex flex-col lg:flex-row gap-4">

    <div className="flex-1">

      <label className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-2 block">

        Min Price

      </label>

      <input
        type="number"
        placeholder="500"
        value={minPrice}
        onChange={(e:ChangeEvent<HTMLInputElement>) =>
          setMinPrice(e.target.value)
        }
        className="w-full bg-white border border-black/5 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-black/5 text-sm"
      />

    </div>

    <div className="flex-1">

      <label className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-2 block">

        Minimum Rating

      </label>

      <select
        value={rating}
        onChange={(e:ChangeEvent<HTMLSelectElement>) =>
          setRating(e.target.value)
        }
        className="w-full bg-white border border-black/5 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-black/5 text-sm"
      >

        <option value="">
          Any Rating
        </option>

        <option value="5">
          5 Stars
        </option>

        <option value="4">
          4+ Stars
        </option>

        <option value="3">
          3+ Stars
        </option>

      </select>

    </div>

    <div className="flex-1">

      <label className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-2 block">

        Sort By

      </label>

      <select
        value={sortBy}
        onChange={(e:ChangeEvent<HTMLSelectElement>) =>
          setSortBy(e.target.value)
        }
        className="w-full bg-white border border-black/5 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-black/5 text-sm"
      >

        <option value="">
          Recommended
        </option>

        <option value="price">
          Price
        </option>

        <option value="rating">
          Rating
        </option>

        <option value="experience">
          Experience
        </option>

      </select>

    </div>

  </div>

  <div className="flex flex-wrap gap-2 sm:gap-3 overflow-visible">

    {categories.map((cat) => (

      <button
        key={cat.name}
        onClick={() =>
          handleCategoryClick(cat.name)
        }
        className={`flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border text-[12px] sm:text-[13px] font-medium transition-all whitespace-nowrap ${
          (search === cat.name ||
          (cat.name === 'All' && !search))
            ? 'bg-[#120f0a] text-white border-[#120f0a]'
            : 'bg-white/50 border-black/5 text-gray-600 hover:border-black/20 hover:bg-white'
        }`}
      >

        {cat.icon && (

          <span className="text-red-500/80 text-sm">

            {cat.icon}

          </span>
        )}

        {cat.name}

      </button>
    ))}

  </div>

</div>
        
        {loading ? (
          <div className="text-center py-20 font-serif text-2xl text-gray-400 animate-pulse">Searching database...</div>
        ) : (
          <>
          <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {mentors.length > 0 ? mentors.map((mentor) => (
              <div
                onClick={() => navigate(`/mentors/${mentor._id}`)}
                key={mentor._id}
                  className="bg-white/40 border border-black/5 rounded-[28px] sm:rounded-4xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-black/5 cursor-pointer"
              >
                <div>
                  <div className="flex justify-between items-start mb-5 sm:mb-6">
                    <div className="flex gap-3 sm:gap-4 items-center">
                      <div >
                        <img 
                        src={mentor.avatar || 'https://placehold.co/100'} 
                        alt={mentor.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-black/10"
                        />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg sm:text-xl text-[#1a1a1a] leading-tight">{mentor.name}</h3>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1">{mentor.mentorProfile?.title || "Senior Lead"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-[#1a1a1a]">
                      <Star size={12} className="fill-red-500 text-red-500 sm:w-3.5" />
                      {mentor.mentorProfile?.avgRating || "New"}
                    </div>
                  </div>

                  <p className="text-gray-600 text-[14px] sm:text-[15px] leading-relaxed mb-6 line-clamp-3">
                    {mentor.mentorProfile?.bio || "Expertise at the intersection of clarity and craft."}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8 sm:mb-10">
                    {mentor.mentorProfile?.expertise?.slice(0, 2).map((exp, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] sm:text-xs font-medium">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-5 sm:pt-6 border-t border-black/5 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-xl sm:text-2xl text-[#1a1a1a]">₹{mentor.mentorProfile?.pricing || '0'}</span>
                      <span className="text-[10px] sm:text-xs text-gray-400">/session</span>
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-1">
                      1-on-1 mentoring
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/mentors/${mentor._id}`)}
                    className="bg-[#120f0a] text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium hover:bg-black transition-all active:scale-95"
                  >
                    Book a slot
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-20 text-gray-400 font-serif text-xl">No mentors found.
              </div>
            )}
          </div>
          {totalPages > 1 && (
  <div className="flex items-center justify-center gap-3 mt-16">

    <button
      disabled={page === 1}
      onClick={() => setPage(prev => prev - 1)}
      className="px-5 py-2 rounded-full border border-black/10 bg-white disabled:opacity-40"
    >
      Prev
    </button>

    <span className="text-sm text-gray-500">
      Page {page} of {totalPages}
    </span>

    <button
      disabled={page === totalPages}
      onClick={() => setPage(prev => prev + 1)}
      className="px-5 py-2 rounded-full border border-black/10 bg-white disabled:opacity-40"
    >
      Next
    </button>

  </div>
)}
</>
        )}
      </div>
      
    </div>
    
  );
}

export default BrowseMentors;