import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../services';
import { ChangeProfileModel } from '../../../models/Profile/change_profile.model';


@Component({
  selector: 'app-profileseting',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profileseting.component.html',
  styleUrls: ['./profileseting.component.scss']
})
export class ProfilesetingComponent implements OnInit {
  
  profile: ChangeProfileModel = { closed: false } as ChangeProfileModel;
  isLoading = true;
  errorMessage = '';
  editMode : boolean = false; 

  constructor(
  private ProfileService: ProfileService
  ) {}

  async ngOnInit() {
    await this.getUserProfile();
  }

  private async getUserProfile(): Promise<void> {
    try {
  const response = await this.ProfileService.getUserProfile();
  this.profile.name = response.name || '';
  this.profile.email = response.email || '';
  this.profile.closed = typeof response.closed === 'boolean' ? response.closed : false;
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
      await this.ProfileService.ChangeProfile(this.profile);
    } catch (error) {
      console.error('Eroare la salvarea profilului:', error);
      this.errorMessage = 'A apărut o eroare la salvarea profilului';
    } finally {
      this.isLoading = false;
    }
  }

  cancelChanges() {
    this.editMode = !this.editMode; 
    this.getUserProfile();
  }

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  toggleProfileStatus() {
    if (!this.editMode) return;
    this.profile.closed = !this.profile.closed;
  }
}