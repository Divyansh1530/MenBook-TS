import type { Review } from "./review";

export interface Booking {
  _id: string;

  mentorId: {
    _id: string;
    name: string;
    avatar: string;
  };

   userId: {
    _id: string;
    name: string;
    avatar: string;
  };

  startTime: string;
  endTime:string;

  amount: number;

  status:
    | "pending"
    | "confirmed"
    | "completed"
    | "cancelled";

  review?: Review;
}