import { CommentModel } from '../Coments/comment.model';

export interface PostModel {
  id: number;
  content: string;
  name: string;
  createAt: string;
  author: string;
  isLikedByCurrentUser?: boolean;
  likesCount?: number;
  comments?: CommentModel[];
  status: number;
  error: string;
  commentsCount: number;
}