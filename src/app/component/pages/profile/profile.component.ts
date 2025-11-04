import { Component, OnInit } from '@angular/core';
import { NgIf,NgFor,CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService, ProfileService} from '../../../services';
import { PostsComponent } from './posts/posts.component';
import { FollowManagerComponent } from '../../follow-manager/follow-manager.component';
import { ProfileModel } from '../../../models/Profile/profile.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf,CommonModule,FormsModule, ReactiveFormsModule,PostsComponent, FollowManagerComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  userProfile: ProfileModel | null = null;
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
      this.userProfile = response;
      
    } catch (error) {
      console.error('Eroare la încărcarea profilului:', error);
    }
    
  }
  
dismissNotification() {
  this.notificationService.clear();
}

}