import { Injectable } from '@angular/core';
import { ApiService } from "../api.service";
import { PostModel, PostResponseModel, UpdatePostModel } from "../../models";
import { PaginationParams } from '../../models/PostsModel/PaginationParams.model';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
    constructor(private apiService: ApiService) {}

    async getPosts(params: PaginationParams): Promise<PostResponseModel> {
      return this.apiService.getDataWithParams(`api/PostsControler/GetPost`,{ pageNumber: params.pageNumber, pageSize: params.pageSize });
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

    async updatePost(params: UpdatePostModel): Promise<PostModel> {
      return this.apiService.patchData(`api/PostsControler/${params.id}/UpData`, params.content );
    }
}