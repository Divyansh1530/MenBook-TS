import type { Mentor } from "./mentor";

export interface MentorsResponse {
  data: {
    mentors: Mentor[];
  };
}