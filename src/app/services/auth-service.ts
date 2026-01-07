import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'https://localhost:7006/api/Auth'; 

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    // userData יכיל: name, email, phone, password
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
                

          if (response.user && response.user.role !== undefined) {
             localStorage.setItem('userRole', response.user.role.toString());
          }
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.clear();
  }
}