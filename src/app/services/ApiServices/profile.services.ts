import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { ProfileModel } from '../../models/profile.model';
import { PostModel } from '../../models/PostsModel/post.model';


@Injectable({
    providedIn: 'root',
})

export class ProfileService {
    constructor(private apiService: ApiService) {}

    async getUserProfile(): Promise<ProfileModel> {
        return this.apiService.getData('api/AuthControler/GetMe');
    }

    async getUserPosts(): Promise<PostModel> {
        return this.apiService.getData('api/PostsControler/GetMe');
    }

    async FolowUser(name: string): Promise<ProfileModel> {
        return this.apiService.postData(`api/AuthControler/follow/${name}`, null);
    }
}