import { Injectable } from '@angular/core';
import { ApiService } from "../api.service";
import { PostModel, PostResponseModel } from "../../models";
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
    constructor(private apiService: ApiService) {}

    async getPosts(pageNumber: number, pageSize: number): Promise<PostResponseModel> {
      return this.apiService.getPostPagin('api/PostsControler/GetPost', { pageNumber, pageSize });
    }

    async createPost(content: string): Promise<PostModel> {
        return this.apiService.postData('api/PostsControler/Create', content);
        
    }

    async deletePost(postId: number): Promise<PostModel> {
        return this.apiService.deleteData('api/PostsControler/Delete', postId);
    }

    async likePost(postId: number): Promise<PostModel> {
        return this.apiService.postData(`api/PostsControler/Post/${postId}/like`, { postId });
    }
}