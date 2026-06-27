export interface Review {
  _id: string;
  rating: number;
  comment: string;
  userId?: {
    _id: string;
    name: string;
  };
}