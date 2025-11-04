import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PostService, CommentService, NotificationService, ProfileService } from '../../../../services';
import { PostModel, PostResponseModel,CreateCommentModel,PaginationParams } from '../../../../models';
import { SharedDirectivesModule } from '../../../../directives/shared-directives.module';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule, FormsModule, SharedDirectivesModule],
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
  lazyScrollEnabled = false;
  currentUserName: string = '';

  
  constructor(private fb: FormBuilder,  
    private router: Router, 
    private profileService: ProfileService,
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

  async ngOnInit(): Promise<void> {
    this.loadPosts();
    this.notificationService.notification$.subscribe((data) => {
      this.notification = data;
    });
    this.currentUserName = await this.profileService.getCurrentUserName();
  }
  dismissNotification() {
    this.notificationService.clear();
  }

  async submitPost() { 
    this.postOpened.emit(0);
    this.expandedPostId = null;
    this.lazyScrollEnabled = true;
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
      const params : PaginationParams = {
        pageNumber: this.currentPage,
        pageSize: this.PageSize
      };
      const response: PostResponseModel = await this.postService.getPosts(params);
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
      const params : PaginationParams = {
        pageNumber: 1,
        pageSize: this.PageSize
      };
      const response: PostResponseModel = await this.postService.getPosts(params);
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
    this.lazyScrollEnabled = true;
    if (this.commentForm.valid) {
      try {
        const commentContent = this.commentForm.value.content.trim();
        const params: CreateCommentModel = {
          postId: postId,
          content: commentContent
        };
        const response = await this.commentService.createComment (params );
        if (response.status === 204) {
          this.notificationService.show('Comment added successfully!', 'success');
          this.commentForm.reset();
          await this.loadCommentsForPost(postId);
          const post = this.posts.find(p => p.id === postId);
          if (post) {
            post.commentsCount = (post.commentsCount || 0) + 1;
          }
        } else {
          this.notificationService.show('Error adding comment', 'error');
        }
      } catch (error: any) {
        this.notificationService.show('Error: ' + (error.message || 'Failed to add comment'), 'error');
      }
    }
    setTimeout(() => {
      this.lazyScrollEnabled = false;
    }, 50);
  }

navigateToUserProfile(userName?: string) {
    if (userName === this.currentUserName) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['', userName]);
    }
}

async toggleLike(post: PostModel) {
  try {
    if (post.isLikedByCurrentUser) {
      console.log("Unliked post with ID:", post.id);
      await this.postService.likePost(post.id);
      post.likesCount = (post.likesCount || 0) - 1;
    } else {
      console.log("Liked post with ID:", post.id);
      await this.postService.likePost(post.id);
      post.likesCount = (post.likesCount || 0) + 1;
    }
    post.isLikedByCurrentUser = !post.isLikedByCurrentUser;
  } catch (error) {
    this.notificationService.show('Error updating like', 'error');
    console.error('Like error:', error);
  }
}
}
