import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  data: any;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getData('/data-endpoint').then((response) => {
      this.data = response;
      console.log('Datele primite:', this.data);
    }).catch((error) => {
      console.error('Eroare la primirea datelor:', error);
    });
  }

}
