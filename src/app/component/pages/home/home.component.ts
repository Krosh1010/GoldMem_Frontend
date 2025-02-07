import { Component, OnInit, NgModule } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { PostModel } from '../../../models/post.model';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent  {
  postForm: FormGroup ;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.postForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  async submitPost() {
    let postData: PostModel | null = null;
    if (this.postForm.valid) {
    const postData = {
      post: this.postForm.value.content.trim()
    }
  }
   try{
    await this.apiService.postData('api/PostController/Post', postData);
    this.postForm.reset();
    alert('Postarea a fost trimisă cu succes!');
   }catch (error: any) {
    console.error('Eroare la postare:', error);
    alert('Eroare la postare!');
  }
  
}
}
