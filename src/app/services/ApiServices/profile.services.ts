import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { ProfileModel } from '../../models/Profile/profile.model';
import { PostModel } from '../../models/PostsModel/post.model';
import { PostResponseModel } from '../../models';
import { ChangeProfileModel } from '../../models/Profile/change_profile.model';


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
    async ChangeProfile(profileData: ChangeProfileModel): Promise<void> {
        return this.apiService.patchData('api/AuthControler/UpdateMe', profileData);
    }
}