export interface Pub {
  title: string;
  desc: string;
  category: string;
  is_paused: boolean;
  photos: File[] | File;
  desired: string;
  price: number;
  user: number;
}
