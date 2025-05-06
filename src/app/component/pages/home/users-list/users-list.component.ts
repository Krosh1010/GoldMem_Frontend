import { Component } from '@angular/core';
import { NgFor,NgIf } from '@angular/common';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {
  users: any[] = [
    {
      id: 1,
      username: 'Utilizator1',
      avatar: 'https://i.pravatar.cc/40?u=1',
      status: 'Online',
      isFollowing: false
    },
    {
      id: 2,
      username: 'Utilizator2',
      avatar: 'https://i.pravatar.cc/40?u=2',
      status: 'Offline',
      isFollowing: true
    },
    {
      id: 3,
      username: 'Utilizator3',
      avatar: 'https://i.pravatar.cc/40?u=3',
      status: 'Online',
      isFollowing: false
    },
    {
      id: 4,
      username: 'Utilizator cu nume foarte lung care nu încape',
      avatar: 'https://i.pravatar.cc/40?u=4',
      status: 'În meeting',
      isFollowing: false
    }
  ];

  refreshUsers() {}
  toggleFollow(user: any) { }
}
