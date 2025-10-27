import { Component, OnInit } from '@angular/core';
import { NgIf,NgFor,CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService, GuestProfileService} from '../../../services';
import { PostGuestProfileComponent } from './post-guest-profile/post-guest-profile.component';
import { HiddenPostComponent } from './hidden-post/hidden-post.component';


@Component({
  selector: 'app-guest-profile',
  standalone: true,
  imports: [NgIf, CommonModule, FormsModule, ReactiveFormsModule, PostGuestProfileComponent, HiddenPostComponent],
  templateUrl: './guest-profile.component.html',
  styleUrl: './guest-profile.component.scss'
})
export class GuestProfileComponent implements OnInit {
userName: string = ''; 
  userid = 0;
  followersCount = "dohuia";
  followingCount = "nihuia";
  notification: any = null;
  expandedPostId: number | null = null;
  HiddenPost:boolean=false;

  constructor(
    private route: Router, 
    private activatedRoute: ActivatedRoute,
    private guestProfileService: GuestProfileService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    const userNameFromRoute = this.activatedRoute.snapshot.paramMap.get('userName') || '';
    this.getUserProfile(userNameFromRoute);
    this.notificationService.notification$.subscribe((data) => {
      this.notification = data;
    });
  }
  private async getUserProfile(userName: string): Promise<void> {
    try {
      const response = await this.guestProfileService.getGuestProfile(userName); 
      this.userName = response.name || ''; 
      this.userid = response.id || 0;
      
    } catch (error) {
      console.error('Eroare la încărcarea profilului:', error);
    }
    
  }
  
dismissNotification() {
  this.notificationService.clear();
}

async followUser(name: string): Promise<void> {
  if (!name) {
    this.notificationService.show('Numele utilizatorului este necesar', 'error');
    return;
  }

  try {
    const response = await this.guestProfileService.FolowUser(name);
    this.notificationService.show(`Ai început să urmărești pe ${name}`, 'success');
  } catch (error) {
    this.notificationService.show('Eroare la urmărirea utilizatorului', 'error');
    console.error('Follow error:', error);
  }
}
}
