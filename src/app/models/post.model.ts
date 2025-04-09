import { CommentModel } from "./comment.model";

export interface PostModel {
  id: number;
  content: string;
  name: string;
  createAt: string;
  author: string;
  comments?: CommentModel[];
}