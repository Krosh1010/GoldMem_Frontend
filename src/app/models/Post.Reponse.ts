import { PostModel } from './post.model';

export interface PostResponseModel {
    pageNumber: number;
    posts: PostModel[];
}