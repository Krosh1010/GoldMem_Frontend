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
      username: 'Utiliza',
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
      username: 'Utilizator3kjhdlfgiluydhfbgdeilufsghvbaeilsdruygbaerdoyiugbaeluyIORfghaeiKRUY fghy ersw35GLTY ',
      avatar: 'https://i.pravatar.cc/40?u=3',
      status: 'Online',
      isFollowing: false
    },
    {
      id: 4,
      username: 'Utilizator ',
      avatar: 'https://i.pravatar.cc/40?u=4',
      status: 'În meeting',
      isFollowing: false
    }
  ];

  refreshUsers() {}
  toggleFollow(user: any) { }
}
