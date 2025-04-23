import { Component, OnInit,HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { UsersListComponent } from './users-list/users-list.component';
import { NotificationService } from '../../../services/notification.service';
import { PostsComponent } from './posts/posts.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule, FormsModule, UsersListComponent,PostsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  activePostId: number | null = null;
  notification: any = null;
  showBackToTop= false;
  isLoading = false;
  hasMorePosts = true;
  
  constructor(
    private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.notificationService.notification$.subscribe((data) => {
      this.notification = data;
    });
  }
  dismissNotification() {
    this.notificationService.clear();
  }

  @HostListener('window:scroll', [])
onWindowScroll() {
  this.showBackToTop = (window.pageYOffset > 100);
}

scrollToTop() {
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth' 
  });
}

scrollToPost(postId: number) {
  const postElement = document.getElementById(`post-${postId}`);
  if (postElement) {
    const elementPosition = postElement.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - 70; 
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}
onPostOpened(postId: number | null) {
  this.activePostId = postId;
}
}
