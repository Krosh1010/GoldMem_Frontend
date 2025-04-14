import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [NgFor],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {
  users = [
    { username: 'alex01', avatar: '', status: 'Online' },
    { username: 'maria99', avatar: '', status: 'Offline' },
    { username: 'george07', avatar: '', status: 'Online' },
    { username: 'florina22', avatar: '', status: 'Online' }
  ];
}
