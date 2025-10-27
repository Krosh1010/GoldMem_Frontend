import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { ProfileModel } from '../../models/Profile/profile.model';
import { PostModel } from '../../models/PostsModel/post.model';
import { PaginationParams } from '../../models/PostsModel/PaginationParams.model';
import { PostResponseModel, GuestProfileModel } from '../../models';
import { ChangeProfileModel } from '../../models/Profile/change_profile.model';


@Injectable({
    providedIn: 'root',
})

export class ProfileService {
    constructor(private apiService: ApiService) {}

    async getUserProfile(): Promise<ProfileModel> {
        return this.apiService.getData('api/AuthControler/GetMe');
    }

    async getUserPosts(params: PaginationParams): Promise<PostResponseModel> {
        return this.apiService.getDataWithParams('api/PostsControler/GetMe', { pageNumber: params.pageNumber, pageSize: params.pageSize });
    }

    async ChangeProfile(profileData: ChangeProfileModel): Promise<void> {
        return this.apiService.patchData('api/AuthControler/UpdateMe', profileData);
    }
    async getFollowings(): Promise<any> {
        return this.apiService.getData('api/AuthControler/GetFollow');
    }
}