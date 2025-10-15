import { Component, OnInit } from '@angular/core';
import { NgIf,NgFor,CommonModule } from '@angular/common';
import { FormGroup, FormsModule, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { PostModel, PostResponseModel } from '../../../../models';
import { PostService, CommentService, ApiService, NotificationService, ProfileService} from '../../../../services';
import { SharedDirectivesModule } from '../../../../directives/shared-directives.module';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [NgIf,NgFor,CommonModule,FormsModule, ReactiveFormsModule, SharedDirectivesModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit {
  commentForm: FormGroup;
  posts: PostModel[] = [];
  userName: string = ''; 
  expandedPostId: number | null = null;
  lazyScrollEnabled = false;
  PageSize = 3;
  currentPage = 1;
  isLoading = false;
  hasMorePosts = true;

  constructor(
    private fb: FormBuilder, 
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
    this.loadPosts();
  }

  async loadPosts(): Promise<void> {
    if (this.isLoading || !this.hasMorePosts) return;
  
    this.isLoading = true;
  
    try {
      const response: PostResponseModel = await this.profileService.getUserPosts(this.currentPage, this.PageSize);
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


async toggleLike(post: PostModel) {
  try {
    if (post.isLiked) {
      // Dacă postarea este deja likuită, eliminăm like-ul
      await this.postService.likePost(post.id);
      post.likesCount = (post.likesCount || 0) - 1;
    } else {
      // Dacă postarea nu este likuită, adăugăm un like
      await this.postService.likePost(post.id);
      post.likesCount = (post.likesCount || 0) + 1;
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
  this.lazyScrollEnabled = true;
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
  setTimeout(() => {
    this.lazyScrollEnabled = false;
  }, 50);
}
}
