import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { NgIf,NgFor,CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PostModel } from '../../../models/post.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf,NgFor,CommonModule,FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  posts: PostModel[] = [];
  userName: string = ''; 
  post: any [] = [];
  userid = 0;
  notification = {
    message: '',
    type: '', 
    timer: null as any
  };

  constructor(private apiService: ApiService, private route: Router) {}

  ngOnInit(): void {
    this.getUserProfile();
  }

  navigateToSettings(): void {
  this.route.navigate(['/seting']);
}

  private async getUserProfile(): Promise<void> {
    try {
      const response = await this.apiService.getData('api/AuthControler/GetMe'); 
      this.userName = response.name || ''; 
      this.userid = response.id || 0;
      this.getUserPosts();
      
    } catch (error) {
      console.error('Eroare la încărcarea profilului:', error);
    }
    
  }
  private async getUserPosts() {
    try {
      const data = await this.apiService.getData('api/PostsControler/GetMe');
      this.posts= data;
    }
    catch (error) {
      console.error('Eroare la încărcarea postărilor:', error);
    }
}

showNotification(message: string, type: 'success' | 'error' | 'warning') {
  if (this.notification.timer) {
    clearTimeout(this.notification.timer);
    this.notification = { message: '', type: '', timer: null };
  }

  this.notification = {
    message,
    type,
    timer: setTimeout(() => this.dismissNotification(), 3000)
  };

  setTimeout(() => {
    const notificationEl = document.querySelector('.notification');
    if (notificationEl) {
      notificationEl.classList.add('show');
    }
  }, 10);
}

dismissNotification() {
  const notificationEl = document.querySelector('.notification');
  if (notificationEl) {
    notificationEl.classList.remove('show');
    
    setTimeout(() => {
      this.notification = { message: '', type: '', timer: null };
    }, 300); 
  }
}

async deletePost(Id: number) {
  if (confirm('Sigur doriți să ștergeți această postare?')) {
    try {
      await this.apiService.deleteData('api/PostsControler/Delete', Id);
      this.posts = this.posts.filter(post => post.id !== Id);
      this.showNotification('Postarea a fost ștearsă cu succes!', 'success');
    } catch (error) {
      this.showNotification('Eroare la ștergerea postării', 'error');
      console.error('Delete error:', error);
    }
  }
}

startEditing(post: any) {
  post.editing = true;
  post.editedContent = post.content;
}

cancelEditing(post: any) {
  post.editing = false;
}

saveEditing(post: any) {
  post.editing = false;
}
}
