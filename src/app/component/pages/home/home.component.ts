import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PostModel } from '../../../models/post.model';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  postForm: FormGroup;
  posts: PostModel[] = [];
  notification = {
    message: '',
    type: '', 
    timer: null as any
  };
  
  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.postForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.loadPosts(); 
  }

  async submitPost() {
    if (this.postForm.valid) {
      try {
        const response = await this.apiService.postData('api/PostsControler/Create', this.postForm.value.content.trim());
        
        if (response.status === 201) {
          this.showNotification('Postare creată cu succes!', 'success');
          this.posts.unshift(response.data);
          this.postForm.reset();
        } else if (response.status === 202) {
          this.showNotification('Postare acceptată cu avertismente', 'warning');
        } else if (response.status >= 400 && response.status < 500) {
          this.showNotification('Eroare client: ' + (response.error?.message || 'Cerere invalidă'), 'error');
        } else if (response.status >= 500) {
          this.showNotification('Eroare server: ' + (response.error?.message || 'Eroare internă'), 'error');
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

  async loadPosts() {
    try {
      const data = await this.apiService.getData('api/PostsControler/GetPost'); 
      this.posts = data;
    } catch (error) {
      console.error('Eroare la încărcarea postărilor:', error);
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
  
}
