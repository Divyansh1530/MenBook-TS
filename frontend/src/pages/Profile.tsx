import { useEffect, useState , type ChangeEvent , type ReactNode } from 'react';
import { 
  FiCamera, 
  FiLock, 
  FiSave, 
  FiLinkedin, 
  FiBriefcase, 
  FiAward, 
  FiDollarSign, 
  FiFileText, 
  FiTag,
  FiUser
} from 'react-icons/fi';
import api from '../api/axios';
import { AxiosError } from 'axios';
import type { User } from '../types/user';
import type { PasswordForm, ProfileForm } from '../types/profile';
import {toast} from 'sonner'
import PageTransition from '../components/PageTransition';
import Skeleton from '../components/Skeleton';

interface UpdateProfilePayload {
    name: string;
    bio?: string;
    title?: string;
    expertise?: string[];
    pricing?: string;
    experience?: string;
    linkedin?: string;
    portfolio?: string;
}

function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ProfileForm>({
    name: '',
    bio: '',
    expertise: '',
    title:'',
    pricing: '',
    experience: '',
    linkedin: '',
    portfolio: ''
  });

  const [passwordData, setPasswordData] = useState<PasswordForm>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '' 
  });

  const fetchCurrentUser = async () => {
    try {
        const response = await api.get<{data:User}>('/users/current-user', {
        withCredentials: true
      });
      const currentUser = response.data.data;
      setUser(currentUser);
      setFormData({
        name: currentUser.name || '',
        bio: currentUser.mentorProfile?.bio || '',
        title:currentUser.mentorProfile?.title || '',
        expertise: currentUser.mentorProfile?.expertise?.join(', ') || '',
        pricing: currentUser.mentorProfile?.pricing || '',
        experience: currentUser.mentorProfile?.experience || '',
        linkedin: currentUser.mentorProfile?.linkedin || '',
        portfolio: currentUser.mentorProfile?.portfolio || ''
      });
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e:ChangeEvent<HTMLInputElement>) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleUpdateProfile = async () => {
    try {
      const payload:UpdateProfilePayload = { name: formData.name };
      if (user!.role === 'mentor') {
        payload.bio = formData.bio;
        payload.title = formData.title;
        payload.expertise = formData.expertise.split(',').map(item => item.trim());
        payload.pricing = formData.pricing;
        payload.experience = formData.experience;
        payload.linkedin = formData.linkedin;
        payload.portfolio = formData.portfolio;
      }
      await api.patch('/users/update-details', payload, { withCredentials: true });
      toast.success('Profile updated successfully');
      fetchCurrentUser();
    } catch (error) {
      const err = error as AxiosError<{message:string}>  
      toast.error(err.response?.data?.message || 'Profile update failed');
    }
  };

  const handleAvatarUpdate = async (file:File) => {
    try {
      const data = new FormData();
      data.append('avatar', file);
      await api.patch('/users/update-avatar', data, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Avatar updated successfully');
      fetchCurrentUser();
    } catch (error) {
      const err = error as AxiosError<{message:string}>
      toast.error(err.response?.data?.message || 'Avatar update failed');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
        return toast.error("Passwords do not match");
    }
    try {
      await api.patch('/users/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      }, { withCredentials: true });
      toast.success('Password changed successfully');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      const err = error as AxiosError<{message:string}>  
      toast.error(err.response?.data?.message || 'Password change failed');
    }
  };

      if (loading) {
      return (
        <section className="min-h-screen bg-[#fdfaf3] py-24 px-4 sm:px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto xl:px-20">

            <Skeleton className="h-3 w-24 mb-5" />
            <Skeleton className="h-16 w-72 mb-6" />
            <Skeleton className="h-6 w-80 mb-14" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              <div className="lg:col-span-4 space-y-8">

                <div className="bg-white/40 border border-black/10 rounded-[40px] p-10 flex flex-col items-center">

                  <Skeleton className="w-32 h-32 rounded-full mb-6" />

                  <Skeleton className="h-8 w-40 mb-3" />

                  <Skeleton className="h-5 w-56 mb-5" />

                  <Skeleton className="h-7 w-20 rounded-lg" />

                </div>

                <div className="bg-white/40 border border-black/10 rounded-[40px] p-10">

                  <Skeleton className="h-8 w-52 mb-8" />

                  <div className="space-y-6">
                    <Skeleton className="h-14 rounded-2xl" />
                    <Skeleton className="h-14 rounded-2xl" />
                    <Skeleton className="h-14 rounded-2xl" />
                    <Skeleton className="h-12 rounded-full" />
                  </div>

                </div>

              </div>

              <div className="lg:col-span-8 bg-white/40 border border-black/10 rounded-[40px] p-12">

                <Skeleton className="h-10 w-56 mb-10" />

                <div className="grid grid-cols-2 gap-8 mb-12">
                  <Skeleton className="h-14 rounded-2xl" />
                  <Skeleton className="h-14 rounded-2xl" />
                </div>

                <Skeleton className="h-8 w-48 mb-8" />

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <Skeleton className="h-14 rounded-2xl" />
                  <Skeleton className="h-14 rounded-2xl" />
                  <Skeleton className="h-14 rounded-2xl" />
                  <Skeleton className="h-14 rounded-2xl" />
                  <Skeleton className="h-14 rounded-2xl" />
                </div>

                <Skeleton className="h-40 rounded-2xl mb-12" />

                <div className="flex justify-end">
                  <Skeleton className="h-14 w-48 rounded-full" />
                </div>

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
          <p className="text-[10px] font-normal tracking-[0.2em] text-black/50 uppercase mb-4">ACCOUNT</p>
          <h1 className="hero-heading font-serif text-4xl sm:text-5xl md:text-6xl text-[#1a1a1a] mb-6 tracking-tighter transform scale-y-[1.2] origin-left">Your profile</h1>
         <p className="text-gray-500 text-base sm:text-lg">
              {user?.role === "mentor"
                ? "Keep your profile up to date so learners know what you offer."
                : "Keep your details fresh so mentors recognize you."}
            </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          <div className="lg:col-span-4 space-y-8">
            
            <div className="bg-white/40 border border-black/15 rounded-[40px] p-6 sm:p-10 text-center flex flex-col items-center">
              <div className="relative group mb-6">
                <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-sm flex items-center justify-center">
                   {user!.avatar ? (
                       <img src={user!.avatar} alt="avatar" className="w-full h-full object-cover" />
                   ) : (
                       <span className="hero-heading tracking-tight font-serif text-4xl text-gray-400">{user!.name[0]}</span>
                   )}
                </div>
                <label className="absolute bottom-1 right-1 bg-[#120f0a] p-2 rounded-full cursor-pointer hover:scale-110 transition-all text-white shadow-lg">
                    <FiCamera size={18} />
                    <input type="file" className="hidden" onChange={(e) => handleAvatarUpdate(e.target.files![0])} />
                </label>
              </div>
              <h2 className="font-serif text-2xl text-[#1a1a1a] break-all">{user!.name}</h2>
              <p className="text-gray-400 text-sm mb-4 break-all">{user!.email}</p>
              <span className="text-[10px] font-bold px-3 py-1 bg-red-50 text-red-400 rounded-lg uppercase tracking-widest">
                {user!.role}
              </span>
            </div>

            <div className="bg-white/40 border border-black/15 rounded-[40px] py-8 px-6 sm:px-10">
              <h3 className="hero-heading font-serif text-xl text-[#1a1a1a] mb-8 flex items-center gap-3 transform scale-y-[1.2] origin-left tracking-tight">
                <FiLock size={20} className="text-gray-400"/> Change password
              </h3>
              <div className="space-y-6">
                <InputGroup label="CURRENT" name="oldPassword" type="password" value={passwordData.oldPassword} onChange={handlePasswordChange} />
                <InputGroup label="NEW" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} />
                <InputGroup label="CONFIRM" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} />
                <button 
                  onClick={handleChangePassword}
                  className="w-full border border-black/10 text-gray-800 py-4 rounded-full font-medium hover:bg-white transition-all text-sm"
                >
                  Update password
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-white/40 border border-black/15 rounded-[40px] p-6 sm:p-12">
            <h3 className="font-serif text-2xl sm:text-3xl text-[#1a1a1a] mb-8 sm:mb-10">Personal details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
              <InputGroup label="FULL NAME" name="name" value={formData.name} onChange={handleChange} />
              <div className="space-y-2">
                <label className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase">EMAIL</label>
                <div className="w-full bg-white/40 border border-black/5 text-gray-400 rounded-2xl px-5 py-4 cursor-not-allowed break-all">
                    {user!.email}
                </div>
              </div>
            </div>

            {user!.role === 'mentor' && (
              <div className="space-y-8 sm:space-y-12 border-t border-black/5 pt-8 sm:pt-12 animate-in fade-in slide-in-from-bottom-4">
                <div className="space-y-2">
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#1a1a1a]">Mentor profile</h3>
                    <p className="text-gray-500 text-sm sm:text-base">This is what learners see when they browse.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <InputGroup icon={<FiTag size={14}/>} label="TITLE" name="title" placeholder="Therapist" value={formData.title} onChange={handleChange} />
                  <InputGroup icon={<FiBriefcase size={14}/>} label="EXPERIENCE" name="experience" placeholder="e.g. 8 years at Google" value={formData.experience} onChange={handleChange} />
                  <InputGroup icon={<FiLinkedin size={14}/>} label="LINKEDIN" name="linkedin" placeholder="https://linkedin.com/in/..." value={formData.linkedin} onChange={handleChange} />
                  <InputGroup icon={<FiUser size={14}/>} label="PORTFOLIO" name="portfolio" placeholder="https://portfolio.com/in/..." value={formData.portfolio} onChange={handleChange} />
                  <InputGroup icon={<FiAward size={14}/>} label="EXPERTISE" name="expertise" placeholder="React, System Design, Career" value={formData.expertise} onChange={handleChange} />
                  <InputGroup icon={<FiDollarSign size={14}/>} label="HOURLY RATE (USD)" name="pricing" type="number" value={formData.pricing} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase">
                    <FiFileText size={14}/> ABOUT
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="A short bio — what you help with, who you've worked with, your style."
                    className="w-full bg-white/40 border border-black/10 rounded-2xl p-4 sm:p-6 outline-none focus:border-black/30 transition-all font-sans min-h-40"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end mt-8 sm:mt-12">
              <button
                onClick={handleUpdateProfile}
                className="w-full sm:w-auto justify-center bg-[#120f0a] text-white px-10 py-4 rounded-full font-medium flex items-center gap-3 hover:bg-black transition-all shadow-lg active:scale-95"
              >
                <FiSave size={18} /> Save changes
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
    </PageTransition>
  );
}
interface InputGroupProps {
    label: string;
    name: string;
    value: string | number;

    onChange: (
        e: ChangeEvent<
            HTMLInputElement
        >
    ) => void;

    type?: string;

    placeholder?: string;

    icon?: ReactNode;
}


const InputGroup = ({ label, name, value, onChange, type = "text", placeholder = "", icon = null }:InputGroupProps) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase">
      {icon} {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-white/40 border border-black/10 rounded-2xl px-5 py-4 outline-none focus:border-black/30 transition-all font-sans"
    />
  </div>
);

export default Profile;