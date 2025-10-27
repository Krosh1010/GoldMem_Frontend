import { Component, OnInit } from '@angular/core';
import { NgIf,NgFor,CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService, ProfileService} from '../../../services';
import { PostsComponent } from './posts/posts.component';
import { FollowManagerComponent } from './follow-manager/follow-manager.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf,CommonModule,FormsModule, ReactiveFormsModule,PostsComponent, FollowManagerComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  userName: string = ''; 
  userid = 0;
  followersCount = "dohuia";
  followingCount = "nihuia";
  notification: any = null;
  expandedPostId: number | null = null;
  showFollowManager: boolean = false;
  followManagerType: 'followers' | 'following' = 'followers';

  constructor(
    private route: Router, 
    private profileService: ProfileService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.getUserProfile();
    this.notificationService.notification$.subscribe((data) => {
      this.notification = data;
    });
  }

  openFollowManager(type: 'followers' | 'following') {
    this.followManagerType = type;
    this.showFollowManager = true;
  }

  closeFollowManager() {
    this.showFollowManager = false;
  }

  navigateToSettings(): void {
  this.route.navigate(['/seting']);
}

  private async getUserProfile(): Promise<void> {
    try {
      const response = await this.profileService.getUserProfile(); 
      this.userName = response.name || ''; 
      this.userid = response.id || 0;
      
    } catch (error) {
      console.error('Eroare la încărcarea profilului:', error);
    }
    
  }
  
dismissNotification() {
  this.notificationService.clear();
}
async followingUser(): Promise<void> {
  try {
    const followers = await this.profileService.getFollowings();
    this.followersCount = followers.length;
  } catch (error) {
    console.error('Eroare la încărcarea urmăritorilor:', error);
  }

}
}