import type { MentorProfile } from "./mentor";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "mentor";
  avatar: string;
  mentorProfile?:MentorProfile;
  isProfileComplete?:boolean
  hasPassword:boolean;
  googleId:string;
}

export interface NavBarProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export interface UserDashboardProps {
  user:User | null;
}

export interface UserProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}