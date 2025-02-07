import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { NgIf,NgFor } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf,NgFor],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  userName: string = ''; 
  post: any [] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getUserProfile();
    this.getUserPosts();
  }

  private async getUserProfile(): Promise<void> {
    try {
      const response = await this.apiService.getData('api/AuthControler/GetMe'); 
      this.userName = response.name || ''; 
    } catch (error) {
      console.error('Eroare la încărcarea profilului:', error);
    }
  }
  private async getUserPosts(): Promise<void> {
    try {
      const response = await this.apiService.getData('api/PostController/GetMyPosts');
      this.post= response || [];
    }
    catch (error) {
      console.error('Eroare la încărcarea postărilor:', error);
    }
}
}
