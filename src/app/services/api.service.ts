import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private axiosClient: AxiosInstance;

  constructor() {
    this.axiosClient = axios.create({
      baseURL: 'https://localhost:7060/',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.axiosClient.interceptors.request.use(
      (config) => {
        const storedToken = localStorage.getItem('authToken'); 
        const token = storedToken ? JSON.parse(storedToken).token : null; 

        console.log('Token:', token); 
        if (token) {
        config.headers['Authorization'] = token; 
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
  // Cerere GET
  async getData(endpoint: string): Promise<any> {
    try {
      const response = await this.axiosClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Eroare la cererea GET:', error);
      throw error;
    }
  }

  // Cerere POST
  async postData(endpoint: string, payload: any): Promise<any> {
    try {
      const response = await this.axiosClient.post(endpoint, payload);
      return response;
    } catch (error) {
      console.error('Eroare la cererea POST:', error);
      throw error;
    }
  }
}