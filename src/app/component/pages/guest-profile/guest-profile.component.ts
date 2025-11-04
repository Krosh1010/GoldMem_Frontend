import { Component, OnInit } from '@angular/core';
import { NgIf,NgFor,CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService, GuestProfileService} from '../../../services';
import { PostGuestProfileComponent } from './post-guest-profile/post-guest-profile.component';
import { HiddenPostComponent } from './hidden-post/hidden-post.component';
import { GuestProfileModel } from '../../../models';
import { ChatOverlayService } from '../../../services/ChatServices/chat-overlay.service';
import { FollowManagerComponent } from '../../follow-manager/follow-manager.component';


@Component({
  selector: 'app-guest-profile',
  standalone: true,
  imports: [NgIf, CommonModule, FormsModule, ReactiveFormsModule, PostGuestProfileComponent, HiddenPostComponent,FollowManagerComponent],
  templateUrl: './guest-profile.component.html',
  styleUrl: './guest-profile.component.scss'
})
export class GuestProfileComponent implements OnInit {
  
  isFollowing: boolean = false;
  notification: any = null;
  expandedPostId: number | null = null;
  userProfile: GuestProfileModel | null = null;

  showFollowManager: boolean = false;
  followManagerType: 'followers' | 'following' = 'followers';
  followManagerProfileUserName?: string;

  constructor( 
    private activatedRoute: ActivatedRoute,
    private guestProfileService: GuestProfileService,
    private notificationService: NotificationService,
    private chatOverlayService: ChatOverlayService,
  ) {}

  ngOnInit(): void {
  this.activatedRoute.paramMap.subscribe(params => {
    const userName = params.get('userName') || '';
    this.getUserProfile(userName);
  });

  this.notificationService.notification$.subscribe((data) => {
    this.notification = data;
  });
}

  private async getUserProfile(userName: string): Promise<void> {
    try {
      const response = await this.guestProfileService.getGuestProfile(userName); 
      this.userProfile = response;
      this.isFollowing = response.isFollowing || false;
    } catch (error) {
      console.error('Eroare la încărcarea profilului:', error);
    }
    
  }
  
dismissNotification() {
  this.notificationService.clear();
}

async toggleFollow(): Promise<void> {
  if (this.userProfile?.isFollowing) {
    await this.unfollowUser(this.userProfile.name);
  } else {
    await this.followUser(this.userProfile?.name || '');
  }
}

async unfollowUser(name: string): Promise<void> {
  try {
    await this.guestProfileService.UnfolowUser(name);
    this.notificationService.show(`L-ai dezurmarit pe ${name}`, 'success');

    this.isFollowing = false;
    if (this.userProfile) {
      this.userProfile.isFollowing = false;
      this.userProfile.followerCount = Math.max(0, this.userProfile.followerCount - 1);
    }

  } catch (error) {
    this.notificationService.show('Eroare la încetarea urmăririi utilizatorului', 'error');
    console.error('Unfollow error:', error);
  } 
}

async followUser(name: string): Promise<void> {
  try {
    await this.guestProfileService.FolowUser(name);
    this.notificationService.show(`Ai început să urmărești pe ${name}`, 'success');

    this.isFollowing = true;
    if (this.userProfile) {
      this.userProfile.isFollowing = true;
      this.userProfile.followerCount += 1;
    }

  } catch (error) {
    this.notificationService.show('Eroare la urmărirea utilizatorului', 'error');
    console.error('Follow error:', error);
  }
}

async openMessage() {
  const target = this.userProfile?.name || 'Utilizator';
  this.chatOverlayService.open(target);
}

// --- FUNCȚII PENTRU DESCHIDEREA LISTEI ---
  openFollowManager(type: 'followers' | 'following'): void {
    if (!this.userProfile?.name) return;
    this.followManagerType = type;
    this.followManagerProfileUserName = this.userProfile.name; // trimitem userul curent al paginii guest
    this.showFollowManager = true;
  }

  closeFollowManager(): void {
    this.showFollowManager = false;
    this.followManagerProfileUserName = undefined;
  }

}
