import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgIf,NgFor,CommonModule } from '@angular/common';
import { FormGroup, FormsModule, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { PostModel, PostResponseModel,PaginationParamsGuest, CreateCommentModel} from '../../../../models';
import { PostService, CommentService, ApiService, NotificationService, GuestProfileService} from '../../../../services';
import { SharedDirectivesModule } from '../../../../directives/shared-directives.module';



@Component({
  selector: 'app-post-guest-profile',
  standalone: true,
  imports: [NgIf,NgFor,CommonModule,FormsModule, ReactiveFormsModule, SharedDirectivesModule],
  templateUrl: './post-guest-profile.component.html',
  styleUrl: './post-guest-profile.component.scss'
})
export class PostGuestProfileComponent implements OnInit, OnChanges {
@Input() userName?: string ;
commentForm: FormGroup;
  posts: PostModel[] = [];
  expandedPostId: number | null = null;
  lazyScrollEnabled = false;
  PageSize = 3;
  currentPage = 1;
  isLoading = false;
  hasMorePosts = true;

  constructor(
    private fb: FormBuilder, 
    private guestProfileService: GuestProfileService,
    private postService: PostService,
    private notificationService: NotificationService, 
    private commentService: CommentService, 
  ) {
      this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(300)]]
    });
  }

  ngOnInit(): void {
    if (this.userName) {
      this.loadPosts();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userName'] && changes['userName'].currentValue) {
      this.posts = [];
      this.currentPage = 1;
      this.hasMorePosts = true;
      this.loadPosts();
    }
  }

  async loadPosts(): Promise<void> {
    if (this.isLoading || !this.hasMorePosts) return;
  
    this.isLoading = true;
  
    try {
      if (!this.userName) {
        console.warn('PostGuestProfileComponent: userName is not set, skipping loadPosts');
        return;
      }
      const params : PaginationParamsGuest = {
              userName: this.userName,
              pageNumber: this.currentPage,
              pageSize: this.PageSize
            };

      const response: PostResponseModel = await this.guestProfileService.getGuestUserPosts(params);
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

async toggleLike(post: PostModel) {
  try {
    if (post.isLikedByCurrentUser) {
      
      await this.postService.likePost(post.id);
      post.likesCount = (post.likesCount || 0) - 1;
    } else {
      
      await this.postService.likePost(post.id);
      post.likesCount = (post.likesCount || 0) + 1;
    }
    post.isLikedByCurrentUser = !post.isLikedByCurrentUser;
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
  this.lazyScrollEnabled = true;
  if (this.commentForm.valid) {
    try {
      const commentContent = this.commentForm.value.content.trim();
      const params: CreateCommentModel = {
        postId: postId,
        content: commentContent
      };
      const response = await this.commentService.createComment (params );

      const post = this.posts.find(p => p.id === postId);
        if(post) {
          post.commentsCount = (post.commentsCount || 0) + 1;
        }

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
  setTimeout(() => {
    this.lazyScrollEnabled = false;
  }, 50);
}
}
