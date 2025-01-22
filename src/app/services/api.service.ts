import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private axiosClient: AxiosInstance;

  constructor() {
    
    this.axiosClient = axios.create({
      baseURL: 'https://api.example.com', 
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  //Cerere GET
  async getData(endpoint: string): Promise<any> {
    try {
      const response = await this.axiosClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Eroare la cererea GET:', error);
      throw error;
    }
  }

  //Cerere POST
  async postData(endpoint: string, payload: any): Promise<any> {
    try {
      const response = await this.axiosClient.post(endpoint, payload);
      return response.data;
    } catch (error) {
      console.error('Eroare la cererea POST:', error);
      throw error;
    }
  }
}
