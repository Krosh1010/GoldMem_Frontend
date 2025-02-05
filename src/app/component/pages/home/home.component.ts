import { Component, OnInit, NgModule } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule,NgFor],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent  {
  data: any;
  postForm: FormGroup ;
  posts: string[] = [];

  constructor(private fb: FormBuilder) {
    this.postForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  submitPost() {
    if (this.postForm.valid) {
      this.posts.unshift(this.postForm.value.content);
      this.postForm.reset();
    }
  }

}
