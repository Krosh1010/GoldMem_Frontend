import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PostService, CommentService, ApiService, NotificationService } from '../../../../services';
import { PostModel, PostResponseModel } from '../../../../models';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule, FormsModule,],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  @Output() postOpened = new EventEmitter<number>();
postForm: FormGroup;
  commentForm: FormGroup;
  expandedPostId: number | null = null;
  posts: PostModel[] = [];
  notification: any = null;
  showBackToTop= false;
  currentPage = 1;
  PageSize = 3;
  isLoading = false;
  hasMorePosts = true;
  
  constructor(private fb: FormBuilder, 
    private apiService: ApiService, 
    private router: Router, 
    private postService: PostService,
    private commentService: CommentService,
    private notificationService: NotificationService) {
    this.postForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(500)]]
    });

    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(300)]]
    });
  }

  ngOnInit(): void {
    this.loadPosts();
    this.notificationService.notification$.subscribe((data) => {
      this.notification = data;
    });
  }
  dismissNotification() {
    this.notificationService.clear();
  }

  async submitPost() {
    if (this.postForm.valid) {
      try {
        const content = this.postForm.value.content.trim();
        const response = await this.postService.createPost(content);
        
        if (response.status === 201) {
          this.notificationService.show('Postare creată cu succes!', 'success'); 
          this.postForm.reset();
          await this.loadFirstPost();
        } else if (response.status === 202) {
          this.notificationService.show('Postare acceptată cu avertismente', 'warning');
        } else if (response.status >= 400 && response.status < 500) {
          this.notificationService.show('Eroare client: ' + (response.error|| 'Cerere invalidă'), 'error');
        } else if (response.status >= 500) {
          this.notificationService.show('Eroare server: ' + (response.error|| 'Eroare internă'), 'error');
        }
      } catch (error: any) {
        this.notificationService.show('Eroare: ' + (error.message || 'Eroare de conexiune'), 'error');
      }
    }
  }

  async loadPosts(): Promise<void> {
    if (this.isLoading || !this.hasMorePosts) return;
  
    this.isLoading = true;
  
    try {
      const response: PostResponseModel = await this.postService.getPosts(this.currentPage, this.PageSize);
      const newPosts = response.posts; 
  
      if (newPosts.length === 0 || newPosts.length < this.PageSize) {
        this.hasMorePosts = false;
      } else {
        this.hasMorePosts = true;
      }
  
      this.posts = [...this.posts, ...newPosts];
      this.currentPage++;
    } catch (error) {
      console.error('Eroare la încărcarea postărilor:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadFirstPost(): Promise<void> {
    try {
      const response: PostResponseModel = await this.postService.getPosts(1, this.PageSize);
      this.posts = response.posts;
      this.currentPage = 2; 
      this.hasMorePosts = response.posts.length === this.PageSize;
    } catch (error) {
      console.error(error);
    }
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

  toggleComments(postId: number) {
    if (this.expandedPostId === postId) {
      this.expandedPostId = null;
      this.postOpened.emit(undefined);
    } else {
      this.expandedPostId = postId;
      this.postOpened.emit(postId);
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

navigateToUserProfile() {
  this.router.navigate(['/profile']);
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


}
