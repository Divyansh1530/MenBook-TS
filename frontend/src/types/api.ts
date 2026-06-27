import type { Mentor } from "./mentor";

export interface MentorsResponse {
  data: {
    mentors: Mentor[];
  };
}

export interface BrowseMentorsResponse {
  data: {
    mentors: Mentor[];
    totalPages: number;
  };
}