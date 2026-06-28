import type {User} from './user'

export interface MentorProfile {
  title: string;
  bio: string;
  expertise: string[];
  pricing: string;
  avgRating: number;
  experience:string;
  linkedin:string;
  portfolio:string;
}

export interface Mentor {
  _id: string;
  name: string;
  avatar: string;
  mentorProfile?: MentorProfile;
}

export interface MentorPageProps {
  user: User | null;
}

export interface MentorAvailabilityProps {
  user: User | null;
}
