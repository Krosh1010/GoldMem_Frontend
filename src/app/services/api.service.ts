import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

function getLocalStorage(key: string): any {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

export function createAxiosClient(): AxiosInstance {
  const client = axios.create({
    baseURL: 'http://localhost:5222',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use(
    (config) => {
      const token = getLocalStorage('jwttoken')?.token;
      if (token && config.headers) {
        config.headers.Authorization = token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return client;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private axiosClient: AxiosInstance;

  constructor() {
    this.axiosClient = createAxiosClient();
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
      return response.data;
    } catch (error) {
      console.error('Eroare la cererea POST:', error);
      throw error;
    }
  }
}
