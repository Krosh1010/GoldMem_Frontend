export interface FollowerModel { 
    userName: string;
    isFollowing: boolean;
    avatar: string | null;
    id: number;
    isMy?: boolean;
}

