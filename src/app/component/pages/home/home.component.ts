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
      const postData: PostModel = {
        post: this.postForm.value.content.trim(),
      };

      try {
        const response = await this.apiService.postData('posts', postData); 

        
        this.posts.unshift(response); 

        this.postForm.reset();
        alert('Postarea a fost trimisă cu succes!');
      } catch (error) {
        alert('Eroare la trimiterea postării!');
      }
    }
  }

  async loadPosts() {
    try {
      const data = await this.apiService.getData('posts'); 
      this.posts = data;
    } catch (error) {
      console.error('Eroare la încărcarea postărilor:', error);
    }
  }
}
