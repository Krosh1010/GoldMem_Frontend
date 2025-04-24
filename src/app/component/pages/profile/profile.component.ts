import { Component, OnInit } from '@angular/core';
import { NgIf,NgFor,CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService, ProfileService} from '../../../services';
import { PostsComponent } from './posts/posts.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf,CommonModule,FormsModule, ReactiveFormsModule,PostsComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  userName: string = ''; 
  userid = 0;
  notification: any = null;
  expandedPostId: number | null = null;

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

async followUser(name: string): Promise<void> {
  if (!name) {
    this.notificationService.show('Numele utilizatorului este necesar', 'error');
    return;
  }

  try {
    const response = await this.profileService.FolowUser(name);
    this.notificationService.show(`Ai început să urmărești pe ${name}`, 'success');
  } catch (error) {
    this.notificationService.show('Eroare la urmărirea utilizatorului', 'error');
    console.error('Follow error:', error);
  }
}

}
