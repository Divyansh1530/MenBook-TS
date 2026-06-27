export interface MentorProfile {
  title: string;
  bio: string;
  expertise: string[];
  pricing: number;
  avgRating: number;
}

export interface Mentor {
  _id: string;
  name: string;
  avatar: string;
  mentorProfile?: MentorProfile;
}