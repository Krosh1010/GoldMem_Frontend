import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  userName: string = ''; 

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getUserProfile();
  }

  private async getUserProfile(): Promise<void> {
    try {
      const response = await this.apiService.getData('me'); 
      this.userName = response.userName || ''; 
      console.log('Profilul a fost încărcat cu succes:', response);
    } catch (error) {
      console.error('Eroare la încărcarea profilului:', error);
    }
  }
}
