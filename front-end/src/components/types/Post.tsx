
import { User } from './User';

interface Post {
  id: number;
  title: string;
  body: string;
  category: string;
  user: User;
  likes: string;
  dislikes: string;
  netRating: number;
  imageUrl: string;
}

export type { Post };
