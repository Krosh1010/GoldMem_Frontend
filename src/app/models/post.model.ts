import { CommentModel } from "./comment.model";

export interface PostModel {
  id: number;
  content: string;
  name: string;
  createdAt: string;
  comments?: CommentModel[];
}