export interface Pub {
  id?: number;
  title: string;
  desc: string;
  category: string;
  is_paused: boolean;
  photos: File;
  desired: string;
  rating: number;
  price: number;
  user: number;
}
