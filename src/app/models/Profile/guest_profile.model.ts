export interface GuestProfileModel {
    id: number;
    name: string;
    followerCount: number;
    followingCount: number;
    userTip: string;
    isFollowing?: boolean;
}