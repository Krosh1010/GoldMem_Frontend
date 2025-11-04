
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService,GuestProfileService, NotificationService } from '../../services';
import { Router } from '@angular/router';
import { FollowerModel } from '../../models';

@Component({
  selector: 'app-follow-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './follow-manager.component.html',
  styleUrls: ['./follow-manager.component.scss']
})
export class FollowManagerComponent implements OnInit, OnChanges {
  @Input() guestMode: boolean = false;
  @Input() guestUserName?: string ;
  @Input() open: boolean = false;
  @Input() type: 'followers' | 'following' = 'followers';
  @Output() close = new EventEmitter<void>();

  users: FollowerModel[] = [];
  notification: any = null;
  searchTerm: string = '';
  loading = false;
  currentUserName: string = '';
  

  constructor(
    private guestProfileService: GuestProfileService,
    private profileService: ProfileService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.notificationService.notification$.subscribe((data) => {
      this.notification = data;
    });
  this.currentUserName = await this.profileService.getCurrentUserName();

}

ngOnChanges(changes: SimpleChanges): void {
  if ((changes['open'] || changes['type'] || changes['profileUserName']) && this.open) {
    this.load();
  }
}
dismissNotification() {
  this.notificationService.clear();
}

  async load(): Promise<void> {
  this.loading = true;
  try {
    if (this.guestMode) {
      if (!this.guestUserName) {
        this.users = [];
      } else if (this.type === 'followers') { 
        // profilul altcuiva
        this.users = await this.guestProfileService.getFollowers(this.guestUserName);
      } else {
        this.users = await this.guestProfileService.getFollowings(this.guestUserName);
      }

    } else {
      // profilul tau
      if (this.type === 'followers') {
        this.users = await this.profileService.getFollowers();
      } else {
        this.users = await this.profileService.getFollowings();
        this.users.forEach(user => user.isFollowing = true);
      }
      
    }
  } catch (err) {
    console.error('Error loading follows', err);
    this.users = [];
  } finally {
    this.loading = false;
  }
}


  get filteredUsers(): FollowerModel[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.users || [];
    return (this.users || []).filter(u => (u.userName || '').toLowerCase().includes(term));
  }

  onClose(): void {
    this.close.emit();
  }

  backdropClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('fm-overlay')) {
      this.onClose();
    }
  }

  navigateToUserProfile(userName?: string) {
  if (!userName) return;

  if (userName === this.currentUserName) {
    this.router.navigate(['/profile']);
  } else {
    this.router.navigate(['', userName]);
  }
  
  this.onClose();
}


async toggleFollow(user: FollowerModel): Promise<void> {
 try{
   if (user.isFollowing) {
    await this.guestProfileService.UnfolowUser(user.userName);
    user.isFollowing = false;
    this.notificationService.show(`L-ai dezurmarit pe ${user.userName}`, 'success');
   } else {
    await this.guestProfileService.FolowUser(user.userName);
    user.isFollowing = true;
    this.notificationService.show(`Ai început să urmărești pe ${user.userName}`, 'success');
   }
 } catch(error){
         this.notificationService.show('Eroare la actualizarea stării de urmărire', 'error');
 }
}
}
