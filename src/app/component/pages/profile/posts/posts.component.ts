import { Component, OnInit } from '@angular/core';
import { NgIf,NgFor,CommonModule } from '@angular/common';
import { FormGroup, FormsModule, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { PostModel } from '../../../../models';
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
    this.getUserPosts();
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
