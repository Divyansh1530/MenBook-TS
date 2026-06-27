export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "mentor";
  avatar: string;
}

export interface NavBarProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}