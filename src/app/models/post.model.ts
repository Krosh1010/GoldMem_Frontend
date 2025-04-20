import { CommentModel } from "./comment.model";

export interface PostModel {
  id: number;
  content: string;
  name: string;
  createAt: string;
  author: string;
  isLiked?: boolean;
  likeCount?: number;
  editing: string;
  editedContent: string;
  comments?: CommentModel[];
  status: number;
  error: string;
  commentsCount: number;
}