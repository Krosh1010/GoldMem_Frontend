import { Injectable } from '@angular/core';
import { ApiService } from "../api.service";
import { PostModel } from '../../models/post.model';
import { PostResponseModel } from '../../models/Post.Reponse';

@Injectable({
  providedIn: 'root',
})
export class PostService {
    constructor(private apiService: ApiService) {}

    async getPosts(pageNumber: number, pageSize: number): Promise<PostResponseModel> {
      return this.apiService.getPostPagin('api/PostsControler/GetPost', { pageNumber, pageSize });
    }

    async createPost(content: string): Promise<PostModel> {
        return this.apiService.postData('api/PostsControler/Create',content);
    }

    async deletePost(postId: number): Promise<PostModel> {
        return this.apiService.deleteData('api/PostsControler/Delete', postId);
    }
}