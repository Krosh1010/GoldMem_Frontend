import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-profileseting',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profileseting.component.html',
  styleUrls: ['./profileseting.component.scss']
})
export class ProfilesetingComponent implements OnInit {
  profile = {
    name: '',
    email: ''
  };
  isLoading = true;
  errorMessage = '';
  editMode : boolean = false; // Flag for edit mode

  constructor(private apiService: ApiService) {}

  async ngOnInit() {
    await this.getUserProfile();
  }

  private async getUserProfile(): Promise<void> {
    try {
      const response = await this.apiService.getData('api/AuthControler/GetMe');
      this.profile = {
        name: response.name || '',
        email: response.email || ''
      };
      this.errorMessage = '';
    } catch (error) {
      console.error('Eroare la încărcarea profilului:', error);
      this.errorMessage = 'A apărut o eroare la încărcarea profilului';
    } finally {
      this.isLoading = false;
    }
  }

  async saveProfile() {
    this.isLoading = true;
    try {
      await this.apiService.patchData('api/AuthControler/UpdateMe', this.profile);
      alert('Profilul a fost actualizat cu succes!');
    } catch (error) {
      console.error('Eroare la salvarea profilului:', error);
      this.errorMessage = 'A apărut o eroare la salvarea profilului';
    } finally {
      this.isLoading = false;
    }
  }

  cancelChanges() {
    this.getUserProfile(); 
  }

  async toggleEdit() {
    if (this.editMode) {
     await this.getUserProfile();
    }
    this.editMode = !this.editMode; 
  }
}