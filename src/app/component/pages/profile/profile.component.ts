import { Component, OnInit } from '@angular/core';
import { NgIf,NgFor,CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PostModel } from '../../../models/post.model';
import { FormGroup, FormsModule, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../../../services/ApiServices/profile.services';
import { PostService } from '../../../services/ApiServices/posts.services';
import { NotificationService } from '../../../services/notification.service';
import { ApiService } from '../../../services/api.service';
import { CommentService } from '../../../services/ApiServices/comment.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf,NgFor,CommonModule,FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  commentForm: FormGroup;
  posts: PostModel[] = [];
  userName: string = ''; 
  post: any [] = [];
  userid = 0;
  notification: any = null;
  expandedPostId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: Router, 
    private profileService: ProfileService,
    private postService: PostService,
    private notificationService: NotificationService,
    private apiService: ApiService, 
    private commentService: CommentService, 
  ) {
      this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(300)]]
    });
  }

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
      this.getUserPosts();
      
    } catch (error) {
      console.error('Eroare la încărcarea profilului:', error);
    }
    
  }
  private async getUserPosts() {
    try {
      const data = await this.profileService.getUserPosts();
      this.posts = Array.isArray(data) ? data : [data];
    }
    catch (error) {
      console.error('Eroare la încărcarea postărilor:', error);
    }
}

dismissNotification() {
  this.notificationService.clear();
}

async deletePost(Id: number) {
  if (confirm('Sigur doriți să ștergeți această postare?')) {
    try {
      await this.postService.deletePost(Id);
      this.posts = this.posts.filter(post => post.id !== Id);
      this.notificationService.show('Postarea a fost ștearsă cu succes!', 'success');
    } catch (error) {
      this.notificationService.show('Eroare la ștergerea postării', 'error');
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

async toggleLike(post: PostModel) {
  try {
    if (post.isLiked) {
      // Dacă postarea este deja likuită, eliminăm like-ul
      await this.apiService.deleteData(`api/LikesController/DeleteLike?postId=${post.id}`);
      post.likeCount = (post.likeCount || 0) - 1;
    } else {
      // Dacă postarea nu este likuită, adăugăm un like
      await this.apiService.postData('api/LikesController/CreateLike', { postId: post.id });
      post.likeCount = (post.likeCount || 0) + 1;
    }
    post.isLiked = !post.isLiked;
  } catch (error) {
    this.notificationService.show('Error updating like', 'error');
    console.error('Like error:', error);
  }
}

toggleComments(postId: number) {
  if (this.expandedPostId === postId) {
    this.expandedPostId = null;
  } else {
    this.expandedPostId = postId;
    this.loadCommentsForPost(postId);
  }
}

async loadCommentsForPost(postId: number) {
  try {
    console.log('Loading comments for post:', postId);
    const comments = await this.commentService.getComments(postId);
    const postIndex = this.posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
      this.posts[postIndex].comments = Array.isArray(comments) ? comments : [comments];
    }
  } catch (error) {
    console.error('Eroare la încărcarea comentariilor:', error);
  }
}

async submitComment(postId: number) {
  if (this.commentForm.valid) {
    try {
      const commentContent = this.commentForm.value.content.trim();
      const response = await this.commentService.createComment (postId ,commentContent );

      if (response.status === 204) {
        this.notificationService.show('Comment added successfully!', 'success');
        this.commentForm.reset();
        await this.loadCommentsForPost(postId);
      } else {
        this.notificationService.show('Error adding comment', 'error');
      }
    } catch (error: any) {
      this.notificationService.show('Error: ' + (error.message || 'Failed to add comment'), 'error');
    }
  }
}

}
