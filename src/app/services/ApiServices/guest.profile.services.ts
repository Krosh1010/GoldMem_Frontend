import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { GuestProfileModel, PostResponseModel, PaginationParamsGuest, FollowerModel } from '../../models';
import { ProfileModel } from '../../models/Profile/profile.model';

@Injectable({
    providedIn: 'root',
})

export class GuestProfileService {
    constructor(private apiService: ApiService) {}

    async getGuestProfile(userName: string): Promise<GuestProfileModel> {
        return this.apiService.getData(`/api/AuthControler/GetUser/${userName}`);
    }
    async getGuestUserPosts(params: PaginationParamsGuest): Promise<PostResponseModel> {
        return this.apiService.getDataWithParams(`api/PostsControler/GetPostByUSerName`, { userName: params.userName, pageNumber: params.pageNumber, pageSize: params.pageSize });
    }
    async FolowUser(name: string): Promise<ProfileModel> {
            return this.apiService.postData(`api/FollowersControler/follow/${name}`, null);
        }
    async UnfolowUser(name: string): Promise<ProfileModel> {
            return this.apiService.deleteData(`api/FollowersControler/UnFollowUser/${name}`, null);
        }
    async getFollowers(userName: string): Promise<FollowerModel[]> {
        return this.apiService.getData(`/api/FollowersControler/GetFollowerByUserName/${userName}`);
    }
    async getFollowings(userName: string): Promise<FollowerModel[]> {
        return this.apiService.getData(`/api/FollowersControler/GetFollowingByUserName/${userName}`);
    }
}