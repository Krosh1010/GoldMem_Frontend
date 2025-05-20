import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { ProfileModel } from '../../models/profile.model';
import { PostModel } from '../../models/PostsModel/post.model';
import { PostResponseModel } from '../../models';


@Injectable({
    providedIn: 'root',
})

export class ProfileService {
    constructor(private apiService: ApiService) {}

    async getUserProfile(): Promise<ProfileModel> {
        return this.apiService.getData('api/AuthControler/GetMe');
    }

    async getUserPosts(pageNumber: number, pageSize: number): Promise<PostResponseModel> {
        return this.apiService.getPostPagin('api/PostsControler/GetMe', { pageNumber, pageSize });
    }

    async FolowUser(name: string): Promise<ProfileModel> {
        return this.apiService.postData(`api/AuthControler/follow/${name}`, null);
    }
}