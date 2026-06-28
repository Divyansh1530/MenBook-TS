import type { MentorProfile } from "./mentor";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "mentor";
  avatar: string;
  mentorProfile?:MentorProfile
}

export interface NavBarProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export interface UserDashboardProps {
  user:User | null;
}