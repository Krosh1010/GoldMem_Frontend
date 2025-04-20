import { Component, OnInit,HostListener } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { PostService } from '../../../services/ApiServices/posts.services';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PostModel } from '../../../models/post.model';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsersListComponent } from './users-list/users-list.component';
import { PostResponseModel } from '../../../models/Post.Reponse';
import { CommentService } from '../../../services/ApiServices/comment.service';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule, FormsModule, UsersListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  postForm: FormGroup;
  commentForm: FormGroup;
  expandedPostId: number | null = null;
  posts: PostModel[] = [];
  notification = {
    message: '',
    type: '', 
    timer: null as any
  };
  showBackToTop= false;
  currentPage = 1;
  PageSize = 3;
  isLoading = false;
  hasMorePosts = true;

  
  constructor(private fb: FormBuilder, 
    private apiService: ApiService, 
    private router: Router, 
    private postService: PostService,
    private commentService: CommentService) {
    this.postForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(500)]]
    });

    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(300)]]
    });
  }

  ngOnInit(): void {
    this.loadPosts(); 
  }

  async submitPost() {
    if (this.postForm.valid) {
      try {
        const content = this.postForm.value.content.trim();
        const response = await this.postService.createPost(content);
        
        if (response.status === 201) {
          this.showNotification('Postare creată cu succes!', 'success'); 
          this.postForm.reset();
          await this.loadFirstPost();
        } else if (response.status === 202) {
          this.showNotification('Postare acceptată cu avertismente', 'warning');
        } else if (response.status >= 400 && response.status < 500) {
          this.showNotification('Eroare client: ' + (response.error|| 'Cerere invalidă'), 'error');
        } else if (response.status >= 500) {
          this.showNotification('Eroare server: ' + (response.error|| 'Eroare internă'), 'error');
        }
      } catch (error: any) {
        this.showNotification('Eroare: ' + (error.message || 'Eroare de conexiune'), 'error');
      }
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

   async loadPosts(): Promise<void> {
    if (this.isLoading || !this.hasMorePosts) return;

    this.isLoading = true;

    try {
      const response: PostResponseModel = await this.postService.getPosts(this.currentPage, this.PageSize);
      const newPosts = response.posts; 

      if (newPosts.length === 0) {
        this.hasMorePosts = false;
      } else {
        this.posts = [...this.posts, ...newPosts];
        this.currentPage++;
      }
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
  
  reloadPosts(): void {
    this.currentPage = 1;
    this.posts = [];
    this.hasMorePosts = true;
    this.loadPosts();
  }

  async deletePost(Id: number) {
    if (confirm('Sigur doriți să ștergeți această postare?')) {
      try {
        await this.postService.deletePost(Id);
        this.posts = this.posts.filter(post => post.id !== Id);
        this.showNotification('Postarea a fost ștearsă cu succes!', 'success');
      } catch (error) {
        this.showNotification('Eroare la ștergerea postării', 'error');
        console.error('Delete error:', error);
      }
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
          this.showNotification('Comment added successfully!', 'success');
          this.commentForm.reset();
          await this.loadCommentsForPost(postId);
        } else {
          this.showNotification('Error adding comment', 'error');
        }
      } catch (error: any) {
        this.showNotification('Error: ' + (error.message || 'Failed to add comment'), 'error');
      }
    }
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
    this.showNotification('Error updating like', 'error');
    console.error('Like error:', error);
  }
}

}
